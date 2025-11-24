const mongoose = require('mongoose');
require('dotenv').config();

// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected successfully."))
  .catch(err => console.error("MongoDB connection error:", err));
// --- END CONNECTION ---


// --- 1. USER SCHEMA (No Change) ---
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
}, { _id: false }); // Prevent Mongoose from creating an _id for this sub-document

// Aligned with Pydantic ExperienceEntry
const structuredExperienceSchema = new mongoose.Schema({
  title: { type: String },
  company: { type: String },
  dates: { type: String }, // Stored as a string from the AI (e.g., "Jan 2020 - Dec 2023")
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


// --- 3. ANALYSIS HISTORY SCHEMA (No Change) ---
const analysisHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume_filename: { type: String },
  jd_text_used: { type: String },
  jd_title_used: { type: String }, // NEW: Store the title used in analysis
  
  // Scores
  overall_score: { type: Number, required: true, min: 0, max: 100 },
  skills_score: { type: Number, min: 0, max: 100 },
  experience_score: { type: Number, min: 0, max: 100 },
  education_score: { type: Number, min: 0, max: 100 },
  
  // Detailed Results (Arrays should be initialized empty if not present)
  matched_keywords: [{ type: String }],
  missing_keywords: [{ type: String }],
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  recommendations: [{ type: String }],
  
  // Critique/Summary
  summary_critique: { type: String }, // Aligned with the Python backend field
  
  // NEW: Structured Resume Data from AI
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
  timestamps: true // Adds createdAt and updatedAt
});

// --- 4. NEW: JOB DESCRIPTION SCHEMA ---
const jobDescriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true }, // E.g., "Senior Software Engineer"
  description: { type: String, required: true }, // The full JD text
  createdAt: { type: Date, default: Date.now },
}, { 
  timestamps: true 
});


// --- 5. MODELS ---
const User = mongoose.models.User || mongoose.model('User', userSchema);
const AnalysisHistory = mongoose.models.AnalysisHistory || mongoose.model('AnalysisHistory', analysisHistorySchema);
const JobDescription = mongoose.models.JobDescription || mongoose.model('JobDescription', jobDescriptionSchema);

// Export only the necessary model: AnalysisHistory and User, and the new JobDescription
module.exports = { User, AnalysisHistory, JobDescription };