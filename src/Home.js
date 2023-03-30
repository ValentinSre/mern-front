import React from "react";

import BookCalendar from "./book/components/BookCalendar";

const livres = [
  {
    releaseDate: new Date("2023-03-01"),
    title: "Le livre 1",
    cover:
      "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/81aCBz5-N6L.jpg",
    id: "1",
  },
  {
    releaseDate: new Date("2023-03-04"),
    title: "Le livre 2",
    cover:
      "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/81aCBz5-N6L.jpg",
    id: "2",
  },
  {
    releaseDate: new Date("2023-03-04"),
    title: "Le livre 3",
    cover:
      "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/81aCBz5-N6L.jpg",
    id: "3",
  },
  {
    releaseDate: new Date("2023-03-04"),
    title: "Le livre 4",
    cover:
      "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/81aCBz5-N6L.jpg",
    id: "4",
  },
  {
    releaseDate: new Date("2023-03-04"),
    title: "Le livre 5",
    cover:
      "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/81aCBz5-N6L.jpg",
    id: "5",
  },
  {
    releaseDate: new Date("2023-03-18"),
    title: "Le livre 6",
    cover:
      "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/81aCBz5-N6L.jpg",
    id: "6",
  },
  {
    releaseDate: new Date("2023-03-21"),
    title: "Le livre 7",
    cover:
      "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/81aCBz5-N6L.jpg",
    id: "7",
  },
];

const Home = () => {
  return (
    <div style={{ margin: "auto", padding: 10, textAlign: "center" }}>
      <h1>Home</h1>
      <BookCalendar month='Mars 2023' books={livres} />
    </div>
  );
};

export default Home;
