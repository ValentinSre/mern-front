import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import BookForm from "./BookForm";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./BookForm.css";

const NewBook = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [options, setOptions] = useState({});

  useEffect(() => {
    const fetchBooksData = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/book/all-information`
        );

        setOptions(responseData);
      } catch (err) {}
    };
    fetchBooksData();
  }, [sendRequest]);

  const history = useHistory();

  const handleAddNewBook = async (newBook) => {
    try {
      await sendRequest(
        process.env.REACT_APP_API_URL + "/book",
        "POST",
        JSON.stringify(newBook),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      history.push("/");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <BookForm
        book={{}}
        handleSubmit={handleAddNewBook}
        existingSeries={options.series}
        existingEditeurs={options.editeurs}
        existingGenres={options.genres}
        existingArtistes={options.artistes}
        existingFormats={options.formats}
      />
    </React.Fragment>
  );
};

export default NewBook;
