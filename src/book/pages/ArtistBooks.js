import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import makeTitle from "../../shared/util/makeTitle";

// CSS à revoir (pas de réutilisation)
const ArtistBooks = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [books, setBooks] = useState();
  const [artist, setArtist] = useState();

  const artistId = useParams().id;

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/book/artist/${artistId}`
        );

        setBooks(responseData.books);
        setArtist(responseData.artist);
      } catch (err) {}
    };
    fetchBook();
  }, [sendRequest, artistId]);

  return (
    <React.Fragment>
      {!isLoading && books && artist && (
        <div>
          <div style={{ backgroundColor: "white", borderRadius: "5px" }}>
            {artist.nom}
          </div>
          <div className='collection-display'>
            <div className='collection-display__books_array'>
              {books.map((book) => (
                <Tooltip title={makeTitle(book)}>
                  <div
                    key={book.id}
                    className='collection-display__book'
                    onClick={() => history.push(`/book/${book._id}`)}
                  >
                    <img src={book.image} alt={book.titre} />
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ArtistBooks;
