import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import HomeIcon from "@material-ui/icons/Home";
import { ImBooks, ImBook } from "react-icons/im";

import { AuthContext } from "../../context/auth-context";

const useStyles = makeStyles((theme) => ({
  link: {
    display: "flex",
    fontSize: "10px",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 14,
    height: 14,
  },
}));

const Breadcrumb = ({ collection, page }) => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const classes = useStyles();

  const handleClick = (path) => {
    history.push(path);
  };

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link
        color="inherit"
        to="/"
        onClick={() => handleClick("/")}
        className={classes.link}
      >
        <HomeIcon className={classes.icon} />
        Accueil
      </Link>
      <Link
        color="inherit"
        className={classes.link}
        onClick={() => {
          const path = collection ? `/${auth.userId}/collection` : "/books";
          handleClick(path);
        }}
      >
        <ImBooks className={classes.icon} />
        {collection ? "Ma collection" : "La bibliothèque"}
      </Link>
      <Typography color="textPrimary" className={classes.link}>
        <ImBook className={classes.icon} />
        {page}
      </Typography>
    </Breadcrumbs>
  );
};

export default Breadcrumb;
