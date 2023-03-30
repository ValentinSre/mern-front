import React, { useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "../../shared/util/TabPanel";

import "./BookCalendar.css";

const months = {
  1: "Janvier",
  2: "Février",
  3: "Mars",
  4: "Avril",
  5: "Mai",
  6: "Juin",
  7: "Juillet",
  8: "Août",
  9: "Septembre",
  10: "Octobre",
  11: "Novembre",
  12: "Décembre",
};

function BookCalendar({ books }) {
  // Group books by release date
  const booksByDate = books.reduce((acc, book) => {
    const releaseDate = book.releaseDate.toISOString().slice(0, 10); // Keep only YYYY-MM-DD
    if (!acc[releaseDate]) {
      acc[releaseDate] = [];
    }
    acc[releaseDate].push(book);
    return acc;
  }, {});

  const releaseDates = Object.keys(booksByDate);

  // Group dates by month
  const datesByMonth = releaseDates.reduce((acc, date) => {
    const month = new Date(date).getMonth() + 1;
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(date);
    return acc;
  }, {});

  const releaseMonths = Object.keys(datesByMonth);

  const [selectedMonth, setSelectedMonth] = useState(releaseMonths[0]);

  return (
    <div className='book-calendar'>
      <Tabs
        className='book-calendar-header'
        value={selectedMonth}
        onChange={(event, newValue) => setSelectedMonth(newValue)}
        centered
      >
        {releaseMonths.map((month) => (
          <Tab key={month} label={months[month]} value={month} />
        ))}
      </Tabs>
      <TabPanel value={selectedMonth} index={selectedMonth}>
        {datesByMonth[selectedMonth].map((date) => (
          <div className='book-calendar-day__div'>
            <div className='book-calendar-day-label'>
              Sorties du {new Date(date).getDate()}
              {new Date(date).getDate() === 1 ? "er" : null}{" "}
              {months[selectedMonth]}
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
      </TabPanel>
    </div>
  );
}

{
  /* <div className='book-calendar-header'>{month}</div>
<div className='book-calendar-days'>
  {releaseDates.map((date) => (
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
</div> */
}

export default BookCalendar;
