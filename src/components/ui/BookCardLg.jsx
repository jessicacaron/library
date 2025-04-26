import React from 'react'

const BookCardLg = ({book}) => {
  const { title, author, year, genre, coverImage, description } = book;

  return (
    <div className={'book-card'}>
      {coverImage && (
        <img src={coverImage} alt={`${title} cover`} className="book-card-image" />
      )}
      <div className="book-card-body">
        <h3 className="book-card-title">{title}</h3>
        <p className="book-card-author">by {author}</p>
        <p className="book-card-year">{year}</p>
        <p className="book-card-genre">{genre}</p>
        {description && <p className="book-card-description">{description}</p>}
      </div>
    </div>
  );
}

export default BookCardLg