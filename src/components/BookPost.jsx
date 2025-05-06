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

    if (price && (isNaN(price) || price < 0)) {
      setError('Price must be a non-negative number');
      return false;
    }

    if (isbn) {
      const isbnRegex = /^[0-9-]{10,17}$/;
      if (!isbnRegex.test(isbn)) {
        setError('ISBN must be 10-17 digits or hyphens');
        return false;
      }
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

    if (!validateForm(isEditing)) {
      return;
    }

    try {
      const stored = localStorage.getItem('token');
      if (!stored) {
        throw new Error('No authentication token found');
      }
      const parsed = JSON.parse(stored);
      const bookOwnerID = parsed.bookOwnerID;

      if (!bookOwnerID) {
        throw new Error('Book Owner ID is missing');
      }

      const formData = new FormData();
      formData.append('bookOwnerID', bookOwnerID);

      if (!isEditing) {
        formData.append('title', title);
        formData.append('genre', genre);
        formData.append('isbn', isbn);
        formData.append('description', description);
        formData.append('language', language);
        formData.append('publicationDate', publicationDate);
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
        formData.append('price', price);
        formData.append('coverPhoto', coverPhoto);

        console.log('Creating new book post...');
        console.log('FormData fields:', [...formData.entries()]);
        const response = await fetch('https://localhost:7200/api/bookowner', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${parsed.token}`
          },
          body: formData,
        });

        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          let errorMessage = `Request failed with status ${response.status}`;
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || JSON.stringify(errorData.errors) || errorMessage;
          } else {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
          throw new Error(errorMessage);
        }

        const contentType = response.headers.get('content-type');
        let result = 'Book post created successfully';
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          result = data.message || result;
        } else {
          const text = await response.text();
          result = text || result;
        }

        handleAbort();
        setError('');
        alert(result);
        navigate('/BookOwnerPage', { replace: true });
      } else {
        if (title && title !== bookPost.title) formData.append('title', title);
        if (genre && genre !== bookPost.genre) formData.append('genre', genre);
        if (isbn && isbn !== bookPost.isbn) formData.append('isbn', isbn);
        if (description && description !== bookPost.description) formData.append('description', description);
        if (language && language !== bookPost.language) formData.append('language', language);
        if (publicationDate && publicationDate !== bookPost.publicationDate) formData.append('publicationDate', publicationDate);
        if (startDate && startDate !== bookPost.startDate) formData.append('startDate', startDate);
        if (endDate && endDate !== bookPost.endDate) formData.append('endDate', endDate);
        if (price && price !== bookPost.price) formData.append('price', price);
        if (coverPhoto) formData.append('coverPhoto', coverPhoto);

        console.log('Updating book post with ID:', bookPost.bookPostID);
        console.log('FormData fields:', [...formData.entries()]);
        const result = await authService.updateBookPost(bookPost.bookPostID, formData);
        const message = result.message || 'Book post updated successfully';

        handleAbort();
        setError('');
        alert(message);
        navigate('/BookOwnerPage', { replace: true });
      }
    } catch (err) {
      console.error('Error submitting book post:', err);
      setError(`Failed to submit book post: ${err.message}`);
      if (err.message.includes('401') || err.message.includes('403')) {
        authService.Logout();
        navigate('/Login', { replace: true });
      }
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
  };

  return (
    <>
      <TopBar />
      <div className="form-container">
        <h2 className="form-title">{isEditing ? 'Update Book Post' : 'Create Book Post'}</h2>
        {error && <p className="error-text">{error}</p>}
        <div>
          <div className="input-group">
            <label className="input-label">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="e.g., The Great Gatsby"
              required={!isEditing}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Genre</label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="input-field"
              placeholder="e.g., Fiction"
              required={!isEditing}
            />
          </div>
          <div className="input-group">
            <label className="input-label">ISBN</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="input-field"
              placeholder="e.g., 978-0743273565"
              required={!isEditing}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              placeholder="e.g., A story of..."
              rows="4"
              required={!isEditing}
            ></textarea>
          </div>
          <div className="input-group">
            <label className="input-label">Language</label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input-field"
              placeholder="e.g., English"
              required={!isEditing}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Publication Date</label>
            <input
              type="date"
              value={publicationDate}
              onChange={(e) => setPublicationDate(e.target.value)}
              className="input-field"
              required={!isEditing}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Available From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
              required={!isEditing}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Available Until</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
              required={!isEditing}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Price ($)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input-field"
              placeholder="e.g., 15"
              min="0"
              required={!isEditing}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Cover Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverPhotoChange}
              className="input-field file-input"
              required={!isEditing}
            />
            {coverPhotoPreview && (
              <div className="cover-preview">
                <img src={coverPhotoPreview} alt="Cover Preview" className="cover-image" />
              </div>
            )}
          </div>
          <div className="button-group">
            <button
              onClick={handleSubmit}
              className="submit-button book-submit-button"
            >
              {isEditing ? 'Update' : 'Submit'}
            </button>
            <button
              onClick={handleAbort}
              className="submit-button book-abort-button"
            >
              Abort
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookPost;