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

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [wishlist, setWishlist] = useState();

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

  console.log(wishlist);
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
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Wishlist;
