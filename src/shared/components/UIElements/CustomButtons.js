import React from "react";
import { Button } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import ArchiveIcon from "@material-ui/icons/Archive";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddShoppingCart from "@material-ui/icons/AddShoppingCart";
import Read from "@material-ui/icons/MenuBook";

const CustomButtons = ({ buttonType, onClick, title, disabled }) => {
  switch (buttonType) {
    case "collection":
      return (
        <PossessionButton onClick={onClick} title={title} disabled={disabled} />
      );
    case "wishlist":
      return (
        <WishlistButton onClick={onClick} title={title} disabled={disabled} />
      );
    case "read":
      return <ReadButton onClick={onClick} title={title} />;
    case "edit":
      return <EditButton onClick={onClick} title={title} />;
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

const ReadButtonStyle = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#ffde59"),
  backgroundColor: "#ffde59",
  "&:hover": {
    backgroundColor: "##ad9326",
  },
}));

const EditButtonStyle = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#06b87f"),
  backgroundColor: "#06b87f",
  "&:hover": {
    backgroundColor: "##06b90f",
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
  const { onClick, disabled, title } = props;

  return (
    <PossessionButtonStyle
      style={{ marginRight: "10px" }}
      onClick={onClick}
      disabled={disabled}
      startIcon={<ArchiveIcon />}
      variant='contained'
    >
      {title}
    </PossessionButtonStyle>
  );
};

const WishlistButton = (props) => {
  const { onClick, disabled, title } = props;

  return (
    <WishlistButtonStyle
      onClick={onClick}
      style={{ marginRight: "10px" }}
      disabled={disabled}
      startIcon={<AddShoppingCart />}
    >
      {title}
    </WishlistButtonStyle>
  );
};

const ReadButton = (props) => {
  const { onClick, title } = props;

  return (
    <ReadButtonStyle
      onClick={onClick}
      style={{ marginRight: "10px" }}
      startIcon={<Read />}
    >
      {title}
    </ReadButtonStyle>
  );
};

const EditButton = (props) => {
  const { onClick, title } = props;

  return (
    <EditButtonStyle
      onClick={onClick}
      style={{ marginRight: "10px" }}
      startIcon={<EditIcon />}
    >
      {title}
    </EditButtonStyle>
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
