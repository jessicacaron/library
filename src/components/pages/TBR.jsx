import React, { useEffect, useState } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../../firebase';

const TBR = () => {
  const [tbrBooks, setTbrBooks] = useState([]);

  useEffect(() => {
    const booksRef = ref(database, 'books');
    const unsubscribe = onValue(booksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const booksArray = Object.entries(data).map(([key, book]) => ({
          key,
          ...book,
        }));
        const filtered = booksArray.filter(book => book.status === 'tbr');
        setTbrBooks(filtered);
      } else {
        setTbrBooks([]);
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const updateStatusToIP = async (bookKey) => {
    const bookRef = ref(database, `books/${bookKey}`);
    try {
      await update(bookRef, { status: 'ip' });
      console.log(`Status updated to "ip" for book ${bookKey}`);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  

  return (
    <div>
      <h1>To Be Read</h1>
      {tbrBooks.length === 0 ? (
        <p>No books in your TBR list.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tbrBooks.map((book) => (
            <li key={book.key} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <h3>{book.title}</h3>
              {book.authors && <p>by {book.authors.join(', ')}</p>}
              {book.smCover && <img src={book.smCover} alt={book.title} style={{ maxWidth: '100px' }} />}
              <button onClick={() => updateStatusToIP(book.key)}>Start Reading</button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TBR;
