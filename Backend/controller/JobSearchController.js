const axios = require("axios");
const jwt = require("jsonwebtoken");

// FIXED: Use environment variable for JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

if (JWT_SECRET === "your-secret-key-change-in-production") {
  console.warn("⚠️  WARNING: Using default JWT_SECRET. Set JWT_SECRET environment variable in production!");
}

/**
 * Middleware to extract user ID from the JWT token in the Authorization header.
 * @param {object} req - Express request object.
 * @returns {string | null} The user ID or null if unauthorized/invalid token.
 */
const getUserFromToken = (req) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return null;
    }

    // Handle both "Bearer token" and "token" formats
    const token = authHeader.startsWith("Bearer ") 
      ? authHeader.substring(7) 
      : authHeader;
    
    if (!token || token.trim() === "") {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!decoded || !decoded.id) {
      return null;
    }
    
    return decoded.id;
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      console.warn("Invalid JWT token");
    } else if (err.name === "TokenExpiredError") {
      console.warn("JWT token expired");
    }
    return null;
  }
};

// --- Core API Controller ---

/**
 * Search for jobs based on job description keywords using concurrent API calls.
 */
exports.searchJobs = async (req, res) => {
  try {
    // Use userId from authenticate middleware if available, otherwise fallback
    const userId = req.userId || getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized. Please login." 
      });
    }

    // 1. Input Validation and Sanitization
    const { jobDescription, location, limit } = req.body;

    if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim().length < 10) {
      return res.status(400).json({ 
        success: false,
        message: "Job description is required and must be at least 10 characters" 
      });
    }

    const sanitizedLocation = location && typeof location === "string" 
      ? location.trim() 
      : "";

    const sanitizedLimit = Math.min(
      Math.max(parseInt(limit) || 10, 1), // Min 1
      50 // Max 50 to prevent abuse
    );

    // 2. Keyword/Title Extraction
    const keywords = extractKeywords(jobDescription);
    
    if (keywords.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Could not extract meaningful keywords from job description" 
      });
    }

    const jobTitle = extractJobTitle(jobDescription);
    // Use the explicit title, or top 3 keywords as the search query
    const searchQuery = jobTitle || keywords.slice(0, 3).join(" "); 

    // 3. Concurrent API Search Setup
    const promises = [];
    const errors = []; 
    
    // Method 1: Adzuna API
    if (process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY) {
      // Execute concurrently and catch errors locally
      promises.push(
        searchAdzuna(searchQuery, sanitizedLocation, sanitizedLimit).catch(err => {
          console.error("Adzuna API error:", err.message);
          errors.push({ source: "Adzuna", error: err.message });
          return []; // Ensure promise resolves to an empty array on failure
        })
      );
    }

    // Method 2: SerpAPI
    if (process.env.SERP_API_KEY) {
      // Execute concurrently and catch errors locally
      promises.push(
        searchSerpAPI(searchQuery, sanitizedLocation, sanitizedLimit).catch(err => {
          console.error("SerpAPI error:", err.message);
          errors.push({ source: "SerpAPI", error: err.message });
          return []; // Ensure promise resolves to an empty array on failure
        })
      );
    }

    let jobs = [];
    
    if (promises.length > 0) {
      // NEW FIX: Execute all API promises concurrently and wait for all to resolve
      const results = await Promise.all(promises);
      
      // Flatten the array of results (results is an array of job arrays)
      jobs = results.flat(); 
    }

    // 4. Fallback or Final Processing
    if (jobs.length === 0) {
      console.log("Using fallback job suggestions");
      jobs = generateJobSuggestions(keywords, jobDescription, sanitizedLocation, sanitizedLimit);
    }

    // Remove duplicates and limit results to the requested amount
    jobs = removeDuplicates(jobs).slice(0, sanitizedLimit);

    // 5. Response
    res.status(200).json({
      success: true,
      data: {
        jobs,
        count: jobs.length,
        searchQuery,
        keywords: keywords.slice(0, 10),
        location: sanitizedLocation || "Not specified",
        isFallback: jobs.length > 0 && jobs[0].isSuggested === true,
      },
      // Include errors for debugging (only in development)
      ...(process.env.NODE_ENV === "development" && errors.length > 0 && { errors }),
    });
  } catch (err) {
    console.error("Error searching jobs:", err);
    res.status(500).json({ 
      success: false,
      message: "Error searching for jobs. Please try again.",
      ...(process.env.NODE_ENV === "development" && { error: err.message }),
    });
  }
};

