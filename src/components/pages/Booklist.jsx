import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaRegCircle, FaStar, FaRegStar, FaClock } from 'react-icons/fa';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showReadOnly, setShowReadOnly] = useState(false);
  const navigate = useNavigate();
  const DATABASE_URL = 'https://library-db1a2-default-rtdb.firebaseio.com';

  // Helper to sort books by title then authors
  const sortBooks = (booksArray) => {
    return booksArray.sort((a, b) => {
      const titleA = (a.title || '').toLowerCase();
      const titleB = (b.title || '').toLowerCase();
      if (titleA < titleB) return -1;
      if (titleA > titleB) return 1;

      // Titles equal, sort by authors (join if array)
      const authorA = (Array.isArray(a.authors) ? a.authors.join(' ') : (a.authors || '')).toLowerCase();
      const authorB = (Array.isArray(b.authors) ? b.authors.join(' ') : (b.authors || '')).toLowerCase();
      if (authorA < authorB) return -1;
      if (authorA > authorB) return 1;

      return 0;
    });
  };

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
          setBooks(sortBooks(bookArray)); // Sort on fetch
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
    const updatedDateFinished = isCurrentlyRead ? '' : new Date().toISOString();

    try {
      await axios.patch(`${DATABASE_URL}/books/${bookKey}.json`, {
        read: updatedReadStatus,
        dateFinished: updatedDateFinished,
      });

      setBooks((prevBooks) =>
        sortBooks(
          prevBooks.map((book) =>
            book.key === bookKey
              ? { ...book, read: updatedReadStatus, dateFinished: updatedDateFinished }
              : book
          )
        )
      );
    } catch (error) {
      console.error('Error updating read status:', error);
    }
  };

  const handleStartReading = async (bookKey) => {
    const currentDate = new Date().toISOString();

    try {
      await axios.patch(`${DATABASE_URL}/books/${bookKey}.json`, {
        status: 'ip',
        dateStarted: currentDate,
      });

      setBooks((prevBooks) =>
        sortBooks(
          prevBooks.map((book) =>
            book.key === bookKey
              ? { ...book, status: 'ip', dateStarted: currentDate }
              : book
          )
        )
      );
    } catch (error) {
      console.error('Error starting reading:', error);
    }
  };

  // Filter by search & optionally show read only
  const filteredBooks = books
    .filter((book) => book.title?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((book) => (showReadOnly ? book.read === 'y' : true));

  return (
    <div>
      <h1>Your Library</h1>

      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '8px', marginBottom: '15px', width: '100%' }}
      />

      <button
        onClick={() => setShowReadOnly(!showReadOnly)}
        style={{
          marginBottom: '15px',
          padding: '8px',
          cursor: 'pointer',
          backgroundColor: showReadOnly ? '#4caf50' : '#ccc',
          color: showReadOnly ? 'white' : 'black',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        {showReadOnly ? 'Show All Books' : 'Show Read Only'}
      </button>

      {filteredBooks.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredBooks.map((book) => (
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

              {openAccordion === book.key && (
                <div style={{ marginTop: '10px', paddingLeft: '20px' }}>
                  <button
                    style={{ marginRight: '10px' }}
                    onClick={() => handleReadStatusChange(book.key, book.read)}
                  >
                    {book.read === 'y' ? 'Mark as Unread' : 'Mark as Read'}
                  </button>
                  <button
                    style={{ marginRight: '10px' }}
                    onClick={() => handleStartReading(book.key)}
                  >
                    Start Reading
                  </button>

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
