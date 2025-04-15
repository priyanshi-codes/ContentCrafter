import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ContentDisplay = ({ genreId }) => {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    if (!genreId) return;

    const fetchContent = async () => {
      try {
        const res = await api.get(`/content/${genreId}`);
        setContents(res.data.data);
      } catch (err) {
        console.error('Error fetching content:', err);
      }
    };

    fetchContent();
  }, [genreId]);

  return (
    <div>
      {contents.length === 0 ? (
      <p>No content available.</p>
    ):(
      contents.map((item) => (
        <div key={item._id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
          <h3>{item.title}</h3>
          <p>{item.content}</p>
        </div>
      )
      ))}
    </div>
  );
};

export default ContentDisplay;
