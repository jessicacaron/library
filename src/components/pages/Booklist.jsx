import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    genre: '',
    format: '',
    status: '',
  });

  const DATABASE_URL = 'https://library-db1a2-default-rtdb.firebaseio.com';

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
          setBooks(bookArray);
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (key) => {
    try {
      await axios.delete(`${DATABASE_URL}/books/${key}.json`);
      setBooks((prevBooks) => prevBooks.filter((book) => book.key !== key));
      console.log(`Book with key ${key} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleEditClick = (book) => {
    setEditingKey(book.key);
    setFormData({
      title: book.title,
      authors: Array.isArray(book.authors) ? book.authors.join(', ') : '',
      genre: book.genre || '',
      format: book.format || '',
      status: book.status || '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedBook = {
        ...formData,
        authors: formData.authors
          .split(',')
          .map((author) => author.trim())
          .filter((author) => author),
      };
      await axios.patch(`${DATABASE_URL}/books/${editingKey}.json`, updatedBook);
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.key === editingKey ? { ...book, ...updatedBook } : book
        )
      );
      console.log(`Book with key ${editingKey} updated successfully.`);
      setEditingKey(null);
      setFormData({
        title: '',
        authors: '',
        genre: '',
        format: '',
        status: '',
      });
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  return (
    <div>
      <h1>Your Library</h1>
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.key}>
              {editingKey === book.key ? (
                <form onSubmit={handleUpdate}>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    required
                  />
                  <input
                    type="text"
                    name="authors"
                    value={formData.authors}
                    onChange={handleInputChange}
                    placeholder="Authors (comma-separated)"
                    required
                  />
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    placeholder="Genre"
                  />
                  <input
                    type="text"
                    name="format"
                    value={formData.format}
                    onChange={handleInputChange}
                    placeholder="Format"
                  />
                  <input
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    placeholder="Status"
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingKey(null)}>
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <h3>{book.title}</h3>
                  <p>Author(s): {Array.isArray(book.authors) ? book.authors.join(', ') : ''}</p>
                  <p>Genre: {book.genre}</p>
                  <p>Format: {book.format}</p>
                  <p>Status: {book.status}</p>
                  {book.smCover && (
                    <img src={book.smCover} alt={`Cover of ${book.title}`} />
                  )}
                  <br />
                  <button onClick={() => handleEditClick(book)}>Edit</button>
                  <button onClick={() => handleDelete(book.key)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookList;









// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const BookList = () => {
//   const [books, setBooks] = useState([]);
//   const [editingBook, setEditingBook] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     authors: '',
//     genre: '',
//     format: '',
//     status: '',
//   });

//   // Set your Firebase Realtime Database URL
//   const DATABASE_URL = 'https://library-db1a2-default-rtdb.firebaseio.com';

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const response = await axios.get(`${DATABASE_URL}/books.json`);
//         const data = response.data;
//         if (data) {
//           const bookArray = Object.entries(data).map(([id, book]) => ({
//             id,
//             ...book,
//           }));
//           setBooks(bookArray);
//         } else {
//           setBooks([]);
//         }
//       } catch (error) {
//         console.error('Error fetching books:', error);
//       }
//     };

//     fetchBooks();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${DATABASE_URL}/books/${id}.json`);
//       setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
//       console.log(`Book with ID ${id} deleted successfully.`);
//     } catch (error) {
//       console.error('Error deleting book:', error);
//     }
//   };

//   const handleEditClick = (book) => {
//     setEditingBook(book.id);
//     setFormData({
//       title: book.title,
//       authors: book.authors.join(', '),
//       genre: book.genre,
//       format: book.format,
//       status: book.status,
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const updatedBook = {
//         ...formData,
//         authors: formData.authors.split(',').map((author) => author.trim()),
//       };
//       await axios.patch(`${DATABASE_URL}/books/${editingBook}.json`, updatedBook);
//       setBooks((prevBooks) =>
//         prevBooks.map((book) =>
//           book.id === editingBook ? { ...book, ...updatedBook } : book
//         )
//       );
//       console.log(`Book with ID ${editingBook} updated successfully.`);
//       setEditingBook(null);
//       setFormData({
//         title: '',
//         authors: '',
//         genre: '',
//         format: '',
//         status: '',
//       });
//     } catch (error) {
//       console.error('Error updating book:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Your Library</h1>
//       {books.length === 0 ? (
//         <p>No books found.</p>
//       ) : (
//         <ul>
//           {books.map((book) => (
//             <li key={book.key}>
//               {editingBook === book.key ? (
//                 <form onSubmit={handleUpdate}>
//                   <input
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     placeholder="Title"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="authors"
//                     value={formData.authors}
//                     onChange={handleInputChange}
//                     placeholder="Authors (comma-separated)"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="genre"
//                     value={formData.genre}
//                     onChange={handleInputChange}
//                     placeholder="Genre"
//                   />
//                   <input
//                     type="text"
//                     name="format"
//                     value={formData.format}
//                     onChange={handleInputChange}
//                     placeholder="Format"
//                   />
//                   <input
//                     type="text"
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     placeholder="Status"
//                   />
//                   <button type="submit">Save</button>
//                   <button type="button" onClick={() => setEditingBook(null)}>
//                     Cancel
//                   </button>
//                 </form>
//               ) : (
//                 <>
//                   <h3>{book.title}</h3>
//                   <p>Author(s): {book.authors?.join(', ')}</p>
//                   <p>Genre: {book.genre}</p>
//                   <p>Format: {book.format}</p>
//                   <p>Status: {book.status}</p>
//                   {book.smCover && (
//                     <img src={book.smCover} alt={`Cover of ${book.title}`} />
//                   )}
//                   <br />
//                   <button onClick={() => handleEditClick(book)}>Edit</button>
//                   <button onClick={() => handleDelete(book.id)}>Delete</button>
//                 </>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default BookList;






// import React, { useEffect, useState } from 'react';
// import { database } from '../../firebase';
// import { ref, onValue, remove, update } from 'firebase/database';
// import axios from 'axios';

// const BookList = () => {
//   const [books, setBooks] = useState([]);
//   const [editingBook, setEditingBook] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     authors: '',
//     genre: '',
//     format: '',
//     status: '',
//   });

//   useEffect(() => {
//     const booksRef = ref(database, 'books');
//     const unsubscribe = onValue(booksRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const bookArray = Object.entries(data).map(([id, book]) => ({
//           id,
//           ...book,
//         }));
//         setBooks(bookArray);
//       } else {
//         setBooks([]);
//       }
//     });
  
//     return () => unsubscribe(); // Detach listener on unmount
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await remove(ref(database, `/books/${id}`));
//       setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
//       console.log(`Book with ID ${id} deleted successfully.`);
//     } catch (error) {
//       console.error('Error deleting book:', error);
//     }
//   };

//   const handleEditClick = (book) => {
//     setEditingBook(book.id);
//     setFormData({
//       title: book.title,
//       authors: book.authors.join(', '),
//       genre: book.genre,
//       format: book.format,
//       status: book.status,
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const updatedBook = {
//         ...formData,
//         authors: formData.authors.split(',').map((author) => author.trim()),
//       };
//       await update(ref(database, `books/${editingBook}`), updatedBook);
//       console.log(`Book with ID ${editingBook} updated successfully.`);
//       setEditingBook(null);
//       setFormData({
//         title: '',
//         authors: '',
//         genre: '',
//         format: '',
//         status: '',
//       });
//     } catch (error) {
//       console.error('Error updating book:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Your Library</h1>
//       {books.length === 0 ? (
//         <p>No books found.</p>
//       ) : (
//         <ul>
//           {books.map((book) => (
//             <li key={book.id}>
//               {editingBook === book.id ? (
//                 <form onSubmit={handleUpdate}>
//                   <input
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     placeholder="Title"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="authors"
//                     value={formData.authors}
//                     onChange={handleInputChange}
//                     placeholder="Authors (comma-separated)"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="genre"
//                     value={formData.genre}
//                     onChange={handleInputChange}
//                     placeholder="Genre"
//                   />
//                   <input
//                     type="text"
//                     name="format"
//                     value={formData.format}
//                     onChange={handleInputChange}
//                     placeholder="Format"
//                   />
//                   <input
//                     type="text"
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     placeholder="Status"
//                   />
//                   <button type="submit">Save</button>
//                   <button type="button" onClick={() => setEditingBook(null)}>
//                     Cancel
//                   </button>
//                 </form>
//               ) : (
//                 <>
//                   <h3>{book.title}</h3>
//                   <p>Author(s): {book.authors?.join(', ')}</p>
//                   <p>Genre: {book.genre}</p>
//                   <p>Format: {book.format}</p>
//                   <p>Status: {book.status}</p>
//                   <img src={book.smCover} alt={`Cover of ${book.title}`} />
//                   <br />
//                   <button onClick={() => handleEditClick(book)}>Edit</button>
//                   <button onClick={() => handleDelete(book.id)}>Delete</button>
//                 </>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default BookList;


