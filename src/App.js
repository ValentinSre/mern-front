// Imports
import React, { Suspense } from "react";
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

const App = () => {
  // Custom auth hook
  const { userId, isAdmin, token, name, login, logout } = useAuth();

  console.log(routeConfigs);
  // Rendered routes
  const renderedRoutes = (
    <Switch>
      {routeConfigs.map((config, index) => {
        const {
          path,
          component: Component,
          exact,
          loggedInOnly,
          adminOnly,
        } = config;
        const key = `route-${index}`;

        if (loggedInOnly && !token) {
          return null;
        }

        if (adminOnly && !isAdmin) {
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
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {renderedRoutes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
