import React, { useEffect, useState, useContext } from "react";
import { Button } from "@material-ui/core";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { LoadingReadlist } from "../components/LoadingParts";
import ReadHistory from "../components/ReadHistory";
import CollectionInDialog from "../components/CollectionDisplay/components/CollectionInDialog";

import "./DisplayReadlist.css";

const DisplayReadlist = () => {
  const auth = useContext(AuthContext);
  const { isLoading: isDataLoading, sendRequest } = useHttpClient();
  const [readlist, setReadlist] = useState([]);
  const [unreadlist, setUnreadlist] = useState([]);
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
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReadlist();
  }, [sendRequest, auth.userId]);

  const handleOpenUnreadlistDialog = () => {
    setOpenUnreadlistDialog(true);
  };

  const handleCloseUnreadlistDialog = () => {
    setOpenUnreadlistDialog(false);
  };

  return (
    <div className="readlist">
      <h1>Mes lectures</h1>
      <Button onClick={handleOpenUnreadlistDialog}>
        Voir les livres non lus
      </Button>

      {isDataLoading && <LoadingReadlist />}

      {!isDataLoading && <ReadHistory readlist={readlist} />}

      {!isDataLoading && unreadlist && (
        <CollectionInDialog
          open={openUnreadlistDialog}
          books={unreadlist}
          title={"Livres non lus"}
          onClose={handleCloseUnreadlistDialog}
        />
      )}
    </div>
  );
};

export default DisplayReadlist;
