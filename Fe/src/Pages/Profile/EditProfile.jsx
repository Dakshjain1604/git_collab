import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// NOTE: Ensure AnimatedContent and Threads are not necessary for the new design,
// as they are visually heavy and removed in this professional revamp.

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false); // New state to manage initial fetch/load

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/user/signin');
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success && response.data.user) {
          setFormData({
            firstName: response.data.user.firstname || '',
            lastName: response.data.user.lastname || '',
            email: response.data.user.username || ''
          });
        }
        setIsPageLoaded(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/user/signin');
        }
        setIsPageLoaded(true);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/user/signin');
          return;
        }

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/update`, {
          firstname: formData.firstName,
          lastname: formData.lastName
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          alert('Profile updated successfully!');
          navigate('/user/profile');
        } else {
          alert(response.data.message || 'Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
        alert(errorMessage);

        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/user/signin');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Show a clean loading screen while data is fetching
  if (!isPageLoaded) {
    return (
      <div className="bg-gray-900 h-screen w-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
        <div className="text-cyan-400 text-lg mt-4">Loading user data...</div>
      </div>
    );
  }

  // --- REVAMPED PROFESSIONAL UI ---
  return (
    // Clean Dark Mode Background
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">

      {/* Elevated Form Card */}
      <div className="w-full max-w-lg bg-gray-800 rounded-xl p-8 sm:p-12 shadow-2xl border border-gray-700/50">

        <h2 className="text-4xl font-bold text-cyan-400 text-center mb-8 border-b border-gray-700 pb-4">
          ⚙️ Edit Profile Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* First Name Field */}
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${errors.firstName ? 'border-red-500' : ''
                }`}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name Field */}
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${errors.lastName ? 'border-red-500' : ''
                }`}
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${errors.email ? 'border-red-500' : ''
                }`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Divider and Password Notice */}
          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-sm text-slate-400">
              To change your password, please use the dedicated "Change Password" section (not implemented here).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-bold transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/user/profile')}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-bold transition-all duration-200 shadow-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;