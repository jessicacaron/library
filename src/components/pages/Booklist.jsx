import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaRegCircle, FaStar, FaRegStar, FaClock } from 'react-icons/fa';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [openAccordion, setOpenAccordion] = useState(null); // Track which book is open
  const navigate = useNavigate();
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

  const handleImageClick = (book) => {
    navigate(`/book/${book.key}`, { state: { book } });
  };

  const toggleAccordion = (key) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const renderStars = (rating) => {
    const starIcons = [];
    for (let i = 0; i < 5; i++) {
      starIcons.push(
        i < rating ? (
          <FaStar key={i} style={{ color: 'gold' }} />
        ) : (
          <FaRegStar key={i} />
        )
      );
    }
    return starIcons;
  };

  const handleReadStatusChange = async (bookKey, currentRead) => {
    const isCurrentlyRead = currentRead === 'y';
    const updatedReadStatus = isCurrentlyRead ? 'n' : 'y';
  
    // Set dateFinished to now if marking as read; otherwise, clear it
    const updatedDateFinished = isCurrentlyRead ? '' : new Date().toISOString();
  
    try {
      await axios.patch(`${DATABASE_URL}/books/${bookKey}.json`, {
        read: updatedReadStatus,
        dateFinished: updatedDateFinished,
      });
  
      // Re-fetch or locally update state if needed
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.key === bookKey
            ? { ...book, read: updatedReadStatus, dateFinished: updatedDateFinished }
            : book
        )
      );
    } catch (error) {
      console.error('Error updating read status:', error);
    }
  };
  

  return (
    <div>
      <h1>Your Library</h1>
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {books.map((book) => (
            <li key={book.key} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              <div
                onClick={() => toggleAccordion(book.key)}
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >
                
                {book.smCover && (
                  <img
                    src={book.smCover}
                    alt={`Cover of ${book.title}`}
                    style={{ maxWidth: '100px', marginRight: '10px' }}
                  />
                )}
                <h3 style={{ marginRight: '10px' }}>{book.title}</h3>
                <>
                {book.read === 'y' ? (
                  <FaCheckCircle style={{ color: 'green', marginRight: '10px' }} />
                ) : (
                  <FaRegCircle style={{ color: 'gray', marginRight: '10px' }} />
                )}

                {book.status === 'ip' && (
                  <FaClock style={{ color: 'orange', marginRight: '10px' }} />
                )}
              </>

                
                {book.rating && renderStars(book.rating)}
              </div>

              {/* Accordion content */}
              {openAccordion === book.key && (
                <div style={{ marginTop: '10px', paddingLeft: '20px' }}>
                  <button
                    style={{ marginRight: '10px' }}
                    onClick={() => handleReadStatusChange(book.key, book.read)}
                  >
                    {book.read === 'y' ? 'Mark as Unread' : 'Mark as Read'}
                  </button>     
                  <button style={{ marginRight: '10px' }}>Start Reading</button>
                  <button style={{ marginRight: '10px' }}>Loan Book</button>
                  <button onClick={() => handleImageClick(book)}>See Details</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookList;


