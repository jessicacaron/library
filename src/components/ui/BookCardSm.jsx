import React, { useState } from 'react';

const BookCardSm = ({ book }) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    title,
    authors,
    publishedDate,
    pages,
    smCover,
    genre,
    format,
    notes,
    loaned,
    review,
    stars,
    dateAdded,
    dateStarted,
    dateFinished,
    read,
  } = book;

  return (
    <div className="sm-card-container">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer"
      >
    <div className="book-card-header" onClick={() => setIsOpen(!isOpen)}>
    <div className="title-with-arrow">
        <h2 className="book-title">{title || 'Untitled Book'}</h2>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
    </div>
        {smCover && (
            <img
            src={smCover}
            alt={title}
            className="book-thumbnail"
            />
        )}
    </div>

      </div>

      {isOpen && (
        <div className="mt-4 text-sm text-gray-700">
          <p><strong>Authors:</strong> {authors.join(', ') || 'N/A'}</p>
          <p><strong>Published:</strong> {publishedDate || 'Unknown'}</p>
          <p><strong>Pages:</strong> {pages}</p>
          <p><strong>Genre:</strong> {genre}</p>
          <p><strong>Format:</strong> {format}</p>
          <p><strong>Status:</strong> {read === 'y' ? 'Read' : 'Unread'}</p>
          <p><strong>Loaned:</strong> {loaned === 'y' ? 'Yes' : 'No'}</p>
          <p><strong>Stars:</strong> {'★'.repeat(stars) || 'Not rated'}</p>
          <p><strong>Notes:</strong> {notes || 'None'}</p>
          <p><strong>Review:</strong> {review || 'None'}</p>
          <p><strong>Date Added:</strong> {new Date(dateAdded).toLocaleDateString()}</p>
          <p><strong>Started:</strong> {new Date(dateStarted).toLocaleDateString()}</p>
          <p><strong>Finished:</strong> {new Date(dateFinished).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

export default BookCardSm;
