import React from "react";
import { Tooltip } from "@material-ui/core";
import { BsCalendarWeek } from "react-icons/bs";
import { ImBook } from "react-icons/im";
import { CiBookmark } from "react-icons/ci";

import CustomButtons from "../../../../shared/components/UIElements/CustomButtons";
import DateButton from "../components/DateButton";

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

const displayArtists = (auteurs, dessinateurs, details) => {
  const auteursNames = auteurs.map((auteur) => auteur.nom);
  const dessinateursNames = dessinateurs.map((dessinateur) => dessinateur.nom);

  if (!details) {
    const allNames = [...auteursNames, ...dessinateursNames];

    // Enlever les noms en double
    const uniqueNames = allNames.filter((name, index) => {
      return allNames.indexOf(name) === index;
    });

    // Enlever le dernier nom
    const lastName = uniqueNames.pop();

    // Afficher les noms
    return uniqueNames.length
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

const displayButton = ({
  possede,
  souhaite,
  bookId,
  handleAdditionToCollection,
  handleAdditionToWishlist,
  handleOpenCollectionModal,
}) => {
  return (
    <div className='book-collection__buttons'>
      <DateButton
        options={[
          {
            name: "Ajouter à ma collection",
            action: () => handleAdditionToCollection(bookId),
          },
          {
            name: "Ajouter à ma collection (daté)",
            action: handleOpenCollectionModal,
          },
        ]}
      />
      <CustomButtons
        buttonType='wishlist'
        title='Ajouter à ma wishlist'
        disabled={souhaite || possede}
        onClick={() => handleAdditionToWishlist(bookId)}
      />
    </div>
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
            <span>{day + " " + MONTHS[month + 1] + " " + year}</span>
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

const displayTitle = (serie, version, tome, titre) => {
  if (serie) {
    return (
      <React.Fragment>
        <h2>
          {serie} {version ? "(v" + version + ")" : null}{" "}
        </h2>
        <h3>{tome ? tome + ". " + titre : titre}</h3>
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

export {
  displayArtists,
  displayButton,
  displaySubtitle,
  displayTitle,
  displayType,
  MONTHS,
};
