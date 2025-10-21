import React from 'react'
import NavBar from '../../Components/NavBar.jsx'
import Prism from '../../Components/Prism'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'


const Dashboard = () => {
 
 
  const [files , setFiles] =useState([]);

  const [isDragging , setIsDragging] =useState (false);

const acceptedFromats = [ '.pdf' , '.docx' , '.doc'];

const fileSize= 5 * 1024 * 1024; // 5mb

  const [backendtext , setBackendText] =useState(null);
  const [displayedtext , setDisplayedText] =useState(null);
  const [history ,sethistory] = useState([]);
  const [loading ,setLoading] = useState(true);
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

{/* Below is the code for fetching the data form the backend api using axios and the history of the user using
  useEffect hook whenever the page loads or the component mounts but there is some confusion related to the hiatsory 
  fetching part because whenever there is new search then i had to use
   the useEffect hook again to fetch the new history but i am not sure how to do that so please help me in that*/}

  useEffect ( ()=>{
    const fetchData = async () =>{
      try {
        setLoading (true) ;
        setError(null);

        const data = await axios.get ('');  //replace the Api endpoint where we will get the text from ai
        const fetchHistory = await axios.get(''); //replace the api endpoint where we will get the hsitory of the user


        const backendData= data.data;

        setBackendText (backendData);
        setDisplayedText (backendData);

        sethistory (fetchHistory.data);

        setLoading (false);

              }
              catch (err){
                console.error (err.message);
              }
              finally {
                setLoading (false);
              }
    };
    fetchData();
  } , [] );


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

  useEffect(() =>{

    const el= containerRef.current;
    if(el){
      el.scrollTop = el.scrollHeight;
    }
  } , [displayedtext])


  if(loading) {
     return <div className='text-white text-xl'> Loading... </div>
  }
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
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
        
        {/* Grid Layout */}
        <div className='grid grid-rows-3 grid-cols-6 gap-4 mx-3 mb-3' style={{ height: '860px' }}>


          {/* below is the component where we will get the history of user */}
          <div className='col-span-2 row-span-3  rounded-3xl'>
            <h3 className='text-2xl text-white text-center  border-2 border-amber-50 rounded-4xl'>History</h3>
             {/*Below is the component using the map method to fetch all the history of the user form database*/}
            <div className='flex flex-items-center justify-center'>
            <p className='bg-opacity-75 bg-gray-200 rounded-2xl  text-black text-xl m-2 text-center'>Here we will provide the
               details to get the all the history
               of the user to get jd and resume </p>
               </div>
          </div>

{/*Below is the component of the main part of the Dashboard
  where we will search for the JD and attach the resume */}

<div className="col-span-3 row-span-3 rounded-3xl flex justify-center">
  <div className="grid w-full h-full grid-rows-6 grid-cols-4">
    <div className="row-span-4 col-span-4  bg-white opacity-20 rounded-4xl m-2 p-3 overflow-y-auto"
    ref={containerRef}>
      <p>{setDisplayedText}</p>
    </div>


    {/* Attach/resume  */}


    <div className="row-start-6 col-span-4  flex items-center p-4">
     <div className='bg-white opacity-60'>
      <label className='rounded-md bg-blue-300 px-6 py-2 text-white text-bold hover:bg-blue-800 cursor-pointer'
      >
        Attach Resume
        <input 
        type='file'
        className='hidden'
        onChange={(e)=>{
        }}
        />
      </label>
    </div>
    </div>
  </div>
</div>



          {/* Below is the component of showing the pie chart of matching the abilities and the tally of the score
          when the user will search for the jd and attach the resume*/}
          <div className='col-span-1 row-span-3  rounded-2xl flex items-center justify-center'>
            <div className='text-white text-bold text-4xl'>we need to include the pie chart to make the reslut show in the format of chart and the tally of the score</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
