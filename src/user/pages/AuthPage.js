import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Button, TextField, Card } from "@material-ui/core";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./AuthPage.css";

const AuthPage = () => {
  // State variables
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const history = useHistory();

  // Context and HTTP hook
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // Switch mode handler
  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  // Auth submit handler
  const authSubmitHandler = async (event) => {
    event.preventDefault();

    const apiUrl = process.env.REACT_APP_API_URL;

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          `${apiUrl}/users/login`,
          "POST",
          JSON.stringify({ email, password }),
          { "Content-Type": "application/json" }
        );

        const { userId, token, isAdmin, name } = responseData;
        auth.login(userId, token, isAdmin, name);
        history.push("/");
      } catch (err) {}
    } else {
      try {
        const signupFormData = new FormData();
        signupFormData.append("email", email);
        signupFormData.append("name", name);
        signupFormData.append("password", password);

        const responseData = await sendRequest(
          `${apiUrl}/users/signup`,
          "POST",
          signupFormData
        );

        const { userId, token, name } = responseData;
        auth.login(userId, token, false, name);
        history.push("/");
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
            value={password}
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

export default AuthPage;
