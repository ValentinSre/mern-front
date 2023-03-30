import React from "react";
import Tooltip from "@material-ui/core/Tooltip";

import "./BookCalendar.css";

function BookCalendar({ month, books }) {
  // Group books by release date
  const booksByDate = books.reduce((acc, book) => {
    const releaseDate = book.releaseDate.toISOString().slice(0, 10); // Keep only YYYY-MM-DD
    if (!acc[releaseDate]) {
      acc[releaseDate] = [];
    }
    acc[releaseDate].push(book);
    return acc;
  }, {});

  const dates = Object.keys(booksByDate);

  return (
    <div className='book-calendar'>
      <div className='book-calendar-header'>{month}</div>
      <div className='book-calendar-days'>
        {dates.map((date) => (
          <div className='book-calendar-day__div'>
            <div className='book-calendar-day-label'>
              Sorties du {new Date(date).getDate()} {month}
            </div>
            <div key={date} className='book-calendar-day'>
              <div className='book-calendar-day-books'>
                {booksByDate[date].map((book) => (
                  <Tooltip title={book.title}>
                    <img key={book.id} src={book.cover} alt={book.title} />
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookCalendar;
