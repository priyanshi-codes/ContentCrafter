import React, { useEffect, useState } from "react";
import api from "../services/api";

const ContentDisplay = ({ genreId }) => {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    if (!genreId) return;

    const fetchContent = async () => {
      try {
        const res = await api.get(`/content/${genreId}`);
        console.log("API Response:", res.data); // Log full response

        // Check if the data key exists and is an array
        if (res.data && Array.isArray(res.data.data)) {
          setContents(res.data.data); // Access `data` instead of `content`
        } else {
          console.error("Data is not an array:", res.data.data); // Log if data is not an array
          setContents([]);  // Reset contents to an empty array
        }
      } catch (err) {
        console.error("Error fetching content:", err);
        setContents([]); // Reset contents to an empty array if there's an error
      }
    };

    fetchContent();
  }, [genreId]);

  return (
    <div>
      {contents.length === 0 ? (
        <p className="text-center text-gray-400">No content available.</p>
      ) : (
        contents.map((item) => (
          <div
            key={item._id}
            className="bg-gray-800 p-5 rounded-xl mb-4 shadow-md border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-gray-300">{item.content}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ContentDisplay;
