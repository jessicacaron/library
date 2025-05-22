import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Import useNavigate instead of useHistory
import axios from 'axios';

const BookDetails = () => {
  const [book, setBook] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    authors: [],
    publishedDate: '',
    pages: 0,
    smCover: '',
    lgCover: '',
    genre: '',
    status: '',
    format: '',
    notes: '',
    loaned: 'n',
    review: '',
    stars: 0,
    dateAdded: new Date().toISOString(),
    dateStarted: new Date().toISOString(),
    dateFinished: new Date().toISOString(),
    read: 'n',
  });
  const [showModal, setShowModal] = useState(false);  // State to control modal visibility
  const [showRateModal, setShowRateModal] = useState(false);  // State for rating modal

  const { bookKey } = useParams();
  const navigate = useNavigate();
  const DATABASE_URL = 'https://library-db1a2-default-rtdb.firebaseio.com';

  // Fetch book details on component mount
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/books/${bookKey}.json`);
        const bookData = response.data;
        if (bookData) {
          setBook(bookData);
          setFormData({
            ...bookData,
            dateAdded: bookData.dateAdded || new Date().toISOString(),
            dateStarted: bookData.dateStarted || new Date().toISOString(),
            dateFinished: bookData.dateFinished || new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [bookKey]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(`${DATABASE_URL}/books/${bookKey}.json`, formData);
      setShowModal(false);  // Close the modal after update
      navigate('/booklist');  // Navigate to the book list page after update
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${DATABASE_URL}/books/${bookKey}.json`);
      navigate('/booklist');  // Navigate to the book list page after deletion
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const openModal = () => {
    setShowModal(true);  // Open the modal when the Update button is clicked
  };

  const closeModal = () => {
    setShowModal(false);  // Close the modal when the cancel button is clicked
  };

  const openRateModal = () => {
    setShowRateModal(true);  // Open the rate modal
  };

  const closeRateModal = () => {
    setShowRateModal(false);  // Close the rate modal
  };

  const handleRateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${DATABASE_URL}/books/${bookKey}.json`, { review: formData.review, stars: formData.stars });
      setShowRateModal(false);
      setFormData((prevData) => ({
        ...prevData,
        review: formData.review,
        stars: formData.stars,
      }));
    } catch (error) {
      console.error('Error updating review and rating:', error);
    }
  };

  const handleReadStatusChange = async () => {
    const isCurrentlyRead = formData.read === 'y';
    const updatedReadStatus = isCurrentlyRead ? 'n' : 'y';
  
    // Set dateFinished to now if marking as read; otherwise, clear it
    const updatedDateFinished = isCurrentlyRead ? '' : new Date().toISOString();
  
    try {
      await axios.patch(`${DATABASE_URL}/books/${bookKey}.json`, {
        read: updatedReadStatus,
        dateFinished: updatedDateFinished,
      });
  
      setFormData((prevData) => ({
        ...prevData,
        read: updatedReadStatus,
        dateFinished: updatedDateFinished,
      }));
    } catch (error) {
      console.error('Error updating read status:', error);
    }
  };
  

  if (!book) {
    return <p>Loading book details...</p>;
  }

  return (
    <div>
      <h1>Book Details</h1>

      {/* Back to Book List Button */}
      <button 
        onClick={() => navigate('/booklist')} 
        // style={{
        //   marginTop: '20px', 
        //   backgroundColor: '#4CAF50', 
        //   color: 'white', 
        //   padding: '15px 32px', 
        //   fontSize: '18px', 
        //   border: 'none', 
        //   borderRadius: '8px', 
        //   cursor: 'pointer',
        //   display: 'block',
        //   marginLeft: 'auto',
        //   marginRight: 'auto',
        // }}
      >
        <i class="fas fa-arrow-left"></i>
      </button>

      {/* Book details */}
      <div>
        {book.smCover && (
            <img src={book.smCover} alt={`Cover of ${book.title}`}/>
        )}
        {book.read === 'y' && (
      <div>
        <p>✅ Read {book.dateFinished}</p>

      </div>
      
    )}
        <p><strong>Title:</strong> {book.title}</p>
        <p><strong>Authors:</strong> {book.authors.join(', ')}</p>
        <p><strong>Published Date:</strong> {book.publishedDate}</p>
        <p><strong>Pages:</strong> {book.pages}</p>
        <p><strong>Genre:</strong> {book.genre}</p>
        <p><strong>Status:</strong> {book.status}</p>
        <p><strong>Description:</strong> {book.description}</p>



        {/* Display star rating */}
        {book.stars > 0 && (
          <p><strong>Rating:</strong> {'⭐'.repeat(book.stars)} out of 5</p>
        )}

        {/* Display review */}
        {book.review && (
          <p><strong>Review:</strong> {book.review}</p>
        )}
      </div>

      {/* Rate and Read buttons */}
      <button onClick={openRateModal} style={{ marginTop: '10px' }}>Rate</button>
      <button onClick={handleReadStatusChange} >
        {formData.read === 'y' ? 'Mark as Unread' : 'Mark as Read'}
      </button>

      <button onClick={openModal} style={{ marginTop: '10px' }}><i class="far fa-edit"></i></button>
      <button onClick={handleDelete} style={{ marginTop: '10px', backgroundColor: 'red', color: 'white' }}>
      <i class="far fa-trash-alt"></i>
      </button>

      {/* Modal for Updating Book */}
      {showModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2>Update Book Details</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </label>
              <br />
  
              <label>
                Authors:
                <input
                  type="text"
                  name="authors"
                  value={formData.authors.join(', ')}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      authors: e.target.value.split(',').map((author) => author.trim()),
                    }))
                  }
                />
              </label>
              <br />
  
              <label>
                Published Date:
                <input
                  type="text"
                  name="publishedDate"
                  value={formData.publishedDate}
                  onChange={handleChange}
                />
              </label>
              <br />
  
              <label>
                Pages:
                <input
                  type="number"
                  name="pages"
                  value={formData.pages}
                  onChange={handleChange}
                />
              </label>
              <br />
  
              <label>
                Small Cover Image:
                <input
                  type="text"
                  name="smCover"
                  value={formData.smCover}
                  onChange={handleChange}
                />
              </label>
              <br />
  
              <label>
                Large Cover Image:
                <input
                  type="text"
                  name="lgCover"
                  value={formData.lgCover}
                  onChange={handleChange}
                />
              </label>
              <br />
  
              <label>
                Genre:
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                />
              </label>
              <br />
  
              <label>
                Status:
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                />
              </label>
              <br />
  
              <label>
                Format:
                <input
                  type="text"
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                />
              </label>
              <br />
  
              <label>
                Notes:
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </label>
              <br />
  
              <label>
                Loaned:
                <select
                  name="loaned"
                  value={formData.loaned}
                  onChange={handleChange}
                >
                  <option value="n">No</option>
                  <option value="y">Yes</option>
                </select>
              </label>
              <br />
  
              <label>
                Review:
                <textarea
                  name="review"
                  value={formData.review}
                  onChange={handleChange}
                />
              </label>
              <br />
  
              <label>
                Stars:
                <input
                  type="number"
                  name="stars"
                  value={formData.stars}
                  onChange={handleChange}
                />
              </label>
              <br />
  
              <label>
                Date Started:
                <input
                  type="date"
                  name="dateStarted"
                  value={formData.dateStarted.split('T')[0]}
                  onChange={handleChange}
                />
              </label>
              <br />
  
              <label>
                Date Finished:
                <input
                  type="date"
                  name="dateFinished"
                  value={formData.dateFinished.split('T')[0]}
                  onChange={handleChange}
                />
              </label>
              <br />
  
              <button type="submit">Save Changes</button>
              <button type="button" onClick={closeModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Rate Modal */}
      {showRateModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2>Rate and Review</h2>
            <form onSubmit={handleRateSubmit}>
              <label>
                Stars:
                <input
                  type="number"
                  name="stars"
                  value={formData.stars}
                  onChange={handleChange}
                  max="5"
                  min="1"
                />
              </label>
              <br />
  
              <label>
                Review:
                <textarea
                  name="review"
                  value={formData.review}
                  onChange={handleChange}
                />
              </label>
              <br />
  
              <button type="submit">Submit Review</button>
              <button type="button" onClick={closeRateModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const modalStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

export default BookDetails;
