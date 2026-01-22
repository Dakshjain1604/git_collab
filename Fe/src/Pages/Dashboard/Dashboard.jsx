import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, FileText, Search, ChevronLeft, ChevronRight, 
  Briefcase, CheckCircle, AlertTriangle, Lightbulb, X, LayoutDashboard, 
  PieChart, Target, BarChart, User, GraduationCap, Phone, Mail, Clock, Zap
} from "lucide-react";
import NavBar from "../../Components/NavBar.jsx";

// --- Utility Components ---

const RadialProgress = ({ score, size = 180, strokeWidth = 12, label, subLabel, color = "#3B82F6" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const safeScore = isNaN(score) ? 0 : score;
  const offset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90 transition-all duration-1000">
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
          transition={{ duration: 1.5, ease: "easeInOut" }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
          className="drop-shadow-lg"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-4xl font-extrabold text-white">
          {Math.round(safeScore)}
          <span className="text-xl font-semibold text-white/70">%</span>
        </div>
        {label && <div className="text-sm font-medium text-white/90 mt-1">{label}</div>}
        {subLabel && <div className="text-xs text-blue-400/80">{subLabel}</div>}
      </div>
    </div>
  );
};

// Fixed the syntax error here: added the missing '}' in the template literal.
const ColorProgressIndicator = ({ value, label, color }) => (
  <div className="flex items-center space-x-2 text-sm">
    <div className={`h-4 w-4 rounded-full ${color}`} /> 
    <span className="text-gray-300">{label}:</span>
    <span className="font-semibold text-white">{value}</span>
  </div>
);

const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="flex items-start space-x-3 mb-6 p-4 rounded-xl border border-white/5 bg-gray-800/20 shadow-lg">
    <Icon className="text-blue-400/90 w-6 h-6 flex-shrink-0 mt-0.5" />
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </div>
);

const StatisticCard = ({ title, value, unit, icon: Icon, colorClass = "text-blue-400" }) => (
  <div className="p-6 bg-gray-800/50 rounded-xl shadow-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-300">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <Icon className={`w-5 h-5 ${colorClass}`} />
    </div>
    <p className="mt-2 text-3xl font-extrabold text-white">
      {value}
      {unit && <span className="text-lg font-semibold ml-1 text-gray-400">{unit}</span>}
    </p>
  </div>
);

const AnalysisSummaryCard = ({ title, content, icon: Icon, color = "text-blue-400", background = "bg-blue-900/10" }) => (
  <div className={`p-5 rounded-xl border border-white/10 shadow-lg ${background}`}>
    <div className="flex items-center space-x-3 mb-3">
      <Icon className={`w-5 h-5 ${color}`} />
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
      {Array.isArray(content) && content.length > 0 ? (
        content.map((item, index) => (
          <li key={index} className="leading-relaxed">{item}</li>
        ))
      ) : (
        <li className="text-gray-500">No data found for this section.</li>
      )}
    </ul>
  </div>
);

// --- View Components ---

// Shared component for loading/error state
const StateMessage = ({ icon: Icon, title, message, color = "text-blue-400" }) => (
  <div className="flex flex-col items-center justify-center p-12 bg-gray-800/30 rounded-xl border border-white/10 backdrop-blur-sm shadow-xl mt-12">
    <Icon className={`w-12 h-12 mb-4 ${color}`} />
    <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
    <p className="text-gray-400 text-center max-w-md">{message}</p>
  </div>
);

