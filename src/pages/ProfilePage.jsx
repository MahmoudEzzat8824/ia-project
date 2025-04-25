import React, { useState, useEffect } from 'react';
import TopBar from "../components/top_bar";
import UserName from '../components/UserName';
import { Link } from 'react-router-dom';
import authService from '../services/auth.service';
import '../index.css';

function ProfilePage() {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [readerId, setReaderId] = useState(null);

  useEffect(() => {
      const fetchRequests = async () => {
          try {
              const tokenData = JSON.parse(localStorage.getItem("token"));
              if (!tokenData || tokenData.role !== "reader" || !tokenData.readerID) {
                  throw new Error("Invalid token data or not a reader");
              }

              setReaderId(tokenData.readerID);
              console.log("Token Data:", tokenData);

              const requestsData = await authService.fetchBorrowRequests(tokenData.readerID);
              
              console.log("Borrow Requests Data in ProfilePage:", requestsData);
              setDebugInfo(JSON.stringify(requestsData, null, 2));

              const requests = Array.isArray(requestsData) ? requestsData : [];
              
              setBorrowRequests(requests);
          } catch (err) {
              setError(`Failed to load borrow requests: ${err.message}`);
              console.error("Fetch error:", err);
          } finally {
              setLoading(false);
          }
      };

      fetchRequests();
  }, []);

  const handleReturnBook = async (requsetID, bookPostID) => {
    try {
      await authService.returnBook(requsetID, bookPostID, readerId); // Fixed readerID to readerId
      setBorrowRequests(borrowRequests.filter(request => (request.requsetID || request.requestId || request.id) !== requsetID));
    } catch (err) {
      setError(`Failed to return book: ${err.message}`);
      console.error("Return book error:", err);
    }
  };

  return (
    <>
      <TopBar />
      <UserName />
      <Link to="/EditProfilePage"> 
          <button className="edit_profile_button">
              edit profile
          </button>
      </Link>
      <div className="borrow-requests">
          <h2>Your Borrow Requests</h2>
          {loading && <p className="loading">Loading requests...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && borrowRequests.length === 0 && (
              <>
                  <p>No borrow requests found.</p>
                  
              </>
          )}
          {!loading && !error && borrowRequests.length > 0 && (
              <ul className="request-list">
                  {borrowRequests.map((request) => {
                      console.log("Request Object:", request); // Debug each request object
                      const status = request.requsetStatus?.toLowerCase(); // Use requsetStatus from schema
                      const canReturn = status === 'accepted' || status === 'approved'; // Adjust based on actual status values
                      return (
                          <li key={request.requsetID || request.requestId || request.id} className="request-item">
                              <div className="request-details">
                                  <div className="request-info">
                                      <p>Book: {request.bookTitle || request.title || 'Unknown'}</p>
                                      <p>Status: {request.requsetStatus || 'Unknown'}</p>
                                  </div>
                                  {canReturn && (
                                      <button 
                                        className="return-button" 
                                        onClick={() => handleReturnBook(
                                          request.requsetID || request.requestId || request.id, // Use requsetID from schema
                                          request.bookPostID || request.bookPostId // Use bookPostID from schema
                                        )}
                                      >
                                        Return Book
                                      </button>
                                  )}
                              </div>
                          </li>
                      );
                  })}
              </ul>
          )}
      </div>
    </>
  );
}

export default ProfilePage;