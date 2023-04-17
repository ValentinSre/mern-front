import React from "react";

import { Modal, Button, Box, Typography, TextField } from "@material-ui/core";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
};

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
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id='modal' variant='h6' component='h2'>
          {title}
        </Typography>
        <div style={{ paddingTop: "10px" }}>
          <Typography id='modal' sx={{ mt: 2 }}>
            <TextField
              id='date'
              label={label}
              fullWidth
              type='date'
              defaultValue={date}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange}
            />
            <div style={{ paddingTop: "10px", margin: "auto" }}>
              <Button
                variant='contained'
                color='primary'
                disabled={!date && !authorizeNoDate}
                onClick={() => {
                  handleSubmit();
                  handleClose();
                }}
              >
                Valider {!date && authorizeNoDate && "(sans date)"}
              </Button>
            </div>
          </Typography>
        </div>
      </Box>
    </Modal>
  );
};

export default DateModal;
