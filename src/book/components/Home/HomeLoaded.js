import React, { useContext } from "react";
import { AuthContext } from "../../../shared/context/auth-context";

import WeeklyReleases from "./WeeklyReleases";
import HomePurchases from "./HomePurchases";
import HomeActivity from "./HomeActivity";
import HomeSuggestions from "./HomeSuggestions";
import HomeReadlist from "./HomeReadlist";
import HomeLists from "./HomeLists";

const HomeLoaded = ({ booksToRelease, homePurchases, homeActivities }) => {
  const auth = useContext(AuthContext);

  const booksByDate = booksToRelease.reduce((acc, book) => {
    const { date_parution } = book;
    const releaseDate = new Date(date_parution).toISOString().slice(0, 10);

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
      <WeeklyReleases books={booksByDate} isLoggedIn={auth.isLoggedIn} />

      {auth.isLoggedIn && <HomeActivity activities={homeActivities} />}
      {auth.isLoggedIn && <HomeReadlist />}
      {auth.isLoggedIn && <HomeLists />}
      {auth.isLoggedIn && <HomeSuggestions />}
      {auth.isLoggedIn && (
        <HomePurchases purchases={homePurchases} userId={auth.userId} />
      )}
    </div>
  );
};

export default HomeLoaded;
