import React, { useEffect, useState, useContext } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import TitleList from "../components/CollectionDisplay/CollectionDisplay";
import CollectionFilter from "../components/Filters";

import SerieList from "./SeriesDisplay";

import { ButtonGroup, IconButton } from "@material-ui/core";
import { FaListUl, FaTh } from "react-icons/fa";

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
    const collectionFilteredBySearch = originalCollection.filter((book) => {
      const { titre, auteurs, serie, dessinateurs, editeur, format } = book;
      const searchLower = searchText.toLowerCase();
      return (
        titre.toLowerCase().includes(searchLower) ||
        auteurs.some((author) =>
          author.nom.toLowerCase().includes(searchLower)
        ) ||
        (serie && serie.toLowerCase().includes(searchLower)) ||
        dessinateurs.some((dessinateur) =>
          dessinateur.nom.toLowerCase().includes(searchLower)
        ) ||
        (editeur && editeur.toLowerCase().includes(searchLower)) ||
        (format && format.toLowerCase().includes(searchLower))
      );
    });

    setLoadedCollection(collectionFilteredBySearch);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />{" "}
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCollection && selectedEditeurs && (
        <div className='collection'>
          <IconButton
            onClick={() => setDisplayMode("bySeries")}
            disabled={displayMode === "bySeries"}
          >
            <FaListUl />
          </IconButton>
          <IconButton
            onClick={() => setDisplayMode("byBooks")}
            disabled={displayMode === "byBooks"}
          >
            <FaTh />
          </IconButton>

          <CollectionFilter
            collection={loadedCollection}
            selectedSort={selectedSort}
            selectedGroupment={selectedGroupment}
            editeurs={selectedEditeurs}
            handleSortChange={handleSortChange}
            handleGroupmentChange={handleGroupmentChange}
            handleEditeursSelection={handleEditeursSelection}
            handleSearchBooks={handleSearchBooks}
          />
          {displayMode === "bySeries" && (
            <SerieList loadedCollection={loadedCollection} />
          )}
          {displayMode === "byBooks" && (
            <TitleList
              collection={loadedCollection}
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
