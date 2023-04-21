import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Badge,
  Typography,
  Divider,
  Box,
  Button,
} from "@material-ui/core";
import { Check as CheckIcon } from "@material-ui/icons";
import DateModal from "../../book/components/BookDetails/components/DateModal";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import WishlistCalendar from "../components/WishlistCalendar";

import "./DisplayWishlist.css";

const Wishlist = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [wishlist, setWishlist] = useState();

  const [openCollectionModal, setOpenCollectionModal] = useState(false);
  const [dateObtention, setDateObtention] = useState(null);
  const [bookId, setBookId] = useState(null);

  const handleAdditionToCollection = () => {
    handleAddToList([bookId], "collection");
  };

  const handleAddToList = async (bookIds, listName) => {
    try {
      const requestData = await sendRequest(
        process.env.REACT_APP_API_URL + "/collection/add",
        "POST",
        JSON.stringify({
          ids_book: bookIds,
          id_user: auth.userId,
          list_name: listName,
          date_achat: dateObtention,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      const { success } = requestData;
      const bookId = bookIds[0];
      if (success) {
        // remove book from wishlist
        setWishlist(wishlist.filter((book) => book.id_book !== bookId));
        // close modal
        setOpenCollectionModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchWishlists = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/my-releases/${auth.userId}`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token }
      );

      setWishlist(responseData.wishlist);
    } catch (err) {}
  };

  useEffect(() => {
    fetchWishlists();
  }, [sendRequest, auth.userId]);

  const [priceFilter, setPriceFilter] = useState([]);

  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setPriceFilter([...priceFilter, value]);
    } else {
      setPriceFilter(priceFilter.filter((filter) => filter !== value));
    }
  };

  const filteredBooks = priceFilter.length
    ? wishlist.filter((book) => {
        if (priceFilter.includes("20")) {
          if (book.prix < 20) return true;
        }
        if (priceFilter.includes("50")) {
          if (book.prix >= 20 && book.prix < 50) return true;
        }
        if (priceFilter.includes("100")) {
          if (book.prix >= 50) return true;
        }
        return false;
      })
    : wishlist;

  const handleButton = (bookId) => {
    setOpenCollectionModal(true);
    setDateObtention(null);
    setBookId(bookId);
  };

  const currentDate = new Date();

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />{" "}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && wishlist && (
        <div className="wishlist">
          <div className="wishlist__filters">
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    value="20"
                    onChange={handleFilterChange}
                    color="primary"
                  />
                }
                label="< 20€"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="50"
                    onChange={handleFilterChange}
                    color="primary"
                  />
                }
                label="> 20€ et < 50€"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="100"
                    onChange={handleFilterChange}
                    color="primary"
                  />
                }
                label="> 50€"
              />
            </Grid>
          </div>
          {filteredBooks.length && (
            <div style={{ marginLeft: "10px", marginTop: "20px" }}>
              <strong>{filteredBooks.length} albums</strong> / total :{" "}
              {filteredBooks
                .reduce((acc, book) => acc + book.prix, 0)
                .toFixed(2)}
              €
            </div>
          )}
          <div>
            {!filteredBooks.length && (
              <h2 style={{ paddingLeft: "20px" }}>
                Aucun livre dans cette wishlist
              </h2>
            )}
            <div>
              <WishlistCalendar books={filteredBooks} />

              {/* {filteredBooks.map(({date, books}) => (
                  <React.Fragment key={date}>
                    <div className='wishlist-display__date'>{date}</div>
                    {books.map((book) => (
                      <div key={book.id} className='wishlist-display__book'>
                        <div
                          style={{ position: "relative" }}
                          onClick={() => history.push(`/book/${book.id_book}`)}
                        >
                          <img src={book.image} alt={book.titre} />
                          {new Date(book.date_parution) < currentDate && (
                            <Badge color='primary' badgeContent='✓' />
                          )}
                        </div>
                        <div
                          className='wishlist-display__info-title'
                          onClick={() => history.push(`/book/${book.id_book}`)}
                        >
                          <h3>{book.titre}</h3>
                          {book.tome && <span>Tome {book.tome}</span>}
                        </div>
                        <div className='wishlist-display__info-price'>
                          <h3>{book.prix.toFixed(2)}€</h3>
                        </div>
                        <div className='wishlist-display__actions'>
                          <Button
                            variant='outlined'
                            style={{
                              height: "30px",
                              marginTop: "10px",
                              margin: "auto",
                            }}
                            fullWidth
                            startIcon={<CheckIcon />}
                            onClick={() => handleButton(book.id_book)}
                          >
                            Acheté
                          </Button>
                        </div>
                        <Divider />
                        <div
                          className='wishlist-display__info-serie'
                          onClick={() => history.push(`/book/${book.id_book}`)}
                        >
                          {book.serie ? (
                            <h4>{book.serie}</h4>
                          ) : (
                            <h4>{book.titre}</h4>
                          )}
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                ))} */}
            </div>
          </div>
          <DateModal
            open={openCollectionModal}
            handleClose={() => setOpenCollectionModal(false)}
            date={dateObtention}
            authorizeNoDate
            label="Date d'achat"
            title="Quand avez-vous acheté ce livre ?"
            handleChange={(e) => setDateObtention(e.target.value)}
            handleSubmit={handleAdditionToCollection}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default Wishlist;
