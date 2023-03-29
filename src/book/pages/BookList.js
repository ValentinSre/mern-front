import React, { useEffect, useState, useContext } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import BookTable from "../components/BookTable";

const BookList = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedBooks, setLoadedBooks] = useState();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/book?user=${auth.userId}`
        );

        setLoadedBooks(responseData.books);
      } catch (err) {}
    };

    fetchBooks();
  }, [sendRequest, auth.userId]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />{" "}
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedBooks && (
        <BookTable books={loadedBooks} isLoading={isLoading} />
      )}
    </React.Fragment>
  );
};

export default BookList;
