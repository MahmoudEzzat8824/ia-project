import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookPost from './components/BookPost';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import BookOwnerPage from './pages/BookOwnerPage';
import HomePageWithoutLogin from './pages/HomePageWithoutLogin';
import BookDetailsPage from './pages/BookDetailsPage';


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
        <Route path="/BookOwnerPage" element={<BookOwnerPage />} />
        <Route path='/HomePageWithoutLogin' element={<HomePageWithoutLogin />} />
        <Route path="/book/:id" element={<BookDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;