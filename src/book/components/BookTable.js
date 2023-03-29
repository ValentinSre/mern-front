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

  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (columnName) => {
    if (sortBy === columnName) {
      // If already sorted by this column, reverse the order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Otherwise, sort by this column in ascending order
      setSortBy(columnName);
      setSortOrder("asc");
    }
  };

  const sortedData = books.sort((a, b) => {
    if (sortBy) {
      // If a sort column is selected, sort by that column
      const aValue =
        a[sortBy] != null
          ? typeof a[sortBy] === "string"
            ? a[sortBy].toLowerCase()
            : a[sortBy]
          : "";
      const bValue =
        b[sortBy] != null
          ? typeof b[sortBy] === "string"
            ? b[sortBy].toLowerCase()
            : b[sortBy]
          : "";
      if (aValue === null && bValue === null) {
        return 0;
      } else if (aValue === null) {
        return sortOrder === "asc" ? 1 : -1;
      } else if (bValue === null) {
        return sortOrder === "asc" ? -1 : 1;
      } else if (aValue < bValue) {
        return sortOrder === "asc" ? -1 : 1;
      } else if (aValue > bValue) {
        return sortOrder === "asc" ? 1 : -1;
      }
    }
    // If no sort column is selected, maintain the original order
    return 0;
  });

  return (
    <div>
      {!loading && books && (
        <table className='book-table'>
          <thead>
            <tr>
              <th onClick={() => handleSort("serie")}>
                Série {sortBy === "serie" && (sortOrder === "asc" ? "⏶" : "⏷")}
              </th>
              <th onClick={() => handleSort("titre")}>
                Titre {sortBy === "titre" && (sortOrder === "asc" ? "⏶" : "⏷")}
              </th>
              <th onClick={() => handleSort("tome")}>
                Tome {sortBy === "tome" && (sortOrder === "asc" ? "⏶" : "⏷")}
              </th>
              {/* <th>Auteur</th>
              <th>Dessinateur</th> */}
              <th onClick={() => handleSort("editeur")}>
                Éditeur{" "}
                {sortBy === "editeur" && (sortOrder === "asc" ? "⏶" : "⏷")}
              </th>
              <th onClick={() => handleSort("format")}>
                Format{" "}
                {sortBy === "format" && (sortOrder === "asc" ? "⏶" : "⏷")}
              </th>
              <th onClick={() => handleSort("prix")}>
                Prix {sortBy === "prix" && (sortOrder === "asc" ? "⏶" : "⏷")}
              </th>
              {/* <th>Date de parution</th>
              <th>Genre</th> */}
              {auth.isLoggedIn && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((book) => (
              <tr key={book._id} onClick={() => handleViewBook(book)}>
                <td>{book.serie}</td>
                <td>{book.titre}</td>
                <td>{book.tome}</td>
                {/* <td>{book.auteur}</td>
                <td>{book.dessinateur}</td> */}
                <td>{book.editeur}</td>
                <td>{book.format}</td>
                <td>{book.prix}€</td>
                {/* <td>{new Date(book.date_parution).toLocaleDateString()}</td>
                <td>{book.genre}</td> */}
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
