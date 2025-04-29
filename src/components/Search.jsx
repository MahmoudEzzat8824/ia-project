import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from './SearchBar.jsx';
import axios from 'axios'; // Import axios
import '../index.css';

function Search() {
  const [results, setResults] = useState([]);
  const [availability, setAvailability] = useState({});
  const [failedBookIds, setFailedBookIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetchedAvailability, setHasFetchedAvailability] = useState(false);
  const navigate = useNavigate();

  const normalizeResults = (data) => {
    return data
      .map((book) => {
        const bookPostID = book.bookPostID || book.id || book.BookPostId;
        if (!bookPostID) {
          console.warn('Missing bookPostID in book:', book);
          return null;
        }
        return {
          bookPostID: bookPostID,
          title: book.title || 'N/A',
          genre: book.genre || 'N/A',
          language: book.language || 'N/A',
          price: book.price || 0,
          bookOwnerName: book.bookOwnerName || 'Unknown',
          isbn: book.isbn || 'N/A',
          description: book.description || 'No description available',
          publicationDate: book.publicationDate || 'N/A',
          startDate: book.startDate || 'N/A',
          endDate: book.endDate || 'N/A',
          coverPhoto: book.coverPhoto || book.bookPhoto || null,
        };
      })
      .filter((book) => book !== null);
  };

  const handleSetResults = (data) => {
    console.log('Search - Raw API response:', data);
    const normalized = normalizeResults(data);
    setResults(normalized);
    setHasFetchedAvailability(false); // Reset to allow one-time availability check
  };
  

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      const availabilityMap = { ...availability };
      const newFailedBookIds = new Set(failedBookIds);
  
      const rawToken = localStorage.getItem('token');
      if (!rawToken) {
        console.warn('No token found in localStorage.');
        setError('Authentication required to check availability.');
        setLoading(false);
        return;
      }
  
      const parsed = JSON.parse(rawToken);
      const token = parsed.token;
  
      const promises = results.map(async (bookPost) => {
        if (!bookPost.bookPostID || failedBookIds.has(bookPost.bookPostID)) {
          availabilityMap[bookPost.bookPostID] = false;
          return;
        }
        try {
          const response = await axios.get(
            `https://localhost:7200/api/BookPost/available?bookPostID=${bookPost.bookPostID}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const isAvailable = response.data.isAvailable ?? response.data;
          availabilityMap[bookPost.bookPostID] = isAvailable;
        } catch (error) {
          console.warn(`Error checking availability for book ${bookPost.bookPostID}:`, error.response?.data || error.message);
          availabilityMap[bookPost.bookPostID] = false;
          if (error.response?.status === 404) {
            newFailedBookIds.add(bookPost.bookPostID);
          } else {
            setError('Failed to check availability for some books.');
          }
        }
      });
  
      await Promise.all(promises);
      setAvailability(availabilityMap);
      setFailedBookIds(newFailedBookIds);
      setHasFetchedAvailability(true); // Mark as done
      setLoading(false);
    };
  
    if (results.length > 0 && !hasFetchedAvailability) {
      fetchAvailability();
    }
  }, [results, failedBookIds, availability, hasFetchedAvailability]);
  

  const handleViewDetails = (bookPost) => {
    if (!bookPost.bookPostID) {
      console.error('Invalid book post: bookPostID is missing', bookPost);
      setError('Cannot view details: Invalid book post.');
      return;
    }
    navigate(`/book/${bookPost.bookPostID}`, { state: { book: bookPost } });
  };

  return (
    <div className="search-page min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-blue-700 mb-10 text-center tracking-tight animate-fade-in">
        Search Books
      </h1>
      <div className="mb-10 flex justify-center">
        <div className="w-full max-w-5xl">
          <SearchBar setResults={handleSetResults} />
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-center text-lg mb-6 animate-pulse font-medium">
          {error}
        </p>
      )}
      {loading && (
        <p className="text-gray-600 text-center text-lg font-medium">
          
        </p>
      )}
      {results.length === 0 && !loading ? (
        <p className="text-gray-600 text-center text-lg font-medium">
          No book posts found. Try adjusting your search criteria.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {results.map((bookPost) => {
            const coverSrc = bookPost.coverPhoto
              ? `data:image/jpeg;base64,${bookPost.coverPhoto}`
              : 'https://placehold.co/150x150';
            console.log(`Book ${bookPost.bookPostID} coverSrc:`, coverSrc); // Debug log
            return (
              <div
                key={bookPost.bookPostID}
                className="book-post-card bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
                onClick={() => handleViewDetails(bookPost)}
              >
                <img
                  src={coverSrc}
                  alt={bookPost.title}
                  className="book-cover w-full h-56 object-cover rounded-t-xl bg-gray-100"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/150x150';
                  }}
                />
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-blue-700 mb-3 truncate">
                    {bookPost.title}
                  </h2>
                  <p className="text-gray-700 text-sm mb-1">
                    <strong className="font-medium text-gray-900">Genre:</strong> {bookPost.genre}
                  </p>
                  <p className="text-gray-700 text-sm mb-1">
                    <strong className="font-medium text-gray-900">Language:</strong> {bookPost.language}
                  </p>
                  <p className="text-gray-700 text-sm mb-1">
                    <strong className="font-medium text-gray-900">Price:</strong> ${bookPost.price.toFixed(2)}
                  </p>
                  <p className="text-gray-700 text-sm mb-3">
                    <strong className="font-medium text-gray-900">Posted by:</strong> {bookPost.bookOwnerName}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      availability[bookPost.bookPostID] ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <strong>Availability:</strong>{' '}
                    {availability[bookPost.bookPostID] === undefined
                      ? 'Checking...'
                      : availability[bookPost.bookPostID]
                      ? 'Available'
                      : 'Not Available'}
                  </p>
                  <button
                    className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(bookPost);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Search;