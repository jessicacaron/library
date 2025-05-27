import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const DATABASE_URL = 'https://library-db1a2-default-rtdb.firebaseio.com';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/books.json`);
        const data = response.data;
        if (data) {
          const bookArray = Object.entries(data)
            .map(([key, book]) => ({ key, ...book }))
            .filter((book) => book.status === 'ip'); // ← Only show 'ip'
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

  const markAsRead = async (book) => {
    const updateData = {
      status: 'none',
      read: 'y',
      dateFinished: new Date().toISOString().split('T')[0],
    };

    try {
      await axios.patch(`${DATABASE_URL}/books/${book.key}.json`, updateData);
      setBooks((prev) =>
        prev.filter((b) => b.key !== book.key) // remove it from the list
      );
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleImageClick = (book) => {
    navigate(`/book/${book.key}`, { state: { book } });
  };

  return (
    <div>
      <h1>Currently Reading</h1>

      {books.length === 0 ? (
        <p>No books in progress.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {books.map((book) => (
            <li key={book.key} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
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
                <button
                  onClick={() => markAsRead(book)}
                  style={{ padding: '10px', cursor: 'pointer' }}
                >
                  Mark as Read
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookList;
