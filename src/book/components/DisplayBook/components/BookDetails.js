import React from "react";

import "./BookDetails.css";
import { IconButton, Tooltip, Chip } from "@material-ui/core";
import {
  MdOutlineAddShoppingCart,
  MdAddTask,
  MdOutlineBookmarkAdded,
  MdCollectionsBookmark,
} from "react-icons/md";
import { BsPatchCheckFill, BsPatchPlus } from "react-icons/bs";
import { RxChatBubble } from "react-icons/rx";
import { TbPencil } from "react-icons/tb";

import Breadcrumb from "../../../../shared/components/UIElements/Breadcrumb";
import makeTitle from "../../../../shared/util/makeTitle";
import variables from "../../../../shared/util/variables";
import BookReview from "./BookReview";

const BookDetails = ({
  book,
  handleCollection,
  handleWishlist,
  handleRead,
}) => {
  const { possede, souhaite, lu } = book;

  return (
    <div className="book-details">
      <Breadcrumb page={makeTitle(book)} />
      <div className="book-details__container">
        <div className="book-details__image">
          <img src={book.image} alt={book.titre} />
        </div>
        <div className="book-details__actions">
          <Tooltip title="Je l'ai !" placement="top">
            <span>
              <IconButton onClick={handleCollection} disabled={possede}>
                <MdAddTask
                  style={{ color: book.possede ? "#4caf50" : "#000" }}
                />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Je le veux !" placement="top">
            <span>
              <IconButton
                onClick={handleWishlist}
                disabled={possede || souhaite}
              >
                <MdOutlineAddShoppingCart
                  style={{ color: book.souhaite ? "#4caf50" : "#000" }}
                />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="J'ai lu !" placement="top">
            <IconButton onClick={handleRead}>
              <MdOutlineBookmarkAdded
                style={{ color: book.lu ? "#4caf50" : "#000" }}
              />
            </IconButton>
          </Tooltip>
        </div>
        <BookDetailsInfo book={book} />
      </div>
      <BookReview book={book} />
    </div>
  );
};

const BookDetailsInfo = ({ book }) => {
  const { genre, format, planches, editeur, type, poids, tome, date_parution } =
    book;
  const { shortMonths } = variables;

  const date = new Date(date_parution);
  const day = date.getDate();
  const month = shortMonths[date.getMonth() + 1];
  const year = date.getFullYear();
  const dateParution = `${day} ${month} ${year}`;

  return (
    <div className="book-details__info">
      <div className="books-details__badges">
        <Chip
          icon={
            book.lu ? (
              <BsPatchCheckFill color="white" />
            ) : (
              <BsPatchPlus color="white" />
            )
          }
          label={book.lu ? "Livre lu" : "Livre à lire"}
          style={{
            backgroundColor: book.lu ? "#4caf50" : "#f44336",
            color: "white",
            fontWeight: "bold",
          }}
          variant="outlined"
        />
        <Chip
          icon={<MdCollectionsBookmark color="white" />}
          label={book.serie ? "Série" : "Histoire complète"}
          style={{
            backgroundColor: book.serie ? "#2196f3" : "#ffde59",
            color: "white",
            fontWeight: "bold",
            marginLeft: "5px",
          }}
          variant="outlined"
        />
      </div>
      <div className="book-details__title">{makeTitle(book)}</div>
      <BookArtists book={book} />
      <div className="book-details__description">
        <h2>À propos de cet ouvrage :</h2>
        <div className="book-details__description-grid">
          <div className="book-details__description-grid__category">
            <p>Catégorie :</p>
            <p>Genre :</p>
          </div>
          <div>
            <p>{type ? type : "Non définie"}</p>
            <p>{genre ? genre : "Non défini"}</p>
          </div>
        </div>
      </div>
      <div className="book-details__description">
        <h2>Caractéristiques :</h2>
        <div className="book-details__description-grid">
          <div className="book-details__description-grid__category">
            <p>Éditeur :</p>
            <p>Format :</p>
            {tome && <p>Tome :</p>}
            <p>Date de parution :</p>
            <p>Nb. de pages :</p>
            <p>Poids :</p>
          </div>
          <div>
            <p>{editeur ? editeur : "Non défini"}</p>
            <p>{format ? format : "Non défini"}</p>
            {tome && <p>{tome}</p>}
            <p>{date_parution ? dateParution : "Non définie"}</p>
            <p>{planches ? planches : "Non défini"}</p>
            <p>{poids ? poids + " gr" : "Non défini"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookArtists = ({ book }) => {
  const { auteurs, dessinateurs } = book;

  return (
    <div className="book-details__artists">
      {auteurs && (
        <div className="book-details__artists-details">
          <RxChatBubble size={18} />
          <span className="book-details__artists-category">Scénario :</span>
          {auteurs.length < 2 ? (
            <span>{auteurs[0].nom}</span>
          ) : (
            auteurs.slice(0, 4).map((auteur, index) => (
              <span key={auteur.id}>
                {index === 0 ? "" : ", "}
                {auteur.nom}
              </span>
            ))
          )}
          {auteurs.length > 4 && <span> ...</span>}
        </div>
      )}

      {dessinateurs && !!dessinateurs.length && (
        <div className="book-details__artists-details">
          <TbPencil size={18} />
          <span className="book-details__artists-category">Dessin :</span>
          {dessinateurs.length < 2 ? (
            <span>{dessinateurs[0].nom}</span>
          ) : (
            dessinateurs.slice(0, 4).map((dessinateur, index) => (
              <span key={dessinateur.id}>
                {index === 0 ? "" : ", "}
                {dessinateur.nom}
              </span>
            ))
          )}
          {dessinateurs.length > 4 && <span> ...</span>}
        </div>
      )}
    </div>
  );
};

export default BookDetails;
