import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SpotlightCard from '../../Components/SpotlightCard';
import Threads from '../../Components/Threads';
import apiClient from '../../services/apiClient.js';
import { useAuth } from '../../Context/AuthContext.jsx';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await apiClient.get('/users/me');
        setProfile(data.user);
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [setUser]);

  if (loading) {
    return <div className='min-h-screen flex items-center justify-center text-white text-xl'>Loading profile...</div>;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 -z-1 bg-black">
        <Threads amplitude={1} distance={0} enableMouseInteraction={true} />
      </div>

      <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full w-full p-4 backdrop-blur-sm bg-black/10">
        <div className="flex items-center justify-center row-span-2 border-4 border-black bg-black/5 backdrop-blur-lg rounded-xl m-3">
          <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 240, 280, 0.9)">
            <div className="w-full p-6 space-y-4">
              {[
                { label: 'First Name', value: profile?.firstname },
                { label: 'Last Name', value: profile?.lastname },
                { label: 'Email', value: profile?.email },
                { label: 'Headline', value: profile?.profile?.headline || 'Add a headline in Edit Profile' },
                { label: 'Location', value: profile?.profile?.location || 'Share your preferred location' },
              ].map((item) => (
                <div key={item.label} className="bg-black/20 p-4 rounded-lg border border-amber-300 flex justify-between items-center">
                  <p className="text-xl font-bold text-white">{item.label}:</p>
                  <h3 className="text-xl font-extrabold text-white">{item.value || '—'}</h3>
                </div>
              ))}

              <div className="border-t-2 border-white/20 my-4"></div>
              <div>
                <p className="text-white font-semibold mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile?.profile?.skills?.length ? (
                    profile.profile.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-emerald-500/20 text-emerald-100 rounded-full text-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">Add skills from Edit Profile.</span>
                  )}
                </div>
              </div>

              <div className="flex justify-center space-x-6 pt-4">
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="bg-red-600/70 text-white py-3 px-6 rounded-lg shadow-md hover:bg-red-700/80 transition-all duration-200"
                >
                  Logout
                </button>
                <button
                  onClick={() => navigate('/edit/profile')}
                  className="bg-blue-600/70 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700/80 transition-all duration-200"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </SpotlightCard>
        </div>

        <div className="col-start-2 row-span-1 m-4 border-4 border-white/20 rounded-xl bg-white/5 backdrop-blur-md overflow-y-auto">
          <div className="text-center p-4">
            <h3 className="text-white text-3xl font-extrabold">Latest Analysis</h3>
          </div>
          <div className="m-3 border-2 border-white/20 rounded-2xl p-4 text-white/80 text-sm space-y-2">
            <p>{profile?.profile?.summary || 'Use the dashboard to generate analysis that will show up here.'}</p>
          </div>
        </div>

        <div className="col-start-2 row-span-1 border-4 border-white/20 rounded-xl m-4 bg-white/5 backdrop-blur-md overflow-y-auto">
          <div className="text-center p-4">
            <h3 className="text-white text-3xl font-extrabold">Social Links</h3>
          </div>
          <div className="m-3 border-2 border-white/20 rounded-2xl p-4 space-y-2">
            {['linkedin', 'github', 'portfolio'].map((key) => (
              <div key={key} className="flex justify-between text-white/80">
                <span className="capitalize">{key}</span>
                <span className="text-cyan-300">
                  {profile?.profile?.socialLinks?.[key] || 'Not added'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;