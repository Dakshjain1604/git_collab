const axios = require("axios");

const FALLBACK_JOBS = [
  {
    title: "Senior AI Engineer",
    company: "Nova Labs",
    location: "Remote",
    url: "https://novalabs.example/jobs/ai-engineer",
    source: "fallback",
  },
  {
    title: "Lead Resume Strategist",
    company: "CareerCraft",
    location: "Hybrid - NYC",
    url: "https://careercraft.example/careers/resume-strategist",
    source: "fallback",
  },
];

const REMOTIVE_ENDPOINT = "https://remotive.com/api/remote-jobs";

exports.getJobSuggestions = async (query) => {
  const keyword = query?.split(" ").slice(0, 4).join(" ") || "resume";

  try {
    const { data } = await axios.get(REMOTIVE_ENDPOINT, {
      params: { search: keyword },
      timeout: 8000,
    });

    const jobs = data?.jobs?.slice(0, 5).map((job) => ({
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location,
      url: job.url,
      source: "remotive",
    }));

    if (!jobs || jobs.length === 0) {
      return FALLBACK_JOBS;
    }

    return jobs;
  } catch (error) {
    console.warn("Job suggestion API failed, using fallback", error.message);
    return FALLBACK_JOBS;
  }
};

