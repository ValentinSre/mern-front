import React from "react";

// import "./HomeLoaded.css";
import WeeklyReleases from "./WeeklyReleases";

const HomeLoaded = ({ booksToRelease }) => {
  const booksByDate = booksToRelease.reduce((acc, book) => {
    const { date_parution } = book;
    const releaseDate = new Date(date_parution).toISOString().slice(0, 10); // Keep only YYYY-MM-DD
    if (!acc[releaseDate]) {
      acc[releaseDate] = [];
    }
    acc[releaseDate].push(book);
    return acc;
  }, {});

  return <WeeklyReleases books={booksByDate} />;
};

export default HomeLoaded;
