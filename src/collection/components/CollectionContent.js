import React from "react";
import { LoadingCollection } from "./LoadingParts";
import CollectionFilter from "./Filters";
import DatedCollection from "./DatedCollection";
import DisplayBySeries from "./CollectionDisplay/DisplayBySeries";
import DisplayByBooks from "./CollectionDisplay/DisplayByBooks";

const CollectionContent = ({
  isDataLoading,
  loadedCollection,
  originalCollection,
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
  collectionStats,
}) => (
  <div className='collection-page'>
    <header className='collection-page__header'>
      <div className='collection-page__heading'>
        <div>
          <h1>Ma collection</h1>
          <p>Retrouve et explore tous les albums de ta bibliothèque.</p>
        </div>
      </div>

      <div className='collection-page__actions'>
        <div className='collection-page__stats'>
          <div className='collection-page__stat'>
            <span className='collection-page__stat-value'>
              {isDataLoading ? "—" : collectionStats.albums}
            </span>
            <span className='collection-page__stat-label'>Albums</span>
          </div>

          <div className='collection-page__stat'>
            <span className='collection-page__stat-value'>
              {isDataLoading ? "—" : collectionStats.series}
            </span>
            <span className='collection-page__stat-label'>Séries</span>
          </div>
        </div>

        {originalCollection && (
          <DatedCollection
            loadedBooks={originalCollection}
            displayMode={displayMode}
            isLoading={isDataLoading}
          />
        )}
      </div>
    </header>

    {isDataLoading && (
      <div className='collection'>
        <LoadingCollection displayMode={displayMode} />
      </div>
    )}

    {!isDataLoading &&
      loadedCollection &&
      originalCollection &&
      selectedEditeurs && (
        <div className='collection'>
          <CollectionFilter
            collection={loadedCollection}
            originalCollection={originalCollection}
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
  </div>
);

export default CollectionContent;
