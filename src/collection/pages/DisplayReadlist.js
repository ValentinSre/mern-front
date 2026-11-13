import React, { useEffect, useState, useContext } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { LoadingReadlist } from "../components/LoadingParts";
import ReadHistory from "../components/ReadHistory";
import CollectionInDialog from "../components/CollectionDisplay/components/CollectionInDialog";

import { FaBookOpen } from "react-icons/fa";

import "./DisplayReadlist.css";

const DisplayReadlist = () => {
  const auth = useContext(AuthContext);
  const { isLoading: isDataLoading, sendRequest } = useHttpClient();

  const [readlist, setReadlist] = useState({});
  const [unreadlist, setUnreadlist] = useState([]);
  const [openUnreadlistDialog, setOpenUnreadlistDialog] = useState(false);

  const fetchReadlist = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/readlist/${auth.userId}`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token },
      );

      setReadlist(responseData.readlist || {});
      setUnreadlist(responseData.unreadlist || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReadlist();
  }, [sendRequest, auth.userId]);

  const totalRead = Object.values(readlist).reduce(
    (total, books) => total + (Array.isArray(books) ? books.length : 0),
    0,
  );

  const handleOpenUnreadlistDialog = () => {
    setOpenUnreadlistDialog(true);
  };

  const handleCloseUnreadlistDialog = () => {
    setOpenUnreadlistDialog(false);
  };

  return (
    <div className='readlist-page'>
      <div className='readlist-header'>
        <div className='readlist-header__heading'>
          <h1>Mes lectures</h1>
          <p>Retrouve l'historique de tes lectures et suis ta progression.</p>
        </div>

        <div className='readlist-header__actions'>
          <div className='readlist-stats'>
            <div className='readlist-stat'>
              <span className='readlist-stat__value'>
                {isDataLoading ? "—" : totalRead}
              </span>
              <span className='readlist-stat__label'>Lus</span>
            </div>

            <div className='readlist-stat'>
              <span className='readlist-stat__value'>
                {isDataLoading ? "—" : unreadlist.length}
              </span>
              <span className='readlist-stat__label'>Non lus</span>
            </div>
          </div>

          <button
            type='button'
            className='readlist-header__button'
            onClick={handleOpenUnreadlistDialog}
            disabled={isDataLoading || unreadlist.length === 0}
          >
            <FaBookOpen />
            <span>Voir les livres non lus</span>
          </button>
        </div>
      </div>

      <div className='readlist'>
        {isDataLoading ? (
          <LoadingReadlist />
        ) : (
          <ReadHistory readlist={readlist} />
        )}
      </div>

      {!isDataLoading && (
        <CollectionInDialog
          open={openUnreadlistDialog}
          books={unreadlist}
          title='Livres non lus'
          showReadingStatus={false}
          onClose={handleCloseUnreadlistDialog}
          filters={true}
        />
      )}
    </div>
  );
};

export default DisplayReadlist;
