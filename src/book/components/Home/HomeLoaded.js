import React, { useContext } from "react";
import { AuthContext } from "../../../shared/context/auth-context";

import WeeklyReleases from "./WeeklyReleases";
import { CollectionRedirection } from "./CollectionRedirection";

const HomeLoaded = ({ booksToRelease }) => {
  const auth = useContext(AuthContext);

  const booksByDate = booksToRelease.reduce((acc, book) => {
    const { date_parution } = book;
    const releaseDate = new Date(date_parution).toISOString().slice(0, 10); // Keep only YYYY-MM-DD
    if (!acc[releaseDate]) {
      acc[releaseDate] = [];
    }
    acc[releaseDate].push(book);
    return acc;
  }, {});

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
      }}
    >
      <WeeklyReleases books={booksByDate} />
      {auth.isLoggedIn && <CollectionRedirection userId={auth.userId} />}
    </div>
  );
};

export default HomeLoaded;
