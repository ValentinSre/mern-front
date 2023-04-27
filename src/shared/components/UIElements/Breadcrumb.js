import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import GrainIcon from "@material-ui/icons/Grain";

const useStyles = makeStyles((theme) => ({
  link: {
    display: "flex",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));

const Breadcrumb = ({ collection, page }) => {
  const history = useHistory();
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
        href="/books"
        onClick={() => handleClick("/books")}
        className={classes.link}
      >
        <WhatshotIcon className={classes.icon} />
        {collection ? "Ma collection" : "La bibliothèque"}
      </Link>
      <Typography color="textPrimary" className={classes.link}>
        <GrainIcon className={classes.icon} />
        {page}
      </Typography>
    </Breadcrumbs>
  );
};

export default Breadcrumb;
