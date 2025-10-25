import React, { useState, useEffect, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHistory } from "react-router-dom";
import "./ListsPage.css";
import { Tooltip } from "@material-ui/core";

const ListsPage = () => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");

  const history = useHistory();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_API_URL + "/lists",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setLists(responseData);
      } catch (error) {
        console.error("Erreur lors de la récupération des listes:", error);
      }
    };
    fetchLists();
  }, [sendRequest, auth.token]);

  const createList = async () => {
    if (!newListName.trim()) return;
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_API_URL + "/lists",
        "POST",
        JSON.stringify({ name: newListName }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setLists([...lists, responseData]);
      setNewListName("");
    } catch (error) {
      console.error("Erreur lors de la création de la liste:", error);
    }
  };

  return (
    <div className='lists-page'>
      <h1>Mes Listes</h1>

      <div className='create-list-form'>
        <input
          type='text'
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder='Nom de la nouvelle liste'
        />
        <button onClick={createList}>Créer une liste</button>
      </div>

      {lists.length === 0 ? (
        <div className='empty-state'>Aucune liste pour le moment.</div>
      ) : (
        <div className='lists-container'>
          {lists
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((list) => (
              <div
                className='list-card'
                key={list._id}
                onClick={() => history.push(`/lists/${list._id}`)}
              >
                {list.coverImage ? (
                  <Tooltip title={list.name}>
                    <img
                      src={list.coverImage}
                      alt={list.name}
                      className='list-card__cover'
                    />
                  </Tooltip>
                ) : (
                  <div className='list-card__no-cover'>{list.name}</div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ListsPage;
