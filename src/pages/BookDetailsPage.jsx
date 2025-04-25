import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const BookDetailsPage = () => {
  const location = useLocation();
  const book = location.state?.book;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (book?.bookPostID) {
      axios
        .get(`https://localhost:7200/api/BookPost/comments/${book.bookPostID}`)
        .then((res) => setComments(res.data))
        .catch((err) => console.error("Error fetching comments:", err));
    }
  }, [book]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
  
    const rawToken = localStorage.getItem("token");
  
    if (!rawToken) {
      console.error("No token found in localStorage.");
      return;
    }
  
    try {
      const parsed = JSON.parse(rawToken);
      const token = parsed.token;
      const readerID = parsed.readerID;
  
      const response = await axios.post(
        "https://localhost:7200/api/reader/comment",
        {
          readerID,
          bookPostID: book.bookPostID,
          content: newComment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setComments((prev) => [
        ...prev,
        {
          commentID: response.data.commentID || Math.random(),
          readerName: response.data.readerName || "You",
          content: newComment.trim(),
        },
      ]);
  
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };
  
  

  if (!book) return <div>Loading...</div>;

  const coverSrc = book.coverPhoto
    ? `data:image/jpeg;base64,${book.coverPhoto}`
    : "https://via.placeholder.com/150";

  return (
    <div className="book-details-page">
      <div className="book-header">
        <img src={coverSrc} alt={book.title} className="book-cover-large" />
        <div className="book-main-info">
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author"><strong>Author:</strong> {book.bookOwnerName}</p>
          <p className="book-genre"><strong>Genre:</strong> {book.genre}</p>
          <p className="book-price"><strong>Price:</strong> ${book.price}</p>
          <p className="book-publication-date"><strong>Publication Date:</strong> {book.publicationDate}</p>
          <p className="book-end-date"><strong>End Date:</strong> {book.endDate}</p>
          <p className="book-isbn"><strong>ISBN:</strong> {book.isbn}</p>
          <p className="book-language"><strong>Language:</strong> {book.language}</p>
        </div>
      </div>

      <div className="book-description">
        <h3>Description</h3>
        <p>{book.description}</p>
      </div>

      <div className="reactions">
        <button className="like-button">👍 {book.totalLikes}</button>
        <button className="dislike-button">👎 {book.totalDislikes}</button>
      </div>

      <div className="comments-section">
        <h3>Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.commentID} className="comment">
              <strong>{comment.readerName}:</strong> {comment.content}
            </div>
          ))
        )}
        <textarea
            className="comment-box"
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            />

            <button onClick={handleCommentSubmit} className="submit-comment-button">
            Submit Comment
            </button>
      </div>
    </div>
  );
};

export default BookDetailsPage;
