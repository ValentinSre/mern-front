import React from "react";
import { Tooltip } from "@material-ui/core";
import { CiCircleMore } from "react-icons/ci";

import "./CollectionInLists.css";

const MAX_ITEMS_PER_CATEGORY = 20;

const CollectionInLists = ({
  collection,
  sort,
  selectedEditeurs,
  sortCollection,
  displayContent,
  groupedCollection,
  groupment,
}) => {
  let categories = Object.keys(groupedCollection);

  if (groupment === 1) {
    // Groupement par éditeur
    for (let i = 0; i < categories.length; i++) {
      const editeur = categories[i];
      if (!selectedEditeurs[editeur]) {
        console.log(editeur);
        categories = categories.filter((category) => category !== editeur);
      }
    }
  } else {
    // retirer les livres où l'éditeur n'est pas sélectionné
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      groupedCollection[category] = groupedCollection[category].filter(
        (book) => selectedEditeurs[book.editeur]
      );

      // retirer les catégories vides
      if (groupedCollection[category].length === 0) {
        categories = categories.filter((cat) => cat !== category);
      }
    }
  }

  return (
    <div className='collection-display'>
      {categories.map((key) => (
        <div className='book-category' key={key}>
          <div className='book-category-header'>{key}</div>
          <div className='book-list'>
            {groupedCollection[key]
              .slice(0, MAX_ITEMS_PER_CATEGORY + 1)
              .map((book, index) =>
                index < MAX_ITEMS_PER_CATEGORY ? (
                  <Tooltip title={book.title} key={book.id}>
                    <div className='book-item'>
                      <img
                        src={book.image}
                        alt={book.title}
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
                    <CiCircleMore size='50px' color='#ccc' />
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
