import React from 'react'
import NavBar from '../../Components/NavBar.jsx'
import Prism from '../../Components/Prism'
import { useEffect, useRef, useState } from 'react'
import apiClient from '../../services/apiClient.js'


const Dashboard = () => {
 
 
  const [searchedText , setSearchedText] = useState ('');

  const [files , setFiles] =useState([]);

  const [isDragging , setIsDragging] =useState (false);

  const acceptedFromats = [ '.pdf' , '.docx' , '.doc'];

  const fileSize= 5 * 1024 * 1024; // 5mb

  const [backendtext , setBackendText] =useState('');
  const [displayedtext , setDisplayedText] =useState('');
  const [history ,sethistory] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [historyLoading ,setHistoryLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error ,setError] = useState(null);
  

  const containerRef = useRef(null);



  const validateFile = (file) =>{

    const ext = '.' + file.name.split('.').pop().toLowerCase();

    if(!acceptedFromats.includes(ext)){
      alert ('File format not supported. Please upload PDF or Word documents.');
      return false;
    }

    if (file.size > fileSize){
      alert ('File size exceeds the 5MB limit. Please upload a smaller file.');
      return false;
    }
    
    return true;
  };

{/* History is fetched on mount and re-fetched after each successful submission */}

  const formatDate = (value) => {
    try {
      return new Date(value).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return value;
    }
  };

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const { data } = await apiClient.get('/analysis/history');
      sethistory(data.items || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching history:', err.message);
      setError(err.response?.data?.message || 'Unable to fetch history');
    } finally {
      setHistoryLoading(false);
    }
  };


  // Fetch History compponent Mount whenever page is loaded

  useEffect ( ()=>{
    fetchHistory();
  } , [] );


  //Typewritter effect for displaying backend text
  //used Ai to make this effect

  useEffect( ()=> {
    setDisplayedText("");
    if (!backendtext) return;

    let i = 0;
    const typeSpeed = 30;  // milliseconds per char
    const timer = setInterval(() => {
      setDisplayedText(prev => prev + backendtext.charAt(i));
      i++; 
      if (i >= backendtext.length) {
        clearInterval(timer);
      }
    }, typeSpeed);

    return () => clearInterval(timer);
  }, [backendtext]);

// Auto scroll to bottom when displayedtext updates
// this component will help to scroll the text area to bottom whenever new text is added

  useEffect(() =>{

    const el= containerRef.current;
    if(el){
      el.scrollTop = el.scrollHeight;
    }
  } , [displayedtext])

//handle loading when fetching history
  if(historyLoading) {
     return <div className='text-white text-xl flex items-center justify-center min-h-screen'> Loading... </div>
  }

  // form submit handler 
  // this is 
