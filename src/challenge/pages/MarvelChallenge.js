import React, { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useHistory } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";

import { useEffect } from "react";
import { useState } from "react";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import NextContent from "../components/NextContent";
import ProductionForm from "../components/ProductionForm";
import ChallengeStats from "../components/ChallengeStats";
import ProductionTable from "../components/ProductionTable";

const MarvelChallenge = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [productions, setProductions] = useState();
  const history = useHistory();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/marvel-prod`
        );

        setProductions(responseData.productions);
      } catch (err) {}
    };
    fetchBook();
  }, [sendRequest]);

  const handleAddProduction = async (productionForm) => {
    try {
      await sendRequest(
        process.env.REACT_APP_API_URL + "/marvel-prod",
        "POST",
        JSON.stringify(productionForm),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      history.push("/");
    } catch (err) {}
  };

  const handlePatchProduction = async (watchObject) => {
    const { id, ...patchWatch } = watchObject;

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_API_URL + "/marvel-prod/" + id,
        "PATCH",
        JSON.stringify(patchWatch),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      const refreshedProductions = productions.map((prod) => {
        if (prod._id === id) return responseData.production;
        return prod;
      });

      setProductions(refreshedProductions);
    } catch (err) {}
  };

  const nextSuggestion = productions?.find((prod) => !prod.watch_dates.length);

  return (
    <React.Fragment>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      <div style={{ margin: "10px" }}>
        <ProductionForm
          handleSubmit={handleAddProduction}
          series={productions}
        />
      </div>
      {!isLoading && productions && (
        <React.Fragment>
          {productions.length && <ChallengeStats productions={productions} />}
          <div style={{ margin: "10px" }}>
            <ProductionTable
              productions={productions}
              setWatched={handlePatchProduction}
            />
          </div>
          {productions.length && (
            <div style={{ margin: "10px" }}>
              <NextContent marvelContent={nextSuggestion} />
            </div>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default MarvelChallenge;
