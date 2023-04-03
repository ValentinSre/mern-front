import React, { useState, useContext, useEffect } from "react";
import { BsCalendarWeek } from "react-icons/bs";
import { ImBook } from "react-icons/im";
import { FaSave } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import { Tooltip } from "@material-ui/core";
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import { Button } from "@material-ui/core";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import CustomButtons from "../../shared/components/UIElements/CustomButtons";
import Rating from "@material-ui/lab/Rating";

import "./BookDetails.css";

const MONTHS = {
  1: "janv.",
  2: "fév.",
  3: "mars",
  4: "avril",
  5: "mai",
  6: "juin",
  7: "juil.",
  8: "août",
  9: "sept.",
  10: "oct.",
  11: "nov.",
  12: "déc.",
};

const BookDetails = ({ book: initialBook }) => {
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
  const [twitterLink, setTwitterLink] = useState(lien);
  const [rating, setRating] = useState(parseInt(note));
  //   const [reviewText, setReviewText] = useState(review);

  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();

  const displayTitle = (serie, version, tome, titre) => {
    if (serie) {
      return (
        <React.Fragment>
          <h2>
            {serie} {version ? "(v" + version + ")" : null}
          </h2>
          <h3>
            {tome}. {titre}
          </h3>
        </React.Fragment>
      );
    } else {
      return <h2>{titre}</h2>;
    }
  };

  const displayType = (type) => {
    switch (type) {
      case "BD":
        return "Une bande dessinée";
      case "Manga":
        return "Un manga";
      case "Comics":
        return "Un comics";
      default:
        return "Un livre";
    }
  };

  const displayArtists = (auteurs, dessinateurs, details) => {
    const auteursNames = auteurs.map((auteur) => auteur.nom);
    const dessinateursNames = dessinateurs.map(
      (dessinateur) => dessinateur.nom
    );

    if (!details) {
      const allNames = [...auteursNames, ...dessinateursNames];

      // Enlever les noms en double
      const uniqueNames = allNames.filter((name, index) => {
        return allNames.indexOf(name) === index;
      });

      // Enlever le dernier nom
      const lastName = uniqueNames.pop();

      // Afficher les noms
      return allNames.length
        ? uniqueNames.join(", ") + " et " + lastName
        : lastName;
    }

    return (
      <p>
        {auteursNames.map((auteur) => (
          <span key={auteur}>
            {" "}
            {auteur} <span className='artist-function'>(Scénario)</span>
          </span>
        ))}
        {dessinateursNames.map((dessinateur) => (
          <span key={dessinateur}>
            {" "}
            {dessinateur} <span className='artist-function'>(Dessin)</span>
          </span>
        ))}
      </p>
    );
  };

  const displaySubtitle = (genre, date_parution, format) => {
    const date = new Date(date_parution);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return (
      <div className='book-subtitle'>
        <p>
          <Tooltip title='Genre' style={{ marginRight: "30px" }}>
            <span>
              <CiBookmark /> {genre}
            </span>
          </Tooltip>
          <Tooltip title='Parution' style={{ marginRight: "30px" }}>
            <span>
              <BsCalendarWeek />{" "}
              <span className='book-subtitle__short-date'>
                {month + "/" + year + " ("}
              </span>
              <span>{day + " " + MONTHS[month] + " " + year}</span>
              <span className='book-subtitle__short-date'>)</span>
            </span>
          </Tooltip>
          {format && (
            <Tooltip title='Format'>
              <span>
                <ImBook /> {format}
              </span>
            </Tooltip>
          )}
        </p>
      </div>
    );
  };

  const [showArtistDetails, setShowArtistDetails] = useState(false);

  const handleAdditionToCollection = (bookId) => {
    handleAddToList([bookId], "collection");
  };

  const handleAdditionToWishlist = (bookId) => {
    handleAddToList([bookId], "wishlist");
  };

  const handleAddToList = async (bookIds, listName) => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_API_URL + "/collection/add",
        "POST",
        JSON.stringify({
          ids_book: bookIds,
          id_user: auth.userId,
          list_name: listName,
          books: [book],
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      const { success, books } = responseData;
      if (success) setBook(books[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBookReading = async (bookId) => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_API_URL + "/collection/edit",
        "POST",
        JSON.stringify({
          id_book: bookId,
          id_user: auth.userId,
          lu: true,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      const { success } = responseData;
      if (success) setBook({ ...book, lu: true });
    } catch (err) {
      console.log(err);
    }
  };

  const handleBookEdition = (bookId) => {
    console.log("Edition du livre");
  };

  const handleBookDeletion = (bookId) => {
    console.log("Suppression du livre");
  };

  const handleSubmitReview = async (bookId) => {
    try {
      const responseData = await sendRequest(
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

      const { success } = responseData;
    } catch (err) {
      console.log(err);
    }
  };

  const displayButton = ({ possede, souhaite }) => {
    return (
      <div className='book-collection__buttons'>
        <CustomButtons
          buttonType='collection'
          title='Ajouter à ma collection'
          disabled={possede}
          onClick={() => handleAdditionToCollection(id)}
        />
        <CustomButtons
          buttonType='wishlist'
          title='Ajouter à ma wishlist'
          disabled={souhaite || possede}
          onClick={() => handleAdditionToWishlist(id)}
        />
      </div>
    );
  };

  const bookCollectionState = ({ possede, lu, souhaite }) => {
    if (!auth.token) return null;

    if (!possede) {
      return displayButton({ possede, souhaite });
    }

    if (possede && !lu) {
      return (
        <div className='book-collection__buttons'>
          <CustomButtons
            buttonType='read'
            title='Marquer comme lu'
            onClick={() => handleBookReading(id)}
          />
        </div>
      );
    }

    return (
      auth.token && (
        <div className='book-collection'>
          <div className='book-collection__review'>
            <form onSubmit={() => handleSubmitReview(id)}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className='book-collection__review__rating'>
                  <p>Ma note</p>
                  <Rating
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
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

  return (
    <div>
      <div className='book-container'>
        <div className='book-image'>
          <img src={image} alt={titre} />
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
      {/* à changer à l'avenir !!!!!!!!!!!!!!! */}
      {!auth.isAdmin && (
        <React.Fragment>
          <CustomButtons
            buttonType='edit'
            title='Modifier'
            onClick={() => handleBookEdition(id)}
          />
          <CustomButtons
            buttonType='delete'
            title='Supprimer'
            onClick={() => handleBookDeletion(id)}
          />
        </React.Fragment>
      )}
    </div>
  );
};

export default BookDetails;
