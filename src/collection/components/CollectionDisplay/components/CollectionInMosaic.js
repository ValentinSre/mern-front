import React from "react";

import "../CollectionDisplay.css";

const CollectionInMosaic = ({
  collection,
  sort,
  selectedEditeurs,
  sortCollection,
  displayContent,
}) => {
  return (
    <div className='collection-display'>
      <div className='collection-display__books_array'>
        {sortCollection(collection, sort).map(
          (book) => selectedEditeurs[book.editeur] && displayContent(book)
        )}
      </div>
    </div>
  );
};

export default CollectionInMosaic;
