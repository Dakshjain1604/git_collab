import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
const UserSignin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [password, setpassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // popup state
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = {};

    if (!username.trim()) errs.username = 'Username (email) is required';
    else if (!/^\S+@\S+\.\S+$/.test(username)) errs.username = 'Username must be a valid email address';
    if (!password) errs.password = 'Password is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setApiError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/user/signin', {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.token) {
        // Use AuthContext login to set token and user state
        login(response.data.token, { id: response.data.userId || response.data.user?.id || null });
      }

      // Navigate to dashboard after successful login
      navigate('/user/DashBoard');
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Signin failed';
      setApiError(errorMessage);

      // show popup modal when an API error occurs
      setShowPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className='relative flex flex-col min-h-screen w-full justify-center items-center overflow-hidden'>
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-indigo-600/10" />
      
      {/* Animated Blobs */}
      <motion.div 
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className='absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl opacity-30'
      />
      <motion.div 
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className='absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl opacity-20'
      />

      {/* Sign In Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 shadow-2xl rounded-2xl p-8 backdrop-blur-xl">

          {/* Header */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full mb-4 border border-blue-400/30"
            >
              <LogIn className="w-7 h-7 text-blue-400" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400 text-sm">Sign in to continue to your account</p>
          </motion.div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* API Error */}
            {apiError && !showPopup && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-300 py-3 px-4 rounded-lg text-sm flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                {apiError}
              </motion.div>
            )}

            {/* Email */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <label htmlFor="username" className="block text-sm font-semibold text-gray-200">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-blue-400 opacity-50" />
                <input
                  id="username"
                  name="username"
                  type="email"
                  placeholder='john.doe@example.com'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-700/30 border ${errors.username ? 'border-red-500/50' : 'border-gray-600/50'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-700/50 transition-all`}
                />
              </div>
              {errors.username && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-400 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" /> {errors.username}
                </motion.p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <label htmlFor="password" className="block text-sm font-semibold text-gray-200">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-blue-400 opacity-50" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  className={`w-full pl-11 pr-12 py-3 bg-gray-700/30 border ${errors.password ? 'border-red-500/50' : 'border-gray-600/50'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-700/50 transition-all`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-400 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" /> {errors.password}
                </motion.p>
              )}
            </motion.div>

            {/* Sign In Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-gray-800/50 to-gray-900/50 text-gray-400">OR</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <motion.button
              type="button"
              onClick={() => navigate('/user/signup')}
              whileHover={{ scale: 1.02 }}
              className="w-full bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/50 text-gray-200 font-semibold py-3 rounded-lg transition-all duration-300 backdrop-blur-sm"
            >
              Create New Account
            </motion.button>
          </form>
        </div>

        {/* Footer Text */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 text-xs mt-6"
        >
          Protected by industry-standard encryption
        </motion.p>
      </motion.div>

      {/* Popup Modal */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/70" 
            onClick={closePopup} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-lg bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-white/10 rounded-lg p-6 backdrop-blur-md"
          >
            <h3 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Error
            </h3>
            <p className="text-gray-300 mb-6">{apiError}</p>
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={closePopup}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                OK
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default UserSignin;