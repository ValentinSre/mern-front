import React from "react";
import { useHistory } from "react-router-dom";
import makeTitle from "../../shared/util/makeTitle";

import "./SearchResults.css";

const DisplayResultCategory = ({ titles, series, artists }) => {
  if (titles) {
    const nbTitles = titles.length;
    return nbTitles > 1 ? (
      <h2>{nbTitles} albums correspondant à la recherche</h2>
    ) : (
      <h2>{nbTitles} album correspondant à la recherche</h2>
    );
  }

  if (series) {
    const nbSeries = series.length;
    return nbSeries > 1 ? (
      <h2>{nbSeries} séries correspondant à la recherche</h2>
    ) : (
      <h2>{nbSeries} série correspondant à la recherche</h2>
    );
  }

  if (artists) {
    const nbArtists = artists.length;
    return nbArtists > 1 ? (
      <h2>{nbArtists} artistes correspondant à la recherche</h2>
    ) : (
      <h2>{nbArtists} artiste correspondant à la recherche</h2>
    );
  }
};

const SearchResults = ({ titles, series, artists }) => {
  const history = useHistory();
  return (
    <div className="search-results">
      <h1>Search Results</h1>

      {titles.length > 0 && (
        <section className="search-results-section">
          {DisplayResultCategory({ titles })}
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
          {DisplayResultCategory({ series })}
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
          {DisplayResultCategory({ artists })}
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
