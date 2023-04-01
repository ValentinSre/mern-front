import React from "react";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import "./Rating.css";

function Star(props) {}

export default function Rating(props) {
  const { rating, size, real } = props;
  const stars = [];

  const realRating = real ? rating : 0;
  // const color = props.real ? "#f8e825" : "#ccc";

  const color = real
    ? rating >= 3.5
      ? "#06b87f"
      : rating <= 1.5
      ? "#cb1515"
      : "#fd6608"
    : "#ccc";

  for (let i = 1; i <= 5; i++) {
    if (i <= realRating) {
      stars.push(<BsStarFill key={i} size={size} style={{ color: color }} />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(realRating)) {
      stars.push(<BsStarHalf key={i} size={size} style={{ color: color }} />);
    } else {
      stars.push(<BsStar key={i} size={size} style={{ color: color }} />);
    }
  }

  return <div className='rating'>{stars}</div>;
}
