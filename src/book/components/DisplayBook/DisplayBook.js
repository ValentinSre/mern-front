import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@material-ui/core";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

import BookDetails from "./components/BookDetails";
import DateModal from "../../../shared/components/UIElements/DateModal";
import CustomButtons from "../../../shared/components/UIElements/CustomButtons";
import EditBookDialog from "./components/EditBookDialog";

const formatDateForInput = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
};

const DisplayBook = ({ book: initialBook }) => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();

  const [book, setBook] = useState(initialBook);

  const [openCollectionModal, setOpenCollectionModal] = useState(false);
  const [openReadModal, setOpenReadModal] = useState(false);
  const [openEditReadModal, setOpenEditReadModal] = useState(false);
  const [openListModal, setOpenListModal] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [dateObtention, setDateObtention] = useState(
    initialBook.date_achat || "",
  );
  const [dateLecture, setDateLecture] = useState(
    formatDateForInput(new Date()),
  );
  const [dateLectureEdit, setDateLectureEdit] = useState("");
  const [editingReadDateIndex, setEditingReadDateIndex] = useState(null);

  const [lists, setLists] = useState([]);
  const [selectedListIds, setSelectedListIds] = useState([]);
  const [newListName, setNewListName] = useState("");

  const [isLoadingLists, setIsLoadingLists] = useState(false);
  const [isSavingLists, setIsSavingLists] = useState(false);

  const bookId = book.id || book._id;

  useEffect(() => {
    setBook(initialBook);
    setDateObtention(initialBook.date_achat || "");
  }, [initialBook]);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth.token}`,
  });

  // Collection

  const handleAddToCollection = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/add`,
        "POST",
        JSON.stringify({
          ids_book: [bookId],
          id_user: auth.userId,
          list_name: "collection",
          book,
          date_achat: dateObtention,
        }),
        getHeaders(),
      );

      setBook(
        responseData.book || {
          ...book,
          possede: true,
          souhaite: false,
          revendu: false,
          date_achat: dateObtention,
        },
      );

      setOpenCollectionModal(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout à la collection :", err);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/add`,
        "POST",
        JSON.stringify({
          ids_book: [bookId],
          id_user: auth.userId,
          list_name: "wishlist",
          book,
        }),
        getHeaders(),
      );

      setBook(
        responseData.book || {
          ...book,
          souhaite: true,
        },
      );
    } catch (err) {
      console.error("Erreur lors de l'ajout à la wishlist :", err);
    }
  };

  const handleSell = async () => {
    if (!window.confirm("Confirmer la revente de ce livre ?")) return;

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/edit`,
        "POST",
        JSON.stringify({
          id_book: bookId,
          id_user: auth.userId,
          revendu: true,
        }),
        getHeaders(),
      );

      if (responseData.success) {
        setBook((previousBook) => ({
          ...previousBook,
          possede: false,
          souhaite: false,
          revendu: true,
        }));
      }
    } catch (err) {
      console.error("Erreur lors de la revente :", err);
    }
  };

  // Historique de lecture

  const handleAddToReadlist = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/edit`,
        "POST",
        JSON.stringify({
          id_book: bookId,
          id_user: auth.userId,
          lu: true,
          ...(dateLecture ? { date_lecture: dateLecture } : {}),
        }),
        getHeaders(),
      );

      if (responseData.success) {
        setBook((previousBook) => ({
          ...previousBook,
          lu: true,
          read_dates: dateLecture
            ? [
                ...(previousBook.read_dates || []),
                new Date(`${dateLecture}T00:00:00.000Z`),
              ]
            : previousBook.read_dates || [],
        }));

        setOpenReadModal(false);
      }
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de la lecture :", err);
    }
  };

  const handleOpenEditReadModal = (index, date) => {
    setEditingReadDateIndex(index);
    setDateLectureEdit(formatDateForInput(date));
    setOpenEditReadModal(true);
  };

  const handleCloseEditReadModal = () => {
    setOpenEditReadModal(false);
    setEditingReadDateIndex(null);
    setDateLectureEdit("");
  };

  const handleEditReadDate = async () => {
    const index = editingReadDateIndex;
    const newDate = dateLectureEdit;

    if (index === null || !newDate) return;

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/edit`,
        "POST",
        JSON.stringify({
          id_book: bookId,
          id_user: auth.userId,
          edit_date_lecture_index: index,
          new_date_lecture: newDate,
        }),
        getHeaders(),
      );

      if (responseData.success) {
        setBook((previousBook) => {
          const updatedDates = [...(previousBook.read_dates || [])];

          updatedDates[index] = new Date(`${newDate}T00:00:00.000Z`);

          return {
            ...previousBook,
            read_dates: updatedDates,
          };
        });

        handleCloseEditReadModal();
      }
    } catch (err) {
      console.error("Erreur lors de la modification de la lecture :", err);
    }
  };

  const handleDeleteReadDate = async (index) => {
    if (!window.confirm("Supprimer cette date de lecture ?")) return;

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/edit`,
        "POST",
        JSON.stringify({
          id_book: bookId,
          id_user: auth.userId,
          delete_date_lecture_index: index,
        }),
        getHeaders(),
      );

      if (responseData.success) {
        setBook((previousBook) => ({
          ...previousBook,
          read_dates: (previousBook.read_dates || []).filter(
            (_, dateIndex) => dateIndex !== index,
          ),
        }));
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de la lecture :", err);
    }
  };

  // Listes

  const fetchLists = async () => {
    setIsLoadingLists(true);

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/lists`,
        "GET",
        null,
        { Authorization: `Bearer ${auth.token}` },
      );

      const userLists = Array.isArray(responseData) ? responseData : [];

      const enrichedLists = userLists.map((list) => {
        const bookList = (book.lists || []).find(
          (item) => item._id.toString() === list._id.toString(),
        );

        return {
          ...list,
          containsBook: bookList ? bookList.containsBook : false,
        };
      });

      setLists(enrichedLists);
      setSelectedListIds(
        enrichedLists
          .filter((list) => list.containsBook)
          .map((list) => list._id),
      );
    } catch (err) {
      console.error("Erreur lors de la récupération des listes :", err);
    } finally {
      setIsLoadingLists(false);
    }
  };

  const handleOpenListModal = async () => {
    setOpenListModal(true);
    await fetchLists();
  };

  const handleToggleList = (listId) => {
    setSelectedListIds((previousIds) =>
      previousIds.includes(listId)
        ? previousIds.filter((id) => id !== listId)
        : [...previousIds, listId],
    );
  };

  const handleSaveLists = async () => {
    const listsToAdd = selectedListIds.filter(
      (id) => !lists.some((list) => list._id === id && list.containsBook),
    );

    if (!listsToAdd.length) {
      setOpenListModal(false);
      return;
    }

    setIsSavingLists(true);

    try {
      for (const listId of listsToAdd) {
        await sendRequest(
          `${process.env.REACT_APP_API_URL}/lists/${listId}/books`,
          "POST",
          JSON.stringify({ bookId }),
          getHeaders(),
        );
      }

      setBook((previousBook) => ({
        ...previousBook,
        lists: (previousBook.lists || []).map((list) => ({
          ...list,
          containsBook: list.containsBook || listsToAdd.includes(list._id),
        })),
      }));

      setLists((previousLists) =>
        previousLists.map((list) => ({
          ...list,
          containsBook: list.containsBook || listsToAdd.includes(list._id),
        })),
      );

      setOpenListModal(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout aux listes :", err);
    } finally {
      setIsSavingLists(false);
    }
  };

  const handleCreateList = async () => {
    const name = newListName.trim();
    if (!name) return;

    setIsSavingLists(true);

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/lists`,
        "POST",
        JSON.stringify({ name }),
        getHeaders(),
      );

      const createdList = responseData.list || responseData;

      if (!createdList._id) {
        throw new Error("Identifiant de liste manquant.");
      }

      await sendRequest(
        `${process.env.REACT_APP_API_URL}/lists/${createdList._id}/books`,
        "POST",
        JSON.stringify({ bookId }),
        getHeaders(),
      );

      setLists((previousLists) => [
        ...previousLists,
        { ...createdList, containsBook: true },
      ]);

      setSelectedListIds((previousIds) => [...previousIds, createdList._id]);

      setBook((previousBook) => ({
        ...previousBook,
        lists: [
          ...(previousBook.lists || []),
          {
            _id: createdList._id,
            name: createdList.name,
            containsBook: true,
          },
        ],
      }));

      setNewListName("");
    } catch (err) {
      console.error("Erreur lors de la création de la liste :", err);
    } finally {
      setIsSavingLists(false);
    }
  };

  // Administration

  const handleBookDeletion = async () => {
    if (!window.confirm("Supprimer définitivement ce livre ?")) return;

    try {
      await sendRequest(
        `${process.env.REACT_APP_API_URL}/book/${bookId}`,
        "DELETE",
        null,
        { Authorization: `Bearer ${auth.token}` },
      );

      history.push("/books");
    } catch (err) {
      console.error("Erreur lors de la suppression du livre :", err);
    }
  };

  return (
    <>
      {auth.isAdmin && (
        <div className='book-details__admin'>
          <CustomButtons
            buttonType='edit'
            title='Modifier'
            onClick={() => setOpenEditDialog(true)}
          />
          <CustomButtons
            buttonType='delete'
            title='Supprimer'
            onClick={handleBookDeletion}
          />
        </div>
      )}

      <BookDetails
        book={book}
        isAuthenticated={auth.isLoggedIn}
        handleCollection={() => setOpenCollectionModal(true)}
        handleWishlist={handleAddToWishlist}
        handleRead={() => setOpenReadModal(true)}
        handleSell={handleSell}
        handleAddToList={handleOpenListModal}
        handleEditReadDate={handleOpenEditReadModal}
        handleDeleteReadDate={handleDeleteReadDate}
      />

      <DateModal
        open={openCollectionModal}
        handleClose={() => setOpenCollectionModal(false)}
        date={dateObtention}
        authorizeNoDate
        label="Date d'achat"
        title='Quand avez-vous acheté ce livre ?'
        handleChange={(event) => setDateObtention(event.target.value)}
        handleSubmit={handleAddToCollection}
      />

      <DateModal
        open={openReadModal}
        handleClose={() => setOpenReadModal(false)}
        date={dateLecture}
        authorizeNoDate
        label='Date de lecture'
        title='Quand avez-vous lu ce livre ?'
        handleChange={(event) => setDateLecture(event.target.value)}
        handleSubmit={handleAddToReadlist}
      />

      <DateModal
        open={openEditReadModal}
        handleClose={handleCloseEditReadModal}
        date={dateLectureEdit}
        label='Nouvelle date de lecture'
        title='Modifier une date de lecture'
        handleChange={(event) => setDateLectureEdit(event.target.value)}
        handleSubmit={handleEditReadDate}
      />

      <Dialog
        open={openListModal}
        onClose={() => !isSavingLists && setOpenListModal(false)}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>Mes listes</DialogTitle>

        <DialogContent>
          {isLoadingLists ? (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 25 }}
            >
              <CircularProgress size={28} />
            </div>
          ) : (
            <List>
              {lists.map((list) => (
                <ListItem key={list._id} dense>
                  <Checkbox
                    checked={selectedListIds.includes(list._id)}
                    disabled={list.containsBook || isSavingLists}
                    onChange={() => handleToggleList(list._id)}
                    color='primary'
                  />
                  <ListItemText
                    primary={list.name}
                    secondary={
                      list.containsBook ? "Déjà présent dans cette liste" : null
                    }
                  />
                </ListItem>
              ))}

              {!lists.length && (
                <ListItem>
                  <ListItemText primary="Vous n'avez pas encore de liste." />
                </ListItem>
              )}
            </List>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <TextField
              label='Nouvelle liste'
              value={newListName}
              onChange={(event) => setNewListName(event.target.value)}
              fullWidth
              size='small'
              variant='outlined'
              disabled={isSavingLists}
            />

            <Button
              onClick={handleCreateList}
              disabled={!newListName.trim() || isSavingLists}
              variant='outlined'
            >
              Créer
            </Button>
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenListModal(false)}
            disabled={isSavingLists}
          >
            Fermer
          </Button>

          <Button
            onClick={handleSaveLists}
            color='primary'
            variant='contained'
            disabled={isLoadingLists || isSavingLists}
          >
            {isSavingLists ? <CircularProgress size={20} /> : "Enregistrer"}
          </Button>
        </DialogActions>
      </Dialog>

      <EditBookDialog
        open={openEditDialog}
        handleCloseDialog={() => setOpenEditDialog(false)}
        book={book}
      />
    </>
  );
};

DisplayBook.propTypes = {
  book: PropTypes.object.isRequired,
};

export default DisplayBook;
