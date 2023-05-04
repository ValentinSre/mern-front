import React from "react";
import { location } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import SearchResults from "../components/SearchResults";

const SearchBooks = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const location = useLocation();
  const searchText = new URLSearchParams(location.search).get("q");
  const [booksByTitle, setBooksByTitle] = useState();
  const [booksBySerie, setBooksBySerie] = useState();
  const [artistsByName, setArtistsByName] = useState();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/book/search?q=${searchText}`
        );

        setBooksByTitle(responseData.booksByTitle);
        setBooksBySerie(responseData.booksBySerie);
        setArtistsByName(responseData.artistsByName);
      } catch (err) {}
    };
    fetchBook();
  }, [sendRequest, searchText]);

  console.log(booksByTitle, booksBySerie, artistsByName);
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && booksByTitle && booksBySerie && artistsByName && (
        <SearchResults
          titles={booksByTitle}
          series={booksBySerie}
          artists={artistsByName}
        />
      )}
    </React.Fragment>
  );
};

export default SearchBooks;
