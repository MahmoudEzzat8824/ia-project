import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookPost from './pages/BookPost';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import AdminDashboard from './pages/AdminDashboard';

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/bookpost" element={<BookPost />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/EditProfilePage" element={<EditProfilePage />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;