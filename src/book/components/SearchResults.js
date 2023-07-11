import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { IconButton, Divider, Tooltip } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import makeTitle from "../../shared/util/makeTitle";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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

  if (series) {
    const nbSeries = series.length;
    return nbSeries > 1
      ? `${nbSeries} séries correspondant à la recherche`
      : `${nbSeries} série correspondant à la recherche`;
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
    <div className="results-display">
      <div className="results-display__books_array">
        {titles.map((book) => (
          <Tooltip title={makeTitle(book)}>
            <div
              key={book.id}
              className="results-display__book"
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

const DisplayBooksBySerie = ({ series }) => {
  const history = useHistory();

  const [expandedSerie, setExpandedSerie] = useState(null);

  const toggleSerieExpansion = (index) => {
    if (index === expandedSerie) {
      setExpandedSerie(null);
    } else {
      setExpandedSerie(index);
    }
  };

  return series.map((serie, index) => (
    <div key={index} className="results-series" style={{ width: "100%" }}>
      <div
        className="results-series-box"
        onClick={() => toggleSerieExpansion(index)}
      >
        {/* div de gauche */}
        <div className="results-series-box__left">
          <div className="results-series-box__left-img">
            <img src={serie.books[0].image} alt={serie.serie} />
          </div>
          <div className="results-series-box__left-info">
            <div className="results-series-box__left-info-title">
              {serie.serie}
            </div>
          </div>
        </div>
        {/* div de droite */}
        <div className="results-series-box__right">
          <div className="results-series-box__right-editor">
            {serie.books[0].editeur}
          </div>
          <Divider orientation="vertical" flexItem className="divider" />
          <div className="results-series-box__right-progress">
            <div className="results-series-box__right-progress__number">
              {serie.books.length}
            </div>
          </div>
          <div className="results-series-box__right-expand">
            <IconButton
              onClick={() => toggleSerieExpansion(index)}
              size="medium"
            >
              {expandedSerie === index ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </div>
        </div>
      </div>
      {expandedSerie === index && (
        <div>
          {serie.books.map((book, bookIndex) => (
            <div key={bookIndex}>
              <div className="book-box">
                <div
                  className="book-box__left"
                  onClick={() => history.push(`/book/${book.id_book}`)}
                >
                  <img src={book.image} alt={book.titre} />
                </div>
                <div
                  style={{ flex: 1, paddingLeft: "20px" }}
                  onClick={() => history.push(`/book/${book.id_book}`)}
                >
                  <div className="book-box__left-title">{book.titre}</div>
                  {book.tome !== undefined && (
                    <div className="book-box__left-tome">Tome {book.tome}</div>
                  )}
                </div>
              </div>
              {bookIndex !== serie.books.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      )}
    </div>
  ));
};

const SearchResults = ({ titles, series, artists }) => {
  const history = useHistory();
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <div className="search-results">
        <h1>Résultats</h1>

        {titles.length > 0 && (
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>Par album</Typography>
              <Typography className={classes.secondaryHeading}>
                {" "}
                {DisplayResultCategory({ titles })}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <section className="search-results-section">
                <DisplayBooksByTitle titles={titles} />
              </section>
            </AccordionDetails>
          </Accordion>
        )}

        {series.length > 0 && (
          <Accordion
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography className={classes.heading}>Par série</Typography>
              <Typography className={classes.secondaryHeading}>
                {" "}
                {DisplayResultCategory({ series })}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <section
                className="search-results-section"
                style={{ width: "100%" }}
              >
                <DisplayBooksBySerie series={series} />
              </section>
            </AccordionDetails>
          </Accordion>
        )}

        {artists.length > 0 && (
          <Accordion
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <Typography className={classes.heading}>Par artiste</Typography>
              <Typography className={classes.secondaryHeading}>
                {" "}
                {DisplayResultCategory({ artists })}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <section className="search-results-section">
                <ul className="search-results-list">
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
            </AccordionDetails>
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
