import React from "react";
import PropTypes from "prop-types";

import BookDetails from "./components/BookDetails";
import "./DisplayBook.css";

const DisplayBook = ({ book }) => {
  const handleAddToCollection = () => {
    console.log("Add to collection");
  };

  const handleAddToWishlist = () => {
    console.log("Add to wishlist");
  };

  const handleAddToReadlist = () => {
    console.log("Add to readlist");
  };

  return (
    <BookDetails
      book={book}
      handleCollection={handleAddToCollection}
      handleWishlist={handleAddToWishlist}
      handleRead={handleAddToReadlist}
    />
  );
};

DisplayBook.propTypes = {
  book: PropTypes.shape({
    image: PropTypes.string.isRequired,
    titre: PropTypes.string.isRequired,
  }).isRequired,
};

export default DisplayBook;
