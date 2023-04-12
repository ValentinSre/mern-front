import React, { useState, useContext, useEffect } from "react";
import { BsCalendarWeek } from "react-icons/bs";
import { useHistory } from "react-router-dom";
import { ImBook } from "react-icons/im";
import { AiFillTwitterCircle } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import Rating from "@material-ui/lab/Rating";
import {
  Button,
  Modal,
  Box,
  Chip,
  Tooltip,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
} from "@material-ui/core";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
import EditBookDialog from "./components/EditBookDialog";
import CustomButtons from "../../../shared/components/UIElements/CustomButtons";
import {
  displayArtists,
  displayButton,
  displaySubtitle,
  displayTitle,
  displayType,
  MONTHS,
} from "./utils/DisplayFunctions";
import DateButton from "./components/DateButton";
import DateModal from "./components/DateModal";

import "./BookDetails.css";

const BookDetails = ({ book: initialBook }) => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { sendRequest } = useHttpClient();

  const [book, setBook] = useState(initialBook);

  const {
    serie,
    tome,
    titre,
    auteurs,
    dessinateurs,
    genre,
    type,
    format,
    editeur,
    date_parution,
    date_lecture,
    image,
    version,
    note,
    id,
    review,
    lien,
    lu,
    critique,
    possede,
    souhaite,
  } = book;

  const [dateLecture, setDateLecture] = useState(null);
  const [dateObtention, setDateObtention] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openCollectionModal, setOpenCollectionModal] = useState(false);
  const [openReadModal, setOpenReadModal] = useState(false);
  const [rating, setRating] = useState(parseFloat(note));
  const [showArtistDetails, setShowArtistDetails] = useState(false);
  const [twitterLink, setTwitterLink] = useState(lien);
  //   const [reviewText, setReviewText] = useState(review);

  // Handle functions for adding to collection and wishlist
  const handleAdditionToCollection = () => {
    const bookId = book.id;
    handleAddToList([bookId], "collection");
  };

  const handleAdditionToWishlist = () => {
    const bookId = book.id;
    handleAddToList([bookId], "wishlist");
  };

  const handleAddToList = async (bookIds, listName) => {
    console.log("there");
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

  // Handle functions to update the state of the book in collection
  const handleOpenReadModal = () => {
    setOpenReadModal(true);
  };

  const handleBookReading = async () => {
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

  // Handle functions to display the read date
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleBookEdition = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    history.push("/books");
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

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    const bookId = book.id;
    try {
      await sendRequest(
        process.env.REACT_APP_API_URL + "/collection/edit",
        "POST",
        JSON.stringify({
          id_book: bookId,
          id_user: auth.userId,
          note: rating,
          //   review: reviewText,
          lien: twitterLink,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      history.push(`/${auth.userId}/collection`);
    } catch (err) {
      console.log(err);
    }
  };

  const bookCollectionState = ({ possede, lu, souhaite }) => {
    if (!auth.token) return null;

    if (!possede) {
      return displayButton({
        possede,
        souhaite,
        bookId: book.id,
        handleAdditionToCollection,
        handleAdditionToWishlist,
        handleOpenCollectionModal: () => setOpenCollectionModal(true),
      });
    }

    if (possede && !lu) {
      return (
        <div className='book-collection__buttons'>
          <DateButton
            options={[
              { name: "Marquer comme lu", action: handleBookReading },
              {
                name: "Marquer comme lu (daté)",
                action: handleOpenReadModal,
              },
            ]}
          />
        </div>
      );
    }

    return (
      auth.token && (
        <div className='book-collection'>
          <div className='book-collection__review'>
            <form onSubmit={(event) => handleSubmitReview(event)}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className='book-collection__review__rating'>
                  <p>Ma note</p>
                  <Rating
                    value={rating}
                    onChange={(e) => setRating(parseFloat(e.target.value))}
                    precision={0.5}
                    size='large'
                  />
                </div>
                <TextField
                  label='Lien Twitter'
                  variant='outlined'
                  value={twitterLink}
                  onChange={(e) => setTwitterLink(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Tooltip title='Voir sur Twitter'>
                          <IconButton
                            onClick={() => {
                              window.location.href = twitterLink;
                            }}
                          >
                            <AiFillTwitterCircle />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                  style={{ width: "100%", marginTop: "10px" }}
                />
              </div>
              {/* <TextField
                id='review-text'
                label='Votre critique'
                variant='outlined'
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                multiline
                rows={4}
                fullWidth
                margin='normal'
              /> */}
              <Button
                type='submit'
                variant='contained'
                color='primary'
                style={{ marginTop: "10px", marginLeft: "15px" }}
              >
                Valider
              </Button>
            </form>
          </div>
        </div>
      )
    );
  };

  const date = new Date(date_lecture);

  return (
    <div>
      <div className='book-container'>
        <div className='book-image' style={{ position: "relative" }}>
          <img
            src={image}
            alt={titre}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          {isHovering && date_lecture && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Chip
                label={
                  "Lu le " +
                  date.getDate() +
                  " " +
                  MONTHS[date.getMonth() + 1] +
                  " " +
                  date.getFullYear()
                }
                size='large'
                style={{
                  backgroundColor: "#0097b2",
                  color: "black",
                  height: "48px",
                  borderRadius: "24px",
                  border: "1px solid black",
                  padding: "0 24px",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              />
            </div>
          )}
        </div>
        <div className='book-details'>
          <div>
            {displayTitle(serie, version, tome, titre)}
            <p className='book-details__major-info'>
              {displayType(type)} de{" "}
              <span onClick={() => setShowArtistDetails(!showArtistDetails)}>
                {displayArtists(auteurs, dessinateurs)}{" "}
                {showArtistDetails ? (
                  <span style={{ fontSize: "10px" }}>▲</span>
                ) : (
                  <span style={{ fontSize: "10px" }}>▼</span>
                )}
              </span>
              chez {editeur} - {new Date(date_parution).getFullYear()}
            </p>
            {showArtistDetails && (
              <p className='book-details__minor-info'>
                {displayArtists(auteurs, dessinateurs, true)}
              </p>
            )}
            {displaySubtitle(genre, date_parution, format)}
          </div>

          {bookCollectionState({ possede, lu, souhaite })}
        </div>
      </div>
      <EditBookDialog
        open={openEditDialog}
        handleCloseDialog={handleCloseEditDialog}
        book={book}
      />
      <DateModal
        open={openReadModal}
        handleClose={() => setOpenReadModal(false)}
        date={dateLecture}
        label='Date de lecture'
        title='Quand avez-vous lu ce livre ?'
        handleChange={(e) => setDateLecture(e.target.value)}
        handleSubmit={handleBookReading}
      />
      <DateModal
        open={openCollectionModal}
        handleClose={() => setOpenCollectionModal(false)}
        date={dateObtention}
        label="Date d'achat"
        title='Quand avez-vous acheté ce livre ?'
        handleChange={(e) => setDateObtention(e.target.value)}
        handleSubmit={handleAdditionToCollection}
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
    </div>
  );
};

export default BookDetails;
