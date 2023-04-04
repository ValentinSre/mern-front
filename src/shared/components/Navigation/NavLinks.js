import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  console.log(auth.isAdmin);

  return (
    <ul className='nav-links'>
      <li>
        <NavLink to='/' exact>
          ACCUEIL
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/collection`}>MA COLLECTION</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/wishlist`}>MA WISHLIST</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/stats`}>MES STATISTIQUES</NavLink>
        </li>
      )}
      <li>
        <NavLink to={`/books`}>LA BIBLIOTHÈQUE</NavLink>
      </li>
      {auth.isAdmin && (
        <li>
          <NavLink to='/book/new'>AJOUTER UN LIVRE</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to='/auth'>SE CONNECTER</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>DÉCONNEXION</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
