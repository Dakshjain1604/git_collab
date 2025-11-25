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
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {

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
      newErrors.email = 'Invalid email';
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
        alert('Failed to update profile');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isPageLoaded) {
    return (
      <div className="bg-black h-screen w-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }
  return (
    <div className="bg-black h-screen w-screen flex items-center justify-center  overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <Threads
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
        />
      </div>
     
      <AnimatedContent
      distance={150}
      direction="vertical"
      reverse={false}
      duration={1.2}
      ease="bounce.out"
      initialOpacity={0.2}
      animateOpacity
      scale={1.1}
      threshold={0.2}
      delay={0.3}>

      <div className="z-10 w-full flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-20 border border-white/20 shadow-2xl w-2xl  mx-4">
          <h2 className="text-4xl font-bold text-white text-center mb-8">Edit Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-white/90 text-sm font-semibold mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition-all"
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
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

            <div>
              <label className="block text-white/90 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition-all"
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>


            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600/70 hover:bg-blue-700/80 text-white py-3 rounded-xl font-bold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 bg-gray-600/70 hover:bg-gray-700/80 text-white py-3 rounded-xl font-bold transition-all duration-200 hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div></AnimatedContent>
    </div>
  )
}

export default EditProfile