import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserSignin = () => {
  const navigate = useNavigate();

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
        localStorage.setItem('token', response.data.token);
      }

      // Successful sign in: navigate to dashboard (keeps existing behavior)
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
    <div className='relative flex flex-col min-h-screen w-full justify-center items-center overflow-hidden bg-[#0B0F17]'>
      {/* Background gradient matching dashboard */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0B0F17] to-[#0B0F17]'></div>
      {/* Floating Shapes (subtle) */}
      <div className='absolute top-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl opacity-20'></div>
      <div className='absolute bottom-10 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl opacity-20'></div>

      {/* Sign In Card (matching dashboard style) */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div
          className="bg-gray-800/50 border border-white/10 shadow-2xl rounded-3xl p-8 transform transition-all duration-300
                     hover:shadow-blue-500/10 hover:border-blue-500/30 hover:scale-[1.02] backdrop-blur-sm"
        >

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400 text-sm">Sign in to ResumeMatcher</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* API Error (small inline, still kept) */}
            {apiError && !showPopup && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 py-2 px-4 rounded-xl text-center">
                {apiError}
              </div>
            )}

            {/* Username/Email */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-white/90">
                Email Address
              </label>
              <div className="relative group">
                <input
                  id="username"
                  name="username"
                  type="email"
                  placeholder='john.doe@example.com'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-800/50 border ${
                    errors.username ? 'border-red-500/60' : 'border-white/10'
                  } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500/50 transition-all duration-200`}
                />
              </div>
              {errors.username && (
                <p className="text-sm text-red-300 mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-white/90">
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  className={`w-full px-4 py-3 pr-12 bg-gray-800/50 border ${
                    errors.password ? 'border-red-500/60' : 'border-white/10'
                  } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500/50 transition-all duration-200`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-300 mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            {/* <div className="text-right">
              <a href="#" className="text-sm text-indigo-300 hover:text-indigo-200 transition-colors">
                Forgot Password?
              </a>
            </div> */}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/30 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/60">OR</span>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="button"
              onClick={() => navigate('/user/signup')}
              className="w-full bg-gray-800/50 hover:bg-gray-700/50 border border-white/10 text-white font-semibold py-3 rounded-xl transition-all duration-300 backdrop-blur-sm transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Create New Account
            </button>
          </form>
        </div>

        {/* Footer Text */}
        <p className="text-center text-white/40 text-sm mt-6">
          Protected by industry-standard encryption
        </p>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          <div className="absolute inset-0 bg-black/70" onClick={closePopup} />
          <div className="relative z-10 w-full max-w-lg bg-gray-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-lg font-semibold text-white mb-2">Error</h3>
            <p className="text-white/80 mb-4">{apiError}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closePopup}
                className="px-4 py-2 rounded-md bg-transparent border border-white/10 text-white hover:bg-white/5 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations (kept minimal) */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default UserSignin;
