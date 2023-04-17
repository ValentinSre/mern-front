import React from "react";

import CollectionInMosaic from "./components/CollectionInMosaic";
import CollectionInLists from "./components/CollectionInLists";
import makeTitle from "../../../shared/util/makeTitle";

import "./DisplayByBooks.css";

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
  0: "titre",
  1: "prix",
  2: "note",
  3: "date_parution",
};

const GROUPMENT_IDS = {
  1: "editeur",
  2: "type",
  3: "etat",
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

const DisplayByBooks = ({
  collection,
  selectedSort: sort,
  selectedGroupment: groupment,
  selectedEditeurs,
  checkedValues,
}) => {
  const groupCollection = (collection, groupment) => {
    if (groupment) {
      if (groupment === 3) {
        const groupedCollection = collection.reduce((acc, book) => {
          if (book.critique) {
            if (!acc["Critiqué"]) {
              acc["Critiqué"] = [];
            }
            acc["Critiqué"].push(book);
          } else if (book.lu) {
            if (!acc["Lu"]) {
              acc["Lu"] = [];
            }
            acc["Lu"].push(book);
          } else {
            if (!acc["Non lu"]) {
              acc["Non lu"] = [];
            }
            acc["Non lu"].push(book);
          }
          return acc;
        }, {});
        return groupedCollection;
      }

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
      // tri par note (si note = undefined, on le met à la fin) par ordre décroissant
      if (sort === 2) {
        return collection.sort((a, b) => {
          if (a[SORT_IDS[sort]] === undefined) {
            return 1;
          }
          if (b[SORT_IDS[sort]] === undefined) {
            return -1;
          }
          return a[SORT_IDS[sort]] < b[SORT_IDS[sort]]
            ? 1
            : a[SORT_IDS[sort]] > b[SORT_IDS[sort]]
            ? -1
            : 0;
        });
      }

      return collection.sort((a, b) => {
        if (sort === 0) {
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

  const filteredBooks = collection.filter((book) => {
    const { type, editeur } = book;
    return checkedValues[type] && selectedEditeurs[editeur];
  });

  const nbBooks = filteredBooks.length;
  const groupedCollection = groupCollection(filteredBooks, groupment);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginLeft: "30px", marginBottom: "20px" }}>
          <strong>{nbBooks} albums</strong> :
        </div>
      </div>
      {!groupment ? (
        <CollectionInMosaic
          collection={filteredBooks}
          sort={sort}
          selectedEditeurs={selectedEditeurs}
          sortCollection={sortCollection}
        />
      ) : (
        <CollectionInLists
          collection={filteredBooks}
          sort={sort}
          groupedCollection={groupedCollection}
          groupment={groupment}
          selectedEditeurs={selectedEditeurs}
          sortCollection={sortCollection}
        />
      )}
      {filteredBooks.length === 0 && (
        <div style={{ textAlign: "center", paddingBottom: "20px" }}>
          <h3>Aucun album ne correspond à votre sélection</h3>
        </div>
      )}
    </div>
  );
};

export default DisplayByBooks;
