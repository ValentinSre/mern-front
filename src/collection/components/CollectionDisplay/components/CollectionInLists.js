import React, { useState } from "react";
import { Tooltip } from "@material-ui/core";
import { CiCircleMore } from "react-icons/ci";
import { useHistory } from "react-router-dom";

import CollectionInDialog from "./CollectionInDialog";

import makeTitle from "../../../../shared/util/makeTitle";

import "./CollectionInLists.css";

const MAX_ITEMS_PER_CATEGORY = 20;

const CollectionInLists = ({
  sort,
  selectedEditeurs,
  sortCollection,
  groupedCollection,
  groupment,
}) => {
  const history = useHistory();

  let categories = Object.keys(groupedCollection);

  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [categoryBooks, setCategoryBooks] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  if (groupment === 1) {
    // Groupement par éditeur
    categories = categories.filter((editeur) => selectedEditeurs[editeur]);
  } else {
    // // retirer les livres où l'éditeur n'est pas sélectionné
    categories.forEach((category) => {
      groupedCollection[category] = groupedCollection[category].filter(
        (book) => selectedEditeurs[book.editeur]
      );
    });
    // retirer les catégories vides
    categories = categories.filter(
      (category) => groupedCollection[category].length > 0
    );
  }

  const handleSeeCategory = (books, name) => {
    setOpenCategoryDialog(true);
    setCategoryBooks(books);
    setCategoryName(name);
  };

  return (
    <div className='collection-display'>
      <CollectionInDialog
        open={openCategoryDialog}
        books={categoryBooks}
        title={categoryName}
        onClose={() => setOpenCategoryDialog(false)}
      />
      {categories.map((key) => (
        <div className='book-category' key={key}>
          <div className='book-category-header'>{key}</div>
          <div className='book-list'>
            {sortCollection(groupedCollection[key], sort)
              .slice(0, MAX_ITEMS_PER_CATEGORY + 1)
              .map((book, index) =>
                index < MAX_ITEMS_PER_CATEGORY ? (
                  <Tooltip title={makeTitle(book)}>
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
                ) : (
                  <div
                    style={{
                      marginLeft: "100px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CiCircleMore
                      size='50px'
                      color='#ccc'
                      onClick={() =>
                        handleSeeCategory(groupedCollection[key], key)
                      }
                    />
                  </div>
                )
              )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CollectionInLists;
