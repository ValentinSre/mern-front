import React, { useState, useEffect, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHistory } from "react-router-dom";
import "./ListsPage.css";

const ListsPage = () => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const history = useHistory();

  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_API_URL + "/lists",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          },
        );

        setLists(responseData);
      } catch (error) {
        console.error("Erreur lors de la récupération des listes:", error);
      }
    };

    fetchLists();
  }, [sendRequest, auth.token]);

  const createList = async () => {
    const name = newListName.trim();
    if (!name) return;

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_API_URL + "/lists",
        "POST",
        JSON.stringify({ name }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
      );

      setLists((previousLists) => [...previousLists, responseData]);
      setNewListName("");
    } catch (error) {
      console.error("Erreur lors de la création de la liste:", error);
    }
  };

  const sortedLists = [...lists].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className='lists-page'>
      <div className='lists-page__header'>
        <div>
          <h1>Mes listes</h1>
          <p>Organise et retrouve facilement tes sélections de comics.</p>
        </div>
        <span className='lists-page__count'>
          {lists.length} {lists.length > 1 ? "listes" : "liste"}
        </span>
      </div>

      <section className='lists-page__create'>
        <div className='lists-page__create-header'>
          <h2>Créer une liste</h2>
          <p>Donne un nom à ta nouvelle sélection.</p>
        </div>

        <form
          className='create-list-form'
          onSubmit={(event) => {
            event.preventDefault();
            createList();
          }}
        >
          <input
            type='text'
            value={newListName}
            onChange={(event) => setNewListName(event.target.value)}
            placeholder='Ex. : Mes comics préférés'
            aria-label='Nom de la nouvelle liste'
            maxLength={100}
          />
          <button type='submit' disabled={!newListName.trim()}>
            Créer la liste
          </button>
        </form>
      </section>

      {lists.length === 0 ? (
        <div className='lists-page__empty'>
          <div className='lists-page__empty-icon'>＋</div>
          <h2>Aucune liste pour le moment</h2>
          <p>Crée ta première liste pour commencer à organiser tes comics.</p>
        </div>
      ) : (
        <section className='lists-page__content'>
          <h2>Mes collections personnalisées</h2>

          <div className='lists-container'>
            {sortedLists.map((list) => (
              <button
                type='button'
                className='list-card'
                key={list._id}
                onClick={() => history.push(`/lists/${list._id}`)}
                aria-label={`Ouvrir la liste ${list.name}`}
              >
                {list.coverImage ? (
                  <img
                    src={list.coverImage}
                    alt=''
                    className='list-card__cover'
                  />
                ) : (
                  <div className='list-card__no-cover'>
                    <span>{list.name}</span>
                  </div>
                )}

                <span className='list-card__name'>{list.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ListsPage;
