import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import '../index.css';

function SearchResults() {
    const location = useLocation();
    const searchResults = location.state?.searchResults || [];
    const [availability, setAvailability] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAvailability = async () => {
            setLoading(true);
            const availabilityMap = {};
            const promises = searchResults.map(async (bookPost) => {
                try {
                    const isAvailable = await authService.checkBookAvailability(bookPost.id);
                    availabilityMap[bookPost.id] = isAvailable;
                } catch (error) {
                    console.error(`Error fetching availability for book ${bookPost.id}:`, error);
                    availabilityMap[bookPost.id] = false;
                }
            });
            await Promise.all(promises);
            setAvailability(availabilityMap);
            setLoading(false);
        };

        if (searchResults.length > 0) {
            fetchAvailability();
        }
    }, [searchResults]);

    return (
        <div className="search-results-container p-4 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Search Results</h1>
            {loading && <p className="text-gray-600">Loading availability...</p>}
            {searchResults.length === 0 ? (
                <p className="text-gray-600">No book posts found matching your criteria.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((bookPost) => (
                        <div
                            key={bookPost.id}
                            className="book-post-card bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
                        >
                            <h2 className="text-xl font-semibold text-blue-600">{bookPost.title}</h2>
                            <p className="text-gray-600"><strong>Genre:</strong> {bookPost.genre || 'N/A'}</p>
                            <p className="text-gray-600"><strong>Language:</strong> {bookPost.language || 'N/A'}</p>
                            <p className="text-gray-600"><strong>Price:</strong> ${bookPost.price?.toFixed(2) || 'N/A'}</p>
                            <p className="text-gray-600"><strong>Posted by:</strong> {bookPost.bookOwnerName || 'Unknown'}</p>
                            <p className="text-gray-600">
                                <strong>Availability:</strong>{' '}
                                {availability[bookPost.id] === undefined
                                    ? 'Checking...'
                                    : availability[bookPost.id]
                                    ? 'Available'
                                    : 'Not Available'}
                            </p>
                            <button
                                className="mt-4 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                                onClick={() => window.location.href = `/BookPost/${bookPost.id}`}
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