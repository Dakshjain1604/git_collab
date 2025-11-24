import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserSignup from './Pages/Auth/UserSignup';
import UserSignin from './Pages/Auth/UserSignin';
import LoadingPage from "./Pages/LoadingPage/LoadingPage";
import NavBar from "./Components/NavBar";
import Profile from "./Pages/Profile/Profile";
import EditProfile from "./Pages/Profile/EditProfile";
import Dashboard from "./Pages/Dashboard/Dashboard";


function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/user/signup' element={<UserSignup />} />
          <Route path='/user/signin' element={<UserSignin />} />
          <Route path='/' element={<LoadingPage />} />
          <Route path='/user/profile' element={<Profile />} />
          <Route path='/edit/profile' element={<EditProfile />} />
          <Route path='/user/DashBoard' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>

  );
}

export default App;
