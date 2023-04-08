import React from "react";
import { useHistory } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import Tooltip from "@material-ui/core/Tooltip";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { BsBookmarkCheckFill, BsBookmarkX } from "react-icons/bs";
import { MdRateReview, MdChatBubbleOutline } from "react-icons/md";

import Rating from "../../../../shared/components/UIElements/Rating";
import makeTitle from "../../../../shared/util/makeTitle";

const EXISTING_STYLE = { color: "#45b061", fontSize: "20px" };
const MISSING_STYLE = { color: "#e74c3c", fontSize: "20px" };

const CollectionInDialog = (props) => {
  const history = useHistory();
  const { title, open, books, onClose } = props;

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

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            onClick={onClose}
            aria-label='close'
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
            Ma collection : {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className='collection-display' style={{ paddingTop: "30px" }}>
        <div className='collection-display__books_array'>
          {books.map((book) => (
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
          ))}
        </div>
      </div>
    </Dialog>
  );
};

export default CollectionInDialog;
