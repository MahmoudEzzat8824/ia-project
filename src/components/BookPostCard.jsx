import React from "react";
import { useNavigate } from "react-router-dom";

const BookPostCard = ({ book }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Get token once at the top

  const coverSrc = book.coverPhoto
    ? `data:image/jpeg;base64,${book.coverPhoto}`
    : "https://via.placeholder.com/100";

  const handleViewDetails = () => {
    navigate(`/book/${book.bookPostID}`, { state: { book } });
  };

  return (
    <div className="book-post-card">
      <img src={coverSrc} alt={book.title} className="book-cover" />
      <div className="book-info">
        <p><strong>Title:</strong> {book.title}</p>
        <p><strong>Genre:</strong> {book.genre}</p>
        <p><strong>Price:</strong> ${book.price}</p>
        <div className="reactions">
          <p>👍 {book.totalLikes}</p>
          <p>👎 {book.totalDislikes}</p>
        </div>
        {token && ( // Only show the button if token exists
          <button onClick={handleViewDetails} className="details-button">
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default BookPostCard;
