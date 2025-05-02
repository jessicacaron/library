import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { ref, push, update } from 'firebase/database';
import { database } from '../../firebase';
import { remove } from 'firebase/database';

import BookCardLg from '../ui/BookCardLg';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';


Modal.setAppElement('#root');

const Home = () => {
  const [books, setBooks] = useState([]);
  const [upcomingBooks, setUpcomingBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', releaseDate: '', author: '', series: '' });
  const [editingBook, setEditingBook] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [booksRead2025, setBooksRead2025] = useState(0);
  const [pagesRead2025, setPagesRead2025] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [summaryTab, setSummaryTab] = useState('yearly');

  const DATABASE_URL = 'https://library-db1a2-default-rtdb.firebaseio.com';

  // Fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${DATABASE_URL}/books.json`);
        const data = res.data;
        if (!data) return setBooks([]);
  
        const booksList = Object.entries(data).map(([key, book]) => ({ key, ...book }));
        setBooks(booksList);
  
        const readIn2025 = booksList.filter(
          (b) => b.read === 'y' && b.dateFinished && new Date(b.dateFinished).getFullYear() === 2025
        );
  
        setBooksRead2025(readIn2025.length);
        setPagesRead2025(readIn2025.reduce((sum, b) => sum + (+b.pages || 0), 0));
  
        // 📆 Monthly stats
        const monthly = Array.from({ length: 12 }, (_, i) => {
          const booksThisMonth = readIn2025.filter(
            (b) => new Date(b.dateFinished).getMonth() === i
          );
  
          const totalBooks = booksThisMonth.length;
          const totalPages = booksThisMonth.reduce(
            (sum, b) => sum + (+b.pages || 0),
            0
          );
  
          return {
            month: new Date(0, i).toLocaleString('default', { month: 'long' }),
            totalBooks,
            totalPages,
          };
        });
  
        setMonthlyStats(monthly); // Don't forget to declare this state
      } catch (err) {
        console.error('Error fetching books:', err);
      }
    };
  
    fetchBooks();
  }, []);

  // Fetch upcoming releases
  const fetchUpcomingBooks = async () => {
    try {
      const res = await axios.get(`${DATABASE_URL}/upcomingBooks.json`);
      const data = res.data;
      const releases = data ? Object.entries(data).map(([key, book]) => ({ key, ...book })) : [];
      setUpcomingBooks(releases);
    } catch (err) {
      console.error('Error fetching upcoming books:', err);
    }
  };

  useEffect(() => {
    fetchUpcomingBooks();
  }, []);

  // Derived lists
  const inProgressBooks = books.filter((b) => b.status === 'ip');
  const recentlyCompletedBooks = books
    .filter((b) => b.read === 'y')
    .sort((a, b) => new Date(b.finishDate) - new Date(a.finishDate))
    .slice(0, 3);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBook = async () => {
    const { title, releaseDate, author, series } = newBook;
    if (!title || !releaseDate || !author || !series) return alert('Please fill all fields!');
    try {
      await push(ref(database, 'upcomingBooks'), { title, releaseDate, author, series });
      setModalIsOpen(false);
      resetForm();
      fetchUpcomingBooks();
    } catch (err) {
      console.error('Error adding book:', err);
    }
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
    setNewBook(book);
    setEditModalIsOpen(true);
  };

  const handleUpdateBook = async () => {
    if (!editingBook) return;
    const { title, releaseDate, author, series } = newBook;
    try {
      await update(ref(database, `upcomingBooks/${editingBook.key}`), {
        title, releaseDate, author, series,
      });
      setEditModalIsOpen(false);
      resetForm();
      fetchUpcomingBooks();
    } catch (err) {
      console.error('Error updating book:', err);
    }
  };

  const resetForm = () => {
    setNewBook({ title: '', releaseDate: '', author: '', series: '' });
    setEditingBook(null);
  };

  const renderBookForm = (onSubmit, actionLabel) => (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <label>
        Title:
        <input type="text" name="title" value={newBook.title} onChange={handleInputChange} required />
      </label>
      <label>
        Release Date:
        <input type="date" name="releaseDate" value={newBook.releaseDate} onChange={handleInputChange} required />
      </label>
      <label>
        Author:
        <input type="text" name="author" value={newBook.author} onChange={handleInputChange} required />
      </label>
      <label>
        Series:
        <input type="text" name="series" value={newBook.series} onChange={handleInputChange} required />
      </label>
      <button type="submit">{actionLabel}</button>
      <button type="button" onClick={() => {
        onSubmit === handleAddBook ? setModalIsOpen(false) : setEditModalIsOpen(false);
        resetForm();
      }}>
        Cancel
      </button>
    </form>
  );

  const getCountdownString = (releaseDate) => {
    const release = new Date(releaseDate);
    const now = new Date();
    const diff = release - now;
  
    if (diff <= 0) return 'Released!';
  
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} `; // Pluralize "day" if more than 1 -- day${days !== 1 ? 's' : ''}
  };
  
  const handleDelete = async (bookKey) => {
    try {
      const bookRef = ref(database, `upcomingBooks/${bookKey}`);
      await remove(bookRef); // Use `remove` to delete the book from Firebase
      console.log('Book deleted!');
      fetchUpcomingBooks(); // Fetch updated list of releases after deletion
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };
  

  return (
    <div className='home-container'>
      <h2>2025 Reading Summary</h2>
      <div className="tab-buttons">
        <button
          className={`tab-button ${summaryTab === 'yearly' ? 'active' : ''}`}
          onClick={() => setSummaryTab('yearly')}
        >
          Yearly
        </button>
        <button
          className={`tab-button ${summaryTab === 'monthly' ? 'active' : ''}`}
          onClick={() => setSummaryTab('monthly')}
        >
          Monthly
        </button>
      </div>
      <hr className='tab-hr'/>

      {summaryTab === 'yearly' ? (
        <>
          <p>Total Books Read: {booksRead2025}</p>
          <p>Total Pages Read: {pagesRead2025}</p>
        </>
      ) : (
        <>
          <div className="chart-container">
            <h3>Books Read per Month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyStats}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="totalBooks" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Pages Read per Month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyStats}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="totalPages" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            {monthlyStats.map((month) => (
              <div key={month.month}>
                <strong>{month.month}:</strong> {month.totalBooks} books, {month.totalPages} pages
              </div>
            ))}
          </div>
        </>
      )}

      <hr />
      <div className='new-releases-container'>
        <h2>Upcoming Releases</h2>
        <p>Track New Book</p>
        <button onClick={() => setModalIsOpen(true)}><i class="fas fa-plus"></i></button>
        <div className="">
          {upcomingBooks.map((book) => {
            const countdown = getCountdownString(book.releaseDate); // Get countdown
            return (
              <div key={book.key} className="countdown-card">
                <BookCardLg book={book} />
                
                <div className="countdown-wrapper">
                  <p className="countdown-card-numbers">{countdown}</p>
                  <p className="countdown-label">day(s)</p>
                </div>

                <button onClick={() => handleEditClick(book)}>
                  <i className="far fa-edit"></i>
                </button>
                <button onClick={() => handleDelete(book.key)}>
                  <i className="far fa-trash-alt"></i>
                </button>
              </div>

            );
          })}
        </div>
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

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Add Book">
        <h2>Add New Upcoming Book</h2>
        {renderBookForm(handleAddBook, 'Add Book')}
      </Modal>

      <Modal isOpen={editModalIsOpen} onRequestClose={() => setEditModalIsOpen(false)} contentLabel="Edit Book">
        <h2>Edit Upcoming Book</h2>
        {renderBookForm(handleUpdateBook, 'Update Book')}
      </Modal>
    </div>
  );
};

export default Home;
