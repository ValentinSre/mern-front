import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { useHistory } from "react-router-dom";
import { BsBookmarkCheckFill, BsBookmarkX } from "react-icons/bs";
import { MdRateReview, MdChatBubbleOutline } from "react-icons/md";

import makeTitle from "../../../../shared/util/makeTitle";
import Rating from "../../../../shared/components/UIElements/Rating";

import "../DisplayByBooks.css";

const EXISTING_STYLE = { color: "#45b061", fontSize: "20px" };
const MISSING_STYLE = { color: "#e74c3c", fontSize: "20px" };

const CollectionInMosaic = ({
  collection,
  sort,
  selectedEditeurs,
  sortCollection,
}) => {
  const bookState = (book) => {
    const { lu, critique } = book;

    if (lu) {
      return (
        <div className='collection-display__book-state'>
          <Tooltip title='Livre lu'>
            <div className='collection-display__book-state__read'>
              <BsBookmarkCheckFill style={EXISTING_STYLE} />
            </div>
          </Tooltip>
          {critique ? (
            <Tooltip title='Critique rédigée'>
              <div className='collection-display__book-state__review'>
                <MdRateReview style={EXISTING_STYLE} />
                <i className='fas fa-comment'></i>
              </div>
            </Tooltip>
          ) : (
            <Tooltip title='Pas de critique'>
              <div className='collection-display__book-state__review'>
                <MdChatBubbleOutline style={MISSING_STYLE} />
                <i className='fas fa-comment'></i>
              </div>
            </Tooltip>
          )}
        </div>
      );
    } else {
      return (
        <div className='collection-display__book-state'>
          <Tooltip title='Livre non lu'>
            <div className='collection-display__book-state__read'>
              <BsBookmarkX style={MISSING_STYLE} />
              <i className='fas fa-times'></i>
            </div>
          </Tooltip>
          <Tooltip title='Pas de critique'>
            <div className='collection-display__book-state__review'>
              <MdChatBubbleOutline style={MISSING_STYLE} />
              <i className='fas fa-comment'></i>
            </div>
          </Tooltip>
        </div>
      );
    }
  };

  const history = useHistory();

  return (
    <div className='collection-display'>
      <div className='collection-display__books_array'>
        {sortCollection(collection, sort).map(
          (book) =>
            selectedEditeurs[book.editeur] && (
              <Tooltip title={makeTitle(book)}>
                <div
                  key={book.id}
                  className='collection-display__book'
                  onClick={() => history.push(`/book/${book.id_book}`)}
                >
                  <div style={{ padding: "10px" }}>
                    <Rating
                      rating={book.note}
                      size={"1em"}
                      real={typeof book.note === "number"}
                    />
                  </div>
                  <img src={book.image} alt={book.titre} />
                  {bookState(book)}
                </div>
              </Tooltip>
            )
        )}
      </div>
    </div>
  );
};

export default CollectionInMosaic;
