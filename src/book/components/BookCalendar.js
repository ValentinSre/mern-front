import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "../../shared/util/TabPanel";

import { makeStyles } from "@material-ui/core/styles";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import LaptopMacIcon from "@material-ui/icons/LaptopMac";
import HotelIcon from "@material-ui/icons/Hotel";
import RepeatIcon from "@material-ui/icons/Repeat";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import makeTitle from "../../shared/util/makeTitle";

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
    <Timeline align="alternate" style={{ width: "90%" }}>
      {releaseMonths.map((selectedMonth) =>
        datesByMonth[selectedMonth].map((date, index) => (
          <TimelineItem>
            <TimelineOppositeContent>
              {!index && (
                <Typography variant="body2" style={{ color: "#ffffff" }}>
                  {months[selectedMonth]}
                </Typography>
              )}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot>
                <div>
                  {(new Date(date).getDate() < 10 ? "0" : "") +
                    new Date(date).getDate()}
                </div>
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
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
    padding: "6px 16px",
    height: "400px",
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));
