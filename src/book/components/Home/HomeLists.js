import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

import "./HomeLists.css";

const HomeLists = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { sendRequest } = useHttpClient();

  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      if (!auth.isLoggedIn) return;

      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/lists`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          },
        );

        const randomLists = [...responseData]
          .sort(() => Math.random() - 0.5)
          .slice(0, 6);

        setLists(randomLists);
      } catch (err) {
        setLists([]);
      }
    };

    fetchLists();
  }, [sendRequest, auth.isLoggedIn, auth.token]);

  if (!auth.isLoggedIn || lists.length === 0) {
    return null;
  }

  return (
    <section className='home-lists-container'>
      <div className='lists-header'>
        <span className='section-kicker'>Mes listes</span>

        <Link to='/lists' className='lists-link'>
          Voir tout
          <span>→</span>
        </Link>
      </div>

      <div className='lists-list'>
        {lists.slice(0, 6).map((list) => (
          <div
            key={list._id}
            className='home-list-item'
            onClick={() => history.push(`/lists/${list._id}`)}
          >
            {list.coverImage ? (
              <img
                src={list.coverImage}
                alt={list.name}
                className='home-list-image'
              />
            ) : (
              <div className='home-list-no-cover'>
                <span>{list.name}</span>
              </div>
            )}

            <p className='home-list-title' title={list.name}>
              {list.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeLists;
