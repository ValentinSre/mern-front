import * as React from "react";
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";

const CustomAlert = ({ isOpen, handleClose, message, severity }) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Collapse in={isOpen}>
        <Alert
          severity={severity || "info"}
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={handleClose}
            >
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default CustomAlert;
