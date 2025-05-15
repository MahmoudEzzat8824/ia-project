import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import '../Styles/SearchResults.css';

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState(location.state?.searchResults || []);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);


  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const query = location.state?.query || '';
        const response = await authService.searchBooks({ query });
        console.log('SearchResults - Raw API response:', response);
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
            likes: book.likes || 0,
            dislikes: book.dislikes || 0,
            coverPhoto: book.coverPhoto || null,
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
  }, [location.state?.query, refreshTrigger]);

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

  const handleLike = async (bookPostID) => {
    try {
      await authService.likeBook(bookPostID);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error liking book:', error);
      setError('Failed to like book.');
    }
  };

  const handleDislike = async (bookPostID) => {
    try {
      await authService.dislikeBook(bookPostID);
      setRefreshTrigger(prev => prev + 1);
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
    <div className="search-results-container">
      <h1 className="search-results-header">Search Results</h1>
      
      {loading && <p className="loading-text">Loading books...</p>}
      {error && <p className="error-text">{error}</p>}
      
      {searchResults.length === 0 && !loading ? (
        <p className="no-results-text">No book posts found.</p>
      ) : (
        <div className="books-grid">
          {searchResults.map((bookPost) => (
            <div
              key={bookPost.bookPostID}
              className="book-card"
            >
              {bookPost.coverPhoto && (
                <img 
                  src={`data:image/jpeg;base64,${bookPost.coverPhoto}`} 
                  alt={bookPost.title}
                  className="book-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/300x200?text=No+Cover';
                  }}
                />
              )}
              <div className="book-content">
                <h2 className="book-title">{bookPost.title}</h2>
                <p className="book-info"><span className="info-label">Genre:</span> {bookPost.genre}</p>
                <p className="book-info"><span className="info-label">Language:</span> {bookPost.language}</p>
                <p className="book-info"><span className="info-label">Price:</span> ${bookPost.price.toFixed(2)}</p>
                <p className="book-info"><span className="info-label">Posted by:</span> {bookPost.bookOwnerName}</p>
                <p className={`availability ${availability[bookPost.bookPostID] ? 'available' : 'not-available'}`}>
                  <span className="info-label">Availability:</span> {availability[bookPost.bookPostID] === undefined ? 'Checking...' : availability[bookPost.bookPostID] ? 'Available' : 'Not Available'}
                </p>
                <div className="rating-container">
                  <span className="likes">{bookPost.likes} 👍</span>
                  <span className="dislikes">{bookPost.dislikes} 👎</span>
                </div>
                <div className="actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(bookPost.bookPostID);
                    }}
                    className="like-button"
                  >
                    Like
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDislike(bookPost.bookPostID);
                    }}
                    className="dislike-button"
                  >
                    Dislike
                  </button>
                </div>
                <button
                  onClick={() => handleViewDetails(bookPost)}
                  className="details-button"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;