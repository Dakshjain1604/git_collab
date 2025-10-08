import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserSignin = () => {
  const navigate = useNavigate();


  const [password, setpassword] = useState('');
  const [username, setUsername] = useState('');

  const [errors, setErrors] = useState({});         // ← added this
  const [apiError, setApiError] = useState('');     // optional, for showing API error

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
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

    try {
      await axios.post('http://localhost:5173/user/signin', {
        
        username,
        password,
      });
      // on success navigate
      navigate('/user/home');   // use a route path, not full URL
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-black text-white shadow-lg rounded-lg">
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
            value={email}                                           /* ← added value prop */
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full px-3 py-2 border rounded ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-indigo-400`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
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
  );
};

export default UserSignin;