// --- Helper Functions ---

/**
 * Extract keywords from job description
 */
function extractKeywords(text) {
  if (!text || typeof text !== "string") {
    return [];
  }

  const commonWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
    "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
    "will", "would", "should", "could", "may", "might", "must", "can", "this", "that", "these", "those",
    "from", "into", "through", "during", "before", "after", "above", "below", "between", "under",
    "about", "against", "among", "around", "their", "there", "where", "which", "who", "whom", "whose",
    "your", "our", "them", "they", "more", "most", "some", "such", "only", "both", "each", "other",
    // IMPROVEMENT: Filter generic resume/JD terms for better keyword results
    "experience", "years", "required", "skill", "ability", "strong", "knowledge",
    "team", "work", "proven", "responsibilities", "must", "using", "within", "we", "seek",
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word));

  if (words.length === 0) {
    return [];
  }

  // Count frequency
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Sort by frequency and return top 20 keywords
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .slice(0, 20); 
}

/**
 * Extract job title from job description
 */
function extractJobTitle(text) {
  if (!text || typeof text !== "string") {
    return null;
  }

  const titlePatterns = [
    /(?:looking for|seeking|hiring|position for|role for|job title|opening for|title|position|role)[\s:]+(?:an?\s+)?([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,4}(?:\s+specialist|engineer|manager|architect|developer|designer))/i,
    // Catch common starting phrase
    /^([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,4})\s+(?:developer|engineer|manager|analyst|specialist|designer|architect|administrator|consultant|coordinator)/i,
  ];

  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const title = match[1].trim();
      if (title.length >= 3 && title.length <= 100) {
        return title;
      }
    }
  }

  return null;
}

/**
 * Search jobs using Adzuna API
 */
async function searchAdzuna(query, location, limit) {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    throw new Error("Adzuna API credentials not configured");
  }

  if (!query || typeof query !== "string") {
    throw new Error("Invalid search query");
  }

  const country = process.env.ADZUNA_COUNTRY || "us"; 

  try {
    const response = await axios.get(`https://api.adzuna.com/v1/api/jobs/${country}/search/1`, {
      params: {
        app_id: appId,
        app_key: appKey,
        results_per_page: limit, // Use the sanitized limit
        what: query,
        where: location || "United States",
        content_type: "application/json",
      },
      timeout: 10000,
    });

    if (response.data && response.data.results) {
      return response.data.results.map((job) => ({
        title: job.title || "Untitled Position", 
        company: job.company?.display_name || "Unknown Company",
        location: job.location?.display_name || location || "Remote",
        description: job.description || "No description available",
        url: (job.redirect_url || job.url || "").startsWith('http') ? (job.redirect_url || job.url) : `https://www.adzuna.com/search?q=${encodeURIComponent(query)}`,
        salary: job.salary_min || job.salary_max ? {
          min: job.salary_min || null,
          max: job.salary_max || null,
          currency: job.currency || "USD", 
        } : null,
        posted: job.created || new Date().toISOString(), 
        source: "Adzuna",
      }));
    }

    return [];
  } catch (err) {
    if (err.response) {
      console.error("Adzuna API HTTP error:", err.response.status, err.response.data);
      throw new Error(`Adzuna API HTTP error: ${err.response.status}`);
    } else if (err.request) {
      console.error("Adzuna API network error");
      throw new Error("Adzuna API network error (Request timeout or failed)");
    } else {
      console.error("Adzuna API error:", err.message);
      throw err;
    }
  }
}

/**
 * Search jobs using SerpAPI (Google Jobs)
 */
