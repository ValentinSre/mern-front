import React from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import BookDetails from "../components/DisplayBook/DisplayBook";

const Book = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedBook, setLoadedBook] = useState();
  const bookId = useParams().id;

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/book/${bookId}?user=${auth.userId}`
        );

        setLoadedBook(responseData.book);
      } catch (err) {}
    };
    fetchBook();
  }, [sendRequest, bookId, auth.userId]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedBook && <BookDetails book={loadedBook} />}
    </React.Fragment>
  );
};

export default Book;
