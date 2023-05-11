import React, { useEffect, useState, useContext } from "react";

import { Skeleton } from "@material-ui/lab";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ReadHistory from "../components/ReadHistory";

import "./DisplayReadlist.css";

const DisplayReadlist = () => {
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();
  const [readlist, setReadlist] = useState();

  const fetchReadlist = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/readlist/${auth.userId}`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token }
      );

      setReadlist(responseData.readlist);
    } catch (err) {}
  };

  useEffect(() => {
    fetchReadlist();
  }, [sendRequest, auth.userId]);

  return (
    <React.Fragment>
      <div className="readlist">
        <h1>Readlist</h1>
        {isLoading && (
          <Skeleton
            variant="rect"
            height={500}
            width={"80%"}
            style={{ margin: "auto", borderRadius: "5px" }}
          />
        )}
        {!isLoading && <ReadHistory readlist={readlist} />}
      </div>
    </React.Fragment>
  );
};

export default DisplayReadlist;
