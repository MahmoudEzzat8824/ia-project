import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import authService from '../services/auth.service';
import '../index.css';

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState(location.state?.searchResults || []);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);

  // Fetch book posts from API
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const query = location.state?.query || ''; // Get search query from state
        // Adjust endpoint and query params as needed
        const response = await axios.get(`https://localhost:7200/api/BookPosts/search`, {
          params: { query }, // Pass query as a parameter
        });
        console.log('SearchResults - API response:', response.data);
        setSearchResults(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching books:', err);
        console.error('Error details:', err.response?.data, err.response?.status);
        setError('Failed to load book posts.');
        setSearchResults(location.state?.searchResults || []);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBooks();
  }, [location.state?.query]); // Re-fetch if query changes

  // Fetch availability for books
  useEffect(() => {
    const fetchAvailability = async () => {
      const availabilityMap = {};
      const promises = searchResults.map(async (bookPost) => {
        try {
          const isAvailable = await authService.checkBookAvailability(bookPost.bookPostID);
          availabilityMap[bookPost.bookPostID] = isAvailable;
        } catch (error) {
          console.error(`Error fetching availability for book ${bookPost.bookPostID}:`, error);
          availabilityMap[bookPost.bookPostID] = false;
        }
      });
      await Promise.all(promises);
      setAvailability(availabilityMap);
    };

    if (searchResults.length > 0) {
      fetchAvailability();
    }
  }, [searchResults]);

  const handleViewDetails = (bookPost) => {
    if (!bookPost?.bookPostID) {
      console.error('Invalid book post:', bookPost);
      return;
    }
    console.log('Navigating to book:', bookPost.bookPostID, bookPost);
    navigate(`/book/${bookPost.bookPostID}`, { state: { book: bookPost } });
  };

  return (
    <div className="search-results-container p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Search Results</h1>
      {loading && <p className="text-gray-600">Loading books...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {searchResults.length === 0 && !loading ? (
        <p className="text-gray-600">No book posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((bookPost) => (
            <div
              key={bookPost.bookPostID}
              className="book-post-card bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-blue-600">{bookPost.title || 'N/A'}</h2>
              <p className="text-gray-600"><strong>Genre:</strong> {bookPost.genre || ' Tablet'}</p>
              <p className="text-gray-600"><strong>Language:</strong> {bookPost.language || 'N/A'}</p>
              <p className="text-gray-600"><strong>Price:</strong> ${bookPost.price?.toFixed(2) || 'N/A'}</p>
              <p className="text-gray-600"><strong>Posted by:</strong> {bookPost.bookOwnerName || 'Unknown'}</p>
              <p className="text-gray-600">
                <strong>Availability:</strong>{' '}
                {availability[bookPost.bookPostID] === undefined
                  ? 'Checking...'
                  : availability[bookPost.bookPostID]
                  ? 'Available'
                  : 'Not Available'}
              </p>
              <button
                onClick={() => {
                  console.log('View Details clicked for:', bookPost.bookPostID);
                  handleViewDetails(bookPost);
                }}
                className="details-button bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;