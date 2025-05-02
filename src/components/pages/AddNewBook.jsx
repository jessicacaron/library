import React, { useState } from 'react';
import Modal from 'react-modal';
import { database } from '../../firebase';
import { ref, push } from 'firebase/database';


Modal.setAppElement('#root'); // Ensure this matches your app's root element

const AddNewBook = () => {
  const [query, setQuery] = useState('');
  const [queryType, setQueryType] = useState('');
  const [results, setResults] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [genre, setGenre] = useState('');
  const [format, setFormat] = useState('');
  const [status, setStatus] = useState('none');

  const searchBooks = async (searchTerm) => {
    try {
      const searchBy = queryType === 'author' ? 'inauthor' : 'intitle';
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchBy}:"${searchTerm}"&orderBy=relevance`
      );
      const data = await response.json();
      setResults(data.items || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  }; 

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 2) {
      searchBooks(value);
    } else {
      setResults([]);
    }
  };

  const openModal = (book) => {
    setSelectedBook(book);
    setGenre('');
    setStatus('none');
    setFormat('none');
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedBook(null);
  };

  const handleAddToLibrary = async () => {
    const newBook = {
        id: selectedBook.id,
        title: selectedBook.volumeInfo.title || '',
        authors: selectedBook.volumeInfo.authors || [],
        publishedDate: selectedBook.volumeInfo.publishedDate || '',
        pages: selectedBook.volumeInfo.pageCount || 0,
        smCover: selectedBook.volumeInfo.imageLinks?.smallThumbnail || '',
        lgCover: selectedBook.volumeInfo.imageLinks?.thumbnail || '',
        genre,
        status,
        format,
        notes: "",
        loaned: "n",
        review: "",
        stars: 0,
        dateAdded: new Date(),
        dateStarted: new Date(),
        dateFinished: new Date(),
        read: "n",
        description: selectedBook.volumeInfo.description || '',
      };
    // Implement the logic to save newBook to your library
    console.log('Book added to library:', newBook);
    try {
        const booksRef = ref(database, 'books');
        await push(booksRef, newBook);
        console.log('Book added to library:', newBook);
        closeModal();
      } catch (error) {
        console.error('Error adding book to library:', error);
      }
    closeModal();
  };
  

  return (
    <div>
      <h1>Search for New Books</h1>
      <p>Search by: 
      <select value={queryType} onChange={(e) => setQueryType(e.target.value)}>
        <option value="title">Title</option>
        <option value="author">Author</option>
      </select></p>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter book title"
      />
      <ul>
        {results.map((item) => (
          <li key={item.id}>
            <h3>{item.volumeInfo.title}</h3>
            <p>{item.volumeInfo.authors?.join(', ')}</p>
            <button onClick={() => openModal(item)}>Add to Library</button>
          </li>
        ))}
      </ul>

      {selectedBook && (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            shouldCloseOnOverlayClick={true}
            contentLabel="Add Book to Library"
        >
          <h2>{selectedBook.volumeInfo.title}</h2>
          <p>Authors: {selectedBook.volumeInfo.authors?.join(', ')}</p>
          {/* Display other book details as needed */}
          <form onSubmit={(e) => { e.preventDefault(); handleAddToLibrary(); }}>
            <label>
                Genre:
                <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
                >
                <option value="">Select genre</option>
                <option value="Romance">Romance</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Mystery">Mystery</option>
                <option value="Thriller">Thriller</option>
                <option value="Horror">Horror</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Action-Adventure">Action & Adventure</option>
                <option value="Dystopian">Dystopian</option>
                <option value="Travel">Travel</option>
                <option value="Religion">Religion</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Biography">Biography</option>
                <option value="True-Crime">True Crime</option>
                <option value="Self-Help">Self Help</option>
                <option value="Historical-Fiction">Historical Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                </select>
            </label>

            <label>
                Format:
                <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                required
                >
                <option value="">Select format</option>
                <option value="Physical">Physical</option>
                <option value="Ebook">Ebook</option>
                <option value="Audiobook">Audiobook</option>
                </select>
            </label>

            <button type="submit">Add to Library</button>
            <button type="button" onClick={closeModal}>Cancel</button>
            </form>
        </Modal>
      )}
    </div>
  );
};

export default AddNewBook;
