import React, { useMemo, useState } from "react";
import makeTitle from "../../shared/util/makeTitle";
import {
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { useHistory } from "react-router-dom";
import {
  FaStream,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaBookOpen,
  FaTimes,
} from "react-icons/fa";

import "./ReadHistory.css";

/* Gestion des dates */

const parseReadDate = (dateKey) => {
  if (!dateKey) return null;

  const isoMatch = String(dateKey).match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    if (
      date.getFullYear() === Number(year) &&
      date.getMonth() === Number(month) - 1 &&
      date.getDate() === Number(day)
    ) {
      return date;
    }

    return null;
  }

  const frenchMatch = String(dateKey).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (frenchMatch) {
    const [, day, month, year] = frenchMatch;
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    if (
      date.getFullYear() === Number(year) &&
      date.getMonth() === Number(month) - 1 &&
      date.getDate() === Number(day)
    ) {
      return date;
    }

    return null;
  }

  const parsedDate = new Date(dateKey);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getMonthKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
};

const getCalendarDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getMonthDate = (monthKey) => {
  const [year, month] = monthKey.split("-").map(Number);

  return new Date(year, month - 1, 1);
};

const formatMonth = (monthKey) =>
  getMonthDate(monthKey).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

const formatBookDate = (date) =>
  date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });

