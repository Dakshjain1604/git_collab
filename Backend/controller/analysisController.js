const axios = require('axios');
const { AnalysisHistory } = require('../model/db');
const FormData = require('form-data');

const AI_BACKEND_URL = process.env.AI_BACKEND_URL || 'http://localhost:8000';

const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume file is required"
            });
        }

        const { jdText, jdTitle } = req.body;
        const userId = req.userId;

        // Prepare form data for AI backend
        const formData = new FormData();
        formData.append('resume', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });
        formData.append('jdText', jdText || 'General career analysis');

        // Call AI backend
        const aiResponse = await axios.post(`${AI_BACKEND_URL}/analyze-resume`, formData, {
            headers: {
                ...formData.getHeaders()
            },
            timeout: 60000 // 60 seconds timeout
        });

        const analysisResult = aiResponse.data;

        // Extract analysis data - AI backend returns:
        // { success, message, analysis: { overall_score, skills_score, ... }, structured_resume: {...} }
        const analysis = analysisResult.analysis || {};
        const structuredResume = analysisResult.structured_resume || {};

        // Save to analysis history
        const historyEntry = new AnalysisHistory({
            userId,
            resume_filename: req.file.originalname,
            jd_text_used: jdText || 'General career analysis',
            jd_title_used: jdTitle || 'Job Analysis',
            overall_score: analysis.overall_score ?? 0,
            skills_score: analysis.skills_score ?? 0,
            experience_score: analysis.experience_score ?? 0,
            education_score: analysis.education_score ?? 0,
            matched_keywords: Array.isArray(analysis.matched_keywords) ? analysis.matched_keywords : [],
            missing_keywords: Array.isArray(analysis.missing_keywords) ? analysis.missing_keywords : [],
            strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
            weaknesses: Array.isArray(analysis.weaknesses) ? analysis.weaknesses : [],
            recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : [],
            summary_critique: analysis.summary_critique || '',
            structured_resume: structuredResume,
            file_id: analysisResult.file_id || ''
        });

        await historyEntry.save();

        // Prepare response with proper structure for frontend
        const responseAnalysis = {
            id: historyEntry._id,
            overall_score: historyEntry.overall_score,
            skills_score: historyEntry.skills_score,
            experience_score: historyEntry.experience_score,
            education_score: historyEntry.education_score,
            matched_keywords: historyEntry.matched_keywords,
            missing_keywords: historyEntry.missing_keywords,
            strengths: historyEntry.strengths,
            weaknesses: historyEntry.weaknesses,
            recommendations: historyEntry.recommendations,
            summary_critique: historyEntry.summary_critique,
            structured_resume: historyEntry.structured_resume,
            job_title: historyEntry.jd_title_used,
            job_description: historyEntry.jd_text_used, // Include JD text for job search
            resume_filename: historyEntry.resume_filename,
            analysis_date: historyEntry.analysis_date
        };

        res.status(200).json({
            success: true,
            message: "Resume analyzed successfully",
            analysis: responseAnalysis
        });

    } catch (error) {
        console.error("Analyze resume error:", error);

        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
            return res.status(503).json({
                success: false,
                message: "AI backend service unavailable. Please try again later."
            });
        }

        if (error.response) {
            // AI backend returned an error
            return res.status(error.response.status || 500).json({
                success: false,
                message: error.response.data?.detail || error.response.data?.message || "AI analysis failed"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || "Internal server error during analysis"
        });
    }
};

const getHistory = async (req, res) => {
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await AnalysisHistory.countDocuments({ userId });
        const analyses = await AnalysisHistory.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v');

        res.status(200).json({
            success: true,
            analyses,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalAnalyses: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error("Get history error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getStats = async (req, res) => {
    try {
        const userId = req.userId;
        const userAnalyses = await AnalysisHistory.find({ userId });

        if (userAnalyses.length === 0) {
            return res.status(200).json({
                success: true,
                stats: {
                    totalAnalyses: 0,
                    averageScore: 0,
                    highestScore: 0,
                    lowestScore: 0,
                    averageSkillsScore: 0,
                    averageExperienceScore: 0,
                    averageEducationScore: 0,
                    analysesThisMonth: 0,
                    analysesThisWeek: 0,
                    scoreDistribution: {
                        excellent: 0,
                        good: 0,
                        average: 0,
                        poor: 0,
                    }
                }
            });
        }

        // Calculate statistics
        const totalAnalyses = userAnalyses.length;
        const scores = userAnalyses.map(a => a.overall_score);
        const skillsScores = userAnalyses.map(a => a.skills_score || 0);
        const experienceScores = userAnalyses.map(a => a.experience_score || 0);
        const educationScores = userAnalyses.map(a => a.education_score || 0);

        const averageScore = scores.reduce((a, b) => a + b, 0) / totalAnalyses;
        const highestScore = Math.max(...scores);
        const lowestScore = Math.min(...scores);
        const averageSkillsScore = skillsScores.reduce((a, b) => a + b, 0) / totalAnalyses;
        const averageExperienceScore = experienceScores.reduce((a, b) => a + b, 0) / totalAnalyses;
        const averageEducationScore = educationScores.reduce((a, b) => a + b, 0) / totalAnalyses;

        // Calculate analyses this month and this week
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

        const analysesThisMonth = userAnalyses.filter(a => new Date(a.createdAt) >= startOfMonth).length;
        const analysesThisWeek = userAnalyses.filter(a => new Date(a.createdAt) >= startOfWeek).length;

        // Calculate score distribution
        const scoreDistribution = {
            excellent: scores.filter(score => score >= 80).length,
            good: scores.filter(score => score >= 60 && score < 80).length,
            average: scores.filter(score => score >= 40 && score < 60).length,
            poor: scores.filter(score => score < 40).length,
        };

        res.status(200).json({
            success: true,
            stats: {
                totalAnalyses,
                averageScore: Math.round(averageScore),
                highestScore,
                lowestScore,
                averageSkillsScore: Math.round(averageSkillsScore),
                averageExperienceScore: Math.round(averageExperienceScore),
                averageEducationScore: Math.round(averageEducationScore),
                analysesThisMonth,
                analysesThisWeek,
                scoreDistribution
            }
        });

    } catch (error) {
        console.error("Get stats error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const deleteHistory = async (req, res) => {
    try {
        const userId = req.userId;
        const { analysisId } = req.body;

        if (analysisId) {
            // Delete specific analysis
            const analysis = await AnalysisHistory.findOne({ _id: analysisId, userId });
            if (!analysis) {
                return res.status(404).json({
                    success: false,
                    message: "Analysis not found"
                });
            }
            await AnalysisHistory.deleteOne({ _id: analysisId, userId });
            return res.status(200).json({
                success: true,
                message: "Analysis deleted successfully"
            });
        } else {
            // Delete all history for user
            const result = await AnalysisHistory.deleteMany({ userId });
            return res.status(200).json({
                success: true,
                message: `Deleted ${result.deletedCount} analysis records`,
                deletedCount: result.deletedCount
            });
        }
    } catch (error) {
        console.error("Delete history error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = { analyzeResume, getHistory, getStats, deleteHistory };
