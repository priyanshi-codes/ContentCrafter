import React, { useEffect, useState } from "react";
import api from "../services/api";
import { FaArrowLeft, FaSave, FaFilePdf, FaBookmark, FaShare } from "react-icons/fa";

const FullContentDisplay = ({ contentId, onBack, onSave }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!contentId) return;

    const fetchFullContent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await api.get(`/content/detail/${contentId}`);
        console.log("Full Content Response:", res.data);

        if (res.data && res.data.data) {
          setContent(res.data.data);
        } else {
          console.error("Invalid content format:", res.data);
          setContent(null);
          setError("Invalid content format");
        }
      } catch (err) {
        console.error("Error fetching full content:", err);
        setContent(null);
        setError(err.message || "Failed to fetch content");
      } finally {
        setLoading(false);
      }
    };

    fetchFullContent();
  }, [contentId]);

  const handleSaveContent = () => {
    // Save the content to local storage or your database
    if (!content) return;
    
    const savedItem = {
      id: content._id,
      title: content.title,
      content: content.content,
      date: new Date().toLocaleDateString(),
      type: "Saved Content"
    };
    
    if (onSave) {
      onSave(savedItem);
    }
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Fullscreen loading state
  if (loading) return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-semibold text-white">Loading content...</h2>
      <p className="text-gray-400 mt-2">Please wait while we prepare your content</p>
    </div>
  );
  
  // Fullscreen error state
  if (error) return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center">
      <div className="bg-red-500/10 p-4 rounded-full mb-4">
        <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">Error Loading Content</h2>
      <p className="text-gray-400 mb-6">{error}</p>
      <button 
        onClick={onBack}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
      >
        <FaArrowLeft className="mr-2" />
        Return to Content List
      </button>
    </div>
  );

  if (!content) return null;

  // Format the creation date if available
  const formattedDate = content.createdAt ? 
    new Date(content.createdAt).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }) : null;

  // Tag styles
  const tagStyle = "text-xs font-medium px-2.5 py-0.5 rounded-full";

  // Success message when content is saved
  const SavedMessage = () => (
    <div className={`fixed bottom-8 right-8 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 flex items-center ${saved ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
      Content saved successfully!
    </div>
  );

  return (
    <>
      {/* Full-screen overlay */}
      <div className="fixed inset-0 bg-gray-900 z-40 overflow-y-auto">
        {/* Top navigation bar */}
        <div className="sticky top-0 bg-gray-800/90 backdrop-blur-sm z-10 border-b border-gray-700">
          <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
            <button 
              onClick={onBack}
              className="text-gray-300 hover:text-white flex items-center"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back to Contents</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleSaveContent}
                className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm"
              >
                <FaSave className="mr-1" />
                <span>Save</span>
              </button>
              
              <button className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors text-sm">
                <FaFilePdf className="mr-1" />
                <span>Export PDF</span>
              </button>
              
              <button className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors text-sm">
                <FaShare className="mr-1" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Content header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">{content.title}</h1>
            
            <div className="flex flex-wrap items-center text-gray-400 mb-6">
              {formattedDate && (
                <div className="flex items-center mr-4 mb-2">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formattedDate}</span>
                </div>
              )}
              
              {content.genre && (
                <div className="flex items-center mr-4 mb-2">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>{content.genre.name || "Unknown genre"}</span>
                </div>
              )}
              
              {content.reading_time && (
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{content.reading_time} min read</span>
                </div>
              )}
            </div>
            
            {/* Tags */}
            {content.tags && content.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {content.tags.map((tag, index) => (
                  <span key={index} className={`${tagStyle} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Content body */}
          <div className="prose prose-lg prose-invert max-w-none">
            {/* Format the content paragraphs properly */}
            {content.content.split('\n').map((paragraph, index) => (
              paragraph ? 
                <p key={index} className="text-gray-300 mb-6 leading-relaxed">{paragraph}</p> 
                : <br key={index} />
            ))}
          </div>
          
          {/* Footer actions */}
          <div className="mt-16 pt-8 border-t border-gray-700 flex justify-between items-center">
            <button 
              onClick={onBack}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back to Content List</span>
            </button>
            
            <button 
              onClick={handleSaveContent}
              className="flex items-center text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-blue-500/30"
            >
              <FaBookmark className="mr-2" />
              <span>Save to My Collection</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Success message */}
      <SavedMessage />
    </>
  );
};

export default FullContentDisplay;