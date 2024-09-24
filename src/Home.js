import React, { useState, useEffect } from "react";

import HomeLoaded from "./book/components/HomeLoaded";
import ErrorModal from "./shared/components/UIElements/ErrorModal";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "./shared/hooks/http-hook";

import "./Home.css";

const Home = () => {
  const [loadedBooks, setLoadedBooks] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/book/future-releases`
        );

        setLoadedBooks(responseData.books);
      } catch (err) {}
    };
    fetchBooks();
  }, [sendRequest]);

  return (
    <div className='outer-div'>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedBooks && loadedBooks.length && (
        <HomeLoaded booksToRelease={loadedBooks} />
      )}
    </div>
  );
};

export default Home;
