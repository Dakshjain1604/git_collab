import React from 'react'
import { useNavigate } from 'react-router-dom'
import ElectricBorder from '../../public/Reactbits/ElectricBorder.jsx';
import GradientText from './GradientText';
const NavBar = () => {


  const navigate = useNavigate();

  return (
    <nav className="w-full px-6 py-4 bg-transparent">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-4xl font-bold cursor-pointer" onClick={() => navigate("/")}>
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={3}
            showBorder={false}
          >
            Dmatch
          </GradientText>
        </div>

    
    <div className="flex justify-end items-center gap-11">
      <ElectricBorder
  color="#7df9ff"
  speed={1}
  chaos={0.5}
  thickness={2}
  style={{ borderRadius: 40 }}
>
      <button className="text-white m-4" onClick={() => navigate('/user/dashboard')}>
        Home
      </button></ElectricBorder>
      <ElectricBorder
  color="#7df9ff"
  speed={1}
  chaos={0.5}
  thickness={2}
  style={{ borderRadius: 30 }}
>
      <button className="text-white m-4" onClick={() => navigate('/user/dashboard#history')}>
        Features
      </button></ElectricBorder>
       <ElectricBorder
  color="#7df9ff"
  speed={1}
  chaos={0.5}
  thickness={2}
  style={{ borderRadius: 30 }}
>
      <button className="text-white m-4" onClick={() => navigate('/')}>
        About
      </button></ElectricBorder>
<ElectricBorder
  color="#7df9ff"
  speed={1}
  chaos={0.5}
  thickness={2}
  style={{ borderRadius: 30 }}
>
     <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-10 h-10 rounded-full m-2"
      onClick={() => navigate('/user/profile')}
    >
      <circle cx="11" cy="7" r="4" />
      <path d="M4 21c0-4 4-5 7-5s7 1 7 5" />
    </svg></ElectricBorder>
    </div>
  </div>
</div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden mt-4 flex flex-col gap-4 bg-white/10 backdrop-blur-md p-4 rounded-lg text-white">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={handleFeatureScroll}>Features</button>
          <button onClick={() => navigate("/user/DashBoard")}>Dashboard</button>
          <button onClick={() => navigate("/user/profile")}>Profile</button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
