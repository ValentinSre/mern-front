import React from "react";

import "./BookTable.css";

const BookTable = ({ books, isLoading }) => {
  return (
    <div>
      {!isLoading && books && (
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
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookTable;
