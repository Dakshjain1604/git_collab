import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Plasma from '../../Components/Plasma';

const UserSignup = () => {
  const navigate = useNavigate();

  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [username, setUsername] = useState('');

  const [errors, setErrors] = useState({});         // ← added this
  const [apiError, setApiError] = useState('');     // optional, for showing API error

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    const errs = {};
    if (!firstname.trim()) errs.firstName = 'First name is required';
    if (!lastname.trim()) errs.lastName = 'Last name is required';
    if (!username.trim()) errs.username = 'Username is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Email is invalid';
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
      await axios.post('http://localhost:5173/user/signup', {
        firstname,
        lastname,
        username,
        email,
        password,
      });

      navigate('/user/home');  
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center'>
 
      <div className="min-w-100 mx-auto mt-10 p-6 bg-black text-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit} noValidate>

        {apiError && (
          <div className="flex flex-row  mb-4 text-red-600 text-center bg-red-200 w-full py-5 text-xl font-bold px-4 rounded-md justify-center items-center "><div className='animate-bounce'>
                {apiError}!
            </div></div>
        )}

        <div className="mb-4">
          <label htmlFor="firstName" className="block mb-1 font-medium">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={firstname}                                      
            onChange={(e) => setfirstname(e.target.value)}
            className={`w-full px-3 py-2 border rounded ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-indigo-400`}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block mb-1 font-medium">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={lastname}                                       
            onChange={(e) => setlastname(e.target.value)}
            className={`w-full px-3 py-2 border rounded ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-indigo-400`}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="username" className="block mb-1 font-medium">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}                                      
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full px-3 py-2 border rounded ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-indigo-400`}
          />
          {errors.username && (
            <p className="text-sm text-red-500 mt-1">{errors.username}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}                                          
            onChange={(e) => setemail(e.target.value)}
            className={`w-full px-3 py-2 border rounded ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-indigo-400`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}                                       
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
          Register
        </button>
      </form>
    </div>

    </div>
  );
};

export default UserSignup;
