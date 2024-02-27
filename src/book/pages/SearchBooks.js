import React, { useEffect, useState } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { useLocation } from "react-router-dom";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import SearchResults from "../components/SearchResults";

const SearchBooks = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const location = useLocation();
  const searchText = new URLSearchParams(location.search).get("q");
  const [booksByTitle, setBooksByTitle] = useState();
  const [artistsByName, setArtistsByName] = useState();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/book/search?q=${searchText}`
        );

        setBooksByTitle(responseData.booksByTitle);
        setArtistsByName(responseData.artistsByName);
      } catch (err) {}
    };
    fetchBook();
  }, [sendRequest, searchText]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && booksByTitle && artistsByName && (
        <SearchResults titles={booksByTitle} artists={artistsByName} />
      )}
    </React.Fragment>
  );
};

export default SearchBooks;
