import React from "react";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import ArchiveIcon from "@material-ui/icons/Archive";
import Tooltip from "@material-ui/core/Tooltip";

function IconOnlyButton(props) {
  return (
    <Tooltip title={props.title}>
      <IconButton
        aria-label='delete'
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {props.delete && <DeleteIcon />}
        {props.wishlist && <AddShoppingCartIcon />}
        {props.collection && <ArchiveIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default IconOnlyButton;
