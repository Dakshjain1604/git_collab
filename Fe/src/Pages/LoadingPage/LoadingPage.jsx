import React from 'react'
import Background from '../../Components/Background'
import SplitText from '../../Components/SplitText'
import { useNavigate } from 'react-router-dom'
const LoadingPage = () => {


    const navigate = useNavigate();

  return (
    <div className='relative w-screen h-screen overflow-hidden'>
        <div className='absolute inset-0 x-0'>
  <Background
    raysOrigin="top-center"
    raysColor="#00ffff"
    raysSpeed={1.5}
    lightSpread={1.5}
    rayLength={5}
    followMouse={true}
    mouseInfluence={0.5}
    noiseAmount={0.1}
    distortion={0.05}
    className="custom-rays h-screen w-sreen bg-black"
  />
</div>
<div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
  <SplitText
    text="DMatch"
    className="text-4xl md:text-6xl font-bold text-center text-white mb-8"
    delay={100}
    duration={0.6}
    ease="power3.out"
    splitType="chars"
    from={{ opacity: 0, y: 40 }}
    to={{ opacity: 1, y: 0 }}
    threshold={0.1}
    rootMargin="-100px"
    textAlign="center"
  />

    <SplitText
    text="Tailor Your Resume to Fit Any Job Description"
    className="text-2xl md:text-4xl font-bold text-center text-white mb-8"
    delay={50}
    duration={0.6}
    ease="power3.out"
    splitType="chars"
    from={{ opacity: 0, y: 40 }}
    to={{ opacity: 1, y: 0 }}
    threshold={0.1}
    rootMargin="-100px"
    textAlign="center"
  />
  <p className="text-white/80 text-2xl max-w-xl text-center">
    Enhance your chances by customizing your resume to match job criteria.
  </p>
  
  <div className="flex gap-4 mt-8">
    <button 
    onClick={()=>navigate("/user/signup")}
    className="bg-cyan-500 text-white px-6 py-3 rounded-lg">
      Signup
    </button>
    <button 
    onClick={()=>navigate('/user/signin')}
    className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg border border-white/20">
      Signin
    </button>
  </div>
</div>
    </div>
  )
}

export default LoadingPage