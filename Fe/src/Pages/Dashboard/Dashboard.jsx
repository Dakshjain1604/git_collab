import React from 'react'
import NavBar from '../../Components/NavBar.jsx'
import Prism from '../../Components/Prism'

const Dashboard = () => {
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


{/*Below is the component of the main part of the Dashboard wheere we will search for the jd and the attach the resume */}

          <div className='col-span-3 row-span-3  rounded-3xl flex items-end justify-center'>
            <textarea
              type="text"
              placeholder="Enter Job Description"
              className="w-3/4 p-4 rounded-2xl text-xl bg-gray-200 bg-opacity-75 text-black mb-10"
            />
          </div>


          {/* Below is the component of showing the pie chart of matching the abilities and the tally of the score
          when the user will search for the jd and attach the resume*/}
          <div className='col-span-1 row-span-3  rounded-3xl'>

            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
