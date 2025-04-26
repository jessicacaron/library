import React from 'react';

const ReadBooks = ({ books }) => {
  // Filter books with read property equal to 'y'
  const readBooks = books.filter(book => book.read === 'y');

  return (
    <div>
      <h2>Read Books</h2>
      {readBooks.length > 0 ? (
        <ul>
          {readBooks.map(book => (
            <li key={book.id}>
              <strong>{book.title}</strong> by {book.author} ({book.year}) - {book.genre}
            </li>
          ))}
        </ul>
      ) : (
        <p>No books have been marked as read.</p>
      )}
    </div>
  );
};

export default ReadBooks;
