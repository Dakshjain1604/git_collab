const mongoose = require('mongoose');
require('dotenv').config();

// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected successfully."))
  .catch(err => console.error("MongoDB connection error:", err));
// --- END CONNECTION ---


// --- 1. USER SCHEMA ---
const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  username: { type: String, unique: true },
  password: { type: String }
});


// --- 2. STRUCTURED RESUME SUB-SCHEMAS (Aligned with Python Backend) ---

// Aligned with Pydantic ContactInfo
const contactInfoSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  email: { type: String },
  linkedin: { type: String },
  portfolio: { type: String }
}, { _id: false });

// Aligned with Pydantic ExperienceEntry
const structuredExperienceSchema = new mongoose.Schema({
  title: { type: String },
  company: { type: String },
  dates: { type: String },
  description_summary: { type: String }
}, { _id: false });

// Aligned with Pydantic EducationEntry
const structuredEducationSchema = new mongoose.Schema({
  degree: { type: String },
  institution: { type: String },
  year_or_dates: { type: String }
}, { _id: false });

// Aligned with Pydantic ProjectEntry
const structuredProjectSchema = new mongoose.Schema({
  project_name: { type: String },
  description: { type: String },
  technologies: [{ type: String }]
}, { _id: false });


// --- 3. FIXED: NESTED SCORES AND KEYWORDS SCHEMAS ---
const scoresSchema = new mongoose.Schema({
  overall_score: { type: Number, default: 0, min: 0, max: 100 },
  skills_score: { type: Number, default: 0, min: 0, max: 100 },
  experience_score: { type: Number, default: 0, min: 0, max: 100 },
  education_score: { type: Number, default: 0, min: 0, max: 100 },
  keyword_score: { type: Number, default: 0, min: 0, max: 100 }
}, { _id: false });

const keywordsSchema = new mongoose.Schema({
  matched_keywords: [{ type: String }],
  missing_keywords: [{ type: String }]
}, { _id: false });


// --- 4. FIXED: ANALYSIS HISTORY SCHEMA WITH NESTED OBJECTS ---
const analysisHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume_filename: { type: String },
  jd_text_used: { type: String },
  jd_title_used: { type: String },
  
  // NESTED SCORES OBJECT (for frontend compatibility)
  scores: {
    type: scoresSchema,
    default: () => ({
      overall_score: 0,
      skills_score: 0,
      experience_score: 0,
      education_score: 0,
      keyword_score: 0
    })
  },
  
  // FLATTENED SCORES (for backward compatibility and easier queries)
  overall_score: { type: Number, default: 0, min: 0, max: 100 },
  skills_score: { type: Number, default: 0, min: 0, max: 100 },
  experience_score: { type: Number, default: 0, min: 0, max: 100 },
  education_score: { type: Number, default: 0, min: 0, max: 100 },
  
  // NESTED KEYWORDS OBJECT (for frontend compatibility)
  keywords: {
    type: keywordsSchema,
    default: () => ({
      matched_keywords: [],
      missing_keywords: []
    })
  },
  
  // FLATTENED KEYWORDS (for backward compatibility and easier queries)
  matched_keywords: [{ type: String }],
  missing_keywords: [{ type: String }],
  
  // Analysis Results
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  recommendations: [{ type: String }],
  summary_critique: { type: String },
  
  // Structured Resume Data from AI
  structured_resume: {
    contact_info: contactInfoSchema,
    summary: { type: String },
    experience: [structuredExperienceSchema],
    education: [structuredEducationSchema],
    projects: [structuredProjectSchema],
    skills: [{ type: String }]
  },

  // Metadata
  analysis_date: { type: Date, default: Date.now },
  file_id: { type: String }
}, { 
  timestamps: true
});

// --- INDEX FOR BETTER QUERY PERFORMANCE ---
analysisHistorySchema.index({ userId: 1, analysis_date: -1 });
analysisHistorySchema.index({ userId: 1, overall_score: -1 });


// --- 5. JOB DESCRIPTION SCHEMA ---
const jobDescriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { 
  timestamps: true 
});

// Index for faster JD lookups
jobDescriptionSchema.index({ userId: 1, createdAt: -1 });


// --- 6. MODELS ---
const User = mongoose.models.User || mongoose.model('User', userSchema);
const AnalysisHistory = mongoose.models.AnalysisHistory || mongoose.model('AnalysisHistory', analysisHistorySchema);
const JobDescription = mongoose.models.JobDescription || mongoose.model('JobDescription', jobDescriptionSchema);

module.exports = { User, AnalysisHistory, JobDescription };