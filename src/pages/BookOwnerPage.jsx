import React, { useState, useEffect, useRef } from 'react';
import TopBar from "../components/top_bar";
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import '../Styles/BookOwnerPage.css';

function BookOwnerPage() {
  const [bookPosts, setBookPosts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    const interval = setInterval(() => {
      authService.refreshTokenIfNeeded();
    }, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    isMounted.current = true;

    const fetchData = async () => {
      try {
        const tokenData = JSON.parse(localStorage.getItem("token"));
        const bookOwnerID = tokenData?.bookOwnerID;

        if (!tokenData || !bookOwnerID || !tokenData.token) {
          setError("Invalid or missing token. Redirecting to login...");
          setTimeout(() => navigate('/login'), 2000);
          setLoading(false);
          return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        
        const postsResponse = await authService.fetchBookPosts(bookOwnerID, controller.signal);
        console.log("Posts Response:", postsResponse);
        const postsArray = postsResponse?.posts && Array.isArray(postsResponse.posts) ? postsResponse.posts : [];
        if (isMounted.current) {
          setBookPosts(postsArray);
        }

       
        const requestsResponse = await authService.fetchBookPostsByOwner(bookOwnerID, controller.signal);
        console.log("Requests Response:", requestsResponse);
        const requestsArray = requestsResponse?.requests && Array.isArray(requestsResponse.requests) ? requestsResponse.requests : [];

        const uniqueRequests = Array.from(
          new Map(
            requestsArray
              .filter(request => request && (request.bookPostID || request.bookPostId) && request.readerID)
              .map(request => [`${request.bookPostID || request.bookPostId}-${request.readerID}`, request])
          ).values()
        );
        if (isMounted.current) {
          setRequests(uniqueRequests);
        }

        clearTimeout(timeoutId);
        if (isMounted.current) {
          setLoading(false);
        }
      } catch (err) {
        console.error("Fetch Error:", err, err.response);
        if (isMounted.current) {
          setError(
            err.name === 'AbortError'
              ? "Request timed out. Please check your network or server availability."
              : `Failed to fetch data: ${err.message}${err.response ? ` (Status: ${err.response.status})` : ''}`
          );
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted.current = false;
    };
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
      const errorMessage = err.response?.data?.message || err.message;
      setError(
        errorMessage === "Book is already borrowed"
          ? "Cannot accept request: This book is already borrowed by another user."
          : `Failed to accept request: ${errorMessage}`
      );
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

  const handleUpdatePost = (post) => {
    navigate('/BookPost', { state: { bookPost: post } });
  };

  const isBookBorrowed = (bookPostId) => {
    return requests.some(
      (request) =>
        (request.bookPostID === bookPostId || request.bookPostId === bookPostId) &&
        request.requsetStatus?.toLowerCase() === "accepted"
    );
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <TopBar />
      <div className="container">
        <div className="button-container">
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
                const associatedRequests = requests.filter((req) => req?.bookPostID === post?.bookPostID);
                const bookIsBorrowed = isBookBorrowed(post.bookPostID);
                return (
                  <li key={post.bookPostID} className="request-item">
                    <div className="request-details">
                      <div className="request-info">
                        <p className="book-title">Book: {post.title || "Untitled"}</p>
                        <p className="book-isbn">ISBN: {post.isbn || "N/A"}</p>
                        <p className="book-price">Price: ${post.price || "N/A"}</p>
                        <button
                          className="update-button"
                          onClick={() => handleUpdatePost(post)}
                        >
                          Update
                        </button>
                        {bookIsBorrowed && (
                          <p className="status-borrowed">This book is currently borrowed.</p>
                        )}
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
                                {isPending && !bookIsBorrowed && (
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
                                {isPending && bookIsBorrowed && (
                                  <p className="status-borrowed">Cannot accept: Book is already borrowed.</p>
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
    </>
  );
}

export default BookOwnerPage;