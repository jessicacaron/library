import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Loaned = () => {
  const [loanedBooks, setLoanedBooks] = useState([]);
  const navigate = useNavigate();
  const DATABASE_URL = 'https://library-db1a2-default-rtdb.firebaseio.com';

  useEffect(() => {
    const fetchLoanedBooks = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/books.json`);
        const data = response.data;
        if (data) {
          const bookArray = Object.entries(data).map(([key, book]) => ({
            key,
            ...book,
          }));
          const loaned = bookArray.filter((book) => book.loaned === 'y');
          setLoanedBooks(loaned);
        } else {
          setLoanedBooks([]);
        }
      } catch (error) {
        console.error('Error fetching loaned books:', error);
      }
    };

    fetchLoanedBooks();
  }, []);

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

  return (
    <div>
      <h1>Loaned Books</h1>

      <button onClick={() => navigate('/')} style={buttonStyle}>
        Back to Library
      </button>

      {loanedBooks.length === 0 ? (
        <p>No books are currently loaned out.</p>
      ) : (
        <ul>
          {loanedBooks.map((book) => (
            <li key={book.key}>
              <h3>{book.title}</h3>
              <p>Author(s): {Array.isArray(book.authors) ? book.authors.join(', ') : ''}</p>
              <p>Genre: {book.genre}</p>
              <p>Format: {book.format}</p>
              {book.smCover && (
                <img
                  src={book.smCover}
                  alt={`Cover of ${book.title}`}
                  style={{ maxWidth: '150px', marginBottom: '10px' }}
                />
              )}
              {book.note && (
                <p><strong>Loan Note:</strong> {book.note}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Loaned;
