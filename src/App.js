import React from 'react';
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
import BookList from './components/pages/Booklist';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/booklist" element={<Booklist />} />
          <Route path="/in-progress" element={<InProgress />} />
          <Route path="/loaned" element={<Loaned />} />
          <Route path="/login" element={<Login />} />
          <Route path="/read" element={<ReadBooks />} />
          <Route path="/tbr" element={<TBR />} />
          <Route path="/wish-list" element={<WishLIst />} />
          <Route path="/add" element={<AddNewBook />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/" element={<BookList />} />
          <Route path="/book/:id" element={<BookDetails />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
