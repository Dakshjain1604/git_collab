import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Target, BarChart3 } from 'lucide-react';

const LandingPage = () => {
    const features = [
        { 
            icon: Zap,
            title: "Smart Analysis", 
            desc: "Instant feedback on your resume's strengths and weaknesses with AI-powered insights."
        },
        { 
            icon: Target,
            title: "ATS Optimization", 
            desc: "Ensure your resume passes Applicant Tracking Systems with keyword optimization."
        },
        { 
            icon: BarChart3,
            title: "Job Matching", 
            desc: "See how well you fit specific job descriptions and get matching scores in real-time."
        }
    ];

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 overflow-hidden">
            {/* Animated Background Blobs */}
            <motion.div 
                animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
                className='absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-30'
            />
            <motion.div 
                animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
                transition={{ duration: 12, repeat: Infinity }}
                className='absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl opacity-30'
            />

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center space-y-12 px-4 py-16">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6 max-w-4xl"
                >
                    <motion.h1 
                        className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight"
                    >
                        Optimize Your Resume with{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            AI Precision
                        </span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
                    >
                        Get instant feedback, keyword analysis, and job matching scores to land your dream job faster. Powered by advanced AI.
                    </motion.p>
                    
                    {/* CTA Buttons */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/user/signup"
                                className="block px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold text-lg transition-all shadow-lg shadow-blue-500/50"
                            >
                                Get Started Free
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/user/signin"
                                className="block px-8 py-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-600/50 text-gray-200 rounded-lg font-bold text-lg transition-all backdrop-blur-sm"
                            >
                                Sign In
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Features Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    id="features-section"
                    className="w-full max-w-6xl mt-20"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
                        Why Choose <span className="text-blue-400">Dmatch</span>?
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                        {features.map((feature, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + idx * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 shadow-lg backdrop-blur-xl hover:border-blue-400/30 transition-all group"
                            >
                                <motion.div 
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    className="inline-block p-3 bg-blue-500/20 rounded-lg mb-4 group-hover:bg-blue-500/30 transition-colors"
                                >
                                    <feature.icon className="w-6 h-6 text-blue-400" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-3 gap-6 mt-20"
                >
                    {[
                        { label: "Active Users", value: "10K+" },
                        { label: "Resumes Analyzed", value: "50K+" },
                        { label: "Success Rate", value: "92%" }
                    ].map((stat, idx) => (
                        <motion.div 
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            className="p-6 text-center"
                        >
                            <p className="text-4xl font-bold text-blue-400 mb-2">{stat.value}</p>
                            <p className="text-gray-400 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPage;
