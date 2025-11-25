import React, { useState, useEffect } from 'react'
import AnimatedContent from '../../Components/AnimatedContent'
import Threads from '../../Components/Threads'
import apiClient from '../../services/apiClient.js'
import { useAuth } from '../../Context/AuthContext.jsx'

const EditProfile = () => {
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    headline: '',
    currentRole: '',
    location: '',
    summary: '',
    skills: '',
    linkedin: '',
    github: '',
    portfolio: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false); // New state to manage initial fetch/load

  useEffect(() => {
    // Simulate getting user ID (e.g., from local storage or context)
    const userId = localStorage.getItem('userId') || 'current'; 

    const fetchUserData = async () => {
      try {
        const { data } = await apiClient.get('/users/me');
        setFormData({
          firstName: data.user.firstname || '',
          lastName: data.user.lastname || '',
          email: data.user.email || '',
          headline: data.user.profile?.headline || '',
          currentRole: data.user.profile?.currentRole || '',
          location: data.user.profile?.location || '',
          summary: data.user.profile?.summary || '',
          skills: data.user.profile?.skills?.join(', ') || '',
          linkedin: data.user.profile?.socialLinks?.linkedin || '',
          github: data.user.profile?.socialLinks?.github || '',
          portfolio: data.user.profile?.socialLinks?.portfolio || ''
        });
        setIsPageLoaded(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsPageLoaded(true);
      }
    };

    fetchUserData();
  }, []);

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
        const payload = {
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          profile: {
            headline: formData.headline,
            currentRole: formData.currentRole,
            location: formData.location,
            summary: formData.summary,
            skills: formData.skills
              .split(',')
              .map((skill) => skill.trim())
              .filter(Boolean),
            socialLinks: {
              linkedin: formData.linkedin,
              github: formData.github,
              portfolio: formData.portfolio,
            },
          },
        };

        const { data } = await apiClient.put('/users/me', payload);
        setUser(data.user);
        alert('Profile updated successfully!');
        console.log('Updated data:', data.user);
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
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
              className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                errors.firstName ? 'border-red-500' : ''
              }`}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

            <div>
              <label className="block text-white/90 text-sm font-semibold mb-2">
                Headline
              </label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition-all"
                placeholder="Senior Resume Strategist"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/90 text-sm font-semibold mb-2">
                  Current Role
                </label>
                <input
                  type="text"
                  name="currentRole"
                  value={formData.currentRole}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition-all"
                  placeholder="Lead Recruiter"
                />
              </div>
              <div>
                <label className="block text-white/90 text-sm font-semibold mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition-all"
                  placeholder="Remote, NYC"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/90 text-sm font-semibold mb-2">
                Professional Summary
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition-all"
                placeholder="Briefly tell us how you help candidates win interviews..."
              />
            </div>

            <div>
              <label className="block text-white/90 text-sm font-semibold mb-2">
                Skills (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition-all"
                placeholder="ATS, Resume Writing, AI Prompting"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['linkedin', 'github', 'portfolio'].map((field) => (
                <div key={field}>
                  <label className="block text-white/90 text-sm font-semibold mb-2 capitalize">
                    {field}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition-all"
                    placeholder={`https://${field}.com/`}
                  />
                </div>
              ))}
            </div>

    
            <div>
              <label className="block text-white/90 text-sm font-semibold mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition-all"
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
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
              className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                errors.email ? 'border-red-500' : ''
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
              onClick={() => navigate('/profile')} // Use navigate for consistency
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