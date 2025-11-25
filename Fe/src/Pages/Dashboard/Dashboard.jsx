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
    <div className='bg-black min-h-screen w-screen overflow-x-hidden relative'>
      {/* Prism as background - absolute positioning */}
      <div className='absolute inset-0 w-full h-full'>
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0.5}
          glow={1}
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
            )}
          </div>

{/*Below is the component of the main part of the Dashboard
  where we will search for the JD and attach the resume */}

<div className="col-span-3 row-span-3 rounded-3xl flex justify-center">
  <div className="grid w-full h-full grid-rows-6 grid-cols-4">
    <div className="row-span-4 col-span-4 bg-gray-400  opacity-20 rounded-2xl m-2 p-4 overflow-y-auto"
    ref={containerRef}>
      {displayedtext ? (
        <p className='text-white text-base leading-relaxed whitespace-pre-wrap'>{displayedtext}</p>
      ) : (
        <div className='flex items-center justify-center h-full'>
          <p className='text-white text-xl'>Your AI analysis will appear in this component</p>
        </div>
      )}
    </div>


    {/* Attach/resume  */}


    <div className="row-start-5 col-span-4 flex items-center p-4 mt-10">
     <form className='w-full'
     onSubmit={handleSubmit}
     >
     <div className='w-full'>
        <div className='mb-3'>
          <textarea
          className='w-full h-24 rounded-xl bg-gray-400 opacity-60 text-black text-xl placeholder-black p-3 resize-none 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-opacity-90'
          placeholder='Enter Job Description here...'
          value={searchedText}
          onChange={(e) => setSearchedText (e.target.value)}
          disabled={submitting}
          >
          </textarea>
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
                    type='button'
                    onClick={() => setFiles(prev => prev.filter((_, index) => index !== i))}
                    className='ml-2 text-red-400 hover:text-red-300'
                  >
                    ✕
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard