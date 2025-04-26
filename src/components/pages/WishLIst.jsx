import React from 'react';

const WishLIst = ({ books }) => {
  // Filter books with status 'Wish'
  const wishBooks = books.filter(book => book.status === 'Wish');

  return (
    <div>
      <h2>Wish List</h2>
      {wishBooks.length > 0 ? (
        <ul>
          {wishBooks.map(book => (
            <li key={book.id}>
              <strong>{book.title}</strong> by {book.author} ({book.year}) - {book.genre}
            </li>
          ))}
        </ul>
      ) : (
        <p>No books in your wish list.</p>
      )}
    </div>
  );
};

export default WishLIst;
