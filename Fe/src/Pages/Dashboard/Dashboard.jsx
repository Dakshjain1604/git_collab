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

const InputView = ({ setViewState }) => {
    // This is a placeholder for the actual InputView logic
    // In a full application, this view would handle file uploads and JD input.
    // For this dashboard context, we'll keep it simple or integrate it within the main dashboard page.
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-160px)]">
            <div className="text-center p-10 bg-gray-800/30 rounded-xl border border-blue-500/20 backdrop-blur-md shadow-2xl max-w-xl">
                <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Upload Resume & Job Description</h2>
                <p className="text-gray-400 mb-6">
                    Start by uploading a candidate's resume (PDF/DOCX) and pasting the corresponding job description (JD) to receive an AI-powered fit analysis.
                </p>
                <button
                    onClick={() => { /* Placeholder action, e.g., open file picker */ }}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-colors transform hover:scale-[1.02]"
                >
                    Start New Analysis
                </button>
                <p className="text-xs text-gray-500 mt-4">Note: This is a placeholder UI. Functionality is integrated with the main App.</p>
            </div>
        </div>
    );
};

const AnalysisView = ({ analysisData, jobTitle }) => {
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

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="p-6 bg-gray-800/50 rounded-xl shadow-2xl border border-white/10">
        <h1 className="text-4xl font-extrabold text-white mb-1">Analysis Report: {jobTitle || "Job Candidate"}</h1>
        <p className="text-gray-400">Deep-dive assessment of the resume against the target job description.</p>
      </div>

      {/* 1. Overall Score & Breakdown */}
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

      {/* 2. Critique & Recommendations */}
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

      {/* 3. Keywords & Summary */}
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


      {/* 4. Structured Resume Data */}
      {structured_resume && (
        <>
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
        </>
      )}

      {/* Spacing for bottom */}
      <div className="h-16"></div>
    </div>
  );
};


