import React from "react";

import "./NextContent.css";

const NextContent = ({ marvelContent }) => {
  return (
    <div className='card'>
      <h2>Prochaine suggestion...</h2>
      <img src={marvelContent.poster} alt={marvelContent.title} />
      <h3>{marvelContent.title}</h3>
    </div>
  );
};

export default NextContent;
