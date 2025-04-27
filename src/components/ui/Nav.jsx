import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Nav.css";
// import { useSearch } from "../../context/SearchContext";

const Nav = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  // const { searchTerm, setSearchTerm } = useSearch();
  // const [searchSubmitted, setSearchSubmitted] = useState(false);

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     setSearchSubmitted(true);
  //   }
  // };

  // const filteredBooks = books.filter((book) =>
  //   book.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Book List", path: "/booklist" },
    { label: "In Progress", path: "/in-progress" },
    { label: "Loaned", path: "/loaned" },
    { label: "Read Books", path: "/read" },
    { label: "TBR List", path: "/tbr" },
    { label: "Wish List", path: "/wish-list" },
    { label: "Add New", path: "/add" },
  ];

  return (
    <nav className="nav-container">
      <div className="nav-top">
        {!menuOpen && (
          <button className="hamburger" onClick={handleMenuToggle}>
            <i className="fas fa-bars"></i>
          </button>
        )}
        {/* <div className="search">
            <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSearchSubmitted(false); // reset on typing
                }}
                onKeyDown={handleKeyDown}
                className="search-input"
            />

            {searchSubmitted && (
            <ul className="search-results">
                {filteredBooks.length > 0 ? (
                filteredBooks.slice(0, 5).map((book) => (
                    <li key={book.id} className="search-item">
                    {book.title}
                    </li>
                ))
                ) : (
                <li className="search-item no-results">No results found</li>
                )}
            </ul>
            )}
        </div> */}
      </div>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        {menuOpen && (
          <button className="close-btn" onClick={handleMenuToggle}>
            <i className="fas fa-times"></i>
          </button>
        )}
        {navItems.map(({ label, path }) => (
          <li key={path} className={location.pathname === path ? "active" : ""}>
            <a href={path}>{label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
