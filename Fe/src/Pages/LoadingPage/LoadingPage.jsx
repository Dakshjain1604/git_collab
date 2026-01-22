import React, { useState, useEffect } from 'react'
import Background from '../../Components/Background'
import SplitText from '../../Components/SplitText'
import { useNavigate } from 'react-router-dom'

const LoadingPage = () => {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: "📊",
      title: "AI-Powered Analysis",
      description: "Get instant, detailed analysis of how well your resume matches any job description using advanced AI algorithms."
    },
    {
      icon: "🎯",
      title: "Match Score",
      description: "Receive a comprehensive match score with breakdowns for skills, experience, education, and keyword matching."
    },
    {
      icon: "💡",
      title: "Smart Recommendations",
      description: "Get actionable recommendations to improve your resume and increase your chances of landing the job."
    },
    {
      icon: "🔍",
      title: "Job Search Integration",
      description: "Find relevant job opportunities directly from job descriptions using our integrated job search engine."
    },
    {
      icon: "📈",
      title: "Progress Tracking",
      description: "Track your resume improvements over time with detailed history and statistics dashboard."
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your data is encrypted and secure. We never share your resume or personal information."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='relative w-screen min-h-screen overflow-x-hidden overflow-y-none bg-[#0B0F17]'>
      <div className='absolute inset-0 x-0'>
        <Background
          raysOrigin="top-center"
          raysColor="#3B82F6"
          raysSpeed={1.5}
          lightSpread={1.5}
          rayLength={5}
          followMouse={true}
          mouseInfluence={0.5}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays min-h-screen w-screen bg-[#0B0F17] overflow-hidden"
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <SplitText
          text="ResumeMatcher"
          className="text-5xl md:text-7xl font-bold text-center text-white mb-6"
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
          className="text-2xl md:text-4xl font-bold text-center text-white mb-6"
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
        
        <p className="text-white/80 text-lg md:text-2xl max-w-3xl text-center mb-4">
          Enhance your chances by customizing your resume to match job criteria with AI-powered insights.
        </p>
        
        <p className="text-white/60 text-sm md:text-base max-w-2xl text-center mb-12">
          Get instant feedback, keyword analysis, and personalized recommendations to make your resume stand out.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button 
            onClick={() => navigate("/user/signup")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50"
          >
            Get Started Free
          </button>
          <button 
            onClick={() => navigate('/user/signin')}
            className="bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 text-white px-8 py-4 rounded-lg border border-white/10 font-semibold text-lg transition-all transform hover:scale-105"
          >
            Sign In
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div id="features-section" className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-white/70 text-center text-lg mb-16 max-w-2xl mx-auto">
            Everything you need to optimize your resume and land your dream job
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-all duration-500 ${
                  currentFeature === index
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20 scale-105'
                    : 'hover:border-blue-500/30 hover:bg-gray-800/70'
                }`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Upload Your Resume",
                description: "Upload your resume in PDF or Word format. Our system supports all standard resume formats."
              },
              {
                step: "2",
                title: "Paste Job Description",
                description: "Copy and paste the job description you're applying for. Our AI will analyze the requirements."
              },
              {
                step: "3",
                title: "Get Instant Analysis",
                description: "Receive detailed match scores, keyword analysis, strengths, weaknesses, and improvement recommendations."
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-white/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
            Why Choose ResumeMatcher?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: "⚡",
                title: "Lightning Fast",
                description: "Get comprehensive resume analysis in seconds, not hours."
              },
              {
                icon: "🎯",
                title: "Accurate Matching",
                description: "Advanced AI algorithms ensure precise job-resume matching."
              },
              {
                icon: "📊",
                title: "Detailed Insights",
                description: "Understand exactly what employers are looking for."
              },
              {
                icon: "🚀",
                title: "Career Growth",
                description: "Track your progress and improve your resume over time."
              },
              {
                icon: "💼",
                title: "Job Discovery",
                description: "Find relevant job opportunities directly from job descriptions."
              },
              {
                icon: "🔄",
                title: "Continuous Updates",
                description: "Regular updates with new features and improvements."
              }
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex items-start gap-4"
              >
                <div className="text-3xl flex-shrink-0">{benefit.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-white/70">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who are using ResumeMatcher to optimize their resumes and get hired faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate("/user/signup")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50"
              >
                Start Free Today
              </button>
              <button 
                onClick={() => navigate('/user/DashBoard')}
                className="bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 text-white px-8 py-4 rounded-lg border border-white/10 font-semibold text-lg transition-all transform hover:scale-105"
              >
                Try Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/60 text-sm">
            © 2024 ResumeMatcher. All rights reserved. | Built with ❤️ for job seekers
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoadingPage