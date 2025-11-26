import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, Edit, FileText, Briefcase, Mail } from 'lucide-react';

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
  <motion.div 
    whileHover={{ x: 5 }}
    className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-b-0 group cursor-default"
  >
    <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">{label}</p>
    <h3 className="text-sm font-semibold text-gray-200">
      {value}
    </h3>
  </motion.div>
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
    // Main Container with gradient background
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-6 sm:p-8 text-white relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div 
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className='absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-20 pointer-events-none'
      />
      <motion.div 
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className='absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl opacity-20 pointer-events-none'
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-700/50"
        >
          <User className="w-8 h-8 text-blue-400" />
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            User Profile
          </h1>
        </motion.div>

        {/* Two-Column Layout (Responsive) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN (Profile/Sidebar) - 1/3 Width */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 rounded-2xl shadow-2xl p-8 backdrop-blur-xl h-fit hover:border-white/20 transition-all">
            
              {/* Profile Header */}
              <div className="text-center mb-8">
                {/* Profile Picture Placeholder (First initial of name) */}
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg"
                >
                  {(firstName?.[0] || 'J') + (lastName?.[0] || 'D')}
                </motion.div>
                <h2 className="text-3xl font-bold text-white">
                  {firstName || 'John'} {lastName || 'Doe'}
                </h2>
                <motion.p 
                  whileHover={{ color: '#60a5fa' }}
                  className="text-sm text-gray-400 flex items-center justify-center gap-2 mt-2"
                >
                  <Mail className="w-4 h-4" />
                  {email || 'john@example.com'}
                </motion.p>
              </div>

              {/* Account Details Section */}
              <div className="mt-8 space-y-2">
                <h3 className="text-lg font-bold text-blue-400 pb-3 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Account Details
                </h3>
                
                <DataRow label="First Name" value={firstName || 'John'} />
                <DataRow label="Last Name" value={lastName || 'Doe'} />
                <DataRow label="Email" value={email || 'john@example.com'} />
                <DataRow label="Password" value="••••••••" />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/edit/profile')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg shadow-lg 
                             transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={logout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-lg shadow-lg 
                             transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </div>
            </div>
          </motion.div>
          
          {/* RIGHT COLUMN (Content Area) - 2/3 Width */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-8"
          >
            
            {/* Resume Section */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 rounded-2xl shadow-2xl p-8 backdrop-blur-xl hover:border-white/20 transition-all"
            >
              <h3 className="text-2xl font-extrabold mb-6 pb-3 border-b border-gray-700/50 text-blue-400 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                My Resumes
              </h3>
              
              {/* Resume Items */}
              <div className="space-y-3">
                <motion.div 
                  whileHover={{ x: 5, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                  className="p-4 bg-gray-700/30 border border-gray-600/30 rounded-lg transition cursor-pointer"
                >
                  <p className="font-semibold text-white">Software Engineer Resume</p>
                  <p className="text-xs text-gray-400 mt-1">Uploaded: October 20, 2025</p>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 5, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                  className="p-4 bg-gray-700/30 border border-gray-600/30 rounded-lg transition cursor-pointer"
                >
                  <p className="font-semibold text-white">Project Management Resume</p>
                  <p className="text-xs text-gray-400 mt-1">Uploaded: November 15, 2025</p>
                </motion.div>
              </div>
              
              <motion.button 
                whileHover={{ x: 5 }}
                className="mt-5 text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 transition-colors"
              >
                View All Resumes →
              </motion.button>
            </motion.div>
            
            {/* Job Applications Section */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 rounded-2xl shadow-2xl p-8 backdrop-blur-xl hover:border-white/20 transition-all"
            >
              <h3 className="text-2xl font-extrabold mb-6 pb-3 border-b border-gray-700/50 text-blue-400 flex items-center gap-2">
                <Briefcase className="w-6 h-6" />
                Job Applications
              </h3>
              
              {/* Job Application Items */}
              <div className="space-y-3">
                <motion.div 
                  whileHover={{ x: 5, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                  className="p-4 bg-gray-700/30 border border-gray-600/30 rounded-lg transition cursor-pointer"
                >
                  <p className="font-semibold text-white">Senior Frontend Developer</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-400">Status: Pending Review</p>
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded">Pending</span>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 5, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                  className="p-4 bg-gray-700/30 border border-gray-600/30 rounded-lg transition cursor-pointer"
                >
                  <p className="font-semibold text-white">Data Scientist, ML Team</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-400">Interview Scheduled: Dec 1</p>
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">Scheduled</span>
                  </div>
                </motion.div>
              </div>
               
              <motion.button 
                whileHover={{ x: 5 }}
                className="mt-5 text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 transition-colors"
              >
                View All Applications →
              </motion.button>
            </motion.div>
          </motion.div>
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