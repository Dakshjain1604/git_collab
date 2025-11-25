import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserSignup from './Pages/Auth/UserSignup';
import UserSignin from './Pages/Auth/UserSignin';
import LoadingPage from "./Pages/LoadingPage/LoadingPage";
import NavBar from "./Components/NavBar";
import Profile from "./Pages/Profile/Profile";
import EditProfile from "./Pages/Profile/EditProfile";
import Dashboard from "./Pages/Dashboard/Dashboard";
import { useAuth } from "./Context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/user/signin" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/user/signup' element={<UserSignup/>}/>
        <Route path='/user/signin' element={<UserSignin/>}/>
        <Route path='/' element={<LoadingPage/>}/>
        <Route path='/navbar' element={<NavBar/>}/>
        <Route path='/user/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path='/edit/profile' element={<ProtectedRoute><EditProfile/></ProtectedRoute>}/>
        <Route path='/user/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;

