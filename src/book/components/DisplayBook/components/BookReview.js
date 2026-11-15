import React, { useContext, useEffect, useState } from "react";
import { Button, TextField, IconButton, Tooltip } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { AiFillTwitterCircle } from "react-icons/ai";
import { MdEdit, MdDelete, MdOpenInNew } from "react-icons/md";

import { useHttpClient } from "../../../../shared/hooks/http-hook";
import { AuthContext } from "../../../../shared/context/auth-context";

import "./BookReview.css";

const BookReview = ({ book }) => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();

  const [rating, setRating] = useState(book.note ?? null);
  const [reviewText, setReviewText] = useState(book.review || "");
  const [twitterLink, setTwitterLink] = useState(book.lien || "");

  const [isEditing, setIsEditing] = useState(
    !book.note && !book.review && !book.lien,
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setRating(book.note ?? null);
    setReviewText(book.review || "");
    setTwitterLink(book.lien || "");
    setIsEditing(!book.note && !book.review && !book.lien);
  }, [book]);

  const hasContent =
    rating !== null || reviewText.trim() !== "" || twitterLink.trim() !== "";

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth.token}`,
  });

  const getBookId = () => book.id || book._id;

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSaving(true);

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/edit`,
        "POST",
        JSON.stringify({
          id_book: getBookId(),
          id_user: auth.userId,
          note: rating,
          review: reviewText,
          lien: twitterLink,
        }),
        getHeaders(),
      );

      if (responseData.success) {
        setRating(rating);
        setReviewText(reviewText.trim());
        setTwitterLink(twitterLink.trim());
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de la critique :", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setRating(book.note ?? null);
    setReviewText(book.review || "");
    setTwitterLink(book.lien || "");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Supprimer définitivement votre critique ?")) return;

    setIsSaving(true);

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/edit`,
        "POST",
        JSON.stringify({
          id_book: getBookId(),
          id_user: auth.userId,
          delete_review: true,
        }),
        getHeaders(),
      );

      if (responseData.success) {
        setRating(null);
        setReviewText("");
        setTwitterLink("");
        setIsEditing(true);
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de la critique :", err);
    } finally {
      setIsSaving(false);
    }
  };

  const openTwitterLink = () => {
    if (!twitterLink) return;

    window.open(twitterLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className='book-review'>
      <div className='book-review__heading'>
        <div>
          <span className='book-review__kicker'>VOTRE AVIS</span>
          <h3>Ma critique</h3>
        </div>

        {!isEditing && hasContent && (
          <div className='book-review__toolbar'>
            <Tooltip title='Modifier ma critique'>
              <span>
                <IconButton
                  onClick={() => setIsEditing(true)}
                  size='small'
                  disabled={isSaving}
                >
                  <MdEdit />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title='Supprimer ma critique'>
              <span>
                <IconButton
                  onClick={handleDelete}
                  size='small'
                  disabled={isSaving}
                >
                  <MdDelete />
                </IconButton>
              </span>
            </Tooltip>
          </div>
        )}
      </div>

      {isEditing ? (
        <form className='book-review__form' onSubmit={handleSubmit}>
          <div className='book-review__rating'>
            <label>Ma note</label>
            <div className='book-review__rating-control'>
              <Rating
                className='book-review__interactive-rating'
                value={rating}
                onChange={(event, value) => setRating(value)}
                precision={0.5}
                size='large'
              />
              {rating !== null && <span>{rating} / 5</span>}
            </div>
          </div>

          <TextField
            label='Ma critique'
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
            multiline
            minRows={4}
            maxRows={12}
            fullWidth
            variant='outlined'
            placeholder="Qu'avez-vous pensé de cet ouvrage ?"
            disabled={isSaving}
          />

          <TextField
            label='Lien vers ma publication Twitter / X'
            value={twitterLink}
            onChange={(event) => setTwitterLink(event.target.value)}
            fullWidth
            variant='outlined'
            placeholder='https://...'
            disabled={isSaving}
          />

          <div className='book-review__form-actions'>
            {hasContent && (
              <Button onClick={handleCancel} disabled={isSaving}>
                Annuler
              </Button>
            )}

            <Button
              type='submit'
              variant='contained'
              disabled={isSaving}
              className='book-review__save'
            >
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      ) : (
        <div className='book-review__content'>
          {rating !== null && (
            <div className='book-review__display-rating'>
              <Rating
                value={rating}
                readOnly
                precision={0.5}
                style={{ color: "#e5bd32" }}
              />
              <strong>{rating} / 5</strong>
            </div>
          )}

          {reviewText.trim() && (
            <p className='book-review__text'>{reviewText}</p>
          )}

          {twitterLink && (
            <button
              type='button'
              className='book-review__twitter'
              onClick={openTwitterLink}
            >
              <AiFillTwitterCircle />
              Voir ma publication
              <MdOpenInNew />
            </button>
          )}
        </div>
      )}

      {!isEditing && !hasContent && (
        <p className='book-review__empty'>
          Vous n'avez pas encore publié de critique.
        </p>
      )}
    </div>
  );
};

export default BookReview;
