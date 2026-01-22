import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserSignup = () => {
  const navigate = useNavigate();

  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [password, setpassword] = useState('');
  const [username, setUsername] = useState('');

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [userExists, setUserExists] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/signup`, {
        firstname,
        lastname,
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      alert('User Registered Successfully');
      navigate('/user/signin');
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed';
      setApiError(message);

      if (message.toLowerCase().includes('exist')) setUserExists(true);

      setShowPopup(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[#0B0F17] relative overflow-hidden">

      {/* Background gradient matching dashboard */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0B0F17] to-[#0B0F17]'></div>

      {/* SUBTLE BACKGROUND CIRCLES */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] opacity-20"></div>
      <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[160px] opacity-20"></div>

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md bg-gray-800/50 border border-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-600/20 backdrop-blur">
            <svg className="w-9 h-9 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zM4 22c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
          </div>
        </div>

        {/* HEADER */}
        <h2 className="text-white text-3xl font-semibold text-center mb-2">Create Account</h2>
        <p className="text-gray-400 text-center mb-8">
          Start your journey with ResumeMatcher
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* API ERROR */}
          {apiError && !showPopup && (
            <div className="text-center text-red-300 bg-red-500/10 border border-red-500/30 py-3 rounded-xl">
              {apiError}
            </div>
          )}

          {/* FIRST NAME */}
          <div>
            <label className="text-white/70 text-sm">First Name</label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setfirstname(e.target.value)}
              className={`w-full mt-1 px-4 py-3 bg-gray-800/50 border ${errors.firstName ? "border-red-500/50" : "border-white/10"
                } rounded-xl text-white placeholder-gray-400 backdrop-blur focus:ring-2 focus:ring-blue-400 focus:border-blue-500/50 outline-none`}
              placeholder="John"
            />
            {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
          </div>

          {/* LAST NAME */}
          <div>
            <label className="text-white/70 text-sm">Last Name</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setlastname(e.target.value)}
              className={`w-full mt-1 px-4 py-3 bg-gray-800/50 border ${errors.lastName ? "border-red-500/50" : "border-white/10"
                } rounded-xl text-white placeholder-gray-400 backdrop-blur focus:ring-2 focus:ring-blue-400 focus:border-blue-500/50 outline-none`}
              placeholder="Doe"
            />
            {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-white/70 text-sm">Email</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full mt-1 px-4 py-3 bg-gray-800/50 border ${errors.username ? "border-red-500/50" : "border-white/10"
                } rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-500/50 backdrop-blur outline-none`}
              placeholder="john@example.com"
            />
            {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-white/70 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className={`w-full mt-1 px-4 py-3 bg-gray-800/50 border ${errors.password ? "border-red-500/50" : "border-white/10"
                } rounded-xl text-white placeholder-gray-400 backdrop-blur focus:ring-2 focus:ring-blue-400 focus:border-blue-500/50 outline-none`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-lg font-medium shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-[1.03]"
          >
            Register
          </button>

          {/* OR */}
          <p className="text-center text-gray-400 text-sm">OR</p>

          {/* SIGN IN BUTTON */}
          <button
            onClick={() => navigate('/user/signin')}
            type="button"
            className="w-full py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-white/10 rounded-xl text-white font-medium transition-all duration-200 hover:scale-[1.02]"
          >
            Already have an account?
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-8">
          Protected by industry-standard encryption
        </p>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800/50 border border-white/10 px-6 py-5 rounded-2xl text-center backdrop-blur-xl shadow-xl">
            <p className="text-white mb-4">{apiError}</p>
            {userExists && (
              <button
                onClick={() => navigate('/user/signin')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-xl mb-3 transition"
              >
                Go to Signin
              </button>
            )}
            <button
              onClick={() => setShowPopup(false)}
              className="w-full bg-gray-800/50 hover:bg-gray-700/50 border border-white/10 text-white py-2 rounded-xl transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserSignup;