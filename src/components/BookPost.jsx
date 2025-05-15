import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/auth.service';
import TopBar from '../components/top_bar';
import '../Styles/BookPostFancy.css';

function BookPost({ bookOwnerName }) {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [isbn, setIsbn] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [price, setPrice] = useState('');
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [error, setError] = useState('');
  const [coverPhotoPreview, setCoverPhotoPreview] = useState('');
  const navigate = useNavigate();
  const { state } = useLocation();
  const bookPost = state?.bookPost || null;
  const isEditing = !!bookPost;

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      try {
        const { token, role } = JSON.parse(stored);
        if (token) {
          if (role === 'book_owner') {
            if (isEditing) {
              setTitle(bookPost.title || '');
              setGenre(bookPost.genre || '');
              setIsbn(bookPost.isbn || '');
              setDescription(bookPost.description || '');
              setLanguage(bookPost.language || '');
              setPublicationDate(bookPost.publicationDate || '');
              setStartDate(bookPost.startDate || '');
              setEndDate(bookPost.endDate || '');
              setPrice(bookPost.price || '');
              setCoverPhotoPreview(bookPost.coverPhoto || '');
              console.log('Editing book post with ID:', bookPost.bookPostID);
            }
          } else {
            navigate('/login', { replace: true });
          }
        }
      } catch (err) {
        console.error('Error reading token:', err);
        localStorage.removeItem('token');
      }
    }
  }, [navigate, isEditing, bookPost]);

  const validateForm = (isEditing) => {
    if (!isEditing) {
      if (!title || !genre || !isbn || !description || !language || !publicationDate || !startDate || !endDate || !price || !coverPhoto) {
        setError('All fields are required for creating a new book post');
        return false;
      }
    }

    if (price && (isNaN(price) || Number(price) < 0)) {
      setError('Price must be a non-negative number');
      return false;
    }

    const isbnRegex = /^[0-9-]{10,17}$/;
    if (isbn && !isbnRegex.test(isbn)) {
      setError('ISBN must be 10-17 digits or hyphens');
      return false;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (publicationDate && !dateRegex.test(publicationDate)) {
      setError('Publication Date must be in YYYY-MM-DD format');
      return false;
    }
    if (startDate && !dateRegex.test(startDate)) {
      setError('Start Date must be in YYYY-MM-DD format');
      return false;
    }
    if (endDate && !dateRegex.test(endDate)) {
      setError('End Date must be in YYYY-MM-DD format');
      return false;
    }

    return true;
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhoto(file);
      setCoverPhotoPreview(URL.createObjectURL(file));
    } else {
      setCoverPhoto(null);
      setCoverPhotoPreview(isEditing ? bookPost.coverPhoto : '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm(isEditing)) return;

    try {
      const stored = localStorage.getItem('token');
      if (!stored) throw new Error('No authentication token found');

      const { token, bookOwnerID } = JSON.parse(stored);
      const formData = new FormData();
      formData.append('bookOwnerID', bookOwnerID || '');

      // Common fields
      formData.append('title', title);
      formData.append('genre', genre);
      formData.append('isbn', isbn);
      formData.append('description', description);
      formData.append('language', language);
      formData.append('publicationDate', new Date(publicationDate).toISOString());
      formData.append('startDate', new Date(startDate).toISOString());
      formData.append('endDate', new Date(endDate).toISOString());
      formData.append('price', price);

      if (coverPhoto) formData.append('coverPhoto', coverPhoto);

      if (!isEditing) {
        console.log('Creating new book post...');
        const response = await fetch('https://localhost:7200/api/bookowner', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });

        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          let errorMessage = `Request failed with status ${response.status}`;
          if (contentType?.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || JSON.stringify(errorData.errors) || errorMessage;
          } else {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
          throw new Error(errorMessage);
        }

        alert('Book post created successfully');
        handleAbort();
      } else {
        const result = await authService.updateBookPost(bookPost.bookPostID, formData, token);
        const message = result.message || 'Book post updated successfully';
        alert(message);
        handleAbort();
      }
    } catch (err) {
      console.error('Error submitting book post:', err);
      if (err.response?.data?.errors) {
        console.error('Validation errors:', err.response.data.errors);
        const errors = Object.entries(err.response.data.errors)
          .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
          .join('\n');
        setError(`Validation error:\n${errors}`);
      } else {
        setError(`Failed to submit book post: ${err.message}`);
      }

      if (err.message.includes('401') || err.message.includes('403')) {
        authService.Logout();
        navigate('/Login', { replace: true });
      }
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this book post?')) return;
    try {
      const stored = localStorage.getItem('token');
      if (!stored) throw new Error('No authentication token found');
      const { token } = JSON.parse(stored);

      await authService.deleteBookPost(postId, token);
      alert('Book post deleted successfully');
      handleAbort();
    } catch (err) {
      setError(`Failed to delete book post: ${err.message}`);
    }
  };

  const handleAbort = () => {
    setTitle('');
    setGenre('');
    setIsbn('');
    setDescription('');
    setLanguage('');
    setPublicationDate('');
    setStartDate('');
    setEndDate('');
    setPrice('');
    setCoverPhoto(null);
    setCoverPhotoPreview('');
    setError('');
    navigate('/BookOwnerPage', { replace: true });
  };

  return (
    <>
      <TopBar />
      <div className="form-container">
        <h2 className="form-title">{isEditing ? 'Update Book Post' : 'Create Book Post'}</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" required />
          </div>
          <div className="input-group">
            <label className="input-label">Genre</label>
            <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} className="input-field" required />
          </div>
          <div className="input-group">
            <label className="input-label">ISBN</label>
            <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} className="input-field" required />
          </div>
          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" rows="4" required />
          </div>
          <div className="input-group">
            <label className="input-label">Language</label>
            <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} className="input-field" required />
          </div>
          <div className="input-group">
            <label className="input-label">Publication Date</label>
            <input type="date" value={publicationDate} onChange={(e) => setPublicationDate(e.target.value)} className="input-field" required />
          </div>
          <div className="input-group">
            <label className="input-label">Available From</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field" required />
          </div>
          <div className="input-group">
            <label className="input-label">Available Until</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field" required />
          </div>
          <div className="input-group">
            <label className="input-label">Price ($)</label>
            <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="input-field" required />
          </div>
          <div className="input-group">
            <label className="input-label">Cover Photo</label>
            <input type="file" accept="image/*" onChange={handleCoverPhotoChange} className="input-field file-input" />
            {coverPhotoPreview && (
              <div className="cover-preview">
                <img src={coverPhotoPreview} alt="Cover Preview" className="cover-image" />
              </div>
            )}
          </div>
          <div className="button-group">
            <button type="submit" className="submit-button book-submit-button">
              {isEditing ? 'Update' : 'Submit'}
            </button>
            <button type="button" onClick={handleAbort} className="submit-button book-abort-button">
              Abort
            </button>
            {isEditing && (
              <button type="button" onClick={() => handleDelete(bookPost.bookPostID)} className="submit-button delete-button">
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

export default BookPost;
