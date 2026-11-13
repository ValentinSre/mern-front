import React, { useState } from "react";
import { Tooltip } from "@material-ui/core";
import { CiCircleMore } from "react-icons/ci";
import { useHistory } from "react-router-dom";

import CollectionInDialog from "./CollectionInDialog";

import makeTitle from "../../../../shared/util/makeTitle";

import "./CollectionInLists.css";

const MAX_ITEMS_PER_CATEGORY = 20;

const UNDEFINED_CATEGORIES = {
  1: "Editeur non défini",
  2: "Format non défini",
  3: "Auteur non défini",
  4: "Dessinateur non défini",
  5: "Genre non défini",
  6: "Année non définie",
  7: "Type non défini",
};

const CollectionInLists = ({
  sort,
  selectedEditeurs,
  sortCollection,
  groupedCollection,
  groupment,
}) => {
  const history = useHistory();

  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [categoryBooks, setCategoryBooks] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  let categories = Object.keys(groupedCollection);

  if (groupment === 1) {
    categories = categories.filter((editeur) => selectedEditeurs[editeur]);
  } else {
    categories.forEach((category) => {
      groupedCollection[category] = groupedCollection[category].filter(
        (book) => selectedEditeurs[book.editeur],
      );
    });

    categories = categories.filter(
      (category) => groupedCollection[category].length > 0,
    );
  }

  const handleSeeCategory = (books, name) => {
    setOpenCategoryDialog(true);
    setCategoryBooks(books);
    setCategoryName(name);
  };

  return (
    <div className='collection-display collection-display--lists'>
      <CollectionInDialog
        open={openCategoryDialog}
        books={categoryBooks}
        title={categoryName}
        onClose={() => setOpenCategoryDialog(false)}
      />

      {categories.map((key) => {
        const books = sortCollection(
          groupedCollection[key].filter((book) => !book.revendu),
          sort,
        );

        if (books.length === 0) return null;

        return (
          <section className='book-category' key={key}>
            <div className='book-category-header'>
              {key !== "undefined" ? key : UNDEFINED_CATEGORIES[groupment]}
              <span className='book-category-count'>
                {books.length} {books.length > 1 ? "albums" : "album"}
              </span>
            </div>

            <div className='book-list'>
              {books.slice(0, MAX_ITEMS_PER_CATEGORY).map((book) => (
                <Tooltip title={makeTitle(book)} key={book.id}>
                  <div
                    className='book-item'
                    onClick={() => history.push(`/book/${book.id_book}`)}
                  >
                    <img
                      src={book.image}
                      alt={book.titre}
                      className='book-cover'
                    />
                  </div>
                </Tooltip>
              ))}

              {books.length > MAX_ITEMS_PER_CATEGORY && (
                <button
                  type='button'
                  className='book-list-more'
                  onClick={() => handleSeeCategory(groupedCollection[key], key)}
                  aria-label={`Voir tous les albums de ${key}`}
                >
                  <CiCircleMore />
                  <span>Voir tout</span>
                </button>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default CollectionInLists;
