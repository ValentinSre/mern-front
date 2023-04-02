import React from "react";

import CollectionInMosaic from "./components/CollectionInMosaic";
import CollectionInLists from "./components/CollectionInLists";
import makeTitle from "../../../shared/util/makeTitle";

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
        if (sort === 1) {
          return makeTitle(a) < makeTitle(b) ? -1 : 1;
        }
        return a[SORT_IDS[sort]] < b[SORT_IDS[sort]]
          ? -1
          : a[SORT_IDS[sort]] > b[SORT_IDS[sort]]
          ? 1
          : 0;
      });
    }
    return collection;
  };

  const groupedCollection = groupCollection(collection, groupment);

  return !groupment ? (
    <CollectionInMosaic
      collection={collection}
      sort={sort}
      selectedEditeurs={selectedEditeurs}
      sortCollection={sortCollection}
    />
  ) : (
    <CollectionInLists
      collection={collection}
      sort={sort}
      groupedCollection={groupedCollection}
      groupment={groupment}
      selectedEditeurs={selectedEditeurs}
      sortCollection={sortCollection}
    />
  );
};

export default CollectionDisplay;
