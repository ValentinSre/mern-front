import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@material-ui/core";

import "./DateModal.css";

const DateModal = ({
  open,
  handleClose,
  date,
  label,
  title,
  handleChange,
  authorizeNoDate,
  handleSubmit,
}) => {
  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleSubmit();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth='xs'
      classes={{ paper: "date-modal" }}
    >
      <form onSubmit={handleFormSubmit}>
        <DialogTitle className='date-modal__title'>
          <h2>{title}</h2>
        </DialogTitle>

        <DialogContent className='date-modal__content'>
          <TextField
            id='date'
            label={label}
            type='date'
            fullWidth
            variant='outlined'
            value={date || ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          {!date && authorizeNoDate && (
            <p className='date-modal__hint'>
              Vous pouvez également continuer sans renseigner de date.
            </p>
          )}
        </DialogContent>

        <DialogActions className='date-modal__actions'>
          <Button onClick={handleClose} className='date-modal__cancel'>
            Annuler
          </Button>

          <Button
            type='submit'
            variant='contained'
            disabled={!date && !authorizeNoDate}
            className='date-modal__submit'
          >
            Valider
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DateModal;
