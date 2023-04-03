import React from "react";
import { Button } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import ArchiveIcon from "@material-ui/icons/Archive";
import DeleteIcon from "@material-ui/icons/Delete";
import AddShoppingCart from "@material-ui/icons/AddShoppingCart";

const CustomButtons = ({ buttonType, onClick }) => {
  switch (buttonType) {
    case "collection":
      return <PossessionButton onClick={onClick} />;
    case "wishlist":
      return <WishlistButton onClick={onClick} />;
    case "delete":
      return <DeleteButton onClick={onClick} />;
    default:
      return null;
  }
};

const PossessionButtonStyle = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#ffde59"),
  backgroundColor: "#ffde59",
  "&:hover": {
    backgroundColor: "##ad9326",
  },
}));

const WishlistButtonStyle = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#ad9326"),
  backgroundColor: "#ad9326",
  "&:hover": {
    backgroundColor: "##ffde59",
  },
}));

const DeleteButtonStyle = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#cb1515"),
  backgroundColor: "#cb1515",
  "&:hover": {
    backgroundColor: "##7a0909",
  },
}));

const PossessionButton = (props) => {
  const { onClick, disabled } = props;

  return (
    <PossessionButtonStyle
      style={{ marginRight: "10px" }}
      onClick={onClick}
      disabled={disabled}
      startIcon={<ArchiveIcon />}
      variant='contained'
    >
      Je possède
    </PossessionButtonStyle>
  );
};

const WishlistButton = (props) => {
  const { onClick, disabled } = props;

  return (
    <WishlistButtonStyle
      onClick={onClick}
      style={{ marginRight: "10px" }}
      disabled={disabled}
      startIcon={<AddShoppingCart />}
    >
      Je souhaite
    </WishlistButtonStyle>
  );
};

const DeleteButton = (props) => {
  const { onClick, disabled } = props;

  return (
    <DeleteButtonStyle
      onClick={onClick}
      style={{ marginRight: "10px" }}
      disabled={disabled}
      startIcon={<DeleteIcon />}
    >
      Supprimer
    </DeleteButtonStyle>
  );
};

export default CustomButtons;
