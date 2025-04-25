import React, { useState, useEffect } from 'react';
import TopBar from "../components/top_bar";
import UserName from '../components/UserName';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import '../index.css';

function BookOwnerPage() {
  const [bookPosts, setBookPosts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
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

        const postsResponse = await authService.fetchBookPosts(bookOwnerID, controller.signal);
        const postsArray = postsResponse?.posts && Array.isArray(postsResponse.posts) ? postsResponse.posts : [];
        setBookPosts(postsArray);

        const requestsResponse = await authService.fetchBookPostsByOwner(bookOwnerID, controller.signal);
        const requestsArray = requestsResponse?.requests && Array.isArray(requestsResponse.requests) ? requestsResponse.requests : [];
        setRequests(requestsArray);

        clearTimeout(timeoutId);
        setLoading(false);
      } catch (err) {
        setError(
          err.name === 'AbortError'
            ? "Request timed out."
            : "Failed to fetch data: " + err.message
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAcceptRequest = async (requestId, bookPostId, readerId) => {
    try {
      await authService.acceptRequest(requestId, bookPostId, readerId);
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.requsetID === requestId ? { ...request, requsetStatus: "Accepted" } : request
        )
      );
      setError(null);
    } catch (err) {
      setError("Failed to accept request: " + err.message);
    }
  };

  const handleRejectRequest = async (requestId, bookPostId, readerId) => {
    try {
      await authService.rejectRequest(requestId, bookPostId, readerId);
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.requsetID === requestId ? { ...request, requsetStatus: "Rejected" } : request
        )
      );
      setError(null);
    } catch (err) {
      setError("Failed to reject request: " + err.message);
    }
  };

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
            {bookPosts.map((post) => {
              const associatedRequests = requests.filter((req) => req.bookPostID === post.bookPostID);
              return (
                <li key={post.bookPostID} className="request-item">
                  <div className="request-details">
                    <div className="request-info">
                      <p className="book-title">Book: {post.title || "Untitled"}</p>
                      <p className="book-isbn">ISBN: {post.isbn || "N/A"}</p>
                      <p className="book-price">Price: ${post.price || "N/A"}</p>
                      {associatedRequests.length > 0 ? (
                        associatedRequests.map((request) => {
                          const isPending = request?.requsetStatus?.toLowerCase() === "pending";
                          const statusText = request.requsetStatus === "Returned" ? "Available" : request.requsetStatus || "N/A";
                          const statusClass =
                            statusText.toLowerCase() === "accepted"
                              ? "status-accepted"
                              : statusText.toLowerCase() === "rejected"
                              ? "status-rejected"
                              : "status-default";
                          return (
                            <div key={request.requsetID} className="request-subitem">
                              <p className="reader-name">Requested by: {request.readerName || "Unknown"}</p>
                              <p className={`status ${statusClass}`}>
                                Status: {statusText}
                              </p>
                              {isPending && (
                                <div className="action-buttons">
                                  <button
                                    className="approve-button"
                                    onClick={() => handleAcceptRequest(request.requsetID, request.bookPostID, request.readerID)}
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="reject-button"
                                    onClick={() => handleRejectRequest(request.requsetID, request.bookPostID, request.readerID)}
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="no-requests">No requests for this book.</p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BookOwnerPage;