import React, { useState } from "react";
import { BsCalendarWeek } from "react-icons/bs";
import { ImBook } from "react-icons/im";
import { CiBookmark } from "react-icons/ci";
import { Tooltip } from "@material-ui/core";

import "./BookDetails.css";

const MONTHS = {
  1: "janvier",
  2: "février",
  3: "mars",
  4: "avril",
  5: "mai",
  6: "juin",
  7: "juillet",
  8: "août",
  9: "septembre",
  10: "octobre",
  11: "novembre",
  12: "décembre",
};

const BookDetails = ({ book }) => {
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
  } = book;

  const displayTitle = (serie, tome, titre) => {
    if (serie) {
      return (
        <React.Fragment>
          <h2>{serie}</h2>
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
              {month +
                "/" +
                year +
                " (" +
                day +
                " " +
                MONTHS[month] +
                " " +
                year +
                ")"}
            </span>
          </Tooltip>
          <Tooltip title='Genre'>
            <span>
              <ImBook /> {format}
            </span>
          </Tooltip>
        </p>
      </div>
    );
  };

  const [showArtistDetails, setShowArtistDetails] = useState(false);

  return (
    <div className='book-container'>
      <div className='book-image'>
        <img src={image} alt={titre} />
      </div>
      <div className='book-details'>
        <div>
          {displayTitle(serie, tome, titre)}
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
      </div>
    </div>
  );
};

export default BookDetails;
