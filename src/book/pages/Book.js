import React from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Book = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedBook, setLoadedBook] = useState();
  const bookId = useParams().id;

  useEffect(() => {
    const fetchBook = async () => {
      console.log("fetchBooks");
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/book/${bookId}?user=${auth.userId}`
        );

        setLoadedBook(responseData.book);
      } catch (err) {}
    };
    fetchBook();
  }, [sendRequest, bookId, auth.userId]);

  console.log(loadedBook);
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedBook && <p>{loadedBook.titre}</p>}
    </React.Fragment>
  );
};

export default Book;
