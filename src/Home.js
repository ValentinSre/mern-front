import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import HomeLoaded from "./book/components/Home/HomeLoaded";
import ErrorModal from "./shared/components/UIElements/ErrorModal";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "./shared/hooks/http-hook";
import { AuthContext } from "./shared/context/auth-context";
import logo from "./shared/images/logo.png";

import "./Home.css";

const Home = () => {
  const auth = useContext(AuthContext);
  const [loadedBooks, setLoadedBooks] = useState();
  const [dashboardStats, setDashboardStats] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const isLoggedIn = Boolean(auth.isLoggedIn);
  const displayName = auth.name || "lecteur";
  const [homePurchases, setHomePurchases] = useState([]);
  const [homeActivities, setHomeActivities] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/book/future-releases`,
        );

        setLoadedBooks(responseData.books);
      } catch (err) {}
    };
    fetchBooks();
  }, [sendRequest]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!isLoggedIn || !auth.userId) return;

      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/collection/home-stats/${auth.userId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token },
        );

        setDashboardStats(responseData);
      } catch (err) {
        setDashboardStats(null);
      }
    };

    fetchDashboardStats();
  }, [sendRequest, isLoggedIn, auth.userId, auth.token]);

  useEffect(() => {
    const fetchHomePurchases = async () => {
      if (!isLoggedIn || !auth.userId) return;

      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/collection/home-purchases/${auth.userId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token },
        );

        setHomePurchases(responseData.purchases || []);
      } catch (err) {
        setHomePurchases([]);
      }
    };

    fetchHomePurchases();
  }, [sendRequest, isLoggedIn, auth.userId, auth.token]);

  useEffect(() => {
    const fetchHomeActivity = async () => {
      if (!isLoggedIn || !auth.userId) return;

      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/collection/home-activity/${auth.userId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token },
        );

        setHomeActivities(responseData.activities || []);
      } catch (err) {
        setHomeActivities([]);
      }
    };

    fetchHomeActivity();
  }, [sendRequest, isLoggedIn, auth.userId, auth.token]);

  const futureReleaseCount = Array.isArray(loadedBooks)
    ? loadedBooks.length
    : 0;

  return (
    <div className={`outer-div ${isLoggedIn ? "outer-div--logged" : ""}`}>
      <ErrorModal error={error} onClear={clearError} />

      <div className='home-shell'>
        <header className='home-header'>
          <Link to='/' className='brand'>
            <img src={logo} alt='Biblio' className='home-logo' />
          </Link>

          <nav className='home-nav' aria-label='Navigation principale'>
            <Link to='/'>Accueil</Link>
            <Link to='/books'>Catalogue</Link>
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

              <div className='hero-search'>
                <input
                  type='text'
                  placeholder='Rechercher un livre, une série, un auteur...'
                />
                <Link to='/search' className='primary-btn'>
                  Rechercher
                </Link>
              </div>

              <div className='stat-grid'>
                <Link to={`/${auth.userId}/collection`} className='stat-card'>
                  <strong>{dashboardStats?.possede ?? "—"}</strong>
                  <span>livres</span>
                </Link>

                <Link to='/readlist' className='stat-card'>
                  <strong>{dashboardStats?.aLire ?? "—"}</strong>
                  <span>à lire</span>
                </Link>

                <Link to='/wishlist' className='stat-card'>
                  <strong>{dashboardStats?.wishlist ?? "—"}</strong>
                  <span>en wishlist</span>
                </Link>

                <Link to='/lists' className='stat-card'>
                  <strong>{dashboardStats?.listes ?? "—"}</strong>
                  <span>listes</span>
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className='home-hero home-hero--guest'>
            <div className='hero-copy'>
              <div className='hero-heading'>
                <span className='eyebrow'>Catalogue de livres</span>
                <h1>Suivez vos éditions, vos sorties et vos envies.</h1>
                <p>
                  Une bibliothèque plus intelligente pour gérer vos achats, vos
                  lectures, vos listes d’envies et les nouveautés à ne pas
                  manquer.
                </p>
              </div>

              <div className='hero-search'>
                <input
                  type='text'
                  placeholder='Rechercher un livre, une série, un auteur...'
                />
                <Link to='/search' className='primary-btn'>
                  Rechercher
                </Link>
              </div>

              <div className='hero-meta'>
                <div>
                  <strong>{futureReleaseCount}</strong>
                  <span>sorties</span>
                </div>
                <div>
                  <strong>{loadedBooks ? "À venir" : "À l’affût"}</strong>
                  <span>calendrier</span>
                </div>
                <div>
                  <strong>Biblio</strong>
                  <span>collection</span>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className='home-showcase'>
          {isLoading && (
            <div className='center'>
              <LoadingSpinner />
            </div>
          )}

          {!isLoading && loadedBooks && (
            <HomeLoaded
              booksToRelease={loadedBooks}
              homePurchases={homePurchases}
              homeActivities={homeActivities}
            />
          )}
        </section>

        {!isLoggedIn && (
          <section className='home-features'>
            <div className='section-head'>
              <div>
                <span className='section-kicker'>Pourquoi c’est utile</span>
                <h2>Une bibliothèque qui suit vos choix</h2>
              </div>
            </div>

            <div className='feature-grid'>
              <article className='feature-card'>
                <div className='feature-icon'>◎</div>
                <h3>Wishlist utile</h3>
                <p>
                  Centralisez les livres à avoir, les sorties à surveiller et
                  les éditions à retrouver au bon moment.
                </p>
              </article>

              <article className='feature-card'>
                <div className='feature-icon'>▣</div>
                <h3>Lecture et achat</h3>
                <p>
                  Suivez ce que vous avez lu, ce que vous possédez et ce qui
                  reste à découvrir avec un vrai historique cohérent.
                </p>
              </article>
              <article className='feature-card'>
                <div className='feature-icon'>✓</div>
                <h3>Collection précise</h3>
                <p>
                  Gardez le vrai statut de chaque achat, afin de savoir en temps
                  réel la valeur de votre bibliothèque pour un nombre varié d
                </p>
              </article>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
