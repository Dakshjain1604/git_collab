import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// NOTE: You must ensure 'SpotlightCard' and 'Threads' are either imported
// or removed if you adopt the new professional style, as they were not used
// in the final revamped design.

// --- 1. CONTEXT SETUP ---
const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // NOTE: Replace the backticks with your actual API endpoint
  const getUser = async (userId) => {
    try {
      const { data } = await axios.get(`/api/users/${userId}`); 
      
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setEmail(data.email);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  return (
    <UserContext.Provider value={{ firstName, lastName, email, getUser }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// --- 2. PROFILE CONTENT (REVAMPED UI) ---

// Helper Component for a clean, professional data row
const DataRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-700 last:border-b-0">
    <p className="text-lg font-medium text-slate-400">{label}:</p>
    <h3 className="text-lg tracking-wide font-semibold text-white">
      {value}
    </h3>
  </div>
);


const ProfileContent = () => {
  const { firstName, lastName, email } = useUser();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // NOTE: Replace the apostrophes with your actual API endpoint
      await axios.post('/api/auth/logout'); 
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    // Main Container: Deep charcoal background, professional padding
    <div className="min-h-screen bg-gray-900 p-6 sm:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-cyan-400 border-b border-slate-700 pb-4">
          👋 User Profile
        </h1>

        {/* New Two-Column Layout (Switches to stack on small screens) */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN (Profile/Sidebar) - 1/3 Width */}
          <div className="lg:w-1/3 p-6 bg-gray-800 rounded-xl shadow-2xl h-fit">
            
            {/* Profile Header */}
            <div className="text-center mb-6">
              {/* Profile Picture Placeholder (First initial of name) */}
              <div className="w-24 h-24 mx-auto mb-4 bg-cyan-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {(firstName?.[0] || 'J') + (lastName?.[0] || 'D')}
              </div>
              <h2 className="text-3xl font-bold text-white">
                {firstName || 'John'} {lastName || 'Doe'}
              </h2>
              <p className="text-md text-slate-400">{email || 'john@example.com'}</p>
            </div>

            {/* Account Details Section */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-bold border-b border-cyan-500 pb-2 mb-4">Account Details</h3>
              
              <DataRow label="First Name" value={firstName || 'John'} />
              <DataRow label="Last Name" value={lastName || 'Doe'} />
              <DataRow label="Email" value={email || 'john@example.com'} />
              <DataRow label="Password" value="••••••••" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-4 mt-8">
              <button
                onClick={() => navigate('/edit/profile')}
                className="bg-cyan-600 text-white py-3 rounded-lg shadow-lg 
                           hover:bg-cyan-700 transition-all duration-200 font-semibold text-lg"
              >
                Edit Profile
              </button>
              <button
                onClick={logout}
                className="bg-red-600 text-white py-3 rounded-lg shadow-lg 
                           hover:bg-red-700 transition-all duration-200 font-semibold text-lg"
              >
                Logout
              </button>
            </div>
          </div>
          
          {/* RIGHT COLUMN (Content Area) - 2/3 Width */}
          <div className="lg:w-2/3 space-y-8">
            
            {/* Resume Section */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl min-h-64">
              <h3 className="text-3xl font-extrabold mb-4 border-b border-slate-700 pb-3 text-cyan-400">
                📄 My Resumes
              </h3>
              
              {/* Placeholder for Mapped Resume List */}
              <div className="p-4 bg-gray-700/50 rounded-lg transition hover:bg-gray-700 cursor-pointer mb-3">
                <p className="font-semibold text-lg">Headings of Resume 1: Software Engineer</p>
                <p className="text-sm text-slate-400">Uploaded: October 20, 2025</p>
              </div>
              <div className="p-4 bg-gray-700/50 rounded-lg transition hover:bg-gray-700 cursor-pointer mb-3">
                <p className="font-semibold text-lg">Headings of Resume 2: Project Management</p>
                <p className="text-sm text-slate-400">Uploaded: November 15, 2025</p>
              </div>
              
              <button className="mt-4 text-cyan-400 hover:text-cyan-300 font-medium">
                View All Resumes →
              </button>
            </div>
            
            {/* Job Description/Applications Section */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl min-h-64">
              <h3 className="text-3xl font-extrabold mb-4 border-b border-slate-700 pb-3 text-cyan-400">
                💼 Job Applications
              </h3>
              
              {/* Placeholder for Mapped Job Applications List */}
              <div className="p-4 bg-gray-700/50 rounded-lg transition hover:bg-gray-700 cursor-pointer mb-3">
                <p className="font-semibold text-lg">Applied for: Senior Frontend Developer</p>
                <p className="text-sm text-slate-400">Status: Pending Review</p>
              </div>
              <div className="p-4 bg-gray-700/50 rounded-lg transition hover:bg-gray-700 cursor-pointer mb-3">
                <p className="font-semibold text-lg">Applied for: Data Scientist, ML Team</p>
                <p className="text-sm text-slate-400">Status: Interview Scheduled (Dec 1)</p>
              </div>
               
              <button className="mt-4 text-cyan-400 hover:text-cyan-300 font-medium">
                View All Applications →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- 3. EXPORT COMPONENT ---
const Profile = () => {
  return (
    <UserProvider>
      <ProfileContent />
    </UserProvider>
  );
};

export default Profile;