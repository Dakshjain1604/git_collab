import React, { createContext, useContext, useState, useEffect } from 'react';
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

  const getUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.success && data.user) {
        setFirstName(data.user.firstname || '');
        setLastName(data.user.lastname || '');
        setEmail(data.user.username || '');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/user/signin';
      }
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
  <div className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
    <p className="text-lg font-medium text-gray-400">{label}:</p>
    <h3 className="text-lg tracking-wide font-semibold text-white">
      {value}
    </h3>
  </div>
);


const ProfileContent = () => {
  const { firstName, lastName, email, getUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, [getUser]);

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/user/signin');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still logout even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/user/signin');
    }
  };

  return (
    // Main Container: Matching dashboard background
    <div className="min-h-screen bg-[#0B0F17] p-6 sm:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-400 border-b border-white/10 pb-4">
          👋 User Profile
        </h1>

        {/* New Two-Column Layout (Switches to stack on small screens) */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT COLUMN (Profile/Sidebar) - 1/3 Width */}
          <div className="lg:w-1/3 p-6 bg-gray-800/50 border border-white/10 rounded-xl shadow-2xl h-fit">

            {/* Profile Header */}
            <div className="text-center mb-6">
              {/* Profile Picture Placeholder (First initial of name) */}
              <div className="w-24 h-24 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {(firstName?.[0] || 'J') + (lastName?.[0] || 'D')}
              </div>
              <h2 className="text-3xl font-bold text-white">
                {firstName || 'John'} {lastName || 'Doe'}
              </h2>
              <p className="text-md text-gray-400">{email || 'john@example.com'}</p>
            </div>

            {/* Account Details Section */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-bold border-b border-blue-500 pb-2 mb-4">Account Details</h3>

              <DataRow label="First Name" value={firstName || 'John'} />
              <DataRow label="Last Name" value={lastName || 'Doe'} />
              <DataRow label="Email" value={email || 'john@example.com'} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-4 mt-8">
              <button
                onClick={() => navigate('/user/settings')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg shadow-lg transition-all duration-200 font-semibold text-lg"
              >
                Settings & Preferences
              </button>
              <button
                onClick={logout}
                className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 py-3 rounded-lg transition-all duration-200 font-semibold text-lg"
              >
                Logout
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN (Content Area) - 2/3 Width */}
          <div className="lg:w-2/3 space-y-8">

            {/* Quick Actions */}
            <div className="bg-gray-800/50 border border-white/10 p-6 rounded-xl shadow-2xl">
              <h3 className="text-2xl font-bold mb-4 text-blue-400">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/user/DashBoard')}
                  className="p-4 bg-gray-800/50 border border-white/10 rounded-xl hover:border-blue-500/30 transition-colors text-left"
                >
                  <p className="font-semibold text-white mb-1">Go to Dashboard</p>
                  <p className="text-sm text-gray-400">View your analysis dashboard</p>
                </button>
                <button
                  onClick={() => navigate('/user/settings')}
                  className="p-4 bg-gray-800/50 border border-white/10 rounded-xl hover:border-blue-500/30 transition-colors text-left"
                >
                  <p className="font-semibold text-white mb-1">Manage Settings</p>
                  <p className="text-sm text-gray-400">Update profile, password, and history</p>
                </button>
              </div>
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