const handleSubmit  = async (e) =>{
  e.preventDefault();
  
  if(files.length === 0){
    return alert ('please attach a resume before submitting');}
  if(searchedText.trim() ===''){
      return alert ('please enter the JD text before submitting');
    }

  setSubmitting(true);
  setError(null);

  try {
    const formData = new FormData();
    formData.append('jdText', searchedText);
    formData.append('resume', files[0]);

    const { data } = await apiClient.post('/analysis', formData, { 
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    const analysisPayload = data.analysis;
    setAnalysis(analysisPayload);
    setJobSuggestions(analysisPayload?.jobSuggestions || []);

    const narrative = `Resume Summary:\n${analysisPayload?.resumeSummary || 'N/A'}\n\nJD Summary:\n${analysisPayload?.jdSummary || 'N/A'}\n\nInsights:\n${analysisPayload?.insights || 'No insights yet.'}`;
    setBackendText(narrative);
    
    // Refetch history after successful submission
    await fetchHistory();

    // Clear form
    setSearchedText('');
    setFiles([]);

  } catch (error) {
    console.error('Error submitting data: ', error);
    setError(error.response?.data?.message || 'Failed to submit. Please try again.');
    alert('Error: ' + (error.response?.data?.message || 'Failed to submit'));
  } finally {
    setSubmitting(false);
  }

  }


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
      
      {/* Content on top of Prism */}
      <div className='relative z-10'>
        {/* Navbar */}
        <div className='h-20 my-3 mx-3 rounded-3xl'>
          <NavBar/>
        </div>
        
        {error && (
          <div className='mx-3 mb-3 bg-red-500/20 border border-red-400/40 text-red-200 text-center py-3 rounded-2xl'>
            {error}
          </div>
        )}
        {/* Grid Layout */}
        <div className='grid grid-rows-3 grid-cols-6 gap-4 mx-3 mb-3' style={{ height: '860px' }}>


          {/* below is the component where we will get the history of user */}
          <div id='history' className='col-span-2 row-span-3 rounded-3xl p-4 overflow-y-auto'>
            <h3 className='text-2xl text-white text-center border-2 border-amber-50 rounded-2xl p-2 mb-4'>History</h3>
             {/*Below is the component using the map method to fetch all the history of the user form database*/}
            {history.length === 0 ? (
              <div className='flex items-center justify-center h-64'>
                <p className='bg-opacity-75 bg-gray-500 opacity-70 rounded-2xl text-black text-lg p-4 text-center'>
                  No history yet. Submit a job description to get started!
                </p>
              </div>
            ) : (
              <div className='space-y-3'>
                {history.map((item) => (
                  <div key={item._id} className='bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg'>
                    <div className='flex justify-between items-center mb-2'>
                      <p className='text-white font-semibold'>Score</p>
                      <span className='text-green-400 font-bold text-lg'>{item.score ?? '--'}%</span>
                    </div>
                    <p className='text-gray-200 text-sm mb-2'>
                      {item.jdSummary || (item.jobDescription ? `${item.jobDescription.slice(0, 120)}...` : 'No description')}
                    </p>
                    <p className='text-xs text-gray-400'>{formatDate(item.createdAt)}</p>
                  </div>
                ))}
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

      <div className='flex items-center gap-3 mb-3'>
        <label className='inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 text-white font-medium hover:bg-blue-600 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13' />
          </svg>
          Attach Resume
          <input 
          type='file'
          className='hidden'
          accept='.pdf,.doc,.docx'
          disabled={submitting}
          onChange={(e)=>{
            const selectedFiles = e.target.files;
            if (selectedFiles.length === 0) return;

            const file = selectedFiles[0];

            if (validateFile(file)){
              setFiles([file]);
            }
            e.target.value = '';
          }}
          />
        </label>

        <button 
        type='submit'
        disabled={submitting}
        className='inline-flex items-center gap-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed'>
          {submitting ? (
            <>
              <svg className='animate-spin h-5 w-5' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Submit'
          )}
        </button>
      </div>

       <div className="text-sm mt-2">
        {files.length > 0 && (
          <div className='bg-gray-700 bg-opacity-50 rounded-lg p-3'>
            <p className='text-white font-semibold mb-2'>Attached Files:</p>
            <ul className="space-y-1">
              {files.map((f, i) => (
                <li key={i} className='flex items-center justify-between text-gray-200 bg-gray-600 bg-opacity-50 rounded px-3 py-1.5'>
                  <span className='truncate'>{f.name}</span>
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
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
    </form>
    </div>
  </div>
</div>



          {/* Below is the component of showing the pie chart of matching the abilities and the tally of the score
          when the user will search for the jd and attach the resume*/}

          
          <div className='col-span-1 row-span-3 rounded-2xl p-4 bg-white/5 backdrop-blur-lg border border-white/10 flex flex-col gap-6'>
            <div className='text-white text-center'>
              <h3 className='text-2xl font-bold mb-2'>Match Score</h3>
              <div className='text-5xl font-extrabold text-green-400'>
                {analysis ? `${analysis.score}%` : '--'}
              </div>
              <p className='text-xs text-gray-400 mt-1'>Based on resume vs JD skills</p>
            </div>
            <div>
              <h4 className='text-white font-semibold mb-2'>Missing Keywords</h4>
              {analysis?.missingKeywords?.length ? (
                <ul className='flex flex-wrap gap-2'>
                  {analysis.missingKeywords.slice(0,5).map((kw) => (
                    <li key={kw} className='text-xs px-3 py-1 bg-red-500/20 text-red-200 rounded-full'>
                      {kw}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-gray-400 text-sm'>Upload a resume to view gaps.</p>
              )}
            </div>
            <div>
              <h4 className='text-white font-semibold mb-2'>Recommended Skills</h4>
              {analysis?.recommendedSkills?.length ? (
                <ul className='flex flex-wrap gap-2'>
                  {analysis.recommendedSkills.slice(0,5).map((skill) => (
                    <li key={skill} className='text-xs px-3 py-1 bg-emerald-500/20 text-emerald-200 rounded-full'>
                      {skill}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-gray-400 text-sm'>Recommendations will appear here.</p>
              )}
            </div>
            <div className='overflow-y-auto'>
              <h4 className='text-white font-semibold mb-2'>Job Suggestions</h4>
              {jobSuggestions.length === 0 ? (
                <p className='text-gray-400 text-sm'>Submit a JD to get live job leads.</p>
              ) : (
                <ul className='space-y-3'>
                  {jobSuggestions.map((job) => (
                    <li key={job.url} className='bg-black/30 rounded-xl p-3 border border-white/5'>
                      <p className='text-white font-semibold'>{job.title}</p>
                      <p className='text-gray-300 text-sm'>{job.company} • {job.location}</p>
                      <a className='text-cyan-300 text-xs' href={job.url} target='_blank' rel='noreferrer'>
                        View role →
                      </a>
                    </li>
                  ))}
                </ul>
              )}
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