const HistoryView = ({ historyData, onSelectAnalysis }) => {
  // Mock data for this component since fetching history is done elsewhere in the app
  const mockHistory = [
    { 
      _id: "a1", 
      resume_filename: "Jane_Doe_Resume.pdf", 
      job_title: "Senior Full Stack Developer", 
      overall_score: 85, 
      analysis_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    { 
      _id: "a2", 
      resume_filename: "John_Smith_CV.docx", 
      job_title: "UX/UI Designer", 
      overall_score: 52, 
      analysis_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    { 
      _id: "a3", 
      resume_filename: "Alex_Johnson_Resume_New.pdf", 
      job_title: "Data Scientist Intern", 
      overall_score: 92, 
      analysis_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const history = historyData || mockHistory;

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
  const [viewState, setViewState] = useState("dashboard"); // 'dashboard', 'input', 'analysis', 'history'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState(null); // The currently viewed analysis report
  const [jobTitle, setJobTitle] = useState("Software Engineer"); // Job title for the current analysis
  const [historyData, setHistoryData] = useState(null); // All historical analyses
  const [statsData, setStatsData] = useState(null); // Aggregate statistics

  // Mock Data for Dashboard View
  useEffect(() => {
    // Simulate fetching dashboard stats and history
    const mockStats = {
      totalAnalyses: 42,
      averageScore: 71,
      highestScore: 95,
      lowestScore: 35,
      averageSkillsScore: 78,
      averageExperienceScore: 68,
      averageEducationScore: 75,
      analysesThisMonth: 12,
      analysesThisWeek: 3,
      scoreDistribution: {
        excellent: 15,
        good: 18,
        average: 7,
        poor: 2,
      }
    };
    setStatsData(mockStats);
    
    // Set a mock analysis report for initial 'analysis' view test
    const mockReport = {
        overall_score: 74,
        skills_score: 80,
        experience_score: 65,
        education_score: 77,
        matched_keywords: ["React", "Tailwind CSS", "FastAPI", "MongoDB", "Asynchronous Programming"],
        missing_keywords: ["Cloud Deployment (AWS/Azure)", "CI/CD", "Docker", "Kubernetes"],
        strengths: [
            "Strong foundational knowledge in modern frontend frameworks (React).",
            "Demonstrated experience in full-stack development with a focus on Python/FastAPI.",
            "Excellent match for required technical skills in the JD."
        ],
        weaknesses: [
            "Limited explicit mention of DevOps and cloud infrastructure experience.",
            "Work experience entries are brief and lack quantifiable achievements."
        ],
        recommendations: [
            "Add a 'DevOps' section to highlight tools like Docker and Kubernetes.",
            "Revise experience descriptions to include impact metrics (e.g., 'Increased performance by 30%').",
            "Consider a brief project on serverless architecture to fill the cloud gap."
        ],
        summary_critique: "The candidate presents a strong profile for a mid-level role. The technical skills are excellent, but the resume would benefit significantly from emphasizing project impact and filling the infrastructure gap mentioned in the JD.",
        structured_resume: {
            contact_info: {
                name: "Alex J. Tech",
                phone: "(555) 123-4567",
                email: "alex.tech@devmail.com",
                linkedin: "https://linkedin.com/in/alexjtech",
                portfolio: "https://alexjtech.com/portfolio"
            },
            summary: "Highly motivated Full Stack Developer with 5 years of experience building scalable web applications using React, Python/FastAPI, and MongoDB. Passionate about clean code and efficient, modern architecture.",
            experience: [
                {
                    title: "Software Engineer",
                    company: "Innovatech Solutions",
                    dates: "Jan 2021 - Present",
                    description_summary: "Led the development of a real-time analytics dashboard using React and WebSockets, resulting in a 25% increase in user engagement."
                },
                {
                    title: "Junior Developer",
                    company: "Startup Co.",
                    dates: "Jun 2019 - Dec 2020",
                    description_summary: "Contributed to the migration of legacy services to a Python-based microservice architecture, improving deployment reliability."
                }
            ],
            education: [
                {
                    degree: "B.S. Computer Science",
                    institution: "State University, Tech Campus",
                    year_or_dates: "2015 - 2019"
                }
            ],
            projects: [
                {
                    project_name: "AI Resume Scanner",
                    description: "Built a FastAPI backend with integrated LLM calling for structured resume parsing and job fit analysis.",
                    technologies: ["FastAPI", "Python", "LLM Integration", "Pydantic"]
                },
                {
                    project_name: "Personal Portfolio v3",
                    description: "A modern, highly performant static site built with Next.js and Tailwind CSS.",
                    technologies: ["Next.js", "Tailwind CSS", "Framer Motion"]
                }
            ],
            skills: ["React", "TypeScript", "Python", "FastAPI", "MongoDB", "SQL", "Git", "Jest", "Tailwind CSS", "Docker (Basic)"]
        }
    };
    setAnalysisData(mockReport);
    
    // Set view to 'analysis' to show the report initially
    // setViewState("analysis");
    
    // History data is mocked in HistoryView for simplicity now.
  }, []);

  const handleSelectAnalysis = (analysis) => {
    // In a real app, this would fetch the full analysis details from the backend
    console.log("Loading analysis:", analysis._id);
    // For mock, we just set the stored data
    setAnalysisData({
        ...analysis, // use history data fields
        // Mock the deeper analysis fields (they would come from the full object)
        matched_keywords: ["Mock", "Data", "Example"], 
        missing_keywords: ["Real", "Keywords"],
        strengths: ["Great mock data!"],
        weaknesses: ["Not real data."],
        recommendations: ["Upload a real resume."],
        summary_critique: "This is a summary critique of the mock report.",
        structured_resume: {
            contact_info: { name: analysis.resume_filename.replace('.pdf', '') },
            summary: "This is a placeholder summary for the loaded history item.",
            experience: [], education: [], projects: [], skills: []
        }
    });
    setJobTitle(analysis.job_title);
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
        return <InputView setViewState={setViewState} />;
      case "analysis":
        return <AnalysisView analysisData={analysisData} jobTitle={jobTitle} />;
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
                <h1 className="text-2xl font-bold text-blue-400">AI Recruiter</h1>
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
                    onClick={() => { setViewState(item.view); setSidebarOpen(false); }}
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
              </nav>

              <div className="mt-auto pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold">JD</div>
                      <div>
                          <p className="text-white font-semibold">Recruiter Dashboard</p>
                          <p className="text-xs text-gray-400">Welcome back!</p>
                      </div>
                  </div>
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