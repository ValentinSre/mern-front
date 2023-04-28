import React, { useState, useContext } from "react";
import PropTypes from "prop-types";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
import BookDetails from "./components/BookDetails";
import DateModal from "../../../shared/components/UIElements/DateModal";

import "./DisplayBook.css";

const DisplayBook = ({ book: initialBook }) => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [book, setBook] = useState(initialBook);

  const [openCollectionModal, setOpenCollectionModal] = useState(false);
  const [dateObtention, setDateObtention] = useState(book.date_achat);
  const [openReadModal, setOpenReadModal] = useState(false);
  const [dateLecture, setDateLecture] = useState(book.date_lecture);

  const handleOpenCollectionModal = () => {
    setOpenCollectionModal(true);
  };

  const handleOpenReadModal = () => {
    setOpenReadModal(true);
  };

  const handleAddToCollection = () => {
    const bookId = book.id;
    handleAddToList([bookId], "collection");
  };

  const handleAddToWishlist = () => {
    const bookId = book.id;
    handleAddToList([bookId], "wishlist");
  };

  const handleAddToReadlist = async () => {
    const bookId = book.id;

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_API_URL + "/collection/edit",
        "POST",
        JSON.stringify({
          id_book: bookId,
          id_user: auth.userId,
          lu: true,
          date_lecture: dateLecture,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      const { success } = responseData;
      if (success)
        setBook({ ...book, lu: true, date_lecture: new Date(dateLecture) });
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToList = async (bookIds, listName) => {
    try {
      const requestData = await sendRequest(
        process.env.REACT_APP_API_URL + "/collection/add",
        "POST",
        JSON.stringify({
          ids_book: bookIds,
          id_user: auth.userId,
          list_name: listName,
          book: book,
          date_achat: dateObtention,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      setBook(requestData.book);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <React.Fragment>
      <DateModal
        open={openCollectionModal}
        handleClose={() => setOpenCollectionModal(false)}
        date={dateObtention}
        authorizeNoDate
        label="Date d'achat"
        title='Quand avez-vous acheté ce livre ?'
        handleChange={(e) => setDateObtention(e.target.value)}
        handleSubmit={handleAddToCollection}
      />
      <DateModal
        open={openReadModal}
        handleClose={() => setOpenReadModal(false)}
        date={dateLecture}
        authorizeNoDate
        label='Date de lecture'
        title='Quand avez-vous lu ce livre ?'
        handleChange={(e) => setDateLecture(e.target.value)}
        handleSubmit={handleAddToReadlist}
      />
      <BookDetails
        book={book}
        handleCollection={handleOpenCollectionModal}
        handleWishlist={handleAddToWishlist}
        handleRead={handleOpenReadModal}
      />
    </React.Fragment>
  );
};

DisplayBook.propTypes = {
  book: PropTypes.shape({
    image: PropTypes.string.isRequired,
    titre: PropTypes.string.isRequired,
  }).isRequired,
};

export default DisplayBook;
