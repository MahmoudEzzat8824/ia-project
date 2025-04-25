import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import authService from '../services/auth.service';
import '../index.css';

export const SearchBar = ({ setResults }) => {
    const [searchParams, setSearchParams] = useState({
        title: '',
        genre: '',
        language: '',
        price: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({ ...prev, [name]: value }));

        const hasInput = Object.values({ ...searchParams, [name]: value }).some((val) => val.trim() !== '');
        if (hasInput) {
            fetchData({ ...searchParams, [name]: value });
        } else {
            setResults([]);
        }
    };

    const fetchData = async (params) => {
        try {
            const data = await authService.searchBooks(params);
            setResults(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setResults([]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const queryParams = Object.entries(searchParams)
            .filter(([_, value]) => value.trim() !== '')
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');
        if (queryParams) {
            fetchData(searchParams);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar w-full md:w-auto">
            <div className="input-wrapper grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="input-group flex items-center">
                    <FaSearch id="search-icon" className="mr-2" />
                    <input
                        type="text"
                        name="title"
                        value={searchParams.title}
                        onChange={handleInputChange}
                        placeholder="Book Title"
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="input-group flex items-center">
                    <FaSearch id="search-icon" className="mr-2" />
                    <input
                        type="text"
                        name="genre"
                        value={searchParams.genre}
                        onChange={handleInputChange}
                        placeholder="Genre"
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="input-group flex items-center">
                    <FaSearch id="search-icon" className="mr-2" />
                    <input
                        type="text"
                        name="language"
                        value={searchParams.language}
                        onChange={handleInputChange}
                        placeholder="Language"
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="input-group flex items-center">
                    <FaSearch id="search-icon" className="mr-2" />
                    <input
                        type="number"
                        name="price"
                        value={searchParams.price}
                        onChange={handleInputChange}
                        placeholder="Max Price"
                        min="0"
                        step="0.01"
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div> 
            {/* <button
                type="submit"
                className="mt-4 w-full md:w-auto bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            >
                Search
            </button> */}
        </form>
    );
};