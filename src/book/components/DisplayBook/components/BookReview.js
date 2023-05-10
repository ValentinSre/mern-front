import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  TextField,
  Tooltip,
  IconButton,
  Button,
  InputAdornment,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { AiFillTwitterCircle } from "react-icons/ai";

import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { useHttpClient } from "../../../../shared/hooks/http-hook";
import { AuthContext } from "../../../../shared/context/auth-context";

import "./BookReview.css";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const BookReview = ({ book }) => {
  const { note, review, lien, lu } = book;
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const classes = useStyles();

  const [rating, setRating] = useState(note);
  const [reviewText, setReviewText] = useState(review);
  const [twitterLink, setTwitterLink] = useState(lien);

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    const bookId = book.id;
    try {
      await sendRequest(
        process.env.REACT_APP_API_URL + "/collection/edit",
        "POST",
        JSON.stringify({
          id_book: bookId,
          id_user: auth.userId,
          note: rating,
          //   review: reviewText,
          lien: twitterLink,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      history.push(`/${auth.userId}/collection`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.root}>
      <Accordion disabled={!lu}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Votre critique</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="book-collection__review">
              <form onSubmit={(event) => handleSubmitReview(event)}>
                <div className="book-collection__review-twitter">
                  <div className="book-collection__review__rating">
                    <p>Ma note</p>
                    <Rating
                      value={rating}
                      onChange={(e) => setRating(parseFloat(e.target.value))}
                      precision={0.5}
                      size="large"
                      style={{ color: "#ffde59" }}
                    />
                  </div>
                  <TextField
                    label="Lien Twitter"
                    variant="outlined"
                    value={twitterLink}
                    onChange={(e) => setTwitterLink(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Voir sur Twitter">
                            <IconButton
                              onClick={() => {
                                window.location.href = twitterLink;
                              }}
                            >
                              <AiFillTwitterCircle />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                </div>
                {/* <TextField
          id='review-text'
          label='Votre critique'
          variant='outlined'
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          multiline
          rows={4}
          fullWidth
          margin='normal'
        /> */}
                <Button
                  type="submit"
                  variant="contained"
                  style={{
                    marginTop: "10px",
                    marginLeft: "15px",
                    backgroundColor: "#ffde59",
                  }}
                >
                  Valider
                </Button>
              </form>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default BookReview;
