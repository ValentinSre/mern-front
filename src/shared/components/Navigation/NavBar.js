import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Paper,
  InputBase,
  Divider,
  Tooltip,
} from "@material-ui/core";
import { FaDice } from "react-icons/fa";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { Link } from "react-router-dom";

import SearchBar from "../UIElements/SearchBar";

import { AuthContext } from "../../context/auth-context";
import logo from "../../images/logo.png";

import StaticNavBar from "./StaticNavBar";

import "./NavBar.css";

const NavBar = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);

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
            <MenuItem>
              <NavLink to={`/${auth.userId}/collection`} className="menu-link">
                Ma collection
              </NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink to={`/${auth.userId}/wishlist`} className="menu-link">
                Ma wishlist
              </NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink to={`/${auth.userId}/stats`} className="menu-link">
                Mes statistiques
              </NavLink>
            </MenuItem>
          </React.Fragment>
        )}
        <MenuItem>
          <NavLink to={`/books`} className="menu-link">
            La bibliothèque
          </NavLink>
        </MenuItem>
        {auth.isAdmin && (
          <MenuItem>
            <NavLink to="/book/new" className="menu-link">
              Ajouter un livre
            </NavLink>
          </MenuItem>
        )}
      </div>
    );
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
            <SearchBar placeHolder="Rechercher un album, une série, un auteur..." />
            {/* <Paper component='form' className='searchBar'>
              <IconButton type='button' sx={{ p: "10px" }} aria-label='search'>
                <SearchIcon />
              </IconButton>
              <InputBase
                style={{ marginLeft: "8px", flex: 1 }}
                placeholder='Rechercher un album, une série, un auteur...'
                inputProps={{ "aria-label": "search google maps" }}
              />
            </Paper> */}
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <Link to="/suggestion">
              <Tooltip title="Suggérer un contenu">
                <IconButton edge="end" color="inherit">
                  <FaDice style={{ color: "#fff" }} />
                </IconButton>
              </Tooltip>
            </Link>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <AccountCircle />
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
            <Divider />
            {!auth.isLoggedIn && (
              <MenuItem>
                <NavLink to="/auth" className="menu-link">
                  Se connecter
                </NavLink>
              </MenuItem>
            )}
            {auth.isLoggedIn && (
              <MenuItem>
                <div onClick={auth.logout} className="menu-link">
                  Déconnexion
                </div>
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </AppBar>
      <StaticNavBar userId={auth.userId} />
    </React.Fragment>
  );
};

export default NavBar;
