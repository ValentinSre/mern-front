import React, { useEffect, useState, useContext } from "react";
import { Checkbox, FormControlLabel, Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
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
        {isLoading && (
          <React.Fragment>
            <div style={{ paddingLeft: "5px" }}>
              <Skeleton variant="rect" width={"20%"} height={20} />
            </div>
            <div
              style={{
                paddingLeft: "5px",
                paddingTop: "25px",
                marginLeft: "auto",
                marginRight: "auto",
                width: "70%",
              }}
            >
              <Skeleton
                variant="rect"
                width={"100%"}
                height={500}
                style={{ borderRadius: "10px" }}
              />
            </div>
          </React.Fragment>
        )}
        {!isLoading && wishlist && (
          <React.Fragment>
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
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};

export default Wishlist;
