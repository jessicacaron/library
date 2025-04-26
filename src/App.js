import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from './components/ui/Layout';
import Home from './components/pages/Home';
import Booklist from './components/pages/Booklist';
import InProgress from './components/pages/InProgress';
import Loaned from './components/pages/Loaned';
import Login from './components/pages/Login';
import ReadBooks from './components/pages/ReadBooks';
import TBR from './components/pages/TBR';
import WishLIst from './components/pages/WishLIst';
import AddNewBook from './components/pages/AddNewBook';
import BookDetails from './components/pages/BookDetails';
import BookForm from './components/pages/BookForm';

function App() {
  const [books] = useState([
    {
      "id": "1",
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "country": "United States",
      "language": "English",
      "year": 1960,
      "pages": 281,
      "imageLink": "https://example.com/to-kill-a-mockingbird.jpg",
      "genre": "Horror",
      "status": "Loaned",
      "read": "y"
    },
    {
      "id": "2",
      "title": "1984",
      "author": "George Orwell",
      "country": "United Kingdom",
      "language": "English",
      "year": 1949,
      "pages": 328,
      "imageLink": "https://example.com/1984.jpg",
      "genre": "Horror",
      "status": "None",
      "read": "y",
      "date-added": "",
      "date-completed": "",
      "format": "Hardcover"
    },
    {
      "id": "3",
      "title": "Pride and Prejudice",
      "author": "Jane Austen",
      "country": "United Kingdom",
      "language": "English",
      "year": 1813,
      "pages": 279,
      "imageLink": "https://example.com/pride-and-prejudice.jpg",
      "genre": "Romance",
      "status": "None",
      "read": "ip",
      "date-added": "",
      "date-completed": "",
      "format": "Audiobook"
    },
    {
      "id": "4",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "country": "United States",
      "language": "English",
      "year": 1925,
      "pages": 180,
      "imageLink": "https://example.com/the-great-gatsby.jpg",
      "genre": "Adventure",
      "status": "Wish",
      "read": "n",
      "date-added": "",
      "date-completed": "",
      "format": "Paperback"
    }
    // Add more book objects as needed
  ]);

  return (
    <Router>
      <Routes>
        <Route element={<Layout books={books} />}>
          <Route path="/" element={<Home books={books} />} />
          <Route path="/booklist" element={<Booklist books={books}/>} />
          <Route path="/in-progress" element={<InProgress />} />
          <Route path="/loaned" element={<Loaned books={books}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/read" element={<ReadBooks books={books} />} />
          <Route path="/tbr" element={<TBR books={books} />} />
          <Route path="/wish-list" element={<WishLIst books={books} />} />
          <Route path="/add" element={<AddNewBook />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/bookform" element={<BookForm />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
