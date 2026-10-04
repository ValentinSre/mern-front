import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import logo from "../../images/logo.png";

import "./GlobalHeader.css";

const GlobalHeader = () => {
  const auth = useContext(AuthContext);

  return (
    <header className='global-header'>
      <Link to='/' className='global-header-brand'>
        <img src={logo} alt='WebVerse' className='global-header-logo' />
      </Link>

      <div className='global-header-actions'>
        {!auth.isLoggedIn ? (
          <>
            <Link to='/auth' className='global-header-login'>
              Se connecter
            </Link>

            <Link to='/auth' className='global-header-register'>
              Créer un compte
            </Link>
          </>
        ) : (
          <button
            type='button'
            className='global-header-logout'
            onClick={auth.logout}
          >
            Déconnexion
          </button>
        )}
      </div>
    </header>
  );
};

export default GlobalHeader;
