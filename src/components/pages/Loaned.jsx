import React from 'react';

const Loaned = ({ books }) => {
  // Filter books with status 'Loaned'
  const loanedBooks = books.filter(book => book.status === 'Loaned');

  return (
    <div>
      <h2>Loaned Books</h2>
      {loanedBooks.length > 0 ? (
        <ul>
          {loanedBooks.map(book => (
            <li key={book.id}>
              <strong>{book.title}</strong> by {book.author} ({book.year}) - {book.genre}
            </li>
          ))}
        </ul>
      ) : (
        <p>No books are currently loaned out.</p>
      )}
    </div>
  );
};

export default Loaned;
