import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import makeTitle from "../../shared/util/makeTitle";

import "./WeeklyReleases.css";
import { Tooltip } from "@material-ui/core";

const WEEK_DAYS = {
  1: "Lundi",
  2: "Mardi",
  3: "Mercredi",
  4: "Jeudi",
  5: "Vendredi",
  6: "Samedi",
  0: "Dimanche",
};

const formalizeDay = (date) => {
  const formalizedDate = new Date(date);
  const day = formalizedDate.getDay();
  const dayNumber = formalizedDate.getDate();

  return `${WEEK_DAYS[day]} ${dayNumber}`;
};

const BookItem = ({ book }) => {
  const history = useHistory();

  const openPreview = () => {
    history.push(`/book/${book.id}`);
  };

  return (
    <Tooltip title={makeTitle(book)}>
      <div className='calendar_book-item' onClick={openPreview}>
        <img
          src={book.image}
          alt={book.titre}
          className='calendar_book-image'
        />
        <div className='calendar_book-info'>
          <p className='calendar_book-date'>
            {formalizeDay(book.date_parution)}
          </p>
        </div>
      </div>
    </Tooltip>
  );
};

const WeeklyReleases = ({ books }) => {
  const [expanded, setExpanded] = useState(false);
  const [currentWeekBooks, setCurrentWeekBooks] = useState([]);
  const [monthlyBooks, setMonthlyBooks] = useState({});

  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((d.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  };

  const sortBooksByDate = (bookList) =>
    bookList.sort(
      (a, b) => new Date(a.date_parution) - new Date(b.date_parution)
    );

  const groupBooksByWeek = () => {
    const now = new Date();
    const currentWeek = getWeekNumber(now);
    const currentYear = now.getFullYear();

    const futureBooks = Object.values(books)
      .flat()
      .map((book) => ({
        ...book,
        week: getWeekNumber(book.date_parution),
        year: new Date(book.date_parution).getFullYear(),
      }))
      .filter((book) => {
        const bookDate = new Date(book.date_parution);
        return (
          bookDate >= now ||
          book.year > currentYear ||
          (book.year === currentYear && book.week >= currentWeek)
        );
      });

    const groupedBooks = {};
    futureBooks.forEach((book) => {
      const weekKey = `${book.year}-S${book.week}`;
      if (!groupedBooks[weekKey]) groupedBooks[weekKey] = [];
      groupedBooks[weekKey].push(book);
    });

    Object.keys(groupedBooks).forEach((key) => {
      groupedBooks[key] = sortBooksByDate(groupedBooks[key]);
    });

    const sortedWeeks = Object.entries(groupedBooks).sort(([a], [b]) => {
      const [yearA, weekA] = a.split("-S").map(Number);
      const [yearB, weekB] = b.split("-S").map(Number);
      return yearA === yearB ? weekA - weekB : yearA - yearB;
    });

    return {
      currentWeekBooks: groupedBooks[`${currentYear}-S${currentWeek}`] || [],
      futureWeeksBooks: Object.fromEntries(
        sortedWeeks.filter(([key]) => key !== `${currentYear}-S${currentWeek}`)
      ),
    };
  };

  useEffect(() => {
    const { currentWeekBooks, futureWeeksBooks } = groupBooksByWeek();
    setCurrentWeekBooks(currentWeekBooks);
    setMonthlyBooks(futureWeeksBooks);
  }, [books]);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div className='weekly-releases-container'>
      <div className='calendar_header'>
        <h2></h2>
        {/* <h2>Sorties de la semaine</h2> */}
        <button className='expand-calendar-btn' onClick={toggleExpanded}>
          {expanded ? "Réduire" : "Voir tout"}
        </button>
      </div>

      <div className='releases-list'>
        <div className='date-section'>
          <h3 className='release-date'>Cette semaine</h3>
          <div className='calendar_book-list horizontal-scroll'>
            {currentWeekBooks.map((book, idx) => (
              <BookItem key={idx} book={book} />
            ))}
          </div>
        </div>

        {expanded &&
          Object.keys(monthlyBooks).map((weekKey) => {
            const [year, week] = weekKey.split("-S");
            return (
              <div key={weekKey} className='date-section past-release'>
                <h3 className='release-date'>
                  Semaine {week} (<i>{year}</i>)
                </h3>
                <div className='calendar_book-list horizontal-scroll'>
                  {monthlyBooks[weekKey].map((book, idx) => (
                    <BookItem key={idx} book={book} />
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

WeeklyReleases.propTypes = {
  books: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        date_parution: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        serie: PropTypes.string,
        titre: PropTypes.string.isRequired,
        tome: PropTypes.number,
        version: PropTypes.string,
        id: PropTypes.string.isRequired,
      })
    )
  ).isRequired,
};

export default WeeklyReleases;
