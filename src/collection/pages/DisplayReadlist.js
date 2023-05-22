import React, { useEffect, useState, useContext } from "react";

import { Skeleton } from "@material-ui/lab";
import { Button } from "@material-ui/core";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ReadHistory from "../components/ReadHistory";
import CollectionInDialog from "../components/CollectionDisplay/components/CollectionInDialog";

import "./DisplayReadlist.css";

const DisplayReadlist = () => {
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();
  const [readlist, setReadlist] = useState();
  const [unreadlist, setUnreadlist] = useState();
  const [openUnreadlistDialog, setOpenUnreadlistDialog] = useState(false);

  const fetchReadlist = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/readlist/${auth.userId}`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token }
      );

      setReadlist(responseData.readlist);
      setUnreadlist(responseData.unreadlist);
      console.log("unreadlist", responseData.unreadlist);
    } catch (err) {}
  };

  useEffect(() => {
    fetchReadlist();
  }, [sendRequest, auth.userId]);

  return (
    <React.Fragment>
      <div className="readlist">
        <h1>Mes lectures</h1>
        <Button onClick={() => setOpenUnreadlistDialog(true)}>
          Voir les livres non lus
        </Button>
        {isLoading && (
          <Skeleton
            variant="rect"
            height={500}
            width={"80%"}
            style={{ margin: "auto", borderRadius: "5px" }}
          />
        )}

        {!isLoading && <ReadHistory readlist={readlist} />}
        {!isLoading && unreadlist && (
          <CollectionInDialog
            open={openUnreadlistDialog}
            books={unreadlist}
            title={"Livres non lus"}
            onClose={() => setOpenUnreadlistDialog(false)}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default DisplayReadlist;
