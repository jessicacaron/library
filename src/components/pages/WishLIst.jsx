import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- import useNavigate

const WishList = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate(); // <-- initialize navigate

  const DATABASE_URL = 'https://library-db1a2-default-rtdb.firebaseio.com';

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
          const wishlistBooks = bookArray.filter(book => book.status === 'wish');
          setBooks(wishlistBooks);
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const downloadWishlist = () => {
    const wishlistText = books.map(book => `Title: ${book.title}\nAuthors: ${Array.isArray(book.authors) ? book.authors.join(', ') : ''}\nGenre: ${book.genre || 'N/A'}\nFormat: ${book.format || 'N/A'}\n\n`).join('');
    const blob = new Blob([wishlistText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'wishlist.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      <h1>Wishlist</h1>

      {books.length === 0 ? (
        <p>No books on your wishlist.</p>
      ) : (
        <>
          <button onClick={downloadWishlist} style={buttonStyle}>Download Wishlist</button>
          <ul>
            {books.map((book) => (
              <li key={book.key}>
                <h3>{book.title}</h3>
                <p>Author(s): {Array.isArray(book.authors) ? book.authors.join(', ') : ''}</p>
                <p>Genre: {book.genre || 'N/A'}</p>
                <p>Format: {book.format || 'N/A'}</p>
              </li>
            ))}
          </ul>
        </>
      )}

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate(-1)} style={buttonStyle}>Back</button> {/* <-- Back button */}
      </div>
    </div>
  );
};

export default WishList;
