import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { IconButton, Divider, Tooltip } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { Done, Clear } from "@material-ui/icons";

import { MdBookmarkAdded, MdBookmarkBorder } from "react-icons/md";

import Rating from "../../../shared/components/UIElements/Rating";

import "./DisplayBySeries.css";

const DisplayBySeries = ({
  collection: series,
  checkedValues,
  selectedEditeurs,
}) => {
  const history = useHistory();
  const [expandedSerie, setExpandedSerie] = useState(null);

  const toggleSerieExpansion = (index) => {
    if (index === expandedSerie) {
      setExpandedSerie(null);
    } else {
      setExpandedSerie(index);
    }
  };

  const updateBookStatus = (serieIndex, bookIndex, status) => {
    console.log("updateBookStatus", serieIndex, bookIndex, status);
  };

  const handleBookClick = (bookId) => {
    history.push(`/book/${bookId}`);
  };

  const filteredSeries = series.filter((serie) => {
    const { type, editeur } = serie.books[0];
    return checkedValues[type] && selectedEditeurs[editeur];
  });

  const nbSeries = filteredSeries.length;
  const nbBooks = filteredSeries.reduce(
    (acc, serie) => acc + serie.books.length,
    0
  );

  return (
    <div style={{ width: "90%", margin: "auto" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginRight: "10px", marginBottom: "20px" }}>
          <strong>{nbSeries} séries</strong> / {nbBooks} albums :
        </div>
      </div>
      {filteredSeries.map((serie, index) => (
        <div key={index} className='collection-series'>
          <div
            className='series-box'
            onClick={() => toggleSerieExpansion(index)}
          >
            {/* div de gauche */}
            <div className='series-box__left'>
              <div className='series-box__left-img'>
                <img src={serie.books[0].image} alt={serie.serie} />
              </div>
              <div className='series-box__left-info'>
                <div className='series-box__left-info-title'>{serie.serie}</div>
                <div>
                  <Rating
                    rating={
                      serie.books.reduce((accumulator, currentValue) => {
                        if (currentValue.note) {
                          return accumulator + currentValue.note;
                        } else {
                          return accumulator;
                        }
                      }, 0) / serie.books.filter((book) => book.note).length
                    }
                    size={"18px"}
                    real={serie.books.filter((book) => book.note).length > 0}
                  />
                  {}
                </div>
              </div>
            </div>
            {/* div de droite */}
            <div className='series-box__right'>
              <div className='series-box__right-editor'>
                {serie.books[0].editeur}
              </div>
              <Divider orientation='vertical' flexItem className='divider' />
              <div className='series-box__right-progress'>
                <div className='series-box__right-progress__number'>
                  {serie.books.filter((book) => book.lu).length}/
                  {serie.books.length}
                </div>
                <div className='series-box__right-progress__text'>
                  {serie.books.filter((book) => book.lu).length > 0 ? (
                    <span>
                      {Math.round(
                        (serie.books.filter((book) => book.lu).length /
                          serie.books.length) *
                          100
                      )}
                      % lus
                    </span>
                  ) : (
                    <span>Pas encore lu</span>
                  )}
                </div>
              </div>
              <div className='series-box__right-expand'>
                <IconButton
                  onClick={() => toggleSerieExpansion(index)}
                  size='medium'
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
                  <div className='book-box'>
                    <div
                      className='book-box__left'
                      onClick={() => handleBookClick(book.id_book)}
                    >
                      <img src={book.image} alt={book.titre} />
                    </div>
                    <div
                      style={{ flex: 1, paddingLeft: "20px" }}
                      onClick={() => handleBookClick(book.id_book)}
                    >
                      <div className='book-box__left-title'>{book.titre}</div>
                      {book.tome && (
                        <div className='book-box__left-tome'>
                          Tome {book.tome}
                        </div>
                      )}
                      <div className='book-box__left-rating'>
                        {book.note ? (
                          <Rating
                            rating={book.note}
                            size={"18px"}
                            real={true}
                          />
                        ) : (
                          <span>Pas encore noté</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <IconButton
                        onClick={() =>
                          updateBookStatus(index, bookIndex, !book.lu)
                        }
                        size='medium'
                      >
                        {book.lu ? (
                          <Tooltip title='Marquer comme non lu'>
                            <MdBookmarkAdded />
                          </Tooltip>
                        ) : (
                          <Tooltip title='Marquer comme lu'>
                            <MdBookmarkBorder />
                          </Tooltip>
                        )}
                      </IconButton>
                    </div>
                  </div>
                  {bookIndex !== serie.books.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {filteredSeries.length === 0 && (
        <div style={{ textAlign: "center", paddingBottom: "20px" }}>
          <h3>Aucune série ne correspond à votre sélection</h3>
        </div>
      )}
    </div>
  );
};

export default DisplayBySeries;
