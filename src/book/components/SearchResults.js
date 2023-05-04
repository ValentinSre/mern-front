import React from "react";
import { useHistory } from "react-router-dom";
import makeTitle from "../../shared/util/makeTitle";

import "./SearchResults.css";

const SearchResults = ({ titles, series, artists }) => {
  const history = useHistory();
  return (
    <div className="search-results">
      <h1>Search Results</h1>

      {titles.length > 0 && (
        <section className="search-results-section">
          <h2>{titles.length} albums correspondant à la recherche</h2>
          <ul className="search-results-list">
            {titles.map((title) => (
              <li
                key={title._id}
                onClick={() => history.push(`/book/${title._id}`)}
              >
                {makeTitle(title)}
              </li>
            ))}
          </ul>
        </section>
      )}

      {series.length > 0 && (
        <section className="search-results-section">
          <h2>{series.length} séries correspondant à la recherche</h2>
          <ul className="search-results-list">
            {series.map((serie) => (
              <li key={serie.id}>
                {serie.serie} {serie.version ? `(v${serie.version})` : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {artists.length > 0 && (
        <section className="search-results-section">
          <h2>{artists.length} artistes correspondant à la recherche</h2>
          <ul className="search-results-list">
            {artists.map((artist) => (
              <li key={artist.id}>{artist.nom}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default SearchResults;
