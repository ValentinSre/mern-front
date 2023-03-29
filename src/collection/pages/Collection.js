import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Collection = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [ collection, setCollection ] = useState();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/collection/${userId}`
        );

        setCollection(responseData.collection);
      } catch (err) {}
    };

    fetchCollections();
  }, [sendRequest, userId]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />{" "}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && collection && (
        <p>Collection to display</p>
      )}
    </React.Fragment>
  );
};

export default Collection;
