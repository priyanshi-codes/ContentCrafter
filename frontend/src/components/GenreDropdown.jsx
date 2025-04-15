import React, { useEffect, useState } from 'react';
import api from '../services/api';

const GenreDropdown = ({ onSelect }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await api.get('/genres');
        setGenres(res.data.data);  // depends on your response structure
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };

    fetchGenres();
  }, []);

  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      <option value="">Select Genre</option>
      {genres.map((genre) => (
        <option key={genre._id} value={genre._id}>
          {genre.name}
        </option>
      ))}
    </select>
  );
};

export default GenreDropdown;
