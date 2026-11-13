import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";
import "./DatedCollection.css";
import makeTitle from "../../shared/util/makeTitle";

const getBooks = (loadedBooks, displayMode) => {
  if (!Array.isArray(loadedBooks)) return [];

  const books =
    displayMode === "bySeries"
      ? loadedBooks.flatMap((serie) => serie.books || [])
      : loadedBooks;

  return books.filter((book) => book.date_achat);
};

const getDate = (book) => {
  const date = new Date(book.date_achat);
  return Number.isNaN(date.getTime()) ? null : date;
};

const toDateInputValue = (date) => {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDefaultDateFrom = (books) => {
  const latestDate = books
    .map((book) => getDate(book))
    .filter(Boolean)
    .sort((a, b) => b - a)[0];

  if (!latestDate) return "";

  return toDateInputValue(
    new Date(latestDate.getFullYear(), latestDate.getMonth(), 1),
  );
};

const formatDate = (date) =>
  date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const formatMonth = (date) =>
  date.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

const parseDateInput = (value) => {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatPeriod = (dateFrom, dateTo) => {
  const from = parseDateInput(dateFrom);
  const to = parseDateInput(dateTo);

  if (from && to) {
    if (
      from.getFullYear() === to.getFullYear() &&
      from.getMonth() === to.getMonth()
    ) {
      return formatMonth(from);
    }

    return `${formatDate(from)} – ${formatDate(to)}`;
  }

  if (from) {
    if (from.getDate() === 1) return formatMonth(from);
    return `Depuis le ${formatDate(from)}`;
  }

  if (to) return `Jusqu'au ${formatDate(to)}`;

  return "Toutes les dates";
};

const DatedCollection = ({ loadedBooks, displayMode }) => {
  const history = useHistory();

  const books = useMemo(
    () => getBooks(loadedBooks, displayMode),
    [loadedBooks, displayMode],
  );

  const [historyOpen, setHistoryOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState(() => getDefaultDateFrom(books));
  const [dateTo, setDateTo] = useState("");
  const [showBooks, setShowBooks] = useState(false);

  // Gère également le cas où la collection est chargée après le montage.
  useEffect(() => {
    if (!dateFrom && books.length > 0) {
      setDateFrom(getDefaultDateFrom(books));
    }
  }, [books, dateFrom]);

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        const date = getDate(book);
        if (!date) return false;

        const dateKey = toDateInputValue(date);

        if (dateFrom && dateKey < dateFrom) return false;
        if (dateTo && dateKey > dateTo) return false;

        return true;
      })
      .sort((a, b) => getDate(a) - getDate(b));
  }, [books, dateFrom, dateTo]);

  const handleOpenHistory = () => {
    setHistoryOpen(true);
  };

  const handleShowBooks = () => {
    setHistoryOpen(false);
    setShowBooks(true);
  };

  const handleCloseHistory = () => {
    setHistoryOpen(false);
  };

  const handleCloseBooks = () => {
    setShowBooks(false);
  };

  const handleBookClick = (book) => {
    if (book.id_book) {
      history.push(`/book/${book.id_book}`);
    }
  };

  const dateRangeInvalid = dateFrom && dateTo && dateFrom > dateTo;

  return (
    <>
      <button
        type='button'
        className='collection-history-trigger'
        onClick={handleOpenHistory}
      >
        <FaCalendarAlt />
        <span>Historique des achats</span>
      </button>

      <Dialog
        open={historyOpen}
        onClose={handleCloseHistory}
        fullWidth
        maxWidth='sm'
        classes={{ paper: "collection-history-dialog" }}
      >
        <DialogTitle>Historique des achats</DialogTitle>

        <DialogContent>
          {books.length === 0 ? (
            <p className='collection-history-empty'>
              Aucun achat daté dans cette collection.
            </p>
          ) : (
            <>
              <div className='collection-history-dates'>
                <div className='collection-history-field'>
                  <label htmlFor='collection-history-from'>Du</label>
                  <input
                    id='collection-history-from'
                    type='date'
                    value={dateFrom}
                    max={dateTo || undefined}
                    onChange={(event) => setDateFrom(event.target.value)}
                  />
                </div>

                <div className='collection-history-field'>
                  <label htmlFor='collection-history-to'>Au</label>
                  <input
                    id='collection-history-to'
                    type='date'
                    value={dateTo}
                    min={dateFrom || undefined}
                    onChange={(event) => setDateTo(event.target.value)}
                  />
                </div>
              </div>

              {dateRangeInvalid && (
                <p className='collection-history-error'>
                  La date de début doit précéder la date de fin.
                </p>
              )}

              <div className='collection-history-summary'>
                <span>{filteredBooks.length} ouvrage(s) trouvé(s)</span>
                <span>Du plus ancien au plus récent</span>
              </div>

              {filteredBooks.length > 0 && (
                <div className='collection-history-preview'>
                  {filteredBooks.slice(0, 3).map((book, index) => (
                    <div
                      className='collection-history-preview-item'
                      key={book._id || book.id_book || index}
                    >
                      <span>{makeTitle(book)}</span>
                      <span>{formatDate(getDate(book))}</span>
                    </div>
                  ))}

                  {filteredBooks.length > 3 && (
                    <p>et {filteredBooks.length - 3} autre(s) ouvrage(s)...</p>
                  )}
                </div>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseHistory}
            className='collection-dialog-button collection-dialog-button--secondary'
          >
            Fermer
          </Button>

          <Button
            color='primary'
            variant='contained'
            disableElevation
            className='collection-dialog-button collection-dialog-button--primary'
            onClick={handleShowBooks}
            disabled={
              books.length === 0 ||
              filteredBooks.length === 0 ||
              Boolean(dateRangeInvalid)
            }
            startIcon={<FaSearch />}
          >
            Voir les achats
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showBooks}
        onClose={handleCloseBooks}
        fullWidth
        maxWidth='md'
        classes={{ paper: "collection-purchases-dialog" }}
      >
        <DialogTitle className='collection-purchases-dialog__title'>
          <span>Mes achats </span>
          <span className='collection-purchases-dialog__subtitle'>
            {formatPeriod(dateFrom, dateTo)}
            {" · "}
            {filteredBooks.length}{" "}
            {filteredBooks.length > 1 ? "ouvrages" : "ouvrage"}
          </span>
        </DialogTitle>

        <DialogContent>
          {filteredBooks.length === 0 ? (
            <p className='collection-history-empty'>
              Aucun achat pour cette période.
            </p>
          ) : (
            <div className='collection-purchases-list'>
              {filteredBooks.map((book, index) => (
                <button
                  type='button'
                  className='collection-purchase-item'
                  key={book._id || book.id_book || index}
                  onClick={() => handleBookClick(book)}
                  disabled={!book.id_book}
                >
                  <div className='collection-purchase-item__cover'>
                    {book.image ? (
                      <img src={book.image} alt='' />
                    ) : (
                      <div className='collection-purchase-item__cover-placeholder'>
                        Aucun visuel
                      </div>
                    )}
                  </div>

                  <div className='collection-purchase-item__info'>
                    <span className='collection-purchase-item__title'>
                      {makeTitle(book) || "Titre indisponible"}
                    </span>

                    <span className='collection-purchase-item__type'>
                      {book.type || "Ouvrage"}
                    </span>
                  </div>

                  <div className='collection-purchase-item__date'>
                    <span className='collection-purchase-item__date-label'>
                      Date d'achat
                    </span>
                    <span className='collection-purchase-item__date-value'>
                      {formatDate(getDate(book))}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseBooks}
            className='collection-dialog-button collection-dialog-button--secondary'
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DatedCollection;
