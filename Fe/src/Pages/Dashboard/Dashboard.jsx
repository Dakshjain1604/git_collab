import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, Search, ChevronRight,
  Briefcase, CheckCircle, AlertTriangle, Lightbulb, X, LayoutDashboard,
  PieChart, Target, BarChart, User, GraduationCap, Phone, Mail, Clock, Zap, Menu,
  TrendingUp, ArrowRight, Star, Award, Flame, Sparkles, Activity, BarChart3
} from "lucide-react";
import {
  PieChart as RPieChart,
  Pie,
  Cell,
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar
} from "recharts";
import { api } from "../../utils/apiClient";

// --- Modern Gradient Background ---
const GradientBg = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950" />
    <motion.div 
      animate={{ x: [0, 20, 0] }}
      transition={{ duration: 8, repeat: Infinity }}
      className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl" 
    />
    <motion.div 
      animate={{ x: [0, -20, 0] }}
      transition={{ duration: 10, repeat: Infinity }}
      className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full filter blur-3xl" 
    />
    <motion.div 
      animate={{ y: [0, 20, 0] }}
      transition={{ duration: 12, repeat: Infinity, delay: 1 }}
      className="absolute top-1/3 left-1/2 w-80 h-80 bg-cyan-600/5 rounded-full filter blur-3xl"
    />
  </div>
);

// --- Modern Radial Progress ---
const RadialProgress = ({ score, size = 180, strokeWidth = 12, label, subLabel, color = "#3B82F6" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const safeScore = isNaN(score) ? 0 : score;
  const offset = circumference - (safeScore / 100) * circumference;

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center justify-center" 
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90 transition-all duration-1000 drop-shadow-lg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-700 opacity-20"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeInOut" }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
          className="drop-shadow-lg filter brightness-110"
        />
      </svg>
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-4xl font-extrabold text-white drop-shadow-lg">
          {Math.round(safeScore)}<span className="text-xl font-semibold text-white/70">%</span>
        </div>
        {label && <div className="text-sm font-semibold text-white/80 mt-2">{label}</div>}
        {subLabel && <div className="text-xs text-blue-300/80">{subLabel}</div>}
      </motion.div>
    </motion.div>
  );
};

// --- Modern Stat Card ---
const StatisticCard = ({ title, value, unit, icon: Icon, colorClass = "text-blue-400", trend }) => (
  <motion.div
    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3)" }}
    transition={{ type: "spring", stiffness: 400 }}
    className="relative p-6 rounded-2xl shadow-lg border border-white/10 overflow-hidden group bg-gradient-to-br from-gray-800/50 to-gray-900/50"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
        <Icon className={`w-5 h-5 ${colorClass} drop-shadow-lg`} />
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-extrabold text-white">{value}</p>
        {unit && <span className="text-lg font-medium text-gray-400">{unit}</span>}
      </div>
      {trend && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-center gap-1 text-xs text-green-400 font-medium"
        >
          <TrendingUp className="w-3 h-3" /> {trend}
        </motion.div>
      )}
    </div>
  </motion.div>
);

// --- Modern Section Header ---
const SectionHeader = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="relative p-6 rounded-2xl border border-white/10 overflow-hidden group bg-gradient-to-r from-gray-800/50 via-gray-800/30 to-gray-900/50"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10 flex items-start gap-4">
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Icon className="text-blue-400 w-8 h-8 flex-shrink-0" />
      </motion.div>
      <div>
        <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
          {title} <Sparkles className="w-5 h-5 text-yellow-400" />
        </h2>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  </motion.div>
);

