import React from "react";
import { NavLink } from "react-router-dom";

import { Typography, IconButton, Tooltip } from "@material-ui/core";
import { BsFillCaretDownFill } from "react-icons/bs";

import "./StaticNavBar.css";

const StaticNavBar = ({ userId }) => {
  const categories = ["BD", "Comics", "Manga"];

  return (
    <div className='static-nav-bar'>
      <div style={{ marginLeft: "20px", display: "flex" }}>
        {categories.map((category) => (
          <Tooltip title={`Cadre ${category}`} key={category}>
            <div
              style={{
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                marginRight: "20px",
                position: "relative",
              }}
            >
              <NavLink
                to={`/category/${category.toLowerCase()}`}
                style={{
                  color: "#ffffff",
                  textDecoration: "none",
                  marginRight: "5px",
                }}
              >
                {category}
              </NavLink>
              <BsFillCaretDownFill
                style={{
                  color: "#ffffff",
                  fontSize: "12px",
                  marginLeft: "5px",
                }}
              />
            </div>
          </Tooltip>
        ))}
      </div>
      <div style={{ flexGrow: 1 }}></div>
      {userId ? (
        <div
          style={{
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            marginRight: "20px",
            position: "relative",
          }}
        >
          <NavLink
            to={`/${userId}/collection`}
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Mes BD
          </NavLink>
        </div>
      ) : null}
    </div>
  );
};

export default StaticNavBar;
