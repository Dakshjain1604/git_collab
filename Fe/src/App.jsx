import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import UserSignup from './Pages/Auth/UserSignup';
import UserSignin from './Pages/Auth/UserSignin';
import LoadingPage from "./Pages/LoadingPage/LoadingPage";
import NavBar from "./Components/NavBar";
import Profile from "./Pages/Profile/Profile";
function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/user/signup' element={<UserSignup/>}/>
        <Route path='/user/signin' element={<UserSignin/>}/>
        <Route path='/' element={<LoadingPage/>}/>
        <Route path='/navbar' element={<NavBar/>}/>
        <Route path='/user/profile' element={<Profile/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;

