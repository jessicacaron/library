import React from 'react';
import BookCardLg from '../ui/BookCardLg';

const Home = ({ books }) => {
  // Ensure books is always an array
  const validBooks = Array.isArray(books) ? books : [];

  const upcomingReleases = validBooks
    .filter(book => new Date(book.releaseDate) > new Date())
    .sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate))
    .slice(0, 4);

  const inProgressBooks = validBooks.filter(book => book.read === 'ip');

  const recentlyCompletedBooks = validBooks
    .filter(book => book.read === 'y')
    .sort((a, b) => new Date(b.finishDate) - new Date(a.finishDate))
    .slice(0, 3);

  return (
    <div>
      <p>Total Pages: {validBooks.reduce((sum, book) => sum + (book.pages || 0), 0)}</p>
      <p>Total Books: {validBooks.length}</p>

      <hr />
      <h2>Upcoming Releases</h2>
      <button>New</button>
      <div className="card-container">
        {upcomingReleases.map(book => (
          <BookCardLg key={book.id} book={book} />
        ))}
      </div>

      <h2>In-Progress Books</h2>
      <div className="card-container">
        {inProgressBooks.map(book => (
          <BookCardLg key={book.id} book={book} />
        ))}
      </div>

      <h2>Recently Completed Books</h2>
      <div className="card-container">
        {recentlyCompletedBooks.map(book => (
          <BookCardLg key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Home;