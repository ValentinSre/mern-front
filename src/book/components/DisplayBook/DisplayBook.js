import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
import BookDetails from "./components/BookDetails";
import DateModal from "../../../shared/components/UIElements/DateModal";
import CustomButtons from "../../../shared/components/UIElements/CustomButtons";
import EditBookDialog from "./components/EditBookDialog";
import { Modal, Box, Typography, Button, TextField } from "@material-ui/core";

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
  const [openListModal, setOpenListModal] = useState(false);
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    setBook(initialBook);
  }, [initialBook]);

  const fetchLists = async () => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_API_URL + "/lists",
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setLists(responseData);
    } catch (err) {
      console.error("Erreur lors de la récupération des listes:", err);
    }
  };

  const handleOpenCollectionModal = () => {
    setOpenCollectionModal(true);
  };

  const handleOpenReadModal = () => {
    setOpenReadModal(true);
  };

  const handleOpenListModal = () => {
    fetchLists();
    setOpenListModal(true);
  };

  const handleAddToCollection = () => {
    const bookId = book.id;
    handleAddToList([bookId], "collection");
  };

  const handleAddToWishlist = () => {
    const bookId = book.id;
    handleAddToList([bookId], "wishlist");
  };

  const handleRemoveFromCollection = async () => {
    const bookId = book.id;

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_API_URL + "/collection/edit",
        "POST",
        JSON.stringify({
          id_book: bookId,
          id_user: auth.userId,
          revendu: true,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      const { success } = responseData;
      if (success) {
        setBook({ ...book, revendu: true });
      }
    } catch (err) {
      console.log(err);
    }
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

  const handleAddToExistingList = async (listId) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_API_URL}/lists/${listId}/books`,
        "POST",
        JSON.stringify({ bookId: book.id }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setOpenListModal(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout du livre à la liste:", err);
    }
  };

  const handleCreateList = async () => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_API_URL + "/lists",
        "POST",
        JSON.stringify({ name: newListName }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setLists([...lists, responseData]);
      setNewListName("");
    } catch (err) {
      console.error("Erreur lors de la création de la liste:", err);
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
        handleSell={handleRemoveFromCollection}
        handleAddToList={handleOpenListModal}
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
      {auth.isLoggedIn && (
        <React.Fragment>
          <CustomButtons
            buttonType='add'
            title='Ajouter à une liste'
            onClick={handleOpenListModal}
          />
          <Modal open={openListModal} onClose={() => setOpenListModal(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                borderRadius: "10px",
                p: 4,
              }}
            >
              <Typography variant='h6' component='h2'>
                Ajouter à une liste
              </Typography>
              <ul>
                {lists.map((list) => (
                  <li key={list._id}>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => handleAddToExistingList(list._id)}
                    >
                      {list.name}
                    </Button>
                  </li>
                ))}
              </ul>
              <TextField
                fullWidth
                label='Nom de la nouvelle liste'
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                style={{ marginTop: "10px" }}
              />
              <Button
                variant='contained'
                color='secondary'
                onClick={handleCreateList}
                style={{ marginTop: "10px" }}
              >
                Créer une liste
              </Button>
            </Box>
          </Modal>
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
