import React, { useEffect, useState, useContext } from "react";
import { Button } from "@material-ui/core";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { LoadingReadlist } from "../components/LoadingParts";

// import "./PurchasingSuggestions.css";

const PurchasingSuggestions = () => {
  const auth = useContext(AuthContext);
  const { isLoading: isDataLoading, sendRequest } = useHttpClient();
  const [wishlist, setWishlist] = useState([]);
  const [incompleteSeries, setIncompleteSeries] = useState([]);

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
    <div className="readlist">
      <h1>Mes suggestions</h1>

      {isDataLoading && <LoadingReadlist />}

      {/* {!isDataLoading && <ReadHistory readlist={readlist} />} */}
    </div>
  );
};

export default PurchasingSuggestions;
