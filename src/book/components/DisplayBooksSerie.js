import React from "react";
import { Tooltip } from "@material-ui/core";

import makeTitle from "../../shared/util/makeTitle";

import "./DisplayBooksSerie.css";

const DisplayBooksSerie = ({ booksSerie }) => {
  return (
    <div className='display-books-serie_container'>
      <h2>Autres livres de la série</h2>
      <div className='display-books-serie'>
        {booksSerie.map((book) => (
          <div
            className='bookSerie'
            key={book.id}
            className='display-books-serie__book'
          >
            <Tooltip title={makeTitle(book)} placement='top'>
              <img src={book.image} alt={book.titre} />
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayBooksSerie;
