import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { BsFillCameraReelsFill } from "react-icons/bs";
import { MdLiveHelp } from "react-icons/md";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";

import SearchBar from "../UIElements/SearchBar";

import { AuthContext } from "../../context/auth-context";
import logo from "../../images/logo.png";

import StaticNavBar from "./StaticNavBar";

import "./NavBar.css";

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: "0.8rem",
    color: "#ffde59",
    backgroundColor: "#fff",
  },
}));

const NavBar = () => {
  const history = useHistory();
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [displaySearchBar, setDisplaySearchBar] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenuItems = () => {
    return (
      <div className="menu-items">
        {auth.isLoggedIn && (
          <React.Fragment>
            <MenuItem onClick={handleCloseMenuOnClick}>
              <NavLink to={`/books`} className="menu-link">
                La bibliothèque
              </NavLink>
            </MenuItem>
            <MenuItem onClick={handleCloseMenuOnClick}>
              <NavLink to={`/lists`} className="menu-link">
                Les listes
              </NavLink>
            </MenuItem>
          </React.Fragment>
        )}
        {auth.isAdmin && (
          <MenuItem onClick={handleCloseMenuOnClick}>
            <NavLink to="/book/new" className="menu-link">
              Ajouter un livre
            </NavLink>
          </MenuItem>
        )}
        {auth.isLoggedIn && (
          <React.Fragment>
            <Divider />

            <MenuItem onClick={handleCloseMenuOnClick}>
              <NavLink to={`/${auth.userId}/collection`} className="menu-link">
                Ma collection
              </NavLink>
            </MenuItem>
            <MenuItem onClick={handleCloseMenuOnClick}>
              <NavLink to={`/${auth.userId}/readlist`} className="menu-link">
                Mes lectures
              </NavLink>
            </MenuItem>
            <MenuItem onClick={handleCloseMenuOnClick}>
              <NavLink to={`/${auth.userId}/wishlist`} className="menu-link">
                Ma wishlist
              </NavLink>
            </MenuItem>
            <MenuItem onClick={handleCloseMenuOnClick}>
              <NavLink to={`/${auth.userId}/releases`} className="menu-link">
                Mes sorties
              </NavLink>
            </MenuItem>
            <MenuItem onClick={handleCloseMenuOnClick}>
              <NavLink to={`/${auth.userId}/stats`} className="menu-link">
                Mes statistiques
              </NavLink>
            </MenuItem>
          </React.Fragment>
        )}
      </div>
    );
  };

  const handleCloseMenuOnClick = () => {
    handleMenuClose();
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <React.Fragment>
      <AppBar position="fixed" style={{ backgroundColor: "#ffde59" }}>
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexGrow: 1,
          }}
        >
          <img
            src={logo}
            alt="WebVerse"
            className="logo"
            onClick={() => history.push("/")}
          />

          <div className="searchBarWrapper">
            <SearchBar
              placeHolder="Rechercher un album, une série, un auteur..."
              searchText={searchText}
              handleSearch={handleSearch}
              globalSearch
            />
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="mobile-search">
              <Tooltip title="Rechercher un contenu">
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={() => {
                    setDisplaySearchBar(!displaySearchBar);
                    if (!displaySearchBar) {
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  <SearchIcon style={{ color: "#fff" }} />
                </IconButton>
              </Tooltip>
            </div>
            {auth.isLoggedIn && (
              <Link to="/suggestions">
                <Tooltip title="Miroir, mon beau miroir">
                  <IconButton edge="end" color="inherit">
                    <MdLiveHelp style={{ color: "#fff" }} />
                  </IconButton>
                </Tooltip>
              </Link>
            )}
            {auth.isAdmin && (
              <Link to="/challenge2024">
                <Tooltip title="Explorer le multivers">
                  <IconButton edge="end" color="inherit">
                    <BsFillCameraReelsFill style={{ color: "#fff" }} />
                  </IconButton>
                </Tooltip>
              </Link>
            )}

            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              {auth.isLoggedIn ? (
                <Avatar className={classes.small}>
                  {auth.name ? auth.name.charAt(0) : "u"}
                </Avatar>
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </div>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            style={{ marginTop: "40px" }}
          >
            {renderMenuItems()}
            {!auth.isLoggedIn && (
              <MenuItem onClick={handleCloseMenuOnClick}>
                <NavLink to="/auth" className="menu-link">
                  Se connecter
                </NavLink>
              </MenuItem>
            )}
            {auth.isLoggedIn && (
              <React.Fragment>
                <Divider />
                <MenuItem onClick={handleCloseMenuOnClick}>
                  <div onClick={auth.logout} className="menu-link">
                    Déconnexion
                  </div>
                </MenuItem>
              </React.Fragment>
            )}
          </Menu>
        </Toolbar>
      </AppBar>

      <StaticNavBar userId={auth.userId} />
      {displaySearchBar && (
        <AppBar position="static" style={{ backgroundColor: "#222" }}>
          <div className="mobileSearchBarWrapper">
            <SearchBar
              placeHolder="Recherche..."
              searchText={searchText}
              handleSearch={handleSearch}
              globalSearch
            />
          </div>
        </AppBar>
      )}
    </React.Fragment>
  );
};

export default NavBar;
