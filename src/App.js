import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import NavBar from "./shared/components/Navigation/NavBar";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import routeConfigs from "./routes";
import { IconButton, Tooltip } from "@material-ui/core";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";

const App = () => {
  // Custom auth hook
  const { userId, isAdmin, token, name, login, logout } = useAuth();
  const [isTopVisible, setIsTopVisible] = useState(true);
  const rootRef = useRef(null);

  useEffect(() => {
    // Fonction pour vérifier si le haut de la page est visible
    const checkTopVisibility = () => {
      const rootElement = rootRef.current;
      if (rootElement) {
        setIsTopVisible(rootElement.scrollTop === 0);
      }
    };

    // Ajout d'un écouteur d'événements de défilement
    const handleScroll = () => {
      checkTopVisibility();
    };
    window.addEventListener("scroll", handleScroll);

    // Nettoyage de l'écouteur d'événements lors du démontage du composant
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Rendered routes
  const renderedRoutes = (
    <Switch>
      {routeConfigs.map((config, index) => {
        const { path, component: Component, exact, loggedInOnly } = config;
        const key = `route-${index}`;

        if (loggedInOnly && !token) {
          return null;
        }

        return (
          <Route key={key} path={path} exact={exact}>
            <Component />
          </Route>
        );
      })}
      <Redirect to="/" />
    </Switch>
  );

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        isAdmin,
        userId,
        name,
        login,
        logout,
      }}
    >
      <Router>
        <NavBar />
        <main ref={rootRef}>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {renderedRoutes}
          </Suspense>
          {isTopVisible && (
            <div
              style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
              }}
            >
              <Tooltip title="Remonter en haut de la page">
                <IconButton
                  style={{
                    backgroundColor: "#ffde59",
                    color: "#fff",
                    borderRadius: "50%",
                  }}
                  onClick={handleScrollToTop}
                >
                  <ArrowUpwardIcon />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
