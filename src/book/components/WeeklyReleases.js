import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import makeTitle from "../../shared/util/makeTitle";

import "./WeeklyReleases.css";
import { Tooltip } from "@material-ui/core";

// Move to variables file
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
const BookItem = ({ book }) => (
  <Tooltip title={makeTitle(book)}>
    <div className='book-item'>
      <img src={book.image} alt={book.titre} className='book-image' />
      <div className='book-info'>
        <p className='book-date'>{formalizeDay(book.date_parution)}</p>
      </div>
    </div>
  </Tooltip>
);

BookItem.propTypes = {
  book: PropTypes.shape({
    date_parution: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    serie: PropTypes.string,
    titre: PropTypes.string.isRequired,
    tome: PropTypes.number,
    version: PropTypes.string,
  }).isRequired,
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

  const sortBooksByDate = (bookList) => {
    return bookList.sort(
      (a, b) => new Date(a.date_parution) - new Date(b.date_parution)
    );
  };

  const getCurrentWeekBooks = () => {
    const now = new Date();
    const currentWeekNumber = getWeekNumber(now);
    let weekBooks = [];

    Object.keys(books).forEach((date) => {
      const bookDate = new Date(date);
      const bookWeekNumber = getWeekNumber(bookDate);
      if (bookWeekNumber === currentWeekNumber) {
        weekBooks = weekBooks.concat(books[date]);
      }
    });

    return sortBooksByDate(weekBooks);
  };

  const groupBooksByWeek = () => {
    const groupedBooks = {};

    Object.keys(books).forEach((date) => {
      const bookWeekNumber = getWeekNumber(date);

      if (!groupedBooks[bookWeekNumber]) {
        groupedBooks[bookWeekNumber] = [];
      }

      groupedBooks[bookWeekNumber] = groupedBooks[bookWeekNumber].concat(
        books[date]
      );
    });

    Object.keys(groupedBooks).forEach((week) => {
      groupedBooks[week] = sortBooksByDate(groupedBooks[week]);
    });

    return groupedBooks;
  };

  useEffect(() => {
    setCurrentWeekBooks(getCurrentWeekBooks());
    setMonthlyBooks(groupBooksByWeek());
  }, [books]);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div className='weekly-releases-container'>
      <div className='header'>
        <h2></h2>
        {/* <h2>Sorties de la semaine</h2> */}
        <button className='toggle-btn' onClick={toggleExpanded}>
          {expanded ? "Réduire" : "Voir tout"}
        </button>
      </div>

      <div className='releases-list'>
        <div className='date-section'>
          <h3 className='release-date'>Cette semaine</h3>
          <div className='book-list horizontal-scroll'>
            {currentWeekBooks.map((book, idx) => (
              <BookItem key={idx} book={book} />
            ))}
          </div>
        </div>

        {expanded &&
          Object.keys(monthlyBooks)
            .filter(
              (weekNumber) =>
                weekNumber > getWeekNumber(new Date()) &&
                !currentWeekBooks.includes(monthlyBooks[weekNumber])
            )
            .map((weekNumber) => (
              <div key={weekNumber} className='date-section past-release'>
                <h3 className='release-date'>Semaine {weekNumber}</h3>
                <div className='book-list horizontal-scroll'>
                  {monthlyBooks[weekNumber].map((book, idx) => (
                    <BookItem key={idx} book={book} />
                  ))}
                </div>
              </div>
            ))}
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
      })
    )
  ).isRequired,
};

export default WeeklyReleases;
