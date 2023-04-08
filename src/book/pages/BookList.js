import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import BookTable from "../components/BookTable";

import "./BookList.css";

const BookList = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedBooks, setLoadedBooks] = useState();

  const fetchBooks = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/book?user=${auth.userId}`
      );
      setLoadedBooks(responseData.books);
    } catch (err) {}
  };

  useEffect(() => {
    fetchBooks();
  }, [sendRequest, auth.userId]);

  const handleAddToList = async (bookIds, listName) => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_API_URL + "/collection/add",
        "POST",
        JSON.stringify({
          ids_book: bookIds,
          id_user: auth.userId,
          list_name: listName,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      if (responseData.success) {
        history.push(
          `/${auth.userId}/${listName}?success=${responseData.success}`
        );
      }
      // Refetch the list of books after adding the book to the collection successfully
      await fetchBooks();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCollection = (bookIds) => {
    handleAddToList(bookIds, "collection");
  };

  const handleAddToWishlist = (bookIds) => {
    handleAddToList(bookIds, "wishlist");
  };

  const actions = [
    {
      type: "collection",
      title: "Je possède",
      handleAction: handleAddToCollection,
      disabled: ["possede"],
    },
    {
      type: "wishlist",
      title: "Je souhaite",
      handleAction: handleAddToWishlist,
      disabled: ["possede", "souhaite"],
    },
  ];

  const headCells = [
    {
      id: "serie",
      numeric: false,
      disablePadding: false,
      label: "Série",
    },
    {
      id: "titre",
      numeric: false,
      disablePadding: false,
      label: "Titre",
    },
    {
      id: "tome",
      numeric: true,
      disablePadding: false,
      label: "Tome",
    },
    {
      id: "editeur",
      numeric: false,
      disablePadding: false,
      label: "Editeur",
    },
    {
      id: "format",
      numeric: false,
      disablePadding: false,
      label: "Format",
    },
    {
      id: "prix",
      numeric: true,
      disablePadding: false,
      label: "Prix",
    },
  ];

  const [filterValue, setFilterValue] = useState("all");

  const handleChangeFilter = (event) => {
    setFilterValue(event.target.value);
  };

  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    if (loadedBooks) {
      // Calculate filteredBooks whenever loadedBooks or filterValue changes
      if (filterValue === "all") {
        setFilteredBooks(loadedBooks);
      } else if (filterValue === "collection") {
        setFilteredBooks(loadedBooks.filter((book) => book.possede === true));
      } else if (filterValue === "wishlist") {
        setFilteredBooks(loadedBooks.filter((book) => book.souhaite === true));
      } else {
        setFilteredBooks(
          loadedBooks.filter((book) => !book.possede && !book.souhaite)
        );
      }
    }
  }, [loadedBooks, filterValue]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />{" "}
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedBooks && (
        <div className='book-list'>
          <BookTable
            headCells={headCells}
            rows={filteredBooks}
            title='Tous les livres'
            actions={actions}
            checkbox={auth.isLoggedIn}
            handleChangeFilter={handleChangeFilter}
            filterValue={filterValue}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default BookList;
