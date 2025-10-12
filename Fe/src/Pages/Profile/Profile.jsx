import React from 'react'
import axios from 'axios'
import { createContext , useContext ,useState } from 'react'

const UserContext = createContext();




const Profile = () => {
  return (
<div className='grid grid-cols-2 grid-rows-2 gap-2 h-screen w-screen p-2 bg-black'>
  <div className='flex items-center justify-center row-span-2 border-4 border-black bg-blue-200 rounded-xl m-3 '>
<div className=''>

  <div className='flex items-center justify-between bg-white/30 p-15 rounded-lg'>
    <div className='text-white bg-black flex items-center border-2 border-amber-300 rounded-lg py-2'>
      <p className='text-2xl px-4 font-semibold'>Name:</p>
      <h3 className='text-2xl px-8 tracking-wider'>John Doe</h3>
    </div>
  </div>

  <div className='flex items-center justify-between bg-white/30 p-15 rounded-lg'>
    <div className='text-white bg-black flex items-center border-2 border-amber-300 rounded-lg py-2'>
      <p className='text-2xl px- font-semibold'>Username:</p>
      <h3 className='text-2xl px-8 tracking-wider'>JohnDoe</h3>
    </div>
  </div>


  <div className='flex items-center justify-between bg-white/30 p-15 rounded-lg'>
    <div className='text-white bg-black flex items-center border-2 border-amber-300 rounded-lg py-2'>
      <p className='text-2xl px-4 font-semibold'>Password:</p>
      <h3 className='text-2xl px-8 tracking-wider'>••••••••</h3>
    </div>
  </div>
  <div className='border-t-2 border-black/20 my-4'></div>
  <div className='flex justify-center space-x-10'>
    <button className="bg-red-600 text-white py-3 px-8 rounded-lg shadow-md 
                       hover:bg-red-700 active:bg-red-800 focus:outline-none 
                       focus:ring-2 focus:ring-red-500 transition-all duration-200 
                       hover:scale-105 font-semibold">
      Logout
    </button>
     <button className="bg-blue-600 text-white py-3 px-8 rounded-lg shadow-md 
                       hover:bg-blue-700 active:bg-blue-800 focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 transition-all duration-200 
                       hover:scale-105 font-semibold">
      Edit
    </button>
  </div>
</div></div>
  <div className='col-start-2 row-span-1 m-4 border-4 border-white rounded-xl overflow-y-auto'>
  <div className='text-center'>
    <h3 className='text-white text-4xl font-semibold'>Resume</h3>
  </div>
  {/* here we will add .map function to add the details of the resume that have been edited with the main heading of it*/}
  <div className='m-3 border-2 border-white rounded-2xl'>
    <p className='px-2 text-white'>Headings of Resume</p>
  </div>
</div>
  <div className='col-start-2 row-span-1 border-3 border-white rounded-xl m-4 overflow-y-auto'>
    <div className='text-center'>
      <h3 className='text-white text-4xl font-semibold'>Job Description</h3>
    </div>
    {/* here we will add .map function to add details of the job Description he had searched*/}
     <div className='m-3 border-3 border-white rounded-4xl'>
      <p className='px-2 text-white'>Description of Jobs</p>
    </div>
  </div>
</div>
  )
}
export default Profile;
