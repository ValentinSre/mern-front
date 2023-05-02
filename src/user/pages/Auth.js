import React, { useState, useContext } from "react";

// import Card from "../../shared/components/UIElements/Card";
import { Button, TextField, Card } from "@material-ui/core";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_API_URL + "/users/login",
          "POST",
          JSON.stringify({
            email: email,
            password: password,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(
          responseData.userId,
          responseData.token,
          responseData.isAdmin
        );
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("name", name);
        formData.append("password", password);
        const responseData = await sendRequest(
          process.env.REACT_APP_API_URL + "/users/signup",
          "POST",
          formData
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Connexion requise</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <React.Fragment>
              <TextField
                label="Votre nom"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                fullWidth
                required
                InputLabelProps={{ position: "top" }}
              />
            </React.Fragment>
          )}
          <TextField
            label="Votre email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            fullWidth
            required
            InputLabelProps={{ position: "top" }}
          />
          <TextField
            label="Votre mot de passe"
            variant="outlined"
            type="password"
            value={name}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            fullWidth
            required
            InputLabelProps={{ position: "top" }}
          />
          <Button type="submit" disabled={!email || !password}>
            {isLoginMode ? "CONNEXION" : "INSCRIPTION"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          {isLoginMode ? "S'INSCRIRE" : "SE CONNECTER"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
