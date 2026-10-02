import React from "react";
import { useHistory } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import makeTitle from "../../shared/util/makeTitle";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import "./SearchResults.css";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

const DisplayResultCategory = ({ titles, artists }) => {
  if (titles) {
    const nbTitles = titles.length;
    return nbTitles > 1
      ? `${nbTitles} albums correspondant à la recherche`
      : `${nbTitles} album correspondant à la recherche`;
  }

  if (artists) {
    const nbArtists = artists.length;
    return nbArtists > 1
      ? `${nbArtists} artistes correspondant à la recherche`
      : `${nbArtists} artiste correspondant à la recherche`;
  }
};

const DisplayBooksByTitle = ({ titles }) => {
  const history = useHistory();

  return (
    <div className='results-display'>
      <div className='results-display__books_array'>
        {titles.map((book) => (
          <Tooltip key={book.id || book._id} title={makeTitle(book)}>
            <div
              className='results-display__book'
              onClick={() => history.push(`/book/${book._id}`)}
            >
              <img src={book.image} alt={book.titre} />
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

const SearchResults = ({ titles, artists }) => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className='search-results'>
        <div className='search-results__header'>
          <h1>Résultats</h1>
          <div className='search-results__count'>
            {(titles?.length || 0) + (artists?.length || 0)} résultats
          </div>
        </div>

        {titles && titles.length > 0 && (
          <React.Fragment>
            <section className='search-results-section'>
              <Typography className='search-results-section__title'>
                Par album
              </Typography>
              <Typography className='search-results-section__sub'>
                {DisplayResultCategory({ titles })}
              </Typography>
              <DisplayBooksByTitle titles={titles} />
            </section>
          </React.Fragment>
        )}

        {artists && artists.length > 0 && (
          <React.Fragment>
            <section className='search-results-section'>
              <Typography className='search-results-section__title'>
                Par artiste
              </Typography>
              <Typography className='search-results-section__sub'>
                {DisplayResultCategory({ artists })}
              </Typography>
              <ul className='search-results-list'>
                {artists.map((artist) => (
                  <li
                    key={artist.id || artist._id}
                    onClick={() => history.push(`/artist/${artist._id}`)}
                  >
                    {artist.nom}
                  </li>
                ))}
              </ul>
            </section>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
