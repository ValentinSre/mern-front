import React from "react";

import { Skeleton } from "@material-ui/lab";

import CollectionFilter from "../Filters";

const DEFAULT_SELECT = 0;
const DEFAULT_ARRAY = [];
const DEFAULT_CHECKED_VALUES = {
  BD: true,
  Comics: true,
  Manga: true,
  Roman: true,
};

const LoadingCollection = ({ displayMode }) => {
  return (
    <React.Fragment>
      <CollectionFilter
        collection={DEFAULT_ARRAY}
        displayMode={displayMode}
        selectedSort={DEFAULT_SELECT}
        selectedGroupment={DEFAULT_SELECT}
        editeurs={DEFAULT_ARRAY}
        loading={true}
        checkedValues={DEFAULT_CHECKED_VALUES}
      />
      <div style={{ paddingLeft: "40px" }}>
        <Skeleton variant="rect" width={"20%"} height={30} />
      </div>
      {displayMode === "bySeries" && (
        <div
          style={{
            paddingLeft: "40px",
            paddingRight: "40px",
            paddingTop: "20px",
          }}
        >
          <Skeleton
            variant="rect"
            width={"100%"}
            height={150}
            style={{ marginBottom: "10px", borderRadius: "10px" }}
          />
          <Skeleton
            variant="rect"
            width={"100%"}
            height={150}
            style={{ marginBottom: "10px", borderRadius: "10px" }}
          />
          <Skeleton
            variant="rect"
            width={"100%"}
            height={150}
            style={{ marginBottom: "10px", borderRadius: "10px" }}
          />
          <Skeleton
            variant="rect"
            width={"100%"}
            height={150}
            style={{ marginBottom: "10px", borderRadius: "10px" }}
          />
        </div>
      )}
      {displayMode === "byBooks" && (
        <div
          style={{
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingTop: "20px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridGap: "2rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            }}
          >
            <Skeleton variant="rect" height={300} />
            <Skeleton variant="rect" height={300} />
            <Skeleton variant="rect" height={300} />
            <Skeleton variant="rect" height={300} />
            <Skeleton variant="rect" height={300} />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default LoadingCollection;