// --- Modern Analysis Card ---
const AnalysisSummaryCard = ({ title, content, icon: Icon, color = "text-blue-400", background = "bg-blue-900/10" }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`p-6 rounded-2xl border border-white/10 shadow-lg ${background} backdrop-blur-sm`}
  >
    <div className="flex items-center gap-3 mb-4">
      <Icon className={`w-6 h-6 ${color}`} />
      <h3 className="text-lg font-bold text-white">{title}</h3>
    </div>
    <ul className="space-y-3">
      {Array.isArray(content) && content.length > 0 ? (
        content.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-3 text-sm text-gray-300"
          >
            <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${color.replace('text-', 'bg-')}`} />
            {item}
          </motion.li>
        ))
      ) : (
        <li className="text-gray-500">No data available</li>
      )}
    </ul>
  </motion.div>
);

// --- Modern Loading/Error State ---
const StateMessage = ({ icon: Icon, title, message, color = "text-blue-400" }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="flex flex-col items-center justify-center p-16 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 rounded-3xl border border-white/10 backdrop-blur-sm shadow-xl mt-12"
  >
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <Icon className={`w-16 h-16 mb-4 ${color}`} />
    </motion.div>
    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
    <p className="text-gray-400 text-center max-w-md">{message}</p>
  </motion.div>
);

// --- INPUT VIEW ---
const InputView = ({ onAnalysisComplete }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [jdTitle, setJdTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validExtensions = ['.pdf', '.doc', '.docx'];
      const fileName = file.name.toLowerCase();
      const isValid = validExtensions.some(ext => fileName.endsWith(ext));

      if (!isValid) {
        setError('Please upload a PDF or Word document (.pdf, .doc, .docx).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setResumeFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      setError('Please upload a resume');
      return;
    }
    if (!jdText.trim()) {
      setError('Please enter a job description');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jdText', jdText);
      if (jdTitle.trim()) {
        formData.append('jdTitle', jdTitle);
      }

      const response = await api.uploadAndAnalyze(formData);
      
      if (response?.data) {
        onAnalysisComplete(response.data);
      } else {
        setError(response?.message || 'Analysis failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to analyze resume');
    } finally {
      setIsUploading(false);
      setResumeFile(null);
      setJdText('');
      setJdTitle('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4 space-y-8"
    >
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-3xl text-center"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3 flex-wrap">
          <Sparkles className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-yellow-400" />
          Welcome to Resume Analyzer
          <Sparkles className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-yellow-400" />
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8">
          Get AI-powered insights on how well your resume matches any job description
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-blue-600/10 rounded-xl border border-blue-500/20">
            <CheckCircle className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-300">Smart Analysis</p>
          </div>
          <div className="p-4 bg-green-600/10 rounded-xl border border-green-500/20">
            <Zap className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-300">Instant Results</p>
          </div>
          <div className="p-4 bg-purple-600/10 rounded-xl border border-purple-500/20">
            <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-300">Score Breakdown</p>
          </div>
        </div>
      </motion.div>

      {/* Upload Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-3xl"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6 md:p-8 shadow-2xl backdrop-blur-sm"
        >
          <div className="text-center mb-6 sm:mb-8">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <Upload className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 text-blue-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Start Analysis</h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              Upload your resume and enter a job description
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
              >
                <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />{error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Job Title (Optional)
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                value={jdTitle}
                onChange={(e) => setJdTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="e.g. Senior Software Engineer"
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Job Description <span className="text-red-400">*</span>
              </label>
              <motion.textarea
                whileFocus={{ scale: 1.02 }}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
                placeholder="Paste the full job description here..."
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Resume (PDF or Word) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className={`flex items-center justify-center w-full px-4 py-8 bg-gray-700/30 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    resumeFile ? 'border-green-500/50 hover:bg-gray-700/50' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50'
                  }`}
                >
                  {resumeFile ? (
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-green-400" />
                      <span className="text-white font-medium">{resumeFile.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setResumeFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="ml-2 text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isUploading || !resumeFile || !jdText.trim()}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {isUploading ? (
                <>
                  <motion.div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Analyze Resume
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// --- ANALYSIS VIEW ---
const AnalysisView = ({ analysisData, jobTitle, onReturn }) => {
  if (!analysisData || Object.keys(analysisData).length === 0) {
    return <StateMessage icon={X} title="No Analysis Data" message="Please perform an analysis first." color="text-red-400" />;
  }

  const {
    scores = {},
    summary_critique = "No critique available.",
    strengths = [],
    weaknesses = [],
    recommendations = [],
    keywords = {},
    structured_resume = null,
  } = analysisData;

  const getProgressColor = (score) => {
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#F59E0B";
    if (score >= 40) return "#FB923C";
    return "#F87171";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-16"
    >
      {/* Header */}
      <motion.div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Analysis Report</h1>
          <p className="text-gray-400 text-lg">
            Position: <span className="text-blue-400 font-semibold">{jobTitle}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNavigateToDashboard}
            className="px-6 py-3 bg-blue-600/50 hover:bg-blue-600/70 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" /> View Dashboard
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={onReturn}
            className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl text-sm font-semibold text-gray-300 flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4 rotate-180" /> Back
          </motion.button>
        </div>
      </motion.div>

      {/* Overall Score */}
      <SectionHeader
        icon={PieChart}
        title="Overall Fit Score"
        description="Your resume match against the job description"
      />
      <div className="grid lg:grid-cols-5 gap-8 items-center p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-white/10 shadow-2xl">
        <div className="lg:col-span-2 flex justify-center">
          <RadialProgress
            score={scores.overall_score || 0}
            size={240}
            strokeWidth={16}
            label="Overall Match"
            color={getProgressColor(scores.overall_score || 0)}
          />
        </div>
        <div className="lg:col-span-3 grid grid-cols-2 gap-4">
          <StatisticCard title="Experience" value={scores.experience_score || 0} unit="%" icon={Briefcase} colorClass="text-blue-400" />
          <StatisticCard title="Skills" value={scores.skills_score || 0} unit="%" icon={Zap} colorClass="text-yellow-400" />
          <StatisticCard title="Education" value={scores.education_score || 0} unit="%" icon={GraduationCap} colorClass="text-purple-400" />
          <StatisticCard title="Keywords" value={keywords.matched_keywords?.length || 0} icon={Target} colorClass="text-green-400" />
        </div>
      </div>

      {/* Insights */}
      <SectionHeader icon={Lightbulb} title="Key Insights" description="Strengths, gaps, and recommendations" />
      <div className="grid md:grid-cols-3 gap-6">
        <AnalysisSummaryCard
          title="Strengths"
          content={strengths}
          icon={CheckCircle}
          color="text-green-400"
          background="bg-green-900/10"
        />
        <AnalysisSummaryCard
          title="Weaknesses"
          content={weaknesses}
          icon={AlertTriangle}
          color="text-red-400"
          background="bg-red-900/10"
        />
        <AnalysisSummaryCard
          title="Recommendations"
          content={recommendations}
          icon={Lightbulb}
          color="text-blue-400"
          background="bg-blue-900/10"
        />
      </div>

      {/* Critique & Keywords */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div className="md:col-span-2 p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Summary Critique
          </h3>
          <p className="text-gray-300 leading-relaxed">{summary_critique}</p>
        </motion.div>
        <motion.div className="p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-400" />
            Keywords
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-green-400 text-sm font-semibold mb-2">Matched ({keywords.matched_keywords?.length || 0})</p>
              <div className="flex flex-wrap gap-2">
                {keywords.matched_keywords?.slice(0, 5).map((kw, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-green-700/50 text-green-300 rounded-full">{kw}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-red-400 text-sm font-semibold mb-2">Missing ({keywords.missing_keywords?.length || 0})</p>
              <div className="flex flex-wrap gap-2">
                {keywords.missing_keywords?.slice(0, 5).map((kw, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-red-700/50 text-red-300 rounded-full line-through">{kw}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- HISTORY VIEW ---
const HistoryView = ({ historyData, onSelectAnalysis, onReturn, isLoading }) => {
  const history = historyData || [];

  const getScoreClass = (score) => {
    if (score >= 80) return "bg-green-600/20 text-green-300 ring-green-500/30";
    if (score >= 60) return "bg-yellow-600/20 text-yellow-300 ring-yellow-500/30";
    if (score >= 40) return "bg-orange-600/20 text-orange-300 ring-orange-500/30";
    return "bg-red-600/20 text-red-300 ring-red-500/30";
  };

  if (isLoading) {
    return <StateMessage icon={Clock} title="Loading" message="Retrieving your history..." color="text-blue-400" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-16"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">Analysis History</h1>
          <p className="text-gray-400 mt-1">Found {history.length} previous analyses</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={onReturn}
          className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl text-sm font-semibold text-gray-300 flex items-center gap-2"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Back
        </motion.button>
      </div>

      {history.length === 0 ? (
        <StateMessage icon={Clock} title="No History" message="Start an analysis to see it here" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((analysis, idx) => {
            const analysisId = analysis?._id || idx;
            const score = analysis?.overall_score || 0;
            const title = analysis?.jd_title_used || 'Position';
            const filename = analysis?.resume_filename || 'Unknown';
            const date = analysis?.analysis_date ? new Date(analysis.analysis_date).toLocaleDateString() : 'N/A';
            
            return (
              <motion.div
                key={analysisId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => onSelectAnalysis(analysis)}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.4)" }}
                className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 hover:border-blue-500/50 cursor-pointer transition-all shadow-lg space-y-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-lg font-bold text-white leading-snug flex-1">{title}</h3>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ring-1 flex-shrink-0 ${getScoreClass(score)}`}>
                    {Math.round(score)}%
                  </span>
                </div>
                <p className="text-sm text-gray-400 truncate">{filename}</p>
                <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-white/5">
                  <span>{String(analysisId).substring(0, 8)}...</span>
                  <span>{date}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

