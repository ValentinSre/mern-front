import React, { useEffect, useState, useContext } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import DisplayByBooks from "../components/CollectionDisplay/DisplayByBooks";
import CollectionFilter from "../components/Filters";
import DisplayBySeries from "../components/CollectionDisplay/DisplayBySeries";

import "./DisplayCollection.css";

const DisplayCollection = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCollection, setLoadedCollection] = useState();
  const [originalCollection, setOriginalCollection] = useState([]);

  const [displayMode, setDisplayMode] = useState("bySeries");

  const [selectedSort, setSelectedSort] = useState(0);
  const [selectedGroupment, setSelectedGroupment] = useState(0);
  const [selectedEditeurs, setSelectedEditeurs] = useState();

  const fetchBooks = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/${auth.userId}?displayMode=${displayMode}`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token }
      );

      setOriginalCollection(responseData.collection);
      setLoadedCollection(responseData.collection);

      loadEditeurs(responseData.editeurs);
    } catch (err) {}
  };

  useEffect(() => {
    fetchBooks();
  }, [sendRequest, auth.userId, displayMode]);

  const loadEditeurs = (editeurs) => {
    const editeursObj = {};
    for (const editeur of editeurs) {
      editeursObj[editeur] = true;
    }

    setSelectedEditeurs(editeursObj);
  };

  const handleEditeursSelection = (name) => {
    const newEditeurs = { ...selectedEditeurs };
    newEditeurs[name] = !selectedEditeurs[name];
    setSelectedEditeurs(newEditeurs);
  };

  const handleSortChange = (event) => {
    setSelectedSort(event.target.value);
  };

  const handleGroupmentChange = (event) => {
    setSelectedGroupment(event.target.value);
  };

  const handleSearchBooks = (searchText) => {
    const collectionFilteredBySearch = originalCollection.filter((element) => {
      const searchLower = searchText.toLowerCase();

      if (displayMode === "bySeries") {
        const { serie } = element;

        return serie && serie.toLowerCase().includes(searchLower);
      } else {
        const { titre, serie } = element;

        return (
          titre.toLowerCase().includes(searchLower) ||
          (serie && serie.toLowerCase().includes(searchLower))
        );
      }
    });

    setLoadedCollection(collectionFilteredBySearch);
  };

  const [checkedValues, setCheckedValues] = React.useState({
    BD: true,
    Comics: true,
    Manga: true,
    Roman: true,
  });

  const handleCheckedChange = (event) => {
    setCheckedValues({
      ...checkedValues,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />{" "}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCollection && selectedEditeurs && (
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

export default DisplayCollection;
