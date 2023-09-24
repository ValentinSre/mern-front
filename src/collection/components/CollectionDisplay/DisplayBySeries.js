import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { IconButton, Divider, Tooltip } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { MdBookmarkAdded, MdBookmarkBorder } from "react-icons/md";

import { AuthContext } from "../../../shared/context/auth-context";
import Rating from "../../../shared/components/UIElements/Rating";
import DateModal from "../../../shared/components/UIElements/DateModal";
import { useHttpClient } from "../../../shared/hooks/http-hook";

import "./DisplayBySeries.css";

const DisplayBySeries = ({
  collection: series,
  checkedValues,
  selectedEditeurs,
}) => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [expandedSerie, setExpandedSerie] = useState(null);

  const toggleSerieExpansion = (index) => {
    if (index === expandedSerie) {
      setExpandedSerie(null);
    } else {
      setExpandedSerie(index);
    }
  };

  const updateBookStatus = (serieTitle, bookIndex, status) => {
    setReadBookId(bookIndex);
    setOpenReadModal(true);
    setReadState(status);
    setSeriesTitle(serieTitle);
  };

  const handleBookClick = (bookId) => {
    history.push(`/book/${bookId}`);
  };

  const [openReadModal, setOpenReadModal] = useState(false);
  const [readBookId, setReadBookId] = useState(null);
  const [dateLecture, setDateLecture] = useState(null);
  const [readState, setReadState] = useState(false);
  const [seriesTitle, setSeriesTitle] = useState(null);

  // Filtrer les séries
  const filteredSeries = series
    .filter((serie) => {
      const { type, editeur } = serie.books[0];
      return checkedValues[type] && selectedEditeurs[editeur];
    })
    .filter((serie) => !serie.books.every((book) => book.revendu));

  // Calculer le nombre de séries et de livres non revendus
  const nbSeries = filteredSeries.length;
  const nbBooks = filteredSeries.reduce((acc, serie) => {
    // Filtrer les livres non revendus
    const nonRevenduBooks = serie.books.filter((book) => !book.revendu);
    return acc + nonRevenduBooks.length;
  }, 0);

  const handleBookReading = async () => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_API_URL + "/collection/edit",
        "POST",
        JSON.stringify({
          id_book: readBookId,
          id_user: auth.userId,
          lu: readState,
          date_lecture: dateLecture,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      const { success } = responseData;
      // update the object in the array
      if (success) {
        const newSeries = [...series];
        const seriesIndex = series.findIndex(
          (serie) => serie.serie === seriesTitle
        );
        const bookIndex = newSeries[seriesIndex].books.findIndex(
          (book) => book.id_book === readBookId
        );
        newSeries[seriesIndex].books[bookIndex].lu = readState;
        series = newSeries;
        setOpenReadModal(false);
      }

      setSeriesTitle(null);
      setReadBookId(null);
      setDateLecture(null);
      setReadState(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ width: "90%", margin: "auto" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginRight: "10px", marginBottom: "20px" }}>
          <strong>
            {nbSeries === 1 ? nbSeries + " série" : nbSeries + " séries"}
          </strong>{" "}
          / {nbBooks === 1 ? nbBooks + " album" : nbBooks + " albums"} :
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
                      serie.books
                        .filter((book) => !book.revendu)
                        .reduce((accumulator, currentValue) => {
                          return accumulator + (currentValue.note || 0);
                        }, 0) /
                      serie.books
                        .filter((book) => !book.revendu)
                        .filter((book) => book.note).length
                    }
                    size={"18px"}
                    real={
                      serie.books
                        .filter((book) => !book.revendu)
                        .filter((book) => book.note).length > 0
                    }
                  />
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
                  {
                    serie.books
                      .filter((book) => !book.revendu)
                      .filter((book) => book.lu).length
                  }
                  /{serie.books.filter((book) => !book.revendu).length}
                </div>
                <div className='series-box__right-progress__text'>
                  {serie.books
                    .filter((book) => !book.revendu)
                    .filter((book) => book.lu).length > 0 ? (
                    <span>
                      {Math.round(
                        (serie.books
                          .filter((book) => !book.revendu)
                          .filter((book) => book.lu).length /
                          serie.books.filter((book) => !book.revendu).length) *
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
              {serie.books
                .filter((book) => !book.revendu)
                .map((book, bookIndex) => (
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
                        {book.tome !== undefined && (
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
                            updateBookStatus(
                              serie.serie,
                              book.id_book,
                              !book.lu
                            )
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
      <DateModal
        open={openReadModal}
        handleClose={() => setOpenReadModal(false)}
        date={dateLecture}
        authorizeNoDate
        label='Date de lecture'
        title='Quand avez-vous lu ce livre ?'
        handleChange={(e) => setDateLecture(e.target.value)}
        handleSubmit={handleBookReading}
      />
    </div>
  );
};

export default DisplayBySeries;
