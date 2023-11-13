import React from "react";
import { NavLink } from "react-router-dom";

import { Tooltip, Chip } from "@material-ui/core";
import { BsFillCaretDownFill } from "react-icons/bs";
import { ImBooks } from "react-icons/im";

import "./StaticNavBar.css";

const StaticNavBar = ({ userId }) => {
  const categories = ["BD", "Comics", "Manga"];

  return (
    <div className="static-nav-bar">
      <div style={{ marginLeft: "20px", display: "flex" }}>
        {categories.map((category) => (
          <Tooltip title={`Cadre ${category}`} key={category}>
            <div className="static-nav-bar__category">
              <NavLink
                to={`/category/${category.toLowerCase()}`}
                className="static-nav-bar__category-link"
              >
                {category}
              </NavLink>
              <BsFillCaretDownFill className="static-nav-bar__category-icon" />
            </div>
          </Tooltip>
        ))}
      </div>
      <div style={{ flexGrow: 1 }}></div>
      {userId ? (
        <div className="static-nav-bar__collection">
          <NavLink
            to={`/${userId}/collection`}
            style={{ color: "#fff", textDecoration: "none" }}
          >
            <Chip
              icon={
                <ImBooks
                  color="black"
                  size="18px"
                  style={{ marginLeft: "10px" }}
                />
              }
              label="Ma biblio"
              style={{
                backgroundColor: "white",
                color: "black",
                fontSize: "12px",
                borderRadius: "8px",
                fontWeight: "bold",
                border: "1px solid black",
              }}
              variant="outlined"
            />
          </NavLink>
        </div>
      ) : null}
    </div>
  );
};

export default StaticNavBar;
