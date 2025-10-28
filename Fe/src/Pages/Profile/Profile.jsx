import React, { use } from 'react'
import axios from 'axios'
import { createContext, useContext, useState } from 'react'
import { Navigate , useNavigate } from 'react-router-dom';
import SpotlightCard from '../../Components/SpotlightCard';
import Threads from '../../Components/Threads';

const UserContext = createContext();


const UserProvider = ({ children }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const getUser = async (userId) => {
    try {
      const { data } = await axios.get(``);// Replace with  API endpoint
      
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


const ProfileContent = () => {
  const { firstName, lastName, email } = useUser();
  const navigate = useNavigate();

  const logout = async () =>{
    try{
      await axios.post(''); // Replace with API endpoint
      localStorage.removeItem('token');  
      localStorage.removeItem('user');
      navigate('/'); 
    }
    catch(error){
      console.error('Error during logout:', error);
    }
  }

  return (
<div className="relative w-full h-screen overflow-hidden">
  <div className="absolute inset-0 -z-1 bg-black">
    <Threads amplitude={1} distance={0} enableMouseInteraction={true} />
  </div>

  <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full w-full p-4 backdrop-blur-sm bg-black/10">
    
    <div className="flex items-center justify-center row-span-2 border-4 border-black bg-black/5 backdrop-blur-lg rounded-xl m-3">
      <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 240, 280, 0.9)">
      <div className="w-full p-6">

        <div className="flex items-center justify-between bg-black/20 p-4 rounded-lg mb-4 border border-amber-300">
          <p className="text-2xl px-4 font-extrabold text-white">First Name:</p>
          <h3 className="text-2xl px-8 tracking-wider font-extrabold text-white">
            {firstName || 'John'}
          </h3>
        </div>

        <div className="flex items-center justify-between bg-black/20 p-4 rounded-lg mb-4 border border-amber-300">
          <p className="text-2xl px-4 font-extrabold text-white">Last Name:</p>
          <h3 className="text-2xl px-8 tracking-wider font-extrabold text-white">
            {lastName || 'Doe'}
          </h3>
        </div>

        <div className="flex items-center justify-between bg-black/20 p-4 rounded-lg mb-4 border border-amber-300">
          <p className="text-2xl px-4 font-extrabold text-white">Email:</p>
          <h3 className="text-2xl px-8 tracking-wider font-extrabold text-white">
            {email || 'john@example.com'}
          </h3>
        </div>

        <div className="flex items-center justify-between bg-black/20 p-4 rounded-lg mb-4 border border-amber-300">
          <p className="text-2xl px-4 font-extrabold text-white">Password:</p>
          <h3 className="text-2xl px-8 tracking-wider font-extrabold text-white">••••••••</h3>
        </div>

        <div className="border-t-2 border-white/20 my-4"></div>

        <div className="flex justify-center space-x-10">
          <button
            onClick={logout}
            className="bg-red-600/70 text-white py-3 px-8 rounded-lg shadow-md 
                       hover:bg-red-700/80 focus:ring-2 focus:ring-red-500 
                       transition-all duration-200 hover:scale-105 font-bold"
          >
            Logout
          </button>
          <button
            onClick={() => navigate('/edit/profile')}
            className="bg-blue-600/70 text-white py-3 px-8 rounded-lg shadow-md 
                       hover:bg-blue-700/80 focus:ring-2 focus:ring-blue-500 
                       transition-all duration-200 hover:scale-105 font-bold"
          >
            Edit
          </button>
        </div>
         </div>
      </SpotlightCard>
    </div>

    <div className="col-start-2 row-span-1 m-4 border-4 border-white/20 rounded-xl bg-white/5 backdrop-blur-md overflow-y-auto">
      <div className="text-center p-4">
        <h3 className="text-white text-4xl font-extrabold">Resume</h3>
      </div>
      {/* here we will use the map to give the brief description of the all the resume he had uploaded from resume schema*/}
      <div className="m-3 border-2 border-white/20 rounded-2xl p-4">
        <p className="px-2 font-extrabold text-white">Headings of Resume</p>
      </div>
    </div>
   
    <div className="col-start-2 row-span-1 border-4 border-white/20 rounded-xl m-4 bg-white/5 backdrop-blur-md overflow-y-auto">
      <div className="text-center p-4">
        <h3 className="text-white text-4xl font-extrabold">Job Description</h3>
      </div>
       {/* here we will use the map function to give the brief description of all the jobs he had requested from the job schema*/}
      <div className="m-3 border-2 border-white/20 rounded-2xl p-4">
        <p className="px-2 font-extrabold text-white">Description of Jobs</p>
      </div>
    </div>
  </div>
</div>


  );
};


const Profile = () => {
  return (
    <UserProvider>
      <ProfileContent />
    </UserProvider>
  );
};

export default Profile;