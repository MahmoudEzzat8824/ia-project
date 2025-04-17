import React, { useState } from 'react';
import TopBar from '../components/top_bar';

// API Calls

const AdminDashboard = () => {
  const [bookOwners, setBookOwners] = useState([]);
  const [bookPosts, setBookPosts] = useState([]);

  return (
    <div className="flex flex-col items-center py-0">
      {/* Use the TopBar component */}
      <TopBar />

      {/* Admin Page Content */}
      <div className="w-full max-w-4xl mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Dashboard</h1>

        {/* Book Owner Notifications */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pending Book Owners</h2>
          {bookOwners.filter(owner => owner.status === 'pending').length === 0 && (
            <p className="text-gray-600 text-center">No pending accounts to review.</p>
          )}
          
        </div>

        {/* Book Post Notifications */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pending Book Posts</h2>
          {bookPosts.filter(post => post.status === 'pending').length === 0 && (
            <p className="text-gray-600 text-center">No pending book posts to review.</p>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;