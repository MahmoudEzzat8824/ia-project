import React, { useState, useEffect } from 'react';
import TopBar from "../components/top_bar";
import UserName from '../components/UserName';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import '../index.css';

function BookOwnerPage() {
  const [bookPosts, setBookPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookPosts = async () => {
      try {
        const tokenData = JSON.parse(localStorage.getItem("token"));
        const bookOwnerID = tokenData?.bookOwnerID;

        if (!tokenData || !bookOwnerID) {
          setError("User not logged in. Redirecting to login...");
          setTimeout(() => navigate('/login'), 2000);
          setLoading(false);
          return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await authService.fetchBookPostsByOwner(bookOwnerID, controller.signal);
        clearTimeout(timeoutId);

        const postArray = response?.requests && Array.isArray(response.requests) ? response.requests : [];
        setBookPosts(postArray);
        setLoading(false);
      } catch (err) {
        setError(
          err.name === 'AbortError'
            ? "Request timed out."
            : "Failed to fetch book posts."
        );
        setLoading(false);
      }
    };

    fetchBookPosts();
  }, [navigate]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <TopBar />
      <UserName />
      <div className="button-container">
        <Link to="/EditProfilePage">
          <button className="edit_profile_button">edit profile</button>
        </Link>
        <Link to="/BookPost">
          <button className="book_post_button">post book</button>
        </Link>
      </div>
      <div className="borrow-requests">
        <h2>Your Book Posts</h2>
        {bookPosts.length === 0 ? (
          <p className="no-posts">No book posts found.</p>
        ) : (
          <ul className="request-list">
            {bookPosts.map((post) => (
              <li key={post?.requsetID} className="request-item">
                <div className="request-details">
                  <div className="request-info">
                    <p className="book-title">Book: {post?.bookTitle || "Untitled"}</p>
                    <p className="status">
                      Status: {post?.requsetStatus === "Returned" ? "Available" : post?.requsetStatus || "N/A"}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BookOwnerPage;