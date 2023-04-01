import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { BsBookmarkCheckFill, BsBookmarkX } from "react-icons/bs";
import { MdRateReview, MdChatBubbleOutline } from "react-icons/md";

import Rating from "../../../shared/components/UIElements/Rating";
import CollectionInMosaic from "./components/CollectionInMosaic";
import CollectionInLists from "./components/CollectionInLists";

import "./CollectionDisplay.css";

// **************************
// **** Sort explanation ****
// **************************
// 1: Sort by title
// 2: Sort by price
// 3: Sort by date

// **************************
// **** Grpt explanation ****
// **************************
// 1: Group by editor
// 2: Group by format
// 3: Group by author
// 4: Group by illustrator
// 5: Group by genre
// 6: Group by year
// 7: Group by type

const SORT_IDS = {
  1: "titre",
  2: "prix",
  3: "date_parution",
  4: "note",
};

const GROUPMENT_IDS = {
  1: "editeur",
  2: "format",
  3: "auteur",
  4: "dessinateur",
  5: "genre",
  6: "annee",
  7: "type",
};

const GROUP_ERROR_MESSAGE = {
  1: "Éditeur non renseigné",
  2: "Sans format",
  3: "Auteur non renseigné",
  4: "Dessinateur non renseigné",
  5: "Genre non renseigné",
  6: "Année non renseignée",
  7: "Type non renseigné",
};

const EXISTING_STYLE = { color: "#45b061", fontSize: "20px" };
const MISSING_STYLE = { color: "#e74c3c", fontSize: "20px" };

const CollectionDisplay = ({
  collection,
  sort,
  groupment,
  selectedEditeurs,
}) => {
  const groupCollection = (collection, groupment) => {
    if (groupment) {
      const groupedCollection = collection.reduce((acc, book) => {
        const key = book[GROUPMENT_IDS[groupment]];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(book);
        return acc;
      }, {});
      return groupedCollection;
    }
    return collection;
  };

  const sortCollection = (collection, sort) => {
    if (sort) {
      return collection.sort((a, b) => {
        if (a[SORT_IDS[sort]] < b[SORT_IDS[sort]]) {
          return -1;
        }
        if (a[SORT_IDS[sort]] > b[SORT_IDS[sort]]) {
          return 1;
        }
        return 0;
      });
    }
    return collection;
  };

  const groupedCollection = groupCollection(collection, groupment);

  const content = (book) => {
    return (
      <Tooltip
        title={
          book.serie
            ? book.serie + " T" + book.tome + " - " + book.titre
            : book.titre
        }
      >
        <div key={book.id} className='collection-display__book'>
          <div style={{ padding: "10px" }}>
            <Rating
              rating={book.note}
              size={"1em"}
              real={typeof book.note === "number"}
            />
          </div>
          <img src={book.image} alt={book.titre} />
          {bookState(book)}
        </div>
      </Tooltip>
    );
  };

  const bookState = (book) => {
    const { lu, critique } = book;

    if (lu) {
      return (
        <div className='collection-display__book-state'>
          <Tooltip title='Livre lu'>
            <div className='collection-display__book-state__read'>
              <BsBookmarkCheckFill style={EXISTING_STYLE} />
            </div>
          </Tooltip>
          {critique ? (
            <Tooltip title='Critique rédigée'>
              <div className='collection-display__book-state__review'>
                <MdRateReview style={EXISTING_STYLE} />
                <i className='fas fa-comment'></i>
              </div>
            </Tooltip>
          ) : (
            <Tooltip title='Pas de critique'>
              <div className='collection-display__book-state__review'>
                <MdChatBubbleOutline style={MISSING_STYLE} />
                <i className='fas fa-comment'></i>
              </div>
            </Tooltip>
          )}
        </div>
      );
    } else {
      return (
        <div className='collection-display__book-state'>
          <Tooltip title='Livre non lu'>
            <div className='collection-display__book-state__read'>
              <BsBookmarkX style={MISSING_STYLE} />
              <i className='fas fa-times'></i>
            </div>
          </Tooltip>
          <Tooltip title='Pas de critique'>
            <div className='collection-display__book-state__review'>
              <MdChatBubbleOutline style={MISSING_STYLE} />
              <i className='fas fa-comment'></i>
            </div>
          </Tooltip>
        </div>
      );
    }
  };

  return !groupment ? (
    <CollectionInMosaic
      collection={collection}
      sort={sort}
      selectedEditeurs={selectedEditeurs}
      sortCollection={sortCollection}
      displayContent={content}
    />
  ) : (
    <CollectionInLists
      collection={collection}
      sort={sort}
      groupedCollection={groupedCollection}
      groupment={groupment}
      selectedEditeurs={selectedEditeurs}
      sortCollection={sortCollection}
      displayContent={content}
    />
  );
};

export default CollectionDisplay;
