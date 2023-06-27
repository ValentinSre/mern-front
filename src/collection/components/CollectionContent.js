import React from "react";

import { LoadingCollection } from "./LoadingParts";
import CollectionFilter from "./Filters";
import DisplayBySeries from "./CollectionDisplay/DisplayBySeries";
import DisplayByBooks from "./CollectionDisplay/DisplayByBooks";

const CollectionContent = ({
  isDataLoading,
  loadedCollection,
  displayMode,
  selectedSort,
  selectedGroupment,
  selectedEditeurs,
  handleSortChange,
  handleGroupmentChange,
  handleEditeursSelection,
  handleSearchBooks,
  setDisplayMode,
  setLoadedCollection,
  checkedValues,
  handleCheckedChange,
}) => {
  return (
    <React.Fragment>
      {isDataLoading && (
        <div className="collection">
          <LoadingCollection displayMode={displayMode} />
        </div>
      )}
      {!isDataLoading && loadedCollection && selectedEditeurs && (
        <div className="collection">
          <CollectionFilter
            collection={loadedCollection}
            displayMode={displayMode}
            selectedSort={selectedSort}
            selectedGroupment={selectedGroupment}
            editeurs={selectedEditeurs}
            handleSortChange={handleSortChange}
            handleGroupmentChange={handleGroupmentChange}
            handleEditeursSelection={handleEditeursSelection}
            handleSearchBooks={handleSearchBooks}
            setDisplayMode={setDisplayMode}
            setLoadedCollection={setLoadedCollection}
            checkedValues={checkedValues}
            handleCheckedChange={handleCheckedChange}
          />
          {displayMode === "bySeries" && (
            <DisplayBySeries
              collection={loadedCollection}
              checkedValues={checkedValues}
              selectedEditeurs={selectedEditeurs}
            />
          )}
          {displayMode === "byBooks" && (
            <DisplayByBooks
              collection={loadedCollection}
              checkedValues={checkedValues}
              selectedSort={selectedSort}
              selectedGroupment={selectedGroupment}
              selectedEditeurs={selectedEditeurs}
            />
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default CollectionContent;
