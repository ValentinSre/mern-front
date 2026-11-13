import React from "react";
import { FaLayerGroup } from "react-icons/fa";

import CollectionInMosaic from "./components/CollectionInMosaic";
import CollectionInLists from "./components/CollectionInLists";
import makeTitle from "../../../shared/util/makeTitle";

import "./DisplayByBooks.css";

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

const getSeriesKey = (book) => {
  if (!book.serie) return book.titre || book.id_book;

  if (typeof book.serie === "string") {
    return book.serie.trim() || book.titre || book.id_book;
  }

  return book.serie.titre || book.serie.nom || book.titre || book.id_book;
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
      // Tri par note décroissante, les albums sans note étant placés à la fin.
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

  const availableBooks = filteredBooks.filter((book) => !book.revendu);
  const nbBooks = availableBooks.length;
  const nbSeries = new Set(availableBooks.map(getSeriesKey)).size;

  const groupedCollection = groupCollection(filteredBooks, groupment);

  return (
    <div>
      <div className='series-collection__summary'>
        <div className='series-collection__summary-icon'>
          <FaLayerGroup />
        </div>
        <span>
          <strong>{nbSeries} séries</strong> / {nbBooks} albums
        </span>
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
