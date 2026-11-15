import React from "react";
import { Tooltip } from "@material-ui/core";

import makeTitle from "../../shared/util/makeTitle";

import "./DisplayBooksSerie.css";

const DisplayBooksSerie = ({ booksSerie, redirectPage }) => {
  if (!booksSerie || booksSerie.length === 0) return null;

  return (
    <section className='display-books-serie_container'>
      <h2>Autres livres de la série</h2>

      <div className='display-books-serie'>
        {booksSerie.map((book) => {
          const title = makeTitle(book);

          return (
            <button
              type='button'
              className='display-books-serie__book'
              key={book._id}
              onClick={() => redirectPage(book._id)}
              aria-label={`Voir ${title}`}
            >
              <Tooltip title={title} placement='top'>
                <div className='display-books-serie__cover'>
                  {book.image ? (
                    <img src={book.image} alt={`Couverture de ${title}`} />
                  ) : (
                    <div className='display-books-serie__cover-empty'>
                      Couverture indisponible
                    </div>
                  )}
                </div>
              </Tooltip>

              <span className='display-books-serie__title'>{title}</span>

              {book.tome !== undefined &&
                book.tome !== null &&
                book.tome !== "" && (
                  <span className='display-books-serie__volume'>
                    Tome {book.tome}
                  </span>
                )}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default DisplayBooksSerie;
