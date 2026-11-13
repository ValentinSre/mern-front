import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import makeTitle from "../../shared/util/makeTitle";

import "./ArtistBooks.css";

const ArtistBooks = () => {
  const history = useHistory();
  const { id: artistId } = useParams();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [books, setBooks] = useState([]);
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/book/artist/${artistId}`,
        );

        setBooks(responseData.books || []);
        setArtist(responseData.artist);
      } catch (err) {}
    };

    fetchBooks();
  }, [sendRequest, artistId]);

  return (
    <div className='artist-books'>
      <ErrorModal error={error} onClear={clearError} />

      {isLoading && (
        <div className='artist-books__loading'>
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && artist && (
        <>
          <header className='artist-books__header'>
            <button
              type='button'
              className='artist-books__back'
              onClick={() => history.goBack()}
            >
              <span aria-hidden='true'>←</span>
              Retour
            </button>

            <div className='artist-books__heading'>
              <span className='artist-books__eyebrow'>CATALOGUE / ARTISTE</span>

              <h1>{artist.nom}</h1>

              <p>
                {books.length} album{books.length > 1 ? "s" : ""} dans le
                catalogue
              </p>
            </div>

            <span className='artist-books__count'>
              {books.length} résultat{books.length > 1 ? "s" : ""}
            </span>
          </header>

          {books.length > 0 ? (
            <section className='artist-books__section'>
              <div className='artist-books__grid'>
                {books.map((book) => (
                  <button
                    type='button'
                    key={book._id}
                    className='artist-books__book'
                    title={makeTitle(book)}
                    onClick={() => history.push(`/book/${book._id}`)}
                  >
                    <div className='artist-books__cover'>
                      <img src={book.image} alt={book.titre} loading='lazy' />
                    </div>

                    <div className='artist-books__book-info'>
                      <span className='artist-books__book-title'>
                        {book.titre}
                      </span>

                      {book.serie && (
                        <span className='artist-books__book-series'>
                          {book.serie}
                          {book.tome ? ` · Tome ${book.tome}` : ""}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <div className='artist-books__empty'>
              <div className='artist-books__empty-icon'>📚</div>
              <h2>Aucun album trouvé</h2>
              <p>
                Aucun album associé à cet artiste n'est présent dans le
                catalogue.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ArtistBooks;
