import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import '../index.css';

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState(location.state?.searchResults || []);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger to refresh data

  // Fetch book posts from API
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const query = location.state?.query || '';
        const response = await authService.searchBooks({ query });
        console.log('SearchResults - Raw API response:', response);
        // Map response to include likes and dislikes
        const mappedResults = response.map(book => {
          const bookPostID = book.bookPostID || book.id || book.BookPostId;
          if (!bookPostID) {
            console.warn('Missing bookPostID in book:', book);
          }
          return {
            bookPostID: bookPostID,
            title: book.title || 'N/A',
            genre: book.genre || 'N/A',
            language: book.language || 'N/A',
            price: book.price || 0,
            bookOwnerName: book.bookOwnerName || 'Unknown',
            likes: book.likes || 0, // Assume API returns likes
            dislikes: book.dislikes || 0, // Assume API returns dislikes
          };
        }).filter(book => book.bookPostID);
        setSearchResults(mappedResults);
        setError(null);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load book posts. Please try again.');
        setSearchResults(location.state?.searchResults || []);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [location.state?.query, refreshTrigger]); // Add refreshTrigger to dependencies

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

  // Handle like/dislike actions
  const handleLike = async (bookPostID) => {
    try {
      await authService.likeBook(bookPostID); // Assume API to like a book
      setRefreshTrigger(prev => prev + 1); // Trigger re-fetch
    } catch (error) {
      console.error('Error liking book:', error);
      setError('Failed to like book.');
    }
  };

  const handleDislike = async (bookPostID) => {
    try {
      await authService.dislikeBook(bookPostID); // Assume API to dislike a book
      setRefreshTrigger(prev => prev + 1); // Trigger re-fetch
    } catch (error) {
      console.error('Error disliking book:', error);
      setError('Failed to dislike book.');
    }
  };

  const handleViewDetails = (bookPost) => {
    if (!bookPost?.bookPostID) {
      console.error('Invalid book post: bookPostID is missing', bookPost);
      setError('Cannot view details: Invalid book post.');
      return;
    }
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
              <h2 className="text-xl font-semibold text-blue-600">{bookPost.title}</h2>
              <p className="text-gray-600"><strong>Genre:</strong> {bookPost.genre}</p>
              <p className="text-gray-600"><strong>Language:</strong> {bookPost.language}</p>
              <p className="text-gray-600"><strong>Price:</strong> ${bookPost.price.toFixed(2)}</p>
              <p className="text-gray-600"><strong>Posted by:</strong> {bookPost.bookOwnerName}</p>
              <p className="text-gray-600">
                <strong>Availability:</strong>{' '}
                {availability[bookPost.bookPostID] === undefined
                  ? 'Checking...'
                  : availability[bookPost.bookPostID]
                  ? 'Available'
                  : 'Not Available'}
              </p>
              <p className="text-gray-600">
                <strong>Likes:</strong> {bookPost.likes} | <strong>Dislikes:</strong> {bookPost.dislikes}
              </p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleLike(bookPost.bookPostID)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Like
                </button>
                <button
                  onClick={() => handleDislike(bookPost.bookPostID)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Dislike
                </button>
              </div>
              <button
                onClick={() => handleViewDetails(bookPost)}
                className="details-button bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
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