import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import HomePageWithoutLogin from "./HomePageWithoutLogin";

const BookDetailsPage = () => {
  const location = useLocation();
  const { id } = useParams();
  const [book, setBook] = useState(location.state?.book || null);
  const [loading, setLoading] = useState(!location.state?.book);
  const [error, setError] = useState(null);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userReaction, setUserReaction] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  // 🆕 State for reply
  const [replyContent, setReplyContent] = useState({});
  const [replySubmitting, setReplySubmitting] = useState(false);

  useEffect(() => {
    if (!book && id) {
      setLoading(true);
      axios
        .get(`https://localhost:7200/api/BookPost/${id}`)
        .then((res) => {
          setBook(res.data);
          setLikes(res.data.totalLikes || 0);
          setDislikes(res.data.totalDislikes || 0);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching book:", err);
          setError("Failed to load book details.");
          setLoading(false);
        });
    } else if (book) {
      setLikes(book.totalLikes || 0);
      setDislikes(book.totalDislikes || 0);
    }
  }, [book, id]);

  useEffect(() => {
    if (book?.bookPostID) {
      axios
        .get(`https://localhost:7200/api/BookPost/comments/${book.bookPostID}`)
        .then((res) => setComments(res.data))
        .catch((err) => {
          console.error("Error fetching comments:", err);
          setError("Failed to load comments.");
        });

      const rawToken = localStorage.getItem("token");
      if (rawToken) {
        const parsed = JSON.parse(rawToken);
        const readerID = parsed.readerID;
        axios
          .get(`https://localhost:7200/api/reader/reaction/${readerID}/${book.bookPostID}`)
          .then((res) => {
            if (res.data?.isLike === true) setUserReaction("like");
            else if (res.data?.isLike === false) setUserReaction("dislike");
          })
          .catch((err) => console.error("Error fetching user reaction:", err));
      }
    }
  }, [book]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const rawToken = localStorage.getItem("token");
    if (!rawToken) {
      console.error("No token found in localStorage.");
      return;
    }

    setSubmitting(true);
    setError(null);

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
          replies: [],
        },
      ]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
    setSubmitting(false);
  };

  const handleBorrowBook = async () => {
    const rawToken = localStorage.getItem("token");
    if (!rawToken) {
      console.error("No token found in localStorage.");
      return;
    }

    try {
      const parsed = JSON.parse(rawToken);
      const token = parsed.token;
      const readerID = parsed.readerID;

      await axios.post(
        "https://localhost:7200/api/reader/borrow",
        {
          readerID,
          bookPostID: book.bookPostID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Book borrow requested successfully!");
      window.location.href = "/HomePageWithLogin";
    } catch (error) {
      console.error("Error borrowing book:", error);
    }
  };

  const handleLike = async () => {
    console.log("Like button clicked ✅");
    const rawToken = localStorage.getItem("token");
    if (!rawToken || !book) return;

    const parsed = JSON.parse(rawToken);
    const token = parsed.token;
    const readerID = parsed.readerID;

    try {
      if (userReaction === "like") {
        await axios.delete("https://localhost:7200/api/reader/like", {
          data: { readerID, bookPostID: book.bookPostID, isLike: true },
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserReaction(null);
        setLikes((prev) => Math.max(prev - 1, 0));
      } else if (userReaction === "dislike") {
        await axios.put(
          "https://localhost:7200/api/reader/like",
          { readerID, bookPostID: book.bookPostID, isLike: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserReaction("like");
        setLikes((prev) => prev + 1);
        setDislikes((prev) => Math.max(prev - 1, 0));
      } else {
        await axios.post(
          "https://localhost:7200/api/reader/like",
          { readerID, bookPostID: book.bookPostID, isLike: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserReaction("like");
        setLikes((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleDislike = async () => {
    console.log("Dislike button clicked ✅");
    const rawToken = localStorage.getItem("token");
    if (!rawToken || !book) return;

    const parsed = JSON.parse(rawToken);
    const token = parsed.token;
    const readerID = parsed.readerID;

    try {
      if (userReaction === "dislike") {
        await axios.delete("https://localhost:7200/api/reader/like", {
          data: { readerID, bookPostID: book.bookPostID, isLike: false },
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserReaction(null);
        setDislikes((prev) => Math.max(prev - 1, 0));
      } else if (userReaction === "like") {
        await axios.put(
          "https://localhost:7200/api/reader/like",
          { readerID, bookPostID: book.bookPostID, isLike: false },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserReaction("dislike");
        setDislikes((prev) => prev + 1);
        setLikes((prev) => Math.max(prev - 1, 0));
      } else {
        await axios.post(
          "https://localhost:7200/api/reader/like",
          { readerID, bookPostID: book.bookPostID, isLike: false },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserReaction("dislike");
        setDislikes((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error handling dislike:", error);
    }
  };

  // 🆕 Submit Reply
  const handleReplySubmit = async (commentID) => {
    const content = replyContent[commentID];
    if (!content?.trim()) return;

    const rawToken = localStorage.getItem("token");
    if (!rawToken) return;

    setReplySubmitting(true);

    try {
      const parsed = JSON.parse(rawToken);
      const token = parsed.token;
      const readerID = parsed.readerID;

      await axios.post(
        "https://localhost:7200/api/reader/reply",
        {
          commentID,
          readerID,
          content: content.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments((prev) =>
        prev.map((comment) =>
          comment.commentID === commentID
            ? {
                ...comment,
                replies: [...(comment.replies || []), { content: content.trim(), readerName: "You" }],
              }
            : comment
        )
      );
      setReplyContent((prev) => ({ ...prev, [commentID]: "" }));
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
    setReplySubmitting(false);
  };

  if (loading) {
    return <div className="text-gray-600 text-center p-4">Loading book details...</div>;
  }

  if (error || !book) {
    return <div className="text-red-600 text-center p-4">{error || "Book data not found."}</div>;
  }

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
        <button
          className={`like-button ${userReaction === "like" ? "active" : ""}`}
          onClick={handleLike}
        >
          👍 {likes}
        </button>

        <button
          className={`dislike-button ${userReaction === "dislike" ? "active" : ""}`}
          onClick={handleDislike}
        >
          👎 {dislikes}
        </button>
      </div>

      <div className="comments-section">
        <h3>Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.commentID} className="comment">
              <strong>{comment.readerName}:</strong> {comment.content}

              {/* 🆕 Replies list */}
              {comment.replies?.map((reply, idx) => (
                <div key={idx} className="reply ml-6 text-gray-600">
                  ↳ <strong>{reply.readerName}:</strong> {reply.content}
                </div>
              ))}

              {/* 🆕 Reply input */}
              <textarea
                className="reply-box"
                placeholder="Write a reply..."
                value={replyContent[comment.commentID] || ""}
                onChange={(e) =>
                  setReplyContent((prev) => ({ ...prev, [comment.commentID]: e.target.value }))
                }
                rows={2}
              />
              <button
                onClick={() => handleReplySubmit(comment.commentID)}
                className="submit-reply-button"
                disabled={replySubmitting}
              >
                Submit Reply
              </button>
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
        <button onClick={handleCommentSubmit} className="submit-comment-button" disabled={submitting}>
          Submit Comment
        </button>
        <button className="borrow-book-button" onClick={handleBorrowBook}>
          Borrow Book
        </button>
      </div>
    </div>
  );
};

export default BookDetailsPage;