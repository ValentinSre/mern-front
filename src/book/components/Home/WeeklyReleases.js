import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import makeTitle from "../../../shared/util/makeTitle";
import { useHttpClient } from "../../../shared/hooks/http-hook";

import "./WeeklyReleases.css";

const WEEK_DAYS = {
  1: "Lundi",
  2: "Mardi",
  3: "Mercredi",
  4: "Jeudi",
  5: "Vendredi",
  6: "Samedi",
  0: "Dimanche",
};

const getStartOfWeek = (date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);

  const day = result.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;

  result.setDate(result.getDate() - daysSinceMonday);

  return result;
};

const formatWeekLabel = (weekStart) => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();

  const startMonth = weekStart.toLocaleDateString("fr-FR", {
    month: "short",
  });

  const endMonth = weekEnd.toLocaleDateString("fr-FR", {
    month: "short",
  });

  const endYear = weekEnd.getFullYear();

  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return `${startDay}–${endDay} ${startMonth} ${endYear}`;
  }

  return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${endYear}`;
};

const BookItem = ({ book }) => {
  const history = useHistory();

  const openPreview = () => {
    history.push(`/book/${book.id}`);
  };

  const date = new Date(book.date_parution);
  const dayName = WEEK_DAYS[date.getDay()].slice(0, 4);
  const dayNumber = date.getDate();

  return (
    <Tooltip title={makeTitle(book)}>
      <div className='calendar_book-item' onClick={openPreview}>
        <div className='calendar_book-cover'>
          <img
            src={book.image}
            alt={book.titre}
            className='calendar_book-image'
          />

          <span className='calendar_book-release-date'>
            {dayName}. {dayNumber}
          </span>
        </div>

        <div className='calendar_book-info'>
          <p className='calendar_book-title'>{makeTitle(book)}</p>
          <p className='calendar_book-type'>{book.type || "Livre"}</p>
        </div>
      </div>
    </Tooltip>
  );
};

const WeeklyReleases = () => {
  const { isLoading, error, sendRequest } = useHttpClient();

  const [books, setBooks] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [displayedWeek, setDisplayedWeek] = useState(null);
  const [futureWeeks, setFutureWeeks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/book/future-releases`,
        );

        setBooks(responseData.books || []);
      } catch (err) {
        setBooks([]);
      }
    };

    fetchBooks();
  }, [sendRequest]);

  useEffect(() => {
    const sortBooksByDate = (bookList) =>
      [...bookList].sort(
        (a, b) => new Date(a.date_parution) - new Date(b.date_parution),
      );

    const groupBooksByWeek = () => {
      const now = new Date();
      const currentWeekStart = getStartOfWeek(now);

      const groupedBooks = {};

      books.forEach((book) => {
        const bookDate = new Date(book.date_parution);
        const weekStart = getStartOfWeek(bookDate);

        // Ignore uniquement les semaines entièrement passées.
        if (weekStart < currentWeekStart) {
          return;
        }

        const weekKey = weekStart.toISOString().slice(0, 10);

        if (!groupedBooks[weekKey]) {
          groupedBooks[weekKey] = {
            start: weekStart,
            books: [],
          };
        }

        groupedBooks[weekKey].books.push(book);
      });

      const sortedWeeks = Object.values(groupedBooks)
        .map((week) => ({
          ...week,
          books: sortBooksByDate(week.books),
        }))
        .sort((a, b) => a.start - b.start);

      const currentWeek = sortedWeeks.find(
        (week) => week.start.getTime() === currentWeekStart.getTime(),
      );

      if (currentWeek) {
        return {
          displayedWeek: {
            ...currentWeek,
            isCurrentWeek: true,
          },
          futureWeeks: sortedWeeks.filter(
            (week) => week.start > currentWeekStart,
          ),
        };
      }

      const firstFutureWeek = sortedWeeks[0];

      return {
        displayedWeek: firstFutureWeek
          ? {
              ...firstFutureWeek,
              isCurrentWeek: false,
            }
          : null,
        futureWeeks: sortedWeeks.slice(1),
      };
    };

    const { displayedWeek, futureWeeks } = groupBooksByWeek();

    setDisplayedWeek(displayedWeek);
    setFutureWeeks(futureWeeks);
  }, [books]);

  const toggleExpanded = () => setExpanded(!expanded);

  if (isLoading) {
    return (
      <div className='weekly-releases-container'>
        <div className='calendar_header'>
          <span className='section-kicker'>Sorties à venir</span>
        </div>

        <div className='weekly-releases-skeleton'>
          <div className='weekly-releases-skeleton-title' />

          <div className='calendar_book-list horizontal-scroll'>
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className='weekly-releases-skeleton-card'>
                <div className='weekly-releases-skeleton-cover' />
                <div className='weekly-releases-skeleton-line' />
                <div className='weekly-releases-skeleton-line short' />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='weekly-releases-container'>
        <div className='calendar_header'>
          <span className='section-kicker'>Sorties à venir</span>
        </div>

        <p className='weekly-releases-message'>
          Impossible de charger les sorties à venir.
        </p>
      </div>
    );
  }

  return (
    <div className='weekly-releases-container'>
      <div className='calendar_header'>
        <Link to='/wishlist' className='section-kicker my-releases-link'>
          <span className='releases-label-default'>Sorties à venir</span>
          <span className='releases-label-hover'>Ma wishlist</span>
        </Link>

        <button className='expand-calendar-btn' onClick={toggleExpanded}>
          {expanded ? "Réduire" : "Voir tout"}
        </button>
      </div>

      <div className='releases-list'>
        {displayedWeek && (
          <div className='date-section'>
            <h3 className='release-date'>
              {displayedWeek.isCurrentWeek
                ? "Cette semaine"
                : `Semaine du ${formatWeekLabel(displayedWeek.start)}`}
            </h3>

            <div className='calendar_book-list horizontal-scroll'>
              {displayedWeek.books.map((book) => (
                <BookItem key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}

        {expanded &&
          futureWeeks.map((week) => (
            <div key={week.start.toISOString()} className='date-section'>
              <h3 className='release-date'>
                Semaine du {formatWeekLabel(week.start)}
              </h3>

              <div className='calendar_book-list horizontal-scroll'>
                {week.books.map((book) => (
                  <BookItem key={book.id} book={book} />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default WeeklyReleases;
