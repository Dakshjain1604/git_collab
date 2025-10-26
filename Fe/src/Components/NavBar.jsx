import React from 'react'
import { useNavigate } from 'react-router-dom'

import GradientText from './GradientText';
import Background from "./Background.jsx"
import UserSignin from '../Pages/Auth/UserSignin.jsx';
import UserIcon from '../assets/icons/UserIcon.jsx';
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
      <button className="text-white hover:cursor-pointer hover:scale-110">
        Home
      </button>
      <button className="text-white hover:cursor-pointer hover:scale-110">
        Features
      </button>
      <button className="text-white hover:cursor-pointer hover:scale-110">
        About
      </button>
      <UserIcon onClick={() => Navigate('/user/profile')}/>
    </div>
  </div>
</div>

  )
}

export default NavBar