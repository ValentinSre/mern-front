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

const DisplayByBooks = ({
  collection,
  selectedSort: sort,
  selectedGroupment: groupment,
  selectedEditeurs,
  checkedValues,
}) => {
  const groupCollection = (collection, groupment) => {
    if (groupment) {
      // Authors
      if (groupment === 3) {
        const authors = collection.reduce((acc, book) => {
          book.auteurs.forEach((author) => {
            if (!acc.includes(author.nom)) {
              acc.push(author.nom);
            }
          });
          return acc;
        }, []);

        const groupedCollection = authors.reduce((acc, author) => {
          acc[author] = [];
          collection.forEach((book) => {
            book.auteurs.forEach((authorBook) => {
              if (authorBook.nom === author) {
                acc[author].push(book);
              }
            });
          });
          return acc;
        }, {});
        return groupedCollection;
      }

      // Illustrators
      if (groupment === 4) {
        const illustrators = collection.reduce((acc, book) => {
          book.dessinateurs.forEach((illustrator) => {
            if (!acc.includes(illustrator.nom)) {
              acc.push(illustrator.nom);
            }
          });
          return acc;
        }, []);

        const groupedCollection = illustrators.reduce((acc, illustrator) => {
          acc[illustrator] = [];
          collection.forEach((book) => {
            book.dessinateurs.forEach((illustratorBook) => {
              if (illustratorBook.nom === illustrator) {
                acc[illustrator].push(book);
              }
            });
          });
          return acc;
        }, {});
        return groupedCollection;
      }

      // Year
      if (groupment === 6) {
        const years = collection.reduce((acc, book) => {
          const year = new Date(book.date_parution).getFullYear();
          if (!acc.includes(year)) {
            acc.push(year);
          }
          return acc;
        }, []);

        const groupedCollection = years.reduce((acc, year) => {
          acc[year] = [];
          collection.forEach((book) => {
            const bookYear = new Date(book.date_parution).getFullYear();
            if (bookYear === year) {
              acc[year].push(book);
            }
          });
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
      console.log(groupedCollection);
      return groupedCollection;
    }

    return collection;
  };

  const sortCollection = (collection, sort) => {
    if (sort) {
      // tri par date de parution
      if (sort === 3) {
        return collection.sort((a, b) => {
          const dateA = new Date(a[SORT_IDS[sort]]);
          const dateB = new Date(b[SORT_IDS[sort]]);
          return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
        });
      }

      // tri par note (si note = undefined, on le met à la fin) par ordre décroissant
      if (sort === 4) {
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