async function searchSerpAPI(query, location, limit) {
  const apiKey = process.env.SERP_API_KEY;

  if (!apiKey) {
    throw new Error("SerpAPI key not configured");
  }

  if (!query || typeof query !== "string") {
    throw new Error("Invalid search query");
  }

  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_jobs",
        q: query,
        location: location || "United States",
        api_key: apiKey,
        num: limit, // Use the sanitized limit
      },
      timeout: 10000,
    });

    if (response.data && response.data.jobs_results) {
      return response.data.jobs_results.map((job) => ({
        title: job.title || "Untitled Position", 
        company: job.company_name || "Unknown Company",
        location: job.location || location || "Remote",
        description: job.description || "No description available",
        url: (job.apply_options?.[0]?.link || 
             job.related_links?.[0]?.link || 
             job.share_link || "").startsWith('http') 
             ? (job.apply_options?.[0]?.link || job.related_links?.[0]?.link || job.share_link)
             : `https://www.google.com/search?q=${encodeURIComponent(query + " jobs")}`,
        salary: job.detected_extensions?.salary ? {
          min: job.detected_extensions.salary,
          max: job.detected_extensions.salary,
          currency: "USD",
        } : null,
        posted: job.detected_extensions?.posted_at || new Date().toISOString(), 
        source: "Google Jobs",
      }));
    }

    return [];
  } catch (err) {
    if (err.response) {
      console.error("SerpAPI HTTP error:", err.response.status, err.response.data);
      throw new Error(`SerpAPI HTTP error: ${err.response.status}`);
    } else if (err.request) {
      console.error("SerpAPI network error");
      throw new Error("SerpAPI network error (Request timeout or failed)");
    } else {
      console.error("SerpAPI error:", err.message);
      throw err;
    }
  }
}

/**
 * Generate job suggestions when APIs are not available
 */
function generateJobSuggestions(keywords, jobDescription, location, limit) {
  if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
    return [];
  }

  const jobTitles = [
    "Software Engineer", "Full Stack Developer", "Frontend Developer", "Backend Developer",
    "DevOps Engineer", "Data Scientist", "Machine Learning Engineer", "Product Manager",
    "UX Designer", "UI Designer", "Project Manager", "Business Analyst",
  ];

  const companies = [
    "Tech Corp", "Innovation Labs", "Digital Solutions", "Cloud Services Inc",
    "Data Analytics Co", "Software Systems", "Tech Innovations", "Digital Ventures",
  ];

  const locations = location && location.trim() 
    ? [location.trim()] 
    : ["Remote", "San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA"];

  const jobs = [];
  const titlesToUse = jobTitles;

  const numJobsToGenerate = Math.min(limit, titlesToUse.length * 2);

  for (let i = 0; i < numJobsToGenerate; i++) {
    const title = titlesToUse[i % titlesToUse.length];
    const company = companies[i % companies.length];
    const jobLocation = locations[i % locations.length];

    const keywordList = keywords.slice(0, 3).join(", ");
    const descriptionPreview = jobDescription.length > 150 
      ? jobDescription.substring(0, 150) + "..." 
      : jobDescription;

    jobs.push({
      title: `${title}`, 
      company,
      location: jobLocation,
      description: `[FALLBACK] Seeking a ${title.toLowerCase()} with expertise in ${keywordList}. Original JD: ${descriptionPreview}`,
      url: `https://www.google.com/search?q=${encodeURIComponent(title + " jobs " + (location || ""))}`, 
      salary: {
        min: 70000 + Math.floor(Math.random() * 40000),
        max: 110000 + Math.floor(Math.random() * 70000),
        currency: "USD",
      },
      posted: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      source: "Suggested",
      isSuggested: true,
    });
  }

  return jobs;
}

/**
 * Remove duplicate jobs based on title and company
 */
function removeDuplicates(jobs) {
  if (!jobs || !Array.isArray(jobs)) {
    return [];
  }

  const seen = new Set();
  return jobs.filter(job => {
    if (!job || !job.title || !job.company) {
      return false;
    }

    const key = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// --- Exports ---
exports.extractKeywords = extractKeywords;
exports.extractJobTitle = extractJobTitle;
exports.getUserFromToken = getUserFromToken;