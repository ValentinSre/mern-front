import React from "react";
import { Button } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

import ArchiveIcon from "@material-ui/icons/Archive";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddShoppingCart from "@material-ui/icons/AddShoppingCart";
import Read from "@material-ui/icons/MenuBook";

const BaseButton = styled(Button)({
  minHeight: 38,
  padding: "7px 15px",
  borderRadius: 8,
  fontSize: "0.85rem",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "none",
  transition:
    "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",

  "& .MuiButton-startIcon": {
    marginRight: 8,
  },

  "&:hover": {
    boxShadow: "none",
  },

  "&.Mui-disabled": {
    opacity: 0.55,
  },
});

const PossessionButtonStyle = styled(BaseButton)({
  color: "#252525",
  backgroundColor: "#ffde59",
  "&:hover": {
    backgroundColor: "#f0ce43",
  },
});

const WishlistButtonStyle = styled(BaseButton)({
  color: "#fff",
  backgroundColor: "#555",
  "&:hover": {
    backgroundColor: "#383838",
  },
});

const ReadButtonStyle = styled(BaseButton)({
  color: "#252525",
  backgroundColor: "#fff3c2",
  border: "1px solid #f0d66d",
  "&:hover": {
    backgroundColor: "#ffe99a",
  },
});

const EditButtonStyle = styled(BaseButton)({
  color: "#444",
  backgroundColor: "#f3f3f3",
  border: "1px solid #e8e8e8",
  "&:hover": {
    color: "#222",
    backgroundColor: "#e9e9e9",
    borderColor: "#d8d8d8",
  },
});

const DeleteButtonStyle = styled(BaseButton)({
  color: "#b43b3b",
  backgroundColor: "#fff",
  border: "1px solid #efdada",
  "&:hover": {
    color: "#982626",
    backgroundColor: "#fff0f0",
    borderColor: "#e7bcbc",
  },
});

const CustomButtons = ({ buttonType, onClick, title, disabled }) => {
  const commonProps = {
    onClick,
    disabled,
    variant: "contained",
  };

  switch (buttonType) {
    case "collection":
      return (
        <PossessionButtonStyle {...commonProps} startIcon={<ArchiveIcon />}>
          {title}
        </PossessionButtonStyle>
      );

    case "wishlist":
      return (
        <WishlistButtonStyle {...commonProps} startIcon={<AddShoppingCart />}>
          {title}
        </WishlistButtonStyle>
      );

    case "read":
      return (
        <ReadButtonStyle {...commonProps} startIcon={<Read />}>
          {title}
        </ReadButtonStyle>
      );

    case "edit":
      return (
        <EditButtonStyle {...commonProps} startIcon={<EditIcon />}>
          {title}
        </EditButtonStyle>
      );

    case "delete":
      return (
        <DeleteButtonStyle {...commonProps} startIcon={<DeleteIcon />}>
          Supprimer
        </DeleteButtonStyle>
      );

    default:
      return null;
  }
};

export default CustomButtons;
