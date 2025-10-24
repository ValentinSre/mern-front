import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddToListMenu = ({ bookId }) => {
  const [lists, setLists] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get('/api/lists');
        setLists(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des listes:', error);
      }
    };
    fetchLists();
  }, []);

  const addToList = async (listId) => {
    try {
      await axios.post(`/api/lists/${listId}/books`, { bookId });
      alert('Livre ajouté à la liste !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du livre à la liste:', error);
    }
  };

  return (
    <div>
      <button onClick={() => setMenuOpen(!menuOpen)}>Ajouter à une liste</button>
      {menuOpen && (
        <ul>
          {lists.map((list) => (
            <li key={list._id} onClick={() => addToList(list._id)}>
              {list.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddToListMenu;