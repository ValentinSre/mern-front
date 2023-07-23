import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
import BookDetails from "./components/BookDetails";
import DateModal from "../../../shared/components/UIElements/DateModal";
import CustomButtons from "../../../shared/components/UIElements/CustomButtons";
import EditBookDialog from "./components/EditBookDialog";

import "./DisplayBook.css";

const DisplayBook = ({ book: initialBook }) => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [book, setBook] = useState(initialBook);

  const [openCollectionModal, setOpenCollectionModal] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [dateObtention, setDateObtention] = useState(book.date_achat);
  const [openReadModal, setOpenReadModal] = useState(false);
  const [dateLecture, setDateLecture] = useState(book.date_lecture);

  useEffect(() => {
    setBook(initialBook);
  }, [initialBook]);

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
      if (success) {
        if (dateLecture) {
          setBook({
            ...book,
            lu: true,
            read_dates: book.read_dates
              ? [...book.read_dates, new Date(dateLecture)]
              : [new Date(dateLecture)],
          });
        } else {
          setBook({ ...book, lu: true });
        }
      }
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

  const handleBookEdition = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleBookDeletion = async () => {
    const bookId = book.id;

    try {
      await sendRequest(
        process.env.REACT_APP_API_URL + "/book/" + bookId,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );

      history.push("/books");
    } catch (err) {}
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
      <EditBookDialog
        open={openEditDialog}
        handleCloseDialog={handleCloseEditDialog}
        book={book}
      />
      {auth.isAdmin && (
        <React.Fragment>
          <div className='book-details__admin'>
            <CustomButtons
              buttonType='edit'
              title='Modifier'
              onClick={handleBookEdition}
            />
            <CustomButtons
              buttonType='delete'
              title='Supprimer'
              onClick={handleBookDeletion}
            />
          </div>
        </React.Fragment>
      )}
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
