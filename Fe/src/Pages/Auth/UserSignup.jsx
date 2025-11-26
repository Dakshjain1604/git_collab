import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

const UserSignup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [password, setpassword] = useState('');
  const [username, setUsername] = useState('');

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [userExists, setUserExists] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = {};
    if (!firstname.trim()) errs.firstName = 'First name is required';
    if (!lastname.trim()) errs.lastName = 'Last name is required';
    if (!username.trim()) errs.username = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(username)) errs.username = 'Email is invalid';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Must be at least 6 characters';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setApiError('');
    setUserExists(false);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/user/signup', {
        firstname,
        lastname,
        username,
        password,
      });

      if (response.data.token) {
        // Use AuthContext login to set token and user state
        login(response.data.token, { id: response.data.userId || response.data.user?.id || null });
      }

      // Navigate to dashboard after successful signup
      navigate('/user/DashBoard');
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed';
      setApiError(message);

      if (message.toLowerCase().includes('exist')) setUserExists(true);

      setShowPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950" />
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-transparent to-blue-600/10" />
      
      {/* Animated Blobs */}
      <motion.div 
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className='absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-30'
      />
      <motion.div 
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className='absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl opacity-20'
      />

      {/* Sign Up Card */}
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
              className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full mb-4 border border-blue-400/30"
            >
              <UserPlus className="w-7 h-7 text-blue-400" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400 text-sm">Start your journey with us</p>
          </motion.div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* API ERROR */}
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

          {/* FIRST NAME */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="text-gray-200 text-sm font-semibold">First Name</label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setfirstname(e.target.value)}
              className={`w-full mt-1 px-4 py-3 bg-gray-700/30 border ${errors.firstName ? "border-red-500/50" : "border-gray-600/50"
                } rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
              placeholder="John"
            />
            {errors.firstName && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" /> {errors.firstName}
              </motion.p>
            )}
          </motion.div>

          {/* LAST NAME */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label className="text-gray-200 text-sm font-semibold">Last Name</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setlastname(e.target.value)}
              className={`w-full mt-1 px-4 py-3 bg-gray-700/30 border ${errors.lastName ? "border-red-500/50" : "border-gray-600/50"
                } rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" /> {errors.lastName}
              </motion.p>
            )}
          </motion.div>

          {/* EMAIL */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <label className="text-gray-200 text-sm font-semibold">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-blue-400 opacity-50" />
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 bg-gray-700/30 border ${errors.username ? "border-red-500/50" : "border-gray-600/50"
                  } rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                placeholder="john@example.com"
              />
            </div>
            {errors.username && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" /> {errors.username}
              </motion.p>
            )}
          </motion.div>

          {/* PASSWORD */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            className="space-y-2"
          >
            <label className="text-gray-200 text-sm font-semibold">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-blue-400 opacity-50" />
              <input
                type="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 bg-gray-700/30 border ${errors.password ? "border-red-500/50" : "border-gray-600/50"
                  } rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" /> {errors.password}
              </motion.p>
            )}
          </motion.div>

          {/* REGISTER BUTTON */}
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
                Registering...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Register
              </>
            )}
          </motion.button>

          {/* OR */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-gray-800/50 to-gray-900/50 text-gray-400">OR</span>
            </div>
          </div>

          {/* SIGN IN BUTTON */}
          <motion.button
            onClick={() => navigate('/user/signin')}
            type="button"
            whileHover={{ scale: 1.02 }}
            className="w-full py-3 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-200 font-medium transition-all duration-200"
          >
            Already have an account?
          </motion.button>
        </form>

        {/* Footer Text */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 text-xs mt-6"
        >
          Protected by industry-standard encryption
        </motion.p>
        </div>
      </motion.div>

      {/* POPUP */}
      {showPopup && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-white/10 px-6 py-6 rounded-lg text-center backdrop-blur-xl shadow-xl max-w-sm w-full mx-4"
          >
            <h3 className="text-red-400 font-semibold mb-2 flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Alert
            </h3>
            <p className="text-gray-300 mb-6">{apiError}</p>
            {userExists && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/user/signin')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mb-3 transition font-medium"
              >
                Go to Sign In
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPopup(false)}
              className="w-full bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-200 py-2 rounded-lg transition font-medium"
            >
              OK
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default UserSignup;