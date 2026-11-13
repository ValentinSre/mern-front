import React, { useState, useContext, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { IconButton, Tooltip } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { BsBookmarkCheckFill, BsBookmarkX } from "react-icons/bs";
import { FaBookOpen, FaLayerGroup, FaStar } from "react-icons/fa";

import { AuthContext } from "../../../shared/context/auth-context";
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

  const [localSeries, setLocalSeries] = useState(series || []);
  const [expandedSerie, setExpandedSerie] = useState(null);

  const [openReadModal, setOpenReadModal] = useState(false);
  const [readBookId, setReadBookId] = useState(null);
  const [dateLecture, setDateLecture] = useState(null);
  const [readState, setReadState] = useState(false);

  useEffect(() => {
    setLocalSeries(series || []);
  }, [series]);

  const filteredSeries = useMemo(() => {
    return localSeries
      .filter((serie) => {
        const books = serie.books || [];

        if (books.length === 0) return false;

        const { type, editeur } = books[0];

        return checkedValues[type] && selectedEditeurs[editeur];
      })
      .filter((serie) => (serie.books || []).some((book) => !book.revendu));
  }, [localSeries, checkedValues, selectedEditeurs]);

  const nbSeries = filteredSeries.length;

  const nbBooks = filteredSeries.reduce((total, serie) => {
    return total + (serie.books || []).filter((book) => !book.revendu).length;
  }, 0);

  const toggleSerieExpansion = (index) => {
    setExpandedSerie((current) => (current === index ? null : index));
  };

  const handleBookClick = (bookId) => {
    if (bookId) {
      history.push(`/book/${bookId}`);
    }
  };

  const updateBookStatus = (bookId, status) => {
    if (!bookId) return;

    setReadBookId(bookId);
    setReadState(status);
    setDateLecture(null);
    setOpenReadModal(true);
  };

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
        },
      );

      if (responseData.success) {
        setLocalSeries((currentSeries) =>
          currentSeries.map((serie) => ({
            ...serie,
            books: (serie.books || []).map((book) =>
              book.id_book === readBookId
                ? {
                    ...book,
                    lu: readState,
                    date_lecture: dateLecture,
                  }
                : book,
            ),
          })),
        );

        setOpenReadModal(false);
        setReadBookId(null);
        setDateLecture(null);
        setReadState(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getBookTitle = (book, isSeries) => {
    const title = book.titre || "Titre indisponible";

    if (
      !isSeries ||
      book.tome === null ||
      book.tome === undefined ||
      book.tome === "" ||
      /\b(tome|volume)\b/i.test(title)
    ) {
      return title;
    }

    const tomeNumber = String(book.tome).padStart(2, "0");

    return `${title} (T${tomeNumber})`;
  };

  return (
    <div className='series-collection'>
      <div className='series-collection__summary'>
        <div className='series-collection__summary-icon'>
          <FaLayerGroup />
        </div>
        <span>
          <strong>
            {nbSeries} {nbSeries > 1 ? "séries " : "série "}
          </strong>
          / {nbBooks} {nbBooks > 1 ? "albums" : "album"}
        </span>
      </div>

      {filteredSeries.map((serie, index) => {
        const allBooks = serie.books || [];
        const availableBooks = allBooks.filter((book) => !book.revendu);

        const isSeries = Boolean(serie.serie && serie.serie.trim());

        const firstBook =
          availableBooks.find((book) => Number(book.tome) === 1) ||
          availableBooks[0];

        const displayTitle = isSeries
          ? serie.serie
          : firstBook?.titre || "Titre indisponible";

        const readCount = availableBooks.filter((book) => book.lu).length;
        const totalCount = availableBooks.length;

        const ratedBooks = availableBooks.filter(
          (book) =>
            book.note !== null && book.note !== undefined && book.note !== "",
        );

        const averageRating = ratedBooks.length
          ? ratedBooks.reduce((total, book) => total + Number(book.note), 0) /
            ratedBooks.length
          : 0;

        const hasRating = ratedBooks.length > 0;
        const incompleteRating = isSeries && ratedBooks.length < totalCount;
        const isExpanded = expandedSerie === index;

        const readingLabel = isSeries
          ? `${totalCount} ${totalCount > 1 ? "tomes" : "tome"} - ${readCount} ${
              readCount > 1 ? "lus" : "lu"
            }`
          : `Récit complet${readCount > 0 ? " - lu" : ""}`;

        return (
          <section
            key={serie._id || `${displayTitle}-${index}`}
            className={`collection-series ${
              isExpanded ? "collection-series--expanded" : ""
            }`}
          >
            <button
              type='button'
              className='series-box'
              onClick={() => toggleSerieExpansion(index)}
              aria-expanded={isExpanded}
            >
              <div className='series-box__cover'>
                {firstBook?.image ? (
                  <img src={firstBook.image} alt={displayTitle} />
                ) : (
                  <div className='series-box__cover-placeholder'>
                    <FaBookOpen />
                  </div>
                )}
              </div>

              <div className='series-box__info'>
                <div className='series-box__title'>{displayTitle}</div>

                <div className='series-box__reading'>{readingLabel}</div>

                <div className='series-box__rating'>
                  {hasRating ? (
                    <>
                      <FaStar className='series-box__rating-star' />
                      <span>{averageRating.toFixed(1).replace(".", ",")}</span>
                      {incompleteRating && (
                        <span className='series-box__rating-incomplete'>
                          (note incomplète)
                        </span>
                      )}
                    </>
                  ) : (
                    <span>Non noté</span>
                  )}
                </div>

                <div className='series-box__editor'>
                  {firstBook?.editeur || "Éditeur inconnu"}
                </div>
              </div>

              <div className='series-box__expand'>
                <ExpandMore />
              </div>
            </button>

            {isExpanded && (
              <div className='series-books'>
                {availableBooks.map((book, bookIndex) => (
                  <div
                    className='book-box'
                    key={book._id || book.id_book || bookIndex}
                  >
                    <button
                      type='button'
                      className='book-box__main'
                      onClick={() => handleBookClick(book.id_book)}
                      disabled={!book.id_book}
                    >
                      <div className='book-box__cover'>
                        {book.image ? (
                          <img src={book.image} alt={book.titre} />
                        ) : (
                          <div className='book-box__cover-placeholder'>
                            <FaBookOpen />
                          </div>
                        )}
                      </div>

                      <div className='book-box__info'>
                        <span className='book-box__title'>
                          {getBookTitle(book, isSeries)}
                        </span>

                        <div className='book-box__rating'>
                          {book.note !== null &&
                          book.note !== undefined &&
                          book.note !== "" ? (
                            <>
                              <FaStar className='book-box__rating-star' />
                              <span>
                                {Number(book.note).toFixed(1).replace(".", ",")}
                              </span>
                              <span className='book-box__rating-max'>/ 5</span>
                            </>
                          ) : (
                            <span className='book-box__not-rated'>
                              Non noté
                            </span>
                          )}
                        </div>
                      </div>
                    </button>

                    <div className='book-box__status'>
                      <Tooltip
                        title={
                          book.lu ? "Marquer comme non lu" : "Marquer comme lu"
                        }
                      >
                        <IconButton
                          onClick={() =>
                            updateBookStatus(book.id_book, !book.lu)
                          }
                          aria-label={
                            book.lu
                              ? "Marquer comme non lu"
                              : "Marquer comme lu"
                          }
                          disabled={!book.id_book}
                          className={
                            book.lu ? "book-box__status-button--read" : ""
                          }
                        >
                          {book.lu ? <BsBookmarkCheckFill /> : <BsBookmarkX />}
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}

      {filteredSeries.length === 0 && (
        <div className='series-collection__empty'>
          <div className='series-collection__empty-icon'>
            <FaBookOpen />
          </div>
          <h3>Aucune série à afficher</h3>
          <p>Aucune série ne correspond à votre sélection.</p>
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
