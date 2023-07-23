import React from "react";
import { Tooltip } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import makeTitle from "../../shared/util/makeTitle";

import "./DisplayBooksSerie.css";

const DisplayBooksSerie = ({ booksSerie, redirectPage }) => {
  return (
    <div className='display-books-serie_container'>
      <h2>Autres livres de la série</h2>
      <div className='display-books-serie'>
        {booksSerie.map((book) => (
          <div
            className='bookSerie'
            key={book._id}
            className='display-books-serie__book'
            onClick={() => {
              redirectPage(book._id);
            }}
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
