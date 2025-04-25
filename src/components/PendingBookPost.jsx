import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PendingBookPost() {
  const [bookPosts, setBookPosts] = useState([]);

  useEffect(() => {
    const fetchBookPosts = async () => {
      try {
        const storedToken = JSON.parse(localStorage.getItem("token"));
        const token = storedToken?.token;

        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get('https://localhost:7200/api/admin/ManageBookPosts', {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        setBookPosts(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchBookPosts();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const storedToken = JSON.parse(localStorage.getItem("token"));
      const token = storedToken?.token;
  
      if (!token) {
        console.error("No token found");
        return;
      }
  
      if (!id) {
        console.error("Invalid post ID:", id);
        return;
      }
  
      const actionValue = action.toLowerCase(); // Match what's expected by the API
  
      await axios.put(
        `https://localhost:7200/api/admin/ProcessBookPosts/${id}?action=${actionValue}`,
        null, // No body is required
        {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      // Remove the processed post from the state
      setBookPosts(bookPosts.filter(post => post.bookPostID !== id));
    } catch (error) {
      console.error(`Error ${action}ing post:`, error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };
  

  return (
    <div className="pending-book-posts-container">
      {bookPosts.length === 0 ? (
        <p className="no-posts-message">No pending book posts.</p>
      ) : (
        bookPosts.map((post, index) => {
          const coverPhoto = post.coverPhoto;
          const mimeType = coverPhoto?.startsWith('/9j') ? 'image/jpeg' : 'image/png';
          const base64Image = coverPhoto ? `data:${mimeType};base64,${coverPhoto}` : null;

          return (
            <div key={index} className="book-card">
              {base64Image ? (
                <img
                  src={base64Image}
                  alt="Book Cover"
                  className="book-cover"
                />
              ) : (
                <div className="book-cover-placeholder">
                  No Image
                </div>
              )}

              <div className="book-info">
                {Object.entries(post).map(([key, value]) => {
                  if (key === 'coverPhoto') return null;
                  return (
                    <div key={key} className="book-info-item">
                      <span className="label">{key}:</span>
                      <span className="value">{value !== null ? value.toString() : 'N/A'}</span>
                    </div>
                  );
                })}
              </div>

              <div className="action-buttons">
                <button 
                  className="approve-button"
                  onClick={() => handleAction(post.bookPostID, 'approve')}
                >
                  Approve
                </button>
                <button 
                  className="reject-button"
                  onClick={() => handleAction(post.bookPostID, 'reject')}
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default PendingBookPost;