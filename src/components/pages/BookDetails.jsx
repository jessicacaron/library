import { useLocation, useNavigate } from 'react-router-dom';

const BookDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { book } = location.state || {};

  if (!book) {
    return <p>No book data found.</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        &larr; Back
      </button>

      <h2>{book.title}</h2>
      <p><strong>Author(s):</strong> {Array.isArray(book.authors) ? book.authors.join(', ') : ''}</p>
      <p><strong>Genre:</strong> {book.genre}</p>
      <p><strong>Format:</strong> {book.format}</p>
      <p><strong>Status:</strong> {book.status === 'y' ? 'Read' : 'Unread'}</p>

      {book.smCover && (
        <div>
          <img src={book.smCover} alt={`Cover of ${book.title}`} style={{ maxWidth: '200px', margin: '20px 0' }} />
        </div>
      )}

      {book.document && (
        <div>
          <a href={book.document} target="_blank" rel="noopener noreferrer">
            View Document
          </a>
        </div>
      )}

      {book.dateStarted && <p><strong>Date Started:</strong> {book.dateStarted}</p>}
      {book.dateFinished && <p><strong>Date Finished:</strong> {book.dateFinished}</p>}

      {book.note && (
        <div style={{ marginTop: '20px' }}>
          <h3>Notes</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{book.note}</p>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
