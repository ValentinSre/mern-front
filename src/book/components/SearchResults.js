import React from "react";
import { useHistory } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { ArrowForward, BookOutlined, PersonOutline } from "@material-ui/icons";
import makeTitle from "../../shared/util/makeTitle";

import "./SearchResults.css";

const DisplayResultCategory = ({ titles, artists }) => {
  if (titles) {
    const count = titles.length;
    return `${count} ${count > 1 ? "albums" : "album"} correspondant à la recherche`;
  }

  if (artists) {
    const count = artists.length;
    return `${count} ${count > 1 ? "artistes" : "artiste"} correspondant à la recherche`;
  }

  return "";
};

const DisplayBooksByTitle = ({ titles }) => {
  const history = useHistory();

  return (
    <div className='results-display__books'>
      {titles.map((book) => (
        <button
          key={book.id || book._id}
          type='button'
          className='results-display__book'
          onClick={() => history.push(`/book/${book._id}`)}
          title={makeTitle(book)}
        >
          <div className='results-display__book-cover'>
            <img src={book.image} alt={book.titre} loading='lazy' />
          </div>

          <div className='results-display__book-info'>
            <span className='results-display__book-title'>{book.titre}</span>
            {book.serie && (
              <span className='results-display__book-series'>
                {book.serie}
                {book.tome ? ` · Tome ${book.tome}` : ""}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

const SearchResults = ({ titles = [], artists = [] }) => {
  const history = useHistory();
  const totalResults = titles.length + artists.length;

  return (
    <main className='search-results'>
      <header className='search-results__header'>
        <div>
          <span className='search-results__eyebrow'>CATALOGUE</span>
          <h1>Résultats de recherche</h1>
          <p>Retrouve les livres et les artistes de ta collection.</p>
        </div>

        <div className='search-results__count'>
          <span>{totalResults}</span>
          {totalResults > 1 ? " résultats" : " résultat"}
        </div>
      </header>

      {totalResults === 0 && (
        <div className='search-results__empty'>
          <div className='search-results__empty-icon'>
            <BookOutlined />
          </div>
          <h2>Aucun résultat</h2>
          <p>Aucun livre ou artiste ne correspond à ta recherche.</p>
        </div>
      )}

      {titles.length > 0 && (
        <section className='search-results-section'>
          <div className='search-results-section__header'>
            <div className='search-results-section__heading'>
              <div className='search-results-section__icon'>
                <BookOutlined />
              </div>
              <div>
                <Typography className='search-results-section__title'>
                  Par album
                </Typography>
                <Typography className='search-results-section__sub'>
                  {DisplayResultCategory({ titles })}
                </Typography>
              </div>
            </div>
            <span className='search-results-section__badge'>
              {titles.length}
            </span>
          </div>

          <DisplayBooksByTitle titles={titles} />
        </section>
      )}

      {artists.length > 0 && (
        <section className='search-results-section'>
          <div className='search-results-section__header'>
            <div className='search-results-section__heading'>
              <div className='search-results-section__icon'>
                <PersonOutline />
              </div>
              <div>
                <Typography className='search-results-section__title'>
                  Par artiste
                </Typography>
                <Typography className='search-results-section__sub'>
                  {DisplayResultCategory({ artists })}
                </Typography>
              </div>
            </div>
            <span className='search-results-section__badge'>
              {artists.length}
            </span>
          </div>

          <ul className='search-results-list'>
            {artists.map((artist) => (
              <li key={artist.id || artist._id}>
                <button
                  type='button'
                  onClick={() => history.push(`/artist/${artist._id}`)}
                >
                  <span className='search-results-list__avatar'>
                    <PersonOutline />
                  </span>
                  <span className='search-results-list__name'>
                    {artist.nom}
                  </span>
                  <ArrowForward className='search-results-list__arrow' />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
};

export default SearchResults;
