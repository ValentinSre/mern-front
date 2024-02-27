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

const DisplayResultCategory = ({ titles, series, artists }) => {
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
          <Tooltip title={makeTitle(book)}>
            <div
              key={book.id}
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
        <h1>Résultats</h1>

        {titles.length > 0 && (
          <React.Fragment>
            <Typography className={classes.heading}>Par album</Typography>
            <Typography className={classes.secondaryHeading}>
              {" "}
              {DisplayResultCategory({ titles })}
            </Typography>
            <section className='search-results-section'>
              <DisplayBooksByTitle titles={titles} />
            </section>
          </React.Fragment>
        )}

        {artists.length > 0 && (
          <React.Fragment>
            <Typography className={classes.secondaryHeading}>
              {" "}
              {DisplayResultCategory({ artists })}
            </Typography>
            <br />
            <section className='search-results-section'>
              <ul className='search-results-list'>
                {artists.map((artist) => (
                  <li
                    key={artist.id}
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
