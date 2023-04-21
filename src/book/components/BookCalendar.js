import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";

import { makeStyles } from "@material-ui/core/styles";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import Paper from "@material-ui/core/Paper";

import makeTitle from "../../shared/util/makeTitle";
import variables from "../../shared/util/variables";

import "./BookCalendar.css";

const { months } = variables;

function BookCalendar({ books }) {
  const history = useHistory();
  const classes = useStyles();

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

  // const [selectedMonth, setSelectedMonth] = useState(releaseMonths[0]);

  return (
    <Timeline align="alternate" style={{ width: "100%" }}>
      {releaseMonths.map((selectedMonth) =>
        datesByMonth[selectedMonth].map((date, index) => (
          <TimelineItem>
            <TimelineOppositeContent>
              {!index && (
                <div className="month_displayer">{months[selectedMonth]}</div>
              )}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                style={{
                  backgroundColor: "#ffde59",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                <div>
                  {(new Date(date).getDate() < 10 ? "0" : "") +
                    new Date(date).getDate()}
                </div>
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent className="timelineContent">
              <div>
                <Paper elevation={3} className={classes.paper}>
                  <div className="book-calendar-day-books">
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
                </Paper>
              </div>
            </TimelineContent>
          </TimelineItem>
        ))
      )}
    </Timeline>
  );
}

export default BookCalendar;

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "5px 10px",
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));
