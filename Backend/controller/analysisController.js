const Analysis = require("../model/Analysis");
const { sendToAiBackend } = require("../services/aiClient");
const { getJobSuggestions } = require("../services/jobService");

const mapAiPayload = (payload = {}) => ({
  resumeSummary: payload.resume_summary ?? "",
  jdSummary: payload.jd_summary ?? "",
  score: payload.score ?? 0,
  missingKeywords: payload.missing_keywords ?? [],
  recommendedSkills: payload.recommended_skills ?? [],
  actionItems: payload.action_items ?? [],
  insights: payload.insights ?? "",
});

exports.analyzeResume = async (req, res, next) => {
  try {
    const { jdText } = req.body;

    if (!jdText || jdText.trim().length < 20) {
      return res.status(400).json({ message: "Job description must be at least 20 characters" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a resume file" });
    }

    const aiPayload = await sendToAiBackend({
      buffer: req.file.buffer,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      jdText,
    });

    const jobs = await getJobSuggestions(jdText);

    const document = await Analysis.create({
      user: req.user.id,
      jobDescription: jdText,
      resumeFileName: req.file.originalname,
      ...mapAiPayload(aiPayload),
      jobSuggestions: jobs,
    });

    res.status(201).json({ message: "Analysis completed", analysis: document });
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const history = await Analysis.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ items: history });
  } catch (error) {
    next(error);
  }
};

