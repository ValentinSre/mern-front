import React from "react";
import makeTitle from "../../shared/util/makeTitle";
import { Tooltip, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@material-ui/lab";

import variables from "../../shared/util/variables";

import "./ReadHistory.css";

const { months } = variables;

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "5px 10px",
    width: "80%",
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
  oppositeContent: {
    flex: 0.2,
    marginRight: theme.spacing(2),
  },
}));

function ReadHistory({ readlist }) {
  const history = useHistory();
  const classes = useStyles();

  if (!readlist) return null;

  const releaseDates = Object.keys(readlist);

  const datesByMonth = releaseDates.reduce((acc, date) => {
    const month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();
    const monthYear = `${year}-${month}`;
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(date);
    return acc;
  }, {});

  const releaseMonths = Object.keys(datesByMonth);

  const displayMonthYear = (date) => {
    const year = date.slice(0, 4);
    const month = date.slice(5);
    return `${months[month]} ${year}`;
  };

  const handleBookClick = (bookId) => {
    history.push(`/book/${bookId}`);
  };

  return (
    <Timeline style={{ width: "100%", marginLeft: "0" }} sx={{ flex: 0.2 }}>
      {releaseMonths.map((selectedMonth) =>
        datesByMonth[selectedMonth].map((date, index) => (
          <TimelineItem key={date}>
            <TimelineOppositeContent className={classes.oppositeContent}>
              {!index && (
                <div className="display_month">
                  {displayMonthYear(selectedMonth)}
                </div>
              )}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                style={{
                  backgroundColor: "#ffde59",
                  color: "#fff",
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
            <TimelineContent className="timeline_content">
              <div>
                <Paper elevation={3} className={classes.paper}>
                  <div className="read-history__day-books">
                    {readlist[date].map((book) => (
                      <div
                        key={book.id}
                        onClick={() => handleBookClick(book.id_book)}
                      >
                        <Tooltip title={makeTitle(book)}>
                          <div>
                            <img src={book.image} alt={makeTitle(book)} />
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

export default ReadHistory;
