import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient.js';
import { useAuth } from '../../Context/AuthContext.jsx';

const UserSignin = () => {
  const navigate = useNavigate();


  const { setUser, setToken } = useAuth();
  const [password, setpassword] = useState('');
  const [username, setUsername] = useState('');

  const [errors, setErrors] = useState({});        
  const [apiError, setApiError] = useState('');     

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = {};
   
    if (!username.trim()) errs.username = 'Username is required';
    else if (!/^\S+@\S+\.\S+$/.test(username)) errs.username = 'Username is invalid';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6)
      errs.password = 'Password must be at least 6 characters';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setApiError('');

// Provide backend API enpoint below 

    try {
      const { data } = await apiClient.post('/auth/login', {
        username,
        password,
      });
      setToken(data.token);
      setUser(data.user);
      navigate('/user/dashboard');   
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='flex flex-col h-screen w-screen justify-center items-center'>
      <div className="sm:min-w-45 md:min-w-100 mx-auto mt-10 p-6 bg-black text-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* API error */}
        {apiError && (
          <div className="mb-4 text-red-600 text-center">{apiError}</div>
        )}


        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium"> 
            UserName 
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder='JohnDoe@gmail.com'
            value={username}                                           /* ← added value prop */
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full px-3 py-2 border rounded ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-indigo-400`}
          />
          {errors.username && (
            <p className="text-sm text-red-500 mt-1">{errors.username}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}                                       /* ← added value prop */
            onChange={(e) => setpassword(e.target.value)}
            className={`w-full px-3 py-2 border rounded ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-indigo-400`}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"  
        >
          Login
        </button>
      </form>
    </div>
    </div>
  );
};

export default UserSignin;
