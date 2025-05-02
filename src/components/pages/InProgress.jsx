import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const DATABASE_URL = 'https://library-db1a2-default-rtdb.firebaseio.com';
  const navigate = useNavigate();

  // Fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/books.json`);
        const data = response.data;
        if (data) {
          const bookArray = Object.entries(data)
            .map(([key, book]) => ({ key, ...book }));
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

  // Handle status change for 'Start Reading' and 'Mark as Read'
  const toggleStatus = async (book) => {
    const newStatus = book.status === 'in progress' ? 'read' : 'in progress';
    const updateData = {
      status: newStatus,
      dateStarted: newStatus === 'in progress' ? new Date().toISOString().split('T')[0] : book.dateStarted,
      dateFinished: newStatus === 'read' ? new Date().toISOString().split('T')[0] : book.dateFinished,
    };

    try {
      await axios.patch(`${DATABASE_URL}/books/${book.key}.json`, updateData);
      setBooks((prev) =>
        prev.map((b) => (b.key === book.key ? { ...b, ...updateData } : b))
      );
    } catch (error) {
      console.error('Error updating book status:', error);
    }
  };

  const handleImageClick = (book) => {
    navigate(`/book/${book.key}`, { state: { book } });
  };

  return (
    <div>
      <h1>Book List</h1>

      {books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.key}>
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
              <button
                onClick={() => toggleStatus(book)}
                style={{ padding: '10px', marginTop: '10px', cursor: 'pointer' }}
              >
                {book.status === 'in progress' ? 'Mark as Read' : 'Start Reading'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookList;
