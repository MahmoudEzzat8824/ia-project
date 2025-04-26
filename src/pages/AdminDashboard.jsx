import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/top_bar';
import PendingBookPost from '../components/PendingBookPost';
import authService from '../services/auth.service';
import PendingBookOwners from '../components/PendingBookOwners';

const AdminDashboard = () => {
  const [bookPosts, setBookPosts] = React.useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthorization = () => {
      const storedData = localStorage.getItem("token");
      if (!storedData) {
        navigate("/login");
        return;
      }

      const { token, role } = JSON.parse(storedData);

      if (!token) {
        navigate("/login");
      } else if (role !== "admin") {
        navigate("/ProfilePage");
      }
    };

    checkAuthorization();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center py-0">
      <TopBar />

      <div className="w-full max-w-4xl mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Dashboard</h1>
        <PendingBookOwners />
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pending Book Posts</h2>
          <PendingBookPost />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;