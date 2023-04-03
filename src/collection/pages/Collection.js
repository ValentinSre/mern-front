import React, { useEffect, useState, useContext } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import CollectionDisplay from "../components/CollectionDisplay/CollectionDisplay";
import CollectionFilter from "../components/CollectionFilter";

import "./Collection.css";

const Collection = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCollection, setLoadedCollection] = useState();

  const [selectedSort, setSelectedSort] = useState(0);
  const [selectedGroupment, setSelectedGroupment] = useState(0);
  const [selectedEditeurs, setSelectedEditeurs] = useState();

  const fetchBooks = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/${auth.userId}`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token }
      );

      setLoadedCollection(responseData.collection);
      loadEditeurs(responseData.editeurs);
    } catch (err) {}
  };

  useEffect(() => {
    fetchBooks();
  }, [sendRequest, auth.userId]);

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
          <CollectionFilter
            collection={loadedCollection}
            selectedSort={selectedSort}
            selectedGroupment={selectedGroupment}
            editeurs={selectedEditeurs}
            handleSortChange={handleSortChange}
            handleGroupmentChange={handleGroupmentChange}
            handleEditeursSelection={handleEditeursSelection}
          />
          <CollectionDisplay
            collection={loadedCollection}
            sort={selectedSort}
            groupment={selectedGroupment}
            selectedEditeurs={selectedEditeurs}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default Collection;
