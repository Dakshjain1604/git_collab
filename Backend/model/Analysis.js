const mongoose = require("mongoose");

const jobSuggestionSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    location: String,
    url: String,
    source: { type: String, default: "remotive" },
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobDescription: { type: String, required: true },
    resumeFileName: String,
    resumeSummary: String,
    jdSummary: String,
    score: Number,
    missingKeywords: { type: [String], default: [] },
    recommendedSkills: { type: [String], default: [] },
    actionItems: { type: [String], default: [] },
    insights: { type: String, default: "" },
    jobSuggestions: { type: [jobSuggestionSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", analysisSchema);

