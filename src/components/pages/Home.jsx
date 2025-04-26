import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCardLg from '../ui/BookCardLg';
import Modal from 'react-modal';
import { ref, push, update } from 'firebase/database';
import { database } from '../../firebase'; // Adjust import path based on your project structure

Modal.setAppElement('#root');

const Home = () => {
  const [books, setBooks] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    releaseDate: '',
    author: '',
    series: '',
  });
  const [editingBook, setEditingBook] = useState(null);
  
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  const DATABASE_URL = 'https://library-db1a2-default-rtdb.firebaseio.com';

  // Fetch books data
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
          setBooks(bookArray); // Update state with books data
        } else {
          setBooks([]); // If no data, set an empty array
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        setBooks([]); // If error, set an empty array
      }
    };

    fetchBooks(); // Call fetchBooks when component mounts
  }, []); // Empty dependency array ensures it only runs once on mount

  // Fetch upcoming releases data
  const fetchReleases = async () => {
    try {
      const response = await axios.get(`${DATABASE_URL}/upcomingBooks.json`);
      const data = response.data;
      if (data) {
        const bookArray = Object.entries(data).map(([key, book]) => ({
          key,
          ...book,
        }));
        setNewReleases(bookArray); // Update state with upcoming books data
      } else {
        setNewReleases([]); // If no data, set an empty array
      }
    } catch (error) {
      console.error('Error fetching upcoming books:', error);
      setNewReleases([]); // If error, set an empty array
    }
  };

  useEffect(() => {
    fetchReleases(); // Fetch upcoming books when component mounts
  }, []); // Empty dependency array ensures it only runs once on mount

  // Ensure books is always an array
  const validBooks = Array.isArray(books) ? books : [];
  
  // Ensure upcoming releases are always an array
  const validUpcomingReleases = Array.isArray(newReleases) ? newReleases : [];

  const inProgressBooks = validBooks.filter(book => book.status === 'ip');

  const recentlyCompletedBooks = validBooks
    .filter(book => book.read === 'y')
    .sort((a, b) => new Date(b.finishDate) - new Date(a.finishDate))
    .slice(0, 3);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const handleAddNewBook = async () => {
    const { title, releaseDate, author, series } = newBook;
    if (title && releaseDate && author && series) {
      try {
        const newBookRef = ref(database, 'upcomingBooks');
        await push(newBookRef, {
          title,
          releaseDate,
          author,
          series,
        });
        console.log('New upcoming book added!');
        setModalIsOpen(false); // Close the modal after adding the book
        setNewBook({ title: '', releaseDate: '', author: '', series: '' }); // Reset form

        // Refresh the upcoming releases after adding the new book
        fetchReleases();
      } catch (error) {
        console.error('Error adding new book:', error);
      }
    } else {
      alert('Please fill all fields!');
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book); // Set the book to be edited
    setNewBook({
      title: book.title,
      releaseDate: book.releaseDate,
      author: book.author,
      series: book.series,
    });
    setEditModalIsOpen(true); // Open the edit modal
  };

  const handleUpdateBook = async () => {
    if (editingBook) {
      const { title, releaseDate, author, series } = newBook;
      try {
        const bookRef = ref(database, `upcomingBooks/${editingBook.key}`);
        await update(bookRef, {
          title,
          releaseDate,
          author,
          series,
        });
        console.log('Upcoming book updated!');
        setEditModalIsOpen(false); // Close the modal after updating
        setNewBook({ title: '', releaseDate: '', author: '', series: '' }); // Reset form

        // Refresh the upcoming releases after updating the book
        fetchReleases();
      } catch (error) {
        console.error('Error updating book:', error);
      }
    }
  };

  return (
    <div>
      <p>Total Pages: {validBooks.reduce((sum, book) => sum + (book.pages || 0), 0)}</p>
      <p>Total Books: {validBooks.length}</p>

      <hr />
      <h2>Upcoming Releases</h2>
      <button onClick={() => setModalIsOpen(true)}>New</button>
      <div className="card-container">
        {validUpcomingReleases.map((book) => (
          <div key={book.key}>
            <BookCardLg book={book} />
            <button onClick={() => handleEditBook(book)}>Edit</button>
          </div>
        ))}
      </div>

      <h2>In-Progress Books</h2>
      <div className="card-container">
        {inProgressBooks.map((book) => (
          <BookCardLg key={book.key} book={book} />
        ))}
      </div>

      <h2>Recently Completed Books</h2>
      <div className="card-container">
        {recentlyCompletedBooks.map((book) => (
          <BookCardLg key={book.key} book={book} />
        ))}
      </div>

      {/* Modal for Adding New Book */}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Add New Upcoming Book">
        <h2>Add New Upcoming Book</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleAddNewBook(); }}>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={newBook.title}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Release Date:
            <input
              type="date"
              name="releaseDate"
              value={newBook.releaseDate}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Author:
            <input
              type="text"
              name="author"
              value={newBook.author}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Series:
            <input
              type="text"
              name="series"
              value={newBook.series}
              onChange={handleInputChange}
              required
            />
          </label>

          <button type="submit">Add Book</button>
          <button type="button" onClick={() => setModalIsOpen(false)}>Cancel</button>
        </form>
      </Modal>

      {/* Modal for Editing an Upcoming Book */}
      <Modal isOpen={editModalIsOpen} onRequestClose={() => setEditModalIsOpen(false)} contentLabel="Edit Upcoming Book">
        <h2>Edit Upcoming Book</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateBook(); }}>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={newBook.title}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Release Date:
            <input
              type="date"
              name="releaseDate"
              value={newBook.releaseDate}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Author:
            <input
              type="text"
              name="author"
              value={newBook.author}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Series:
            <input
              type="text"
              name="series"
              value={newBook.series}
              onChange={handleInputChange}
              required
            />
          </label>

          <button type="submit">Update Book</button>
          <button type="button" onClick={() => setEditModalIsOpen(false)}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default Home;
