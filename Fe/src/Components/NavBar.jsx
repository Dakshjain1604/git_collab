import React from 'react'
import { useNavigate } from 'react-router-dom'

import GradientText from './GradientText';
import Background from "./Background.jsx"
const NavBar = () => {


  const Navigate = useNavigate();

  return (
    
<div className=" m-6 bg-black text-white rounded-md w-min-screen">
  <div className="max-w-8xl mx-auto px-4  py-4 flex items-center justify-between">

    <div className="text-4xl font-bold">
      <GradientText
        colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
        animationSpeed={3}
        showBorder={false}
      >
        Dmatch
      </GradientText>
    </div>


    <div className="flex justify-end items-center gap-11">
      <button className="text-white">
        Home
      </button>
      <button className="text-white">
        Features
      </button>
      <button className="text-white">
        About
      </button>

      <img
        className="h-10 w-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-cyan-500 transition-all ml-6"
        src="/assets/user.png"
        alt="User Profile"
        onClick={() => Navigate('/user/profile')}
      />
    </div>
  </div>
</div>

  )
}

export default NavBar