import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import AppLayout from "./shared/components/Navigation/AppLayout";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import routeConfigs from "./routes";

const App = () => {
  const { userId, isAdmin, token, name, login, logout } = useAuth();

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

        if (loggedInOnly && !token) return null;
        if (adminOnly && !isAdmin) return null;

        return (
          <Route key={key} path={path} exact={exact}>
            <Component />
          </Route>
        );
      })}
      <Redirect to='/' />
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
        <main className='app-main'>
          <Suspense
            fallback={
              <div className='center'>
                <LoadingSpinner />
              </div>
            }
          >
            <AppLayout>{renderedRoutes}</AppLayout>
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
