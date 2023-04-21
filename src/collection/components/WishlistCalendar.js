import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "../../shared/util/TabPanel";

import makeTitle from "../../shared/util/makeTitle";

import "./WishlistCalendar.css";

import variables from "../../shared/util/variables";

const { months } = variables;

function WishlistCalendar({ books }) {
  const history = useHistory();

  // Group books by release date
  const booksByDate = books.reduce((acc, book) => {
    const { date_parution } = book;
    const releaseDate = new Date(date_parution).toISOString().slice(0, 10); // Keep only YYYY-MM-DD
    if (!acc[releaseDate]) {
      acc[releaseDate] = [];
    }
    acc[releaseDate].push(book);
    return acc;
  }, {});

  const releaseDates = Object.keys(booksByDate);

  // Sort dates by ascending order
  releaseDates.sort((a, b) => new Date(a) - new Date(b));

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

  // Calculate the price for each month
  const pricesByMonth = releaseMonths.reduce((acc, month) => {
    const prices = datesByMonth[month].reduce((acc, date) => {
      const books = booksByDate[date];
      const price = books.reduce((acc, book) => {
        const { prix } = book;
        return acc + prix;
      }, 0);
      return acc + price;
    }, 0);
    acc[month] = prices;
    return acc;
  }, {});

  return (
    <div className="wishlist-calendar">
      {books && books.length > 0 && (
        <React.Fragment>
          <Tabs
            className="wishlist-calendar-header"
            value={selectedMonth}
            onChange={(event, newValue) => setSelectedMonth(newValue)}
            centered
            style={{
              color: "#000",
              fontWeight: "bolder",
            }}
            indicatorColor="#ffde59"
          >
            {releaseMonths.map((month) => (
              <Tab key={month} label={months[month]} value={month} />
            ))}
          </Tabs>
          <TabPanel value={selectedMonth} index={selectedMonth}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginLeft: "30px", marginBottom: "20px" }}>
                Dépenses prévues du mois :{" "}
                <strong>{pricesByMonth[selectedMonth].toFixed(2)}€</strong>
              </div>
            </div>
            {datesByMonth[selectedMonth].map((date) => (
              <div className="wishlist-calendar-day__div">
                <div className="wishlist-calendar-day-label">
                  {new Date(date).getDate()}
                  {new Date(date).getDate() === 1 ? "er" : null}{" "}
                  {months[selectedMonth]}
                </div>

                <div key={date} className="wishlist-calendar-day">
                  <div className="wishlist-calendar-day-books">
                    {booksByDate[date].map((book) => (
                      <div onClick={() => history.push(`/book/${book.id}`)}>
                        <Tooltip title={makeTitle(book)}>
                          <div key={book.id}>
                            <img
                              key={book.id}
                              src={book.image}
                              alt={makeTitle(book)}
                            />
                          </div>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </TabPanel>
        </React.Fragment>
      )}
    </div>
  );
}

export default WishlistCalendar;
