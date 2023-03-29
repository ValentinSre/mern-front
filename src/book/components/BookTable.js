import React, { useContext, useState, useEffect } from "react";

import IconOnlyButton from "../../shared/components/UIElements/IconOnlyButton";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./BookTable.css";

const BookTable = ({ books: initialBooks, loading: initialLoading }) => {
  const auth = useContext(AuthContext);

  const [books, setBooks] = useState(initialBooks);
  const [loading, setLoading] = useState(initialLoading);

  const { sendRequest } = useHttpClient();

  const handleViewBook = (bookId) => {
    console.log(bookId);
  };

  const handleAddToList = async (bookId, listName) => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_API_URL + "/collection/add",
        "POST",
        JSON.stringify({
          id_book: bookId,
          id_user: auth.userId,
          list_name: listName,
          books,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      setBooks(responseData.books);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setBooks(initialBooks);
    setLoading(initialLoading);
  }, [initialBooks, initialLoading]);

  return (
    <div>
      {!loading && books && (
        <table className='book-table'>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Série</th>
              <th>Tome</th>
              <th>Auteur</th>
              <th>Dessinateur</th>
              <th>Éditeur</th>
              <th>Format</th>
              <th>Prix</th>
              <th>Date de parution</th>
              <th>Genre</th>
              {auth.isLoggedIn && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id} onClick={() => handleViewBook(book)}>
                <td>{book.titre}</td>
                <td>{book.serie}</td>
                <td>{book.tome}</td>
                <td>{book.auteur}</td>
                <td>{book.dessinateur}</td>
                <td>{book.editeur}</td>
                <td>{book.format}</td>
                <td>{book.prix}€</td>
                <td>{new Date(book.date_parution).toLocaleDateString()}</td>
                <td>{book.genre}</td>
                {auth.isLoggedIn && (
                  <td>
                    <div className='button-group'>
                      <IconOnlyButton
                        onClick={() => handleAddToList(book._id, "collection")}
                        collection
                        disabled={book.possede}
                        title='Ajouter à ma collection'
                      />
                      <IconOnlyButton
                        onClick={() => handleAddToList(book._id, "wishlist")}
                        wishlist
                        disabled={book.souhaite || book.possede}
                        title='Ajouter à ma wishlist'
                      />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookTable;
