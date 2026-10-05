import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

import HomeLoaded from "./book/components/Home/HomeLoaded";
import ErrorModal from "./shared/components/UIElements/ErrorModal";
import { AuthContext } from "./shared/context/auth-context";
import logo from "./shared/images/logo.png";

import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Settings } from "@material-ui/icons";

import "./Home.css";

const Home = () => {
  const auth = useContext(AuthContext);
  const isLoggedIn = Boolean(auth.isLoggedIn);
  const displayName = auth.name || "lecteur";

  const history = useHistory();
  const [searchText, setSearchText] = useState("");

  const handleHomeSearch = (event) => {
    event.preventDefault();

    const query = searchText.trim();

    if (!query) {
      history.push("/search");
      return;
    }

    history.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className={`outer-div ${isLoggedIn ? "outer-div--logged" : ""}`}>
      <ErrorModal />

      <div className='home-shell'>
        <header className='home-header'>
          <Link to='/' className='brand'>
            <img src={logo} alt='WebVerse' className='home-logo' />
          </Link>

          <nav className='home-nav' aria-label='Navigation principale'>
            <Link to='/'>Accueil</Link>

            {isLoggedIn && (
              <Link to={`/${auth.userId}/collection`}>Collection</Link>
            )}

            <Link to='/books'>Catalogue</Link>
            <Link to='/contact'>Contact</Link>
          </nav>

          <div className='header-actions'>
            {isLoggedIn ? (
              <>
                <Link
                  to={`/${auth.userId}/collection`}
                  className='secondary-btn small'
                >
                  Ma bibliothèque
                </Link>

                <button
                  type='button'
                  className='primary-btn small'
                  onClick={auth.logout}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to='/auth' className='secondary-btn small'>
                  Se connecter
                </Link>

                <Link to='/auth' className='primary-btn small'>
                  Créer mon compte
                </Link>
              </>
            )}
          </div>
        </header>

        {isLoggedIn ? (
          <section className='home-hero home-hero--logged'>
            <div className='hero-copy'>
              <div className='hero-heading'>
                <span className='eyebrow'>Ma bibliothèque</span>

                <h1>Bonjour {displayName}, ta collection avance.</h1>

                <p>
                  Suis tes achats, tes lectures, tes listes d’envies et les
                  sorties à ne pas manquer. Tout est pensé pour garder une vraie
                  trace de ta bibliothèque physique.
                </p>
              </div>

              <div className='hero-actions'>
                <Link to={`/${auth.userId}/collection`} className='primary-btn'>
                  Voir ma collection
                </Link>

                <Link to='/books' className='secondary-btn'>
                  Explorer le catalogue
                </Link>
              </div>

              <form className='hero-search' onSubmit={handleHomeSearch}>
                <input
                  type='text'
                  placeholder='Rechercher un livre, une série, un auteur...'
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                />

                <button type='submit' className='primary-btn'>
                  Rechercher
                </button>
              </form>
            </div>
          </section>
        ) : (
          <section className='home-hero home-hero--guest'>
            <div className='hero-copy'>
              <div className='hero-heading'>
                <span className='eyebrow'>Votre bibliothèque</span>

                <h1>Votre bibliothèque, enfin au même endroit.</h1>

                <p>
                  Retrouvez les livres que vous possédez, ceux que vous voulez
                  lire, les éditions que vous recherchez et les prochaines
                  sorties qui vous intéressent.
                </p>
              </div>

              <div className='hero-actions'>
                <Link to='/books' className='primary-btn'>
                  Explorer le catalogue
                </Link>

                <Link to='/auth' className='secondary-btn'>
                  Créer ma bibliothèque
                </Link>
              </div>

              <form className='hero-search' onSubmit={handleHomeSearch}>
                <input
                  type='text'
                  placeholder='Rechercher un livre, une série, un auteur...'
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                />

                <button type='submit' className='primary-btn'>
                  Rechercher
                </button>
              </form>
            </div>
          </section>
        )}

        <section className='home-showcase'>
          <HomeLoaded />
        </section>

        {!isLoggedIn && (
          <section className='home-features'>
            <div className='section-head'>
              <div>
                <span className='section-kicker'>Avec WebVerse</span>
                <h2>Tout ce qu’il faut pour suivre sa bibliothèque.</h2>
              </div>
            </div>

            <div className='feature-grid'>
              <article className='feature-card'>
                <div className='feature-icon'>📚</div>
                <h3>Ma collection</h3>
                <p>
                  Enregistrez les livres que vous possédez et retrouvez
                  rapidement l’ensemble de votre bibliothèque.
                </p>
              </article>

              <article className='feature-card'>
                <div className='feature-icon'>✅</div>
                <h3>À lire & wishlist</h3>
                <p>
                  Gardez sous la main les livres que vous voulez lire, acheter
                  ou simplement ne pas oublier.
                </p>
              </article>

              <article className='feature-card'>
                <div className='feature-icon'>📋</div>
                <h3>Mes listes</h3>
                <p>
                  Organisez vos livres dans vos propres listes pour retrouver
                  facilement les sélections qui comptent pour vous.
                </p>
              </article>
            </div>
          </section>
        )}
      </div>

      {isLoggedIn && auth.isAdmin && (
        <React.Fragment>
          <Link
            to='/book/new'
            className='home-admin-button'
            aria-label='Ajouter un livre'
            title='Ajouter un livre'
          >
            <AddCircleIcon />
          </Link>

          <Link
            to='/admin'
            className='home-admin-button home-admin-button--settings'
            aria-label="Gérer l'application"
            title="Gérer l'application"
          >
            <Settings />
          </Link>
        </React.Fragment>
      )}
    </div>
  );
};

export default Home;
