import React, { useEffect, useState, useContext } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import CollectionContent from "../components/CollectionContent";

import "./DisplayCollection.css";

const DisplayCollection = () => {
  // Context and state
  const auth = useContext(AuthContext);
  const {
    isLoading: isDataLoading,
    error,
    sendRequest,
    clearError,
  } = useHttpClient();
  const [loadedCollection, setLoadedCollection] = useState();
  const [originalCollection, setOriginalCollection] = useState([]);
  const [displayMode, setDisplayMode] = useState("bySeries");
  const [selectedSort, setSelectedSort] = useState(0);
  const [selectedGroupment, setSelectedGroupment] = useState(0);
  const [selectedEditeurs, setSelectedEditeurs] = useState();
  const [checkedValues, setCheckedValues] = useState({
    BD: true,
    Comics: true,
    Manga: true,
    Roman: true,
  });

  // Fetch collection data
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

      loadEditeurs(responseData.collection, displayMode);
    } catch (err) {}
  };

  useEffect(() => {
    fetchBooks();
  }, [sendRequest, auth.userId, displayMode]);

  const loadEditeurs = (collection, displayMode) => {
    if (!Array.isArray(collection) || typeof displayMode !== "string") {
      throw new Error("Invalid arguments provided to loadEditeurs function.");
    }

    const editeursObj = {};

    const processItem = (item) => {
      if (!item.revendu && !(item.editeur in editeursObj)) {
        editeursObj[item.editeur] = true;
      }
    };

    if (displayMode === "bySeries") {
      collection.forEach((serie) => {
        const firstBookOfSerie = serie.books[0];
        processItem(firstBookOfSerie);
      });
    } else {
      collection.forEach((book) => {
        processItem(book);
      });
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

  const handleCheckedChange = (event) => {
    setCheckedValues({
      ...checkedValues,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <CollectionContent
        isDataLoading={isDataLoading}
        originalCollection={originalCollection}
        loadedCollection={loadedCollection}
        displayMode={displayMode}
        selectedSort={selectedSort}
        selectedGroupment={selectedGroupment}
        selectedEditeurs={selectedEditeurs}
        handleSortChange={handleSortChange}
        handleGroupmentChange={handleGroupmentChange}
        handleEditeursSelection={handleEditeursSelection}
        handleSearchBooks={handleSearchBooks}
        setDisplayMode={setDisplayMode}
        setLoadedCollection={setLoadedCollection}
        checkedValues={checkedValues}
        handleCheckedChange={handleCheckedChange}
      />
    </React.Fragment>
  );
};

export default DisplayCollection;
