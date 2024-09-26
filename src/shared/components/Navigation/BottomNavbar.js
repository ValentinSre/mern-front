import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom"; // Utilisation de NavLink pour la navigation
import "./BottomNavbar.css";
import { AuthContext } from "../../context/auth-context";
import GlobalSearchBar from "./GlobalSearchBar";

// Import des icônes depuis MUI
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import CollectionsBookmarkIcon from "@material-ui/icons/CollectionsBookmark";
import BookIcon from "@material-ui/icons/MenuBook";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";

const BottomNavbar = () => {
  const auth = useContext(AuthContext);
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [placeholder, setPlaceholder] = useState(
    "Rechercher un album, une série, un auteur..."
  );

  const updatePlaceholder = () => {
    if (window.innerWidth < 600) {
      setPlaceholder("Rechercher...");
    } else {
      setPlaceholder("Rechercher un album, une série, un auteur...");
    }
  };

  useEffect(() => {
    updatePlaceholder();

    window.addEventListener("resize", updatePlaceholder);

    return () => {
      window.removeEventListener("resize", updatePlaceholder);
    };
  }, []);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const toggleSearchBar = () => {
    setSearchMode(!searchMode);
  };

  return (
    <div className='navbar'>
      {!searchMode && (
        <React.Fragment>
          <NavLink to='/home' className='navbar-item' activeClassName='active'>
            <HomeIcon className='icon' />
            {/* <span>ACCUEIL</span> */}
          </NavLink>

          <NavLink to='/books' className='navbar-item'>
            <CollectionsBookmarkIcon className='icon' />
            {/* <span>BIBLIO</span> */}
          </NavLink>

          <NavLink to='/lists' className='navbar-item'>
            <FormatListBulletedIcon className='icon' />
            {/* <span>Listes</span> */}
          </NavLink>

          {auth.isAdmin && (
            <NavLink to='/book/new' className='navbar-add'>
              <button className='add-button'>
                <AddCircleIcon />
              </button>
            </NavLink>
          )}

          <div className='navbar-item' onClick={toggleSearchBar}>
            <SearchIcon className='icon' />
            {/* <span>RECHERCHE</span> */}
          </div>

          {auth.isLoggedIn && (
            <NavLink to={`/${auth.userId}/collection`} className='navbar-item'>
              <BookIcon className='icon' />
              {/* <span>MA COLLEC'</span> */}
            </NavLink>
          )}

          {!auth.isLoggedIn && (
            <NavLink to='/auth' className='navbar-item'>
              <AccountCircleIcon className='icon' />
              {/* <span>CONNEXION</span> */}
            </NavLink>
          )}
          {auth.isLoggedIn && (
            <div onClick={auth.logout} className='navbar-item'>
              <AccountCircleIcon className='icon' />
              {/* <span>DECONNEXION</span> */}
            </div>
          )}
        </React.Fragment>
      )}

      {searchMode && (
        <div className='globalSearchBarWrapper'>
          <GlobalSearchBar
            placeHolder={placeholder}
            searchText={searchText}
            handleSearch={handleSearch}
            globalSearch
            toggleSearchBar={toggleSearchBar}
          />
        </div>
      )}
    </div>
  );
};

export default BottomNavbar;
