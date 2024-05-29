import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Badge, Button, Divider } from "@material-ui/core";
import { BsCartCheckFill } from "react-icons/bs";
import { MdDeleteSweep } from "react-icons/md";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { LoadingReadlist } from "../components/LoadingParts";
import DateModal from "../../shared/components/UIElements/DateModal";

import "./PurchasingSuggestions.css";

const PurchasingSuggestions = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();

  const { isLoading: isDataLoading, sendRequest } = useHttpClient();
  const [wishlist, setWishlist] = useState([]);
  const [incompleteSeries, setIncompleteSeries] = useState([]);
  const [openCollectionModal, setOpenCollectionModal] = useState(false);
  const [dateObtention, setDateObtention] = useState(null);
  const [bookId, setBookId] = useState(null);

  const currentDate = new Date();

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
        setWishlist(wishlist.filter((book) => book.id_book !== bookId));
        setOpenCollectionModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleBuyButton = (bookId) => {
    setOpenCollectionModal(true);
    setDateObtention(null);
    setBookId(bookId);
  };

  const handleDeleteButton = async (bookId) => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/wishlist/${auth.userId}/${bookId}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );

      if (responseData.success)
        setWishlist(wishlist.filter((book) => book.id_book !== bookId));
    } catch (err) {}
  };

  const fetchPurchasingSuggestions = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/purchasing-suggestions/${auth.userId}`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token }
      );

      setWishlist(responseData.wishilist);
      setIncompleteSeries(responseData.incompleteSeries);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPurchasingSuggestions();
  }, [sendRequest, auth.userId]);

  if (!isDataLoading) {
    console.log(incompleteSeries);
    console.log(wishlist);
  }

  return (
    <div className='wishlist'>
      <h1>Mes suggestions</h1>

      {isDataLoading && <LoadingReadlist />}

      {!isDataLoading && (
        <React.Fragment>
          <Grid container spacing={2}>
            <div className='wishlist-display'>
              <div className='wishlist-display__books_array'>
                {incompleteSeries.map((book) => (
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
                    <div className='wishlist-display__actions_buy'>
                      <Button
                        variant='outlined'
                        style={{
                          height: "30px",
                          marginTop: "10px",
                          margin: "auto",
                          backgroundColor: "#06b87f",
                          color: "white",
                        }}
                        fullWidth
                        startIcon={<BsCartCheckFill />}
                        onClick={() => handleBuyButton(book.id_book)}
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
              </div>
            </div>
          </Grid>
          <DateModal
            open={openCollectionModal}
            handleClose={() => setOpenCollectionModal(false)}
            date={dateObtention}
            authorizeNoDate
            label="Date d'achat"
            title='Quand avez-vous acheté ce livre ?'
            handleChange={(e) => setDateObtention(e.target.value)}
            handleSubmit={handleAdditionToCollection}
          />
        </React.Fragment>
      )}
    </div>
  );
};

export default PurchasingSuggestions;
