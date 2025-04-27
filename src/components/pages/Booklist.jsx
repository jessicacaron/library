import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    genre: '',
    format: '',
    status: '',
  });
  const [selectedNote, setSelectedNote] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);

  const DATABASE_URL = 'https://library-db1a2-default-rtdb.firebaseio.com';
  const navigate = useNavigate();

  const handleImageClick = (book) => {
    navigate(`/book/${book.key}`, { state: { book } });
  };

  // Fetch books from Firebase
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/books.json`);
        const data = response.data;
        if (data) {
          const bookArray = Object.entries(data).map(([key, book]) => ({
            key,
            ...book,
          }));
          setBooks(bookArray);
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Delete a book
  const handleDelete = async (key) => {
    try {
      await axios.delete(`${DATABASE_URL}/books/${key}.json`);
      setBooks((prev) => prev.filter((book) => book.key !== key));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  // Start editing a book
  const handleEditClick = (book) => {
    setEditingKey(book.key);
    setFormData({
      title: book.title,
      authors: Array.isArray(book.authors) ? book.authors.join(', ') : '',
      genre: book.genre || '',
      format: book.format || '',
      status: book.status || '',
    });
  };

  // Save the updated book
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedBook = {
        ...formData,
        authors: formData.authors.split(',').map((a) => a.trim()).filter(Boolean),
      };
      await axios.patch(`${DATABASE_URL}/books/${editingKey}.json`, updatedBook);
      setBooks((prev) =>
        prev.map((book) => (book.key === editingKey ? { ...book, ...updatedBook } : book))
      );
      setEditingKey(null);
      setFormData({ title: '', authors: '', genre: '', format: '', status: '' });
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  // Toggle read/unread status
  const toggleReadStatus = async (book) => {
    const newStatus = book.status === 'y' ? 'n' : 'y';
    try {
      await axios.patch(`${DATABASE_URL}/books/${book.key}.json`, { status: newStatus });
      setBooks((prev) =>
        prev.map((b) => (b.key === book.key ? { ...b, status: newStatus } : b))
      );
    } catch (error) {
      console.error('Error updating read status:', error);
    }
  };

  // Toggle loan status
  const toggleLoanStatus = async (book) => {
    if (book.loaned === 'y') {
      const timestamp = new Date().toLocaleDateString();
      const updatedNote = book.note ? `${book.note}\nReturned (${timestamp})` : `Returned (${timestamp})`;

      try {
        await axios.patch(`${DATABASE_URL}/books/${book.key}.json`, { loaned: 'n', note: updatedNote });
        setBooks((prev) =>
          prev.map((b) => (b.key === book.key ? { ...b, loaned: 'n', note: updatedNote } : b))
        );
      } catch (error) {
        console.error('Error updating loan status:', error);
      }
    } else {
      const borrower = prompt('Enter borrower name:');
      if (!borrower) return;

      const timestamp = new Date().toLocaleDateString();
      const updatedNote = book.note ? `${book.note}\nLoaned to ${borrower} (${timestamp})` : `Loaned to ${borrower} (${timestamp})`;

      try {
        await axios.patch(`${DATABASE_URL}/books/${book.key}.json`, { loaned: 'y', note: updatedNote });
        setBooks((prev) =>
          prev.map((b) => (b.key === book.key ? { ...b, loaned: 'y', note: updatedNote } : b))
        );
      } catch (error) {
        console.error('Error updating loan status:', error);
      }
    }
  };

  // Styles
  const buttonStyle = {
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '8px',
    marginRight: '8px',
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '80%',
    textAlign: 'center',
    whiteSpace: 'pre-wrap',
  };

  return (
    <div>
      <h1>Your Library</h1>

      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.key}>
              {editingKey === book.key ? (
                <form onSubmit={handleUpdate}>
                <div>
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    required
                  />
                </div>
              
                <div>
                  <label htmlFor="authors">Authors (comma-separated)</label>
                  <input
                    type="text"
                    name="authors"
                    id="authors"
                    value={formData.authors}
                    onChange={handleInputChange}
                    placeholder="Authors (comma-separated)"
                    required
                  />
                </div>
              
                <div>
                  <label htmlFor="genre">Genre</label>
                  <input
                    type="text"
                    name="genre"
                    id="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    placeholder="Genre"
                  />
                </div>
              
                <div>
                  <label htmlFor="format">Format</label>
                  <input
                    type="text"
                    name="format"
                    id="format"
                    value={formData.format}
                    onChange={handleInputChange}
                    placeholder="Format"
                  />
                </div>
              
                <div>
                  <label htmlFor="photo">Photo URL</label>
                  <input
                    type="text"
                    name="photo"
                    id="photo"
                    value={formData.photo}
                    onChange={handleInputChange}
                    placeholder="Photo URL"
                  />
                </div>
              
                <div>
                  <label htmlFor="document">Document URL</label>
                  <input
                    type="text"
                    name="document"
                    id="document"
                    value={formData.document}
                    onChange={handleInputChange}
                    placeholder="Document URL"
                  />
                </div>
              
                <div>
                  <label htmlFor="dateStarted">Date Started</label>
                  <input
                    type="date"
                    name="dateStarted"
                    id="dateStarted"
                    value={formData.dateStarted}
                    onChange={handleInputChange}
                  />
                </div>
              
                <div>
                  <label htmlFor="dateFinished">Date Finished</label>
                  <input
                    type="date"
                    name="dateFinished"
                    id="dateFinished"
                    value={formData.dateFinished}
                    onChange={handleInputChange}
                  />
                </div>
              
                <div>
                  <button type="submit" style={buttonStyle}>Save</button>
                  <button type="button" onClick={() => setEditingKey(null)} style={buttonStyle}>Cancel</button>
                </div>
              </form>
              
              
              
              
              ) : (
                <>
                  <h3>{book.title}</h3>
                  <p>Author(s): {Array.isArray(book.authors) ? book.authors.join(', ') : ''}</p>
                  <p>Genre: {book.genre}</p>
                  <p>Format: {book.format}</p>
                  {book.smCover && (
                    <img
                    src={book.smCover}
                    alt={`Cover of ${book.title}`}
                    style={{ maxWidth: '150px', marginBottom: '10px', cursor: 'pointer' }}
                    onClick={() => handleImageClick(book)}
                    />
                  )}
                  <div>
                    <button onClick={() => handleEditClick(book)} style={buttonStyle}>Edit</button>
                    <button onClick={() => handleDelete(book.key)} style={{ ...buttonStyle, backgroundColor: '#f44336' }}>Delete</button>
                    <button onClick={() => toggleReadStatus(book)} style={{ ...buttonStyle, backgroundColor: book.status === 'y' ? '#4caf50' : '#9e9e9e' }}>
                      {book.status === 'y' ? 'Read' : 'Unread'}
                    </button>
                    <button onClick={() => toggleLoanStatus(book)} style={{ ...buttonStyle, backgroundColor: book.loaned === 'y' ? '#f44336' : '#2196f3' }}>
                      {book.loaned === 'y' ? 'Mark as Returned' : 'Loan Book'}
                    </button>
                    {book.note && (
                      <button onClick={() => { setSelectedNote(book.note); setShowNoteModal(true); }} style={{ ...buttonStyle, backgroundColor: '#4CAF50' }}>
                        View Notes
                      </button>
                    )}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {showNoteModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2>Notes</h2>
            <p>{selectedNote}</p>
            <button
              onClick={() => setShowNoteModal(false)}
              style={{ ...buttonStyle, backgroundColor: '#f44336', marginTop: '20px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;