const formatFullDate = (date) =>
  date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function ReadHistory({ readlist }) {
  const history = useHistory();

  const [view, setView] = useState("timeline");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const currentMonth = getMonthKey(new Date());

  // Conversion et tri chronologique des dates d'origine.
  const entries = useMemo(() => {
    if (!readlist || Array.isArray(readlist)) return [];

    return Object.entries(readlist)
      .map(([dateKey, books]) => ({
        dateKey,
        date: parseReadDate(dateKey),
        books: Array.isArray(books) ? books : [],
      }))
      .filter((entry) => entry.date && entry.books.length > 0)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [readlist]);

  // Regroupement des lectures par mois.
  const monthGroups = useMemo(() => {
    const groups = {};

    entries.forEach((entry) => {
      const monthKey = getMonthKey(entry.date);

      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }

      groups[monthKey].push(entry);
    });

    return groups;
  }, [entries]);

  const months = useMemo(
    () => Object.keys(monthGroups).sort((a, b) => b.localeCompare(a)),
    [monthGroups],
  );

  // Le calendrier peut également afficher les mois sans lecture.
  const defaultMonth = months.includes(currentMonth)
    ? currentMonth
    : months[0] || currentMonth;

  const activeMonth = selectedMonth || defaultMonth;
  const earliestMonth = months.length
    ? months[months.length - 1]
    : currentMonth;

  const canGoToPreviousMonth = activeMonth > earliestMonth;
  const canGoToNextMonth = activeMonth < currentMonth;

  const totalBooks = entries.reduce(
    (total, entry) => total + entry.books.length,
    0,
  );

  // Correspondance entre les dates et les livres lus chaque jour.
  const booksByDay = useMemo(() => {
    const result = {};

    entries.forEach((entry) => {
      const calendarKey = getCalendarDateKey(entry.date);

      if (!result[calendarKey]) {
        result[calendarKey] = [];
      }

      result[calendarKey].push(...entry.books);
    });

    return result;
  }, [entries]);

  const handleBookClick = (bookId) => {
    if (bookId) {
      history.push(`/book/${bookId}`);
    }
  };

  const handleViewChange = (event, nextView) => {
    if (nextView) {
      setView(nextView);
    }
  };

  const handleMonthChange = (direction) => {
    const date = getMonthDate(activeMonth);
    date.setMonth(date.getMonth() + direction);

    const nextMonth = getMonthKey(date);

    if (nextMonth >= earliestMonth && nextMonth <= currentMonth) {
      setSelectedMonth(nextMonth);
    }
  };

  const handleOpenDay = (date, books) => {
    setSelectedDay({ date, books });
  };

  const handleCloseDay = () => {
    setSelectedDay(null);
  };

  const renderBook = (book, date, calendar = false, index = 0) => {
    const title = makeTitle(book);
    const bookId = book.id_book || book.id;

    return (
      <Tooltip
        key={`${getCalendarDateKey(date)}-${bookId || index}`}
        title={title}
        placement='top'
      >
        <button
          type='button'
          className={
            calendar ? "read-history__calendar-book" : "read-history__book"
          }
          onClick={() => handleBookClick(bookId)}
          aria-label={`Voir ${title}`}
        >
          <img src={book.image} alt={title} loading='lazy' />

          {!calendar && (
            <span className='read-history__book-date'>
              {formatBookDate(date)}
            </span>
          )}
        </button>
      </Tooltip>
    );
  };

  // Chronologie : une seule ligne horizontale par mois.
  const renderTimeline = () => (
    <div className='read-history__timeline'>
      {months.map((monthKey) => {
        const monthEntries = monthGroups[monthKey];

        const monthBooks = monthEntries.flatMap((entry) =>
          entry.books.map((book, index) => ({
            book,
            date: entry.date,
            dateKey: entry.dateKey,
            index,
          })),
        );

        return (
          <div className='read-history__month' key={monthKey}>
            <div className='read-history__month-marker'>
              <span className='read-history__month-dot' />

              <h3>{formatMonth(monthKey)}</h3>

              <span className='read-history__month-count'>
                {monthBooks.length}{" "}
                {monthBooks.length > 1 ? "lectures" : "lecture"}
              </span>
            </div>

            <div className='read-history__month-books'>
              {monthBooks.map(({ book, date, dateKey, index }) =>
                renderBook(book, date, false, `${dateKey}-${index}`),
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Calendrier mensuel.
  const renderCalendar = () => {
    const monthDate = getMonthDate(activeMonth);
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;

    const calendarDays = [
      ...Array(firstWeekday).fill(null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];

    while (calendarDays.length % 7 !== 0) {
      calendarDays.push(null);
    }

    return (
      <div className='read-history__calendar'>
        <div className='read-history__calendar-navigation'>
          <IconButton
            onClick={() => handleMonthChange(-1)}
            disabled={!canGoToPreviousMonth}
            aria-label='Mois précédent'
          >
            <FaChevronLeft />
          </IconButton>

          <h3>{formatMonth(activeMonth)}</h3>

          <IconButton
            onClick={() => handleMonthChange(1)}
            disabled={!canGoToNextMonth}
            aria-label='Mois suivant'
          >
            <FaChevronRight />
          </IconButton>
        </div>

        <div className='read-history__calendar-grid'>
          {["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."].map(
            (day) => (
              <div key={day} className='read-history__calendar-weekday'>
                {day}
              </div>
            ),
          )}

          {calendarDays.map((day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className='read-history__calendar-cell is-empty'
                />
              );
            }

            const date = new Date(year, month, day);
            const dateKey = getCalendarDateKey(date);
            const books = booksByDay[dateKey] || [];

            return (
              <div
                key={dateKey}
                className={`read-history__calendar-cell ${
                  books.length ? "has-books" : ""
                }`}
              >
                <button
                  type='button'
                  className='read-history__calendar-day-number'
                  onClick={
                    books.length ? () => handleOpenDay(date, books) : undefined
                  }
                  disabled={!books.length}
                  aria-label={
                    books.length
                      ? `Voir les ${books.length} albums lus le ${formatFullDate(date)}`
                      : `Le ${day}`
                  }
                >
                  {day}
                </button>

                {books.length > 0 && (
                  <div className='read-history__calendar-books'>
                    {books
                      .slice(0, 3)
                      .map((book, index) =>
                        renderBook(book, date, true, index),
                      )}

                    {books.length > 3 && (
                      <button
                        type='button'
                        className='read-history__calendar-more'
                        onClick={() => handleOpenDay(date, books)}
                        aria-label={`Voir les ${books.length} albums lus le ${formatFullDate(
                          date,
                        )}`}
                      >
                        +{books.length - 3}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (entries.length === 0) {
    return (
      <div className='read-history__empty'>
        <FaBookOpen />
        <span>Aucune lecture pour le moment.</span>
      </div>
    );
  }

  return (
    <div className='read-history'>
      <div className='read-history__toolbar'>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          size='small'
          className='read-history__view-toggle'
        >
          <ToggleButton value='timeline'>
            <FaStream />
            <span>Chronologie</span>
          </ToggleButton>

          <ToggleButton value='calendar'>
            <FaCalendarAlt />
            <span> Calendrier</span>
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {view === "timeline" ? renderTimeline() : renderCalendar()}

      <Dialog
        open={Boolean(selectedDay)}
        onClose={handleCloseDay}
        maxWidth='sm'
        fullWidth
        aria-labelledby='read-history-day-dialog-title'
        className='read-history__day-dialog'
      >
        {selectedDay && (
          <>
            <DialogTitle id='read-history-day-dialog-title' disableTypography>
              <div className='read-history__day-dialog-header'>
                <div>
                  <h3>{formatFullDate(selectedDay.date)}</h3>
                  <span>
                    {selectedDay.books.length}{" "}
                    {selectedDay.books.length > 1 ? "albums lus" : "album lu"}
                  </span>
                </div>

                <IconButton onClick={handleCloseDay} aria-label='Fermer'>
                  <FaTimes />
                </IconButton>
              </div>
            </DialogTitle>

            <DialogContent>
              <div className='read-history__day-dialog-books'>
                {selectedDay.books.map((book, index) => {
                  const title = makeTitle(book);
                  const bookId = book.id_book || book.id;

                  return (
                    <button
                      type='button'
                      key={`${bookId || title}-${index}`}
                      className='read-history__day-dialog-book'
                      onClick={() => handleBookClick(bookId)}
                    >
                      <img src={book.image} alt={title} loading='lazy' />
                      <span>{title}</span>
                    </button>
                  );
                })}
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  );
}

export default ReadHistory;
