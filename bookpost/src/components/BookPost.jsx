import { useState } from 'react';

function BookPost() {
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

  const validateForm = () => {
    if (!title || !genre || !isbn || !description || !language || !publicationDate || !startDate || !endDate || !price || !coverPhoto) {
      setError('All fields are required');
      return false;
    }
    if (isNaN(price) || price < 0) {
      setError('Price must be a non-negative number');
      return false;
    }
    const isbnRegex = /^[0-9-]{10,17}$/;
    if (!isbnRegex.test(isbn)) {
      setError('ISBN must be 10-17 digits or hyphens');
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
      setCoverPhotoPreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (isbn === '978-0743273565') {
        throw new Error('ISBN already exists');
      }
      alert('Book post submitted successfully (mock response)');
      handleAbort();
    } catch (err) {
      setError(err.message || 'Submission failed');
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
    <div className="form-container">
      <h2 className="form-title">Create Book Post</h2>
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
            required
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
            required
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
            required
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
            required
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
            required
          />
        </div>
        <div className="input-group">
          <label className="input-label">Publication Date</label>
          <input
            type="date"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div className="input-group">
          <label className="input-label">Available From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div className="input-group">
          <label className="input-label">Available Until</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input-field"
            required
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
            required
          />
        </div>
        <div className="input-group">
          <label className="input-label">Cover Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverPhotoChange}
            className="input-field file-input"
            required
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
            Submit
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
  );
}

export default BookPost;