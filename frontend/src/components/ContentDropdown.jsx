import React, { useEffect, useState } from "react";
import api from "../services/api";

const ContentDisplay = ({ genreId, onContentSelect }) => {
  const [contentPreviews, setContentPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!genreId) return;

    const fetchContentPreviews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await api.get(`/content/${genreId}`);
        console.log("API Response:", res.data); 

        if (res.data && res.data.data && Array.isArray(res.data.data)) {
          setContentPreviews(res.data.data);
        } else {
          console.error("Invalid data format:", res.data);
          setContents([]);
          setError("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching content:", err);
        setContents([]);
        setError(err.message || "Failed to fetch content");
      } finally {
        setLoading(false);
      }
    };

    fetchContentPreviews();
  }, [genreId]);

  if (!onContentSelect) {
    console.warn("ContentDisplay: onContentSelect prop is missing");
    onContentSelect = (id) => console.log("Content selected:", id);
  }

  if (loading) return <p className="text-center text-blue-400">Loading content...</p>;
  if (error) return <p className="text-center text-red-400">Error: {error}</p>;

  return (
    <div>
      {contentPreviews.length === 0 ? (
        <p className="text-center text-gray-400">No content available for this genre.</p>
      ) : (
        contentPreviews.map((item) => (
          <div
            key={item._id}
            onClick={() => onContentSelect(item._id)}
            className="bg-gray-800 p-5 rounded-xl mb-4 shadow-md border border-gray-700 cursor-pointer hover:border-blue-400 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-gray-300">{item.preview}</p>
            <div className="mt-4 text-blue-400 text-sm flex item-center">
              <span>Read Full content</span>
              <svg className="w-4 h-4 ml=1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 17 7-7 7"/>
              </svg>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ContentDisplay;