const InputView = ({ setViewState, setAnalysisData, onAnalysisComplete, setJobDescription: setParentJobDescription, setJobTitle: setParentJobTitle }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setResumeFile(file);
    } else {
      alert('Please select a PDF or DOCX file');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleSubmit = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      alert('Please select a resume file and enter a job description');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jdText', jobDescription);
      if (jobTitle.trim()) {
        formData.append('jdTitle', jobTitle);
      }

      const response = await axios.post('http://localhost:3000/analysis', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success && response.data.analysis) {
        // Set the analysis data and switch to analysis view
        setAnalysisData(response.data.analysis);
        const finalJobTitle = jobTitle || response.data.analysis.job_title || 'Job Analysis';
        const finalJobDescription = response.data.analysis.job_description || jobDescription;
        
        // Update parent state (Dashboard's state)
        if (setParentJobTitle) setParentJobTitle(finalJobTitle);
        if (setParentJobDescription) setParentJobDescription(finalJobDescription);
        
        setViewState('analysis');

        // Refresh history and stats
        onAnalysisComplete();
      } else {
        alert('Analysis failed: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to analyze resume. Please try again.';
      alert(errorMessage);
      
      // If unauthorized, redirect to signin
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/user/signin';
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={Upload}
        title="Resume Analysis"
        description="Upload a candidate's resume and paste the job description to get AI-powered insights."
      />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* File Upload Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">Resume Upload</h3>

          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              dragActive
                ? 'border-blue-400 bg-blue-500/10'
                : resumeFile
                ? 'border-green-400 bg-green-500/5'
                : 'border-gray-600 hover:border-blue-400 hover:bg-blue-500/5'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            {resumeFile ? (
              <div className="space-y-3">
                <FileText className="w-12 h-12 text-green-400 mx-auto" />
                <div>
                  <p className="text-white font-medium">{resumeFile.name}</p>
                  <p className="text-gray-400 text-sm">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setResumeFile(null);
                  }}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 text-blue-400 mx-auto" />
                <div>
                  <p className="text-white font-medium">Click to upload or drag and drop</p>
                  <p className="text-gray-400 text-sm">PDF or DOCX files only (max 10MB)</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job Description Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Job Title (Optional)</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Full Stack Developer"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Job Description *</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here..."
              rows={12}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-vertical"
            />
            <p className="text-gray-400 text-sm mt-2">
              {jobDescription.length} characters
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleSubmit}
          disabled={!resumeFile || !jobDescription.trim() || uploading}
          className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all transform ${
            !resumeFile || !jobDescription.trim() || uploading
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
          }`}
        >
          {uploading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Analyzing Resume...</span>
            </div>
          ) : (
            'Start AI Analysis'
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
        <h4 className="text-blue-400 font-semibold mb-3">How it works:</h4>
        <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
          <li>Upload the candidate's resume (PDF or DOCX format)</li>
          <li>Paste the complete job description you're hiring for</li>
          <li>Our AI analyzes the resume against the job requirements</li>
          <li>Get detailed insights, scores, and recommendations</li>
        </ol>
      </div>
    </div>
  );
};

const AnalysisView = ({ analysisData, jobTitle, jobDescription }) => {
  if (!analysisData) {
    return <StateMessage icon={X} title="No Analysis Data" message="Please perform an analysis first to view the results." color="text-red-400" />;
  }
  
  const { 
    overall_score, skills_score, experience_score, education_score, 
    matched_keywords, missing_keywords, strengths, weaknesses, 
    recommendations, summary_critique, structured_resume 
  } = analysisData;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getProgressColor = (score) => {
    if (score >= 80) return "#10B981"; // Emerald
    if (score >= 60) return "#F59E0B"; // Amber
    if (score >= 40) return "#FB923C"; // Orange
    return "#F87171"; // Red
  };

  // Ensure arrays are not null
  const safe_strengths = strengths || [];
  const safe_weaknesses = weaknesses || [];
  const safe_recommendations = recommendations || [];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Use scrollIntoView with offset calculation
      const yOffset = -120; // Offset for sticky headers
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    } else {
      console.warn(`Section with id "${sectionId}" not found`);
    }
  };

  const navigationTabs = [
    { id: 'overall-score', label: 'Overall Score', icon: PieChart },
    { id: 'critique', label: 'Critique', icon: Lightbulb },
    { id: 'keywords', label: 'Keywords', icon: Target },
    ...(structured_resume ? [{ id: 'resume-data', label: 'Resume Data', icon: FileText }] : []),
    ...(jobDescription ? [{ id: 'job-openings', label: 'Job Openings', icon: Search }] : [])
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="p-6 bg-gray-800/50 rounded-xl shadow-2xl border border-white/10">
        <h1 className="text-4xl font-extrabold text-white mb-1">Analysis Report: {jobTitle || "Job Candidate"}</h1>
        <p className="text-gray-400">Deep-dive assessment of the resume against the target job description.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-4 z-40 bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-lg">
        <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
          <span className="text-gray-400 text-sm font-medium mr-2 hidden md:inline">Jump to:</span>
          {navigationTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gray-700/50 hover:bg-gradient-to-r hover:from-blue-600/50 hover:to-purple-600/50 border border-white/10 hover:border-blue-500/30 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Overall Score & Breakdown */}
      <div id="overall-score" className="scroll-mt-24">
        <SectionHeader 
        icon={PieChart} 
        title="Overall Fit Score" 
        description="A holistic rating of the candidate's resume match and quality against the JD." 
      />
      <div className="grid lg:grid-cols-5 gap-8 items-center">
        {/* Main Radial Score */}
        <div className="lg:col-span-2 flex justify-center p-6 bg-gray-800/50 rounded-xl shadow-2xl border border-blue-500/20">
          <RadialProgress 
            score={overall_score} 
            size={220}
            strokeWidth={15}
            label="Overall Match" 
            subLabel={jobTitle || "JD"}
            color={getProgressColor(overall_score)}
          />
        </div>

        {/* Breakdown Scores */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-4">
          <StatisticCard 
            title="Experience Score" 
            value={experience_score} 
            unit="%" 
            icon={Briefcase} 
            colorClass={getScoreColor(experience_score)}
          />
          <StatisticCard 
            title="Skills Score" 
            value={skills_score} 
            unit="%" 
            icon={Zap} 
            colorClass={getScoreColor(skills_score)}
          />
          <StatisticCard 
            title="Education Score" 
            value={education_score} 
            unit="%" 
            icon={GraduationCap} 
            colorClass={getScoreColor(education_score)}
          />
          <StatisticCard 
            title="JD Keyword Match" 
            value={matched_keywords ? matched_keywords.length : 0} 
            unit="Keywords" 
            icon={Target} 
            colorClass="text-purple-400"
          />
        </div>
      </div>
      </div>

      {/* 2. Critique & Recommendations */}
      <div id="critique" className="scroll-mt-24">
        <SectionHeader 
        icon={Lightbulb} 
        title="Critique & Actionable Insights" 
        description="Strengths, areas for improvement, and clear recommendations for the next step." 
      />
      <div className="grid md:grid-cols-3 gap-6">
        <AnalysisSummaryCard 
          title="Candidate Strengths" 
          content={safe_strengths} 
          icon={CheckCircle} 
          color="text-green-400" 
          background="bg-green-900/10"
        />
        <AnalysisSummaryCard 
          title="Weaknesses & Gaps" 
          content={safe_weaknesses} 
          icon={AlertTriangle} 
          color="text-red-400" 
          background="bg-red-900/10"
        />
        <AnalysisSummaryCard 
          title="Recommendations" 
          content={safe_recommendations} 
          icon={Lightbulb} 
          color="text-blue-400" 
          background="bg-blue-900/10"
        />
      </div>
      </div>

      {/* 3. Keywords & Summary */}
      <div id="keywords" className="scroll-mt-24">
        <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">Summary Critique</h3>
            <p className="p-4 text-gray-300 bg-gray-800/50 rounded-xl border border-white/10 shadow-inner leading-relaxed">
              {summary_critique || "No summary critique available."}
            </p>
        </div>
        <div className="md:col-span-1">
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">JD Keyword Analysis</h3>
            <div className="p-4 bg-gray-800/50 rounded-xl border border-white/10 shadow-inner space-y-3">
                <h4 className="text-base font-medium text-blue-400">Matched ({matched_keywords ? matched_keywords.length : 0})</h4>
                <div className="flex flex-wrap gap-2">
                    {(matched_keywords || []).map((keyword, index) => (
                        <span key={index} className="px-3 py-1 text-xs font-medium bg-green-700/50 text-green-300 rounded-full">{keyword}</span>
                    ))}
                </div>
                
                <h4 className="text-base font-medium text-red-400 pt-3 border-t border-white/5">Missing ({missing_keywords ? missing_keywords.length : 0})</h4>
                <div className="flex flex-wrap gap-2">
                    {(missing_keywords || []).map((keyword, index) => (
                        <span key={index} className="px-3 py-1 text-xs font-medium bg-red-700/50 text-red-300 rounded-full line-through opacity-80">{keyword}</span>
                    ))}
                </div>
            </div>
        </div>
      </div>
      </div>


      {/* 4. Structured Resume Data */}
      {structured_resume && (
        <div id="resume-data" className="scroll-mt-24">
          <SectionHeader 
            icon={FileText} 
            title="Extracted Candidate Data" 
            description="The key information structured by the AI for quick reference." 
          />

          <div className="grid md:grid-cols-4 gap-6 mb-8">
              {/* Contact Info */}
              <div className="md:col-span-1 p-5 bg-gray-800/50 rounded-xl border border-white/10 shadow-lg">
                  <h3 className="text-xl font-bold text-white mb-3 border-b border-white/10 pb-2">{structured_resume.contact_info?.name || "Candidate"}</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                      {structured_resume.contact_info?.email && (
                          <div className="flex items-center"><Mail className="w-4 h-4 mr-2 text-blue-400"/>{structured_resume.contact_info.email}</div>
                      )}
                      {structured_resume.contact_info?.phone && (
                          <div className="flex items-center"><Phone className="w-4 h-4 mr-2 text-blue-400"/>{structured_resume.contact_info.phone}</div>
                      )}
                      {structured_resume.contact_info?.linkedin && (
                          <div className="flex items-center"><User className="w-4 h-4 mr-2 text-blue-400"/>
                          <a href={structured_resume.contact_info.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 truncate">LinkedIn</a>
                          </div>
                      )}
                       {structured_resume.contact_info?.portfolio && (
                          <div className="flex items-center"><LayoutDashboard className="w-4 h-4 mr-2 text-blue-400"/>
                          <a href={structured_resume.contact_info.portfolio} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 truncate">Portfolio</a>
                          </div>
                      )}
                  </div>
              </div>
              
              {/* Summary */}
              <div className="md:col-span-3 p-5 bg-gray-800/50 rounded-xl border border-white/10 shadow-lg">
                  <h3 className="text-xl font-semibold text-white mb-3 border-b border-white/10 pb-2">Professional Summary</h3>
                  <p className="text-gray-300 leading-relaxed">{structured_resume.summary || "Summary not extracted."}</p>
              </div>
          </div>

          {/* Experience and Education/Projects Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-blue-400"/>Work Experience</h3>
                  <div className="space-y-5">
                      {structured_resume.experience && structured_resume.experience.length > 0 ? (
                          structured_resume.experience.map((exp, index) => (
                              <div key={index} className="p-4 border-l-4 border-blue-600 bg-gray-800/30 rounded-r-lg shadow-md">
                                  <h4 className="text-lg font-bold text-white">{exp.title}</h4>
                                  <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                                    <span>{exp.company}</span>
                                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/>{exp.dates}</span>
                                  </div>
                                  <p className="text-sm text-gray-300">{exp.description_summary}</p>
                              </div>
                          ))
                      ) : (
                          <p className="text-gray-500">No work experience extracted.</p>
                      )}
                  </div>
                  
                  {structured_resume.projects && structured_resume.projects.length > 0 && (
                      <div className="pt-6">
                          <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2 flex items-center"><Target className="w-5 h-5 mr-2 text-blue-400"/>Key Projects</h3>
                          <div className="space-y-4">
                              {structured_resume.projects.map((project, index) => (
                                  <div key={index} className="p-4 bg-gray-800/30 rounded-lg shadow-md border border-white/10">
                                      <h4 className="text-lg font-bold text-white mb-1">{project.project_name}</h4>
                                      <p className="text-sm text-gray-300 mb-2">{project.description}</p>
                                      <div className="flex flex-wrap gap-2">
                                          {(project.technologies || []).map((tech, i) => (
                                              <span key={i} className="px-2 py-0.5 text-xs font-medium bg-purple-700/50 text-purple-300 rounded-md">{tech}</span>
                                          ))}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

              </div>
              
              <div className="lg:col-span-1 space-y-6">
                  {/* Education */}
                  <div>
                      <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2 flex items-center"><GraduationCap className="w-5 h-5 mr-2 text-blue-400"/>Education</h3>
                      <div className="space-y-4">
                          {structured_resume.education && structured_resume.education.length > 0 ? (
                              structured_resume.education.map((edu, index) => (
                                  <div key={index} className="p-4 bg-gray-800/30 rounded-lg shadow-md border border-white/10">
                                      <h4 className="text-base font-bold text-white">{edu.degree}</h4>
                                      <p className="text-sm text-gray-400">{edu.institution}</p>
                                      <p className="text-xs text-gray-500">{edu.year_or_dates}</p>
                                  </div>
                              ))
                          ) : (
                              <p className="text-gray-500">No education extracted.</p>
                          )}
                      </div>
                  </div>

                  {/* Skills */}
                  <div>
                      <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2 flex items-center"><Zap className="w-5 h-5 mr-2 text-blue-400"/>Key Skills</h3>
                      <div className="p-4 bg-gray-800/30 rounded-lg shadow-md border border-white/10">
                          <div className="flex flex-wrap gap-2">
                              {structured_resume.skills && structured_resume.skills.length > 0 ? (
                                  structured_resume.skills.map((skill, index) => (
                                      <span key={index} className="px-3 py-1 text-sm font-medium bg-gray-700/50 text-gray-300 rounded-full">{skill}</span>
                                  ))
                              ) : (
                                  <p className="text-gray-500 text-sm">No skills extracted.</p>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      )}

      {/* 5. Relevant Job Openings */}
      {jobDescription && (
        <div id="job-openings" className="scroll-mt-24">
          <JobSearchSection jobDescription={jobDescription} jobTitle={jobTitle} />
        </div>
      )}

      {/* Spacing for bottom */}
      <div className="h-16"></div>
    </div>
  );
};

// Job Search Component
const JobSearchSection = ({ jobDescription, jobTitle }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (jobDescription && jobDescription.trim().length > 10 && !searched) {
      searchJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobDescription]);

  const searchJobs = async () => {
    if (loading || searched) return;
    
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please sign in to search for jobs');
        return;
      }

      const response = await axios.post('http://localhost:3000/jobs/search', {
        jobDescription: jobDescription,
        limit: 10
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success && response.data.data) {
        setJobs(response.data.data.jobs || []);
      }
    } catch (err) {
      console.error('Job search error:', err);
      setError(err.response?.data?.message || 'Failed to search for jobs');
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Salary not specified';
    const min = salary.min ? new Intl.NumberFormat('en-US', { style: 'currency', currency: salary.currency || 'USD', maximumFractionDigits: 0 }).format(salary.min) : '';
    const max = salary.max ? new Intl.NumberFormat('en-US', { style: 'currency', currency: salary.currency || 'USD', maximumFractionDigits: 0 }).format(salary.max) : '';
    if (min && max) return `${min} - ${max}`;
    if (min) return `From ${min}`;
    if (max) return `Up to ${max}`;
    return 'Salary not specified';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Search} 
        title="Relevant Job Openings" 
        description={`Based on the job description for "${jobTitle || 'this position'}", here are some current openings that match your criteria.`} 
      />

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <span className="ml-4 text-gray-400">Searching for relevant jobs...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && searched && (
        <div className="p-8 bg-gray-800/50 border border-white/10 rounded-xl text-center">
          <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No job openings found. Try adjusting your search criteria.</p>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="grid gap-4">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="p-6 bg-gray-800/50 border border-white/10 rounded-xl hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {job.url && job.url !== '#' && (job.url.startsWith('http://') || job.url.startsWith('https://')) ? (
                      <a 
                        href={job.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (!job.url || job.url === '#' || (!job.url.startsWith('http://') && !job.url.startsWith('https://'))) {
                            e.preventDefault();
                            return false;
                          }
                        }}
                        className="flex items-center hover:text-blue-400 transition-colors"
                      >
                        {job.title}
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <span className="flex items-center">
                        {job.title}
                        <span className="ml-2 text-xs text-gray-500">(URL not available)</span>
                      </span>
                    )}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {job.company}
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {job.location}
                    </div>
                    {job.salary && (
                      <div className="flex items-center text-green-400">
                        <span className="font-semibold">{formatSalary(job.salary)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex flex-col items-end">
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs font-medium rounded-full mb-2">
                    {job.source}
                  </span>
                  <span className="text-xs text-gray-500">{formatDate(job.posted)}</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                {job.description}
              </p>
              {job.url && job.url !== '#' && (job.url.startsWith('http://') || job.url.startsWith('https://')) ? (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!job.url || job.url === '#' || (!job.url.startsWith('http://') && !job.url.startsWith('https://'))) {
                      e.preventDefault();
                      return false;
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
                >
                  Apply Now
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center px-4 py-2 bg-gray-600/50 text-gray-400 font-medium rounded-lg cursor-not-allowed"
                  title="Job URL not available"
                >
                  URL Not Available
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {jobs.length > 0 && (
        <div className="text-center pt-4">
          <p className="text-gray-400 text-sm">
            Found {jobs.length} relevant job{jobs.length !== 1 ? 's' : ''} based on your job description
          </p>
        </div>
      )}
    </div>
  );
};


const HistoryView = ({ historyData, onSelectAnalysis }) => {
  const history = historyData || [];

  const getScoreClass = (score) => {
    if (score >= 80) return "bg-green-600/20 text-green-300 ring-green-500/30";
    if (score >= 60) return "bg-yellow-600/20 text-yellow-300 ring-yellow-500/30";
    if (score >= 40) return "bg-orange-600/20 text-orange-300 ring-orange-500/30";
    return "bg-red-600/20 text-red-300 ring-red-500/30";
  };

  if (history.length === 0) {
    return <StateMessage icon={Clock} title="No History Yet" message="Your analysis history will appear here once you've processed a resume." />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Clock} 
        title="Analysis History" 
        description={`Found ${history.length} previous analyses. Click an entry to reload the full report.`} 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((analysis) => (
          <div 
            key={analysis._id} 
            onClick={() => onSelectAnalysis(analysis)}
            className="p-5 bg-gray-800/50 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all duration-200 cursor-pointer shadow-xl space-y-3"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-white leading-snug">{analysis.job_title}</h3>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ring-1 ml-4 flex-shrink-0 ${getScoreClass(analysis.overall_score)}`}>
                {analysis.overall_score}%
              </span>
            </div>
            <p className="text-sm text-gray-400 truncate">{analysis.resume_filename}</p>
            <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-white/5">
              <span>Analysis ID: {analysis._id.substring(0, 8)}...</span>
              <span>{new Date(analysis.analysis_date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// --- Main Dashboard Component ---

const Dashboard = () => {
  const [viewState, setViewState] = useState("input"); // 'dashboard', 'input', 'analysis', 'history'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [analysisData, setAnalysisData] = useState(null); // The currently viewed analysis report
  const [jobTitle, setJobTitle] = useState(""); // Job title for the current analysis
  const [jobDescription, setJobDescription] = useState(""); // Job description for job search
  const [historyData, setHistoryData] = useState(null); // All historical analyses
  const [statsData, setStatsData] = useState(null); // Aggregate statistics
  const [loading, setLoading] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      // Load history and stats
      await Promise.all([loadHistory(), loadStats()]);
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No auth token found");
        return;
      }

      const response = await axios.get('http://localhost:3000/analysis/history', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setHistoryData(response.data.analyses || []);
      }
    } catch (error) {
      console.error("Failed to load history:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/user/signin';
      }
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No auth token found");
        return;
      }

      const response = await axios.get('http://localhost:3000/analysis/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setStatsData(response.data.stats);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/user/signin';
        return;
      }
      // If no stats available yet, set empty stats
      setStatsData({
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
      });
    }
  };

  const handleSelectAnalysis = (analysis) => {
    console.log("Loading analysis:", analysis._id);
    // Use the stored data from the history item
    // Map the history entry to the expected analysis data structure
    setAnalysisData({
      overall_score: analysis.overall_score,
      skills_score: analysis.skills_score,
      experience_score: analysis.experience_score,
      education_score: analysis.education_score,
      matched_keywords: analysis.matched_keywords || [],
      missing_keywords: analysis.missing_keywords || [],
      strengths: analysis.strengths || [],
      weaknesses: analysis.weaknesses || [],
      recommendations: analysis.recommendations || [],
      summary_critique: analysis.summary_critique || '',
      structured_resume: analysis.structured_resume || {}
    });
    setJobTitle(analysis.job_title || analysis.jd_title_used || 'Job Analysis');
    setJobDescription(analysis.jd_text_used || '');
    setViewState("analysis");
  };

  const DashboardView = ({ stats }) => (
    <div className="space-y-10">
      <SectionHeader 
        icon={LayoutDashboard} 
        title="Recruitment Metrics Dashboard" 
        description="A summary of your resume analysis activity and key performance indicators." 
      />

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatisticCard title="Total Analyses" value={stats.totalAnalyses} icon={FileText} colorClass="text-blue-400" />
        <StatisticCard title="Avg Fit Score" value={stats.averageScore} unit="%" icon={PieChart} colorClass="text-green-400" />
        <StatisticCard title="Highest Score" value={stats.highestScore} unit="%" icon={Zap} colorClass="text-purple-400" />
        <StatisticCard title="Lowest Score" value={stats.lowestScore} unit="%" icon={AlertTriangle} colorClass="text-red-400" />
      </div>

      {/* Score Distribution and Timeline */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Score Distribution */}
        <div className="lg:col-span-2 p-6 bg-gray-800/50 rounded-xl shadow-2xl border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">Score Distribution (Count)</h3>
          <div className="grid grid-cols-4 gap-4 mt-6">
            <ColorProgressIndicator value={stats.scoreDistribution.excellent} label="Excellent (80+)" color="bg-green-500" />
            <ColorProgressIndicator value={stats.scoreDistribution.good} label="Good (60-79)" color="bg-yellow-500" />
            <ColorProgressIndicator value={stats.scoreDistribution.average} label="Average (40-59)" color="bg-orange-500" />
            <ColorProgressIndicator value={stats.scoreDistribution.poor} label="Poor (0-39)" color="bg-red-500" />
          </div>
          <div className="mt-8">
             <h4 className="text-lg font-semibold text-white mb-3">Activity Timeline</h4>
             <div className="grid grid-cols-2 gap-4">
                <StatisticCard title="Analyses This Month" value={stats.analysesThisMonth} icon={Clock} colorClass="text-indigo-400" />
                <StatisticCard title="Analyses This Week" value={stats.analysesThisWeek} icon={BarChart} colorClass="text-pink-400" />
             </div>
          </div>
        </div>

        {/* Breakdown Radial Scores */}
        <div className="lg:col-span-1 p-6 bg-gray-800/50 rounded-xl shadow-2xl border border-white/10 flex flex-col items-center">
          <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2 w-full text-center">Average Breakdown</h3>
          <div className="flex flex-wrap justify-center gap-4">
             <RadialProgress score={stats.averageExperienceScore} size={100} strokeWidth={8} label="Experience" color="#6366F1" />
             <RadialProgress score={stats.averageSkillsScore} size={100} strokeWidth={8} label="Skills" color="#F97316" />
             <RadialProgress score={stats.averageEducationScore} size={100} strokeWidth={8} label="Education" color="#0EA5E9" />
          </div>
        </div>
      </div>
      
      {/* Quick Access to History */}
      <div className="pt-4">
        <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">Recent Activity</h3>
        <HistoryView historyData={historyData} onSelectAnalysis={handleSelectAnalysis} />
      </div>

      {/* Spacing */}
      <div className="h-16"></div>
    </div>
  );
  
  const renderContent = () => {
    switch (viewState) {
      case "input":
        return <InputView 
          setViewState={setViewState} 
          setAnalysisData={setAnalysisData} 
          onAnalysisComplete={() => { loadHistory(); loadStats(); }}
          setJobDescription={setJobDescription}
          setJobTitle={setJobTitle}
        />;
      case "analysis":
        return <AnalysisView analysisData={analysisData} jobTitle={jobTitle} jobDescription={jobDescription} />;
      case "history":
        return <HistoryView historyData={historyData} onSelectAnalysis={handleSelectAnalysis} />;
      case "dashboard":
      default:
        return statsData ? <DashboardView stats={statsData} /> : <StateMessage icon={Clock} title="Loading Dashboard" message="Fetching your recruitment activity metrics..." color="text-blue-400" />;
    }
  };

  const navItems = [
    { name: "Dashboard", view: "dashboard", icon: LayoutDashboard },
    { name: "New Analysis", view: "input", icon: Upload },
    { name: "Last Report", view: "analysis", icon: FileText },
    { name: "History", view: "history", icon: Clock },
  ];

  const handleNavClick = (item) => {
    if (item.view === 'settings') {
      window.location.href = '/user/settings';
    } else {
      setViewState(item.view);
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0B0F17] text-white font-sans">
      
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900/95 backdrop-blur-md shadow-2xl md:static"
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-blue-400">ResumeMatcher</h1>
                <button 
                  onClick={() => setSidebarOpen(false)} 
                  className="p-1 rounded-full text-gray-400 hover:bg-gray-700 md:hidden"
                >
                  <X size={20} />
                </button>
              </div>
              
              <nav className="flex-grow space-y-2">
                {navItems.map(item => (
                  <button
                    key={item.view}
                    onClick={() => handleNavClick(item)}
                    className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors text-left ${
                      viewState === item.view 
                        ? 'bg-blue-600/50 text-white font-semibold shadow-md' 
                        : 'text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                ))}
                <button
                  onClick={() => window.location.href = '/user/settings'}
                  className="flex items-center w-full px-4 py-3 rounded-xl transition-colors text-left text-gray-300 hover:bg-gray-700/50"
                >
                  <User className="w-5 h-5 mr-3" />
                  Settings
                </button>
              </nav>

              <div className="mt-auto pt-4 border-t border-gray-700 space-y-2">
                  <div className="flex items-center space-x-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold">JD</div>
                      <div>
                          <p className="text-white font-semibold">Recruiter Dashboard</p>
                          <p className="text-xs text-gray-400">Welcome back!</p>
                      </div>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      window.location.href = '/user/signin';
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 transition-colors text-sm font-medium"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Logout
                  </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-4 z-40 p-2 bg-gray-800/50 border border-white/10 rounded-lg hover:bg-gray-700 transition-colors md:hidden"
      >
        <ChevronRight size={20} className={sidebarOpen ? "opacity-0" : "opacity-100"} />
      </button>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Toggle Sidebar trigger for desktop */}
         <div className="absolute left-0 top-1/2 -translate-y-1/2 z-30 hidden md:block">
             <button 
               onClick={() => setSidebarOpen(!sidebarOpen)}
               className="h-16 w-4 bg-white/5 hover:bg-blue-500/20 rounded-r-xl transition-colors flex items-center justify-center"
             >
               {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
             </button>
         </div>
        
        <div className="h-full overflow-y-auto p-4 md:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0B0F17] to-[#0B0F17]">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