// --- DASHBOARD VIEW ---
const DashboardView = ({ stats, historyData, onSelectAnalysis, onNavigate, isLoading }) => {
  const safeStats = stats || {};
  const safeHistory = historyData || [];


  if (isLoading) {
    return <StateMessage icon={LayoutDashboard} title="Loading" message="Fetching your metrics..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-16"
    >
      <SectionHeader
        icon={BarChart3}
        title="Recruitment Metrics"
        description="Your resume analysis activity and key performance indicators"
      />

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  <StatisticCard title="Total Analyses" value={safeStats.totalAnalyses || 0} icon={FileText} colorClass="text-blue-400" />
  <StatisticCard title="Average Score" value={Math.round(safeStats.averageScore || 0)} unit="%" icon={PieChart} colorClass="text-green-400" />
  <StatisticCard title="Highest Score" value={safeStats.highestScore || 0} unit="%" icon={Award} colorClass="text-purple-400" />
  <StatisticCard title="Lowest Score" value={safeStats.lowestScore || 0} unit="%" icon={AlertTriangle} colorClass="text-red-400" />

  {/* NEW METRICS */}
  <StatisticCard title="This Month" value={safeStats.analysesThisMonth || 0} icon={Clock} colorClass="text-yellow-400" />
  <StatisticCard title="This Week" value={safeStats.analysesThisWeek || 0} icon={Clock} colorClass="text-teal-400" />
  <StatisticCard title="Avg Skills Score" value={safeStats.averageSkillsScore || 0} unit="%" icon={Zap} colorClass="text-orange-400" />
  <StatisticCard title="Avg Experience Score" value={safeStats.averageExperienceScore || 0} unit="%" icon={Briefcase} colorClass="text-indigo-400" />
  <StatisticCard title="Avg Education Score" value={safeStats.averageEducationScore || 0} unit="%" icon={GraduationCap} colorClass="text-blue-300" />
</div>





      {/* Score Distribution */}
      {/* SCORE DISTRIBUTION — DONUT CHART */}
<motion.div className="lg:col-span-2 p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 shadow-xl">
  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
    <BarChart className="w-6 h-6 text-blue-400" />
    Score Distribution
  </h3>

  <div className="flex items-center justify-center">
    <RPieChart width={350} height={350}>
      <Pie
        data={[
          { name: "Excellent", value: safeStats.scoreDistribution?.excellent || 0 },
          { name: "Good", value: safeStats.scoreDistribution?.good || 0 },
          { name: "Average", value: safeStats.scoreDistribution?.average || 0 },
          { name: "Poor", value: safeStats.scoreDistribution?.poor || 0 }
        ]}
        innerRadius={90}
        outerRadius={130}
        paddingAngle={3}
        dataKey="value"
      >
        <Cell fill="#22c55e" />
        <Cell fill="#3b82f6" />
        <Cell fill="#facc15" />
        <Cell fill="#ef4444" />
      </Pie>
    </RPieChart>
    {/* LEGEND */}
<div className="mt-6 grid grid-cols-2 gap-3 text-sm">
  <div className="flex items-center gap-2">
    <span className="w-3 h-3 rounded-full bg-green-500"></span>
    <span className="text-gray-300">Excellent (80+)</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
    <span className="text-gray-300">Good (60–79)</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
    <span className="text-gray-300">Average (40–59)</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="w-3 h-3 rounded-full bg-red-500"></span>
    <span className="text-gray-300">Poor (0–39)</span>
  </div>
</div>


  </div>
</motion.div>

{/* SCORE BREAKDOWN — BAR CHART */}
<motion.div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 shadow-xl">
  <h3 className="text-xl font-bold text-white mb-6">Score Breakdown</h3>

  <RBarChart width={500} height={300} data={[
    { name: "Overall", value: safeStats.averageScore || 0 },
    { name: "Skills", value: safeStats.averageSkillsScore || 0 },
    { name: "Experience", value: safeStats.averageExperienceScore || 0 },
    { name: "Education", value: safeStats.averageEducationScore || 0 },
  ]}>
    <XAxis dataKey="name" stroke="#aaa" />
    <YAxis stroke="#aaa" />
    <Tooltip />
    <Bar dataKey="value" fill="#3b82f6" />
  </RBarChart>
  {/* LEGEND */}
<div className="flex flex-wrap gap-4 mt-6">
  <div className="flex items-center gap-2">
    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
    <span className="text-gray-300 text-sm">Scores (0–100%)</span>
  </div>
</div>

</motion.div>

{/* RADAR CHART — PROFILE BALANCE */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="p-6 rounded-2xl bg-gray-900/60 border border-white/10 backdrop-blur-xl shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400/20 transition-all"
>
  <div className="flex flex-col items-center">
    <h3 className="text-2xl font-semibold text-white mb-1 tracking-tight">
      Profile Radar
    </h3>
    <p className="text-gray-400 text-sm mb-6">
      Resume-based competency overview
    </p>
  </div>

  <RadarChart
    outerRadius={100}
    width={450}
    height={320}
    data={[
      { metric: "Skills", value: safeStats.averageSkillsScore || 0 },
      { metric: "Experience", value: safeStats.averageExperienceScore || 0 },
      { metric: "Education", value: safeStats.averageEducationScore || 0 },
    ]}
  >
    <PolarGrid stroke="rgba(255,255,255,0.1)" />
    <PolarAngleAxis dataKey="metric" stroke="#e5e7eb" tick={{ fontSize: 12 }} />
    <Radar
      dataKey="value"
      stroke="#3b82f6"
      fill="#3b82f6"
      fillOpacity={0.45}
      strokeWidth={2}
      animationDuration={1200}
    />
  </RadarChart>

  {/* LEGEND */}
  <div className="flex gap-6 mt-8 justify-center text-sm">
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
      <span className="text-gray-300">Overall Score</span>
    </div>
  </div>
</motion.div>

      {/* Recent Activity */}
      <motion.div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-400" />
          Recent Activity
        </h3>
        {safeHistory.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
              {safeHistory.slice(0, 3).map((analysis) => (
                <motion.div
                  key={analysis._id}
                  onClick={() => onSelectAnalysis(analysis)}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-gray-700/50 rounded-lg border border-white/10 hover:border-blue-500/50 cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-semibold text-white truncate flex-1">{analysis.jd_title_used || 'Position'}</p>
                    <span className="text-xs font-bold text-blue-400 flex-shrink-0">{analysis.overall_score}%</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 truncate">{analysis.resume_filename}</p>
                </motion.div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => onNavigate("history")}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 ml-auto"
            >
              View All <ChevronRight className="w-4 h-4" />
            </motion.button>
          </>
        ) : (
          <p className="text-gray-500 text-center py-4">No analyses yet</p>
        )}
      </motion.div>
    </motion.div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = () => {
  // Start with "input" view (file upload) as the landing page
  const [viewState, setViewState] = useState("input");
  const [analysisData, setAnalysisData] = useState(null);
  const [jobTitle, setJobTitle] = useState("Job Position");
  const [historyData, setHistoryData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
 

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, historyRes] = await Promise.all([
        api.getDashboardStats(),
        api.getAnalysisHistory()
      ]);

      // Handle stats response
      const stats = statsRes?.data?.data || {};
      setStatsData(stats);

      // Handle history response - ensure we're accessing the data correctly
      let historyArray = [];
      if (historyRes?.data?.data) {
        historyArray = historyRes.data.data;
        // Check if data is directly an array or nested
        if (Array.isArray(historyRes.data)) {
          historyArray = historyRes.data;
        } else if (historyRes.data.data && Array.isArray(historyRes.data.data)) {
          historyArray = historyRes.data.data;
        } else if (historyRes.data.success) {
          historyArray = historyRes.data.data || [];
        }
      }
      console.log('History data:', historyArray);
      setHistoryData(historyArray);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to load dashboard data";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

 


  // Only fetch on mount if there's data to show
  useEffect(() => {
    if (viewState === "dashboard" || viewState === "history") {
      fetchDashboardData();
    }
  }, [viewState, fetchDashboardData]);

  const handleSelectAnalysis = async (summaryAnalysis) => {
    setViewState("analysis");
    setAnalysisData(summaryAnalysis);
    setJobTitle(summaryAnalysis.jd_title_used || 'Job Position');
  };

  const handleAnalysisComplete = async (newAnalysis) => {
    // Set the new analysis data
    setAnalysisData(newAnalysis);
    setJobTitle(newAnalysis.jd_title_used || newAnalysis.jdTitle || 'Job Position');
    
    // Fetch updated dashboard data in the background
    try {
      const [statsRes, historyRes] = await Promise.all([
        api.getDashboardStats(),
        api.getAnalysisHistory()
      ]);
      
      const stats = statsRes?.data || {};
      setStatsData(stats);

      // Properly handle history response
      let historyArray = [];
      if (historyRes?.data) {
        if (Array.isArray(historyRes.data)) {
          historyArray = historyRes.data;
        } else if (historyRes.data.data && Array.isArray(historyRes.data.data)) {
          historyArray = historyRes.data.data;
        } else if (historyRes.data.success) {
          historyArray = historyRes.data.data || [];
        }
      }
      setHistoryData(historyArray);
    } catch (err) {
      console.error('Error refreshing dashboard data:', err);
    }
    
    // Navigate to dashboard view to see the new analysis and stats
    setViewState("dashboard");
  };

  const navigate = (view) => {
    setViewState(view);
    setError(null);
  };

  const navItems = [
    { name: "Upload", view: "input", icon: Upload },
    { name: "Dashboard", view: "dashboard", icon: LayoutDashboard },
    { name: "Last Report", view: "analysis", icon: FileText, disabled: !analysisData },
    { name: "History", view: "history", icon: Clock },
  ];

  const renderContent = () => {
    if (error && viewState !== 'input') {
      return <StateMessage icon={AlertTriangle} title="Error" message={error} color="text-red-400" />;
    }

    switch (viewState) {
      case "input":
        return <InputView onAnalysisComplete={handleAnalysisComplete} />;
      case "analysis":
        return <AnalysisView analysisData={analysisData} jobTitle={jobTitle} onReturn={() => navigate('dashboard')} />;
      case "history":
        return <HistoryView historyData={historyData} onSelectAnalysis={handleSelectAnalysis} onReturn={() => navigate('dashboard')} isLoading={isLoading} />;
      default:
        return <DashboardView stats={statsData} historyData={historyData} onSelectAnalysis={handleSelectAnalysis} onNavigate={navigate} isLoading={isLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white font-sans p-2 sm:p-4 md:p-8">
      <GradientBg />
      
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-lg p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl border border-white/10 mb-4 sm:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Zap className="w-6 sm:w-8 h-6 sm:h-8 text-blue-400" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Resume Analyzer</h1>
          </div>
          <nav className="flex flex-wrap justify-center gap-1 sm:gap-2 max-w-full">
            {navItems.map(item => (
              <motion.button
                key={item.view}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => !item.disabled && navigate(item.view)}
                disabled={item.disabled}
                className={`flex items-center px-2 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${viewState === item.view
                  ? 'bg-blue-600/50 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700/50'
                  }`}
              >
                <item.icon className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{item.name}</span>
                <span className="sm:hidden text-xs">{item.name.substring(0, 3)}</span>
              </motion.button>
            ))}
          </nav>
        </div>
      </header>

      <div className="w-full max-w-7xl mx-auto px-0 sm:px-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
