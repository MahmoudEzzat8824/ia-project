import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/top_bar';
import PendingBookPost from '../components/PendingBookPost';
import authService from '../services/auth.service';
import PendingBookOwners from '../components/PendingBookOwners';
import '../Styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [bookPosts, setBookPosts] = useState([]);
  const [adminName, setAdminName] = useState('');
  const [passwordHash, setPasswordHash] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      authService.refreshTokenIfNeeded();
    }, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, []);

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

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await authService.createAdmin(adminName, passwordHash);
      setSuccess("Admin created successfully!");
      setAdminName('');
      setPasswordHash('');
    } catch (err) {
      setError("Failed to create admin. Please try again.");
      console.error("Create admin error:", err);
    }
  };

  return (
    <>
      <TopBar />
      <div className="flex flex-col items-center py-0"> {/* Renamed to match CSS, moved inside to preserve layout */}
        <div className="w-full max-w-4xl mt-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Dashboard</h1>

          {/* Create Admin Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Create New Admin</h2>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            {success && <p className="text-green-600 mb-4">{success}</p>}
            <form onSubmit={handleCreateAdmin} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <label className="block text-gray-700">Admin Name</label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="text"
                  value={passwordHash}
                  onChange={(e) => setPasswordHash(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Create Admin
              </button>
            </form>
          </div>

          {/* Existing Sections */}
          <PendingBookOwners />
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pending Book Posts</h2>
            <PendingBookPost />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;