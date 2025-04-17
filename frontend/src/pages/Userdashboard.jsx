import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Footer from "@/components/Footer/Footer";
import GenreDropdown from "../components/GenreDropdown";
import genre from "@/assets/genre.jpg";
import chat from "@/assets/chat.jpg";
import trending from "@/assets/trendytopics.jpg";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [typingText, setTypingText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [selectedMode, setSelectedMode] = useState("");
  const [genre, setGenre] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [alert, setAlert] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const typingPhrases = [
    "A best hybrid content awaits...",
    "AI-powered creativity, at your fingertips.",
    "Craft. Refine. Publish. Effortlessly.",
  ];

  useEffect(() => {
    let timeout;
    if (charIndex < typingPhrases[phraseIndex].length) {
      setTypingText((prev) => prev + typingPhrases[phraseIndex][charIndex]);
      timeout = setTimeout(() => setCharIndex(charIndex + 1), 60);
    } else {
      timeout = setTimeout(() => eraseText(), 1500);
    }
    return () => clearTimeout(timeout);
  }, [charIndex]);

  const eraseText = () => {
    if (charIndex > 0) {
      setTypingText((prev) => prev.slice(0, -1));
      setCharIndex(charIndex - 1);
    } else {
      setPhraseIndex((prev) => (prev + 1) % typingPhrases.length);
      setTimeout(() => setCharIndex(0), 600);
    }
  };

  const handleModeSelection = (mode) => {
    setSelectedMode(mode);
    setIsModalOpen(true);
    setAlert("");
  };

  const handleGenerate = () => {
    if (!genre && selectedMode === "Genre-Based Content") {
      setAlert("Please choose a genre first!");
      return;
    }
    setAlert("");
    };

  const handleReset = () => {
    setSelectedMode("");
    setGenre("");
    setUserPrompt("");
    setGeneratedContent("");
    setAlert("");
    setIsModalOpen(false);
  };

  return (
    <div className="text-gray-900 font-Poppins min-h-screen">
      <Header />
      {/* Main Content Wrapper */}
      <div className={`${isModalOpen ? "blur-sm" : ""} transition-all duration-300`}>
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center text-white">
          {/* Video Background */}
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src="https://pin.it/1p07igOBJ"
            autoPlay
            loop
            muted
          ></video>
          {/* Overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-transparent bg-opacity-60"></div>
          {/* Content */}
          <div className="relative z-10 text-center px-6">
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400">
              Welcome to Content Crafter
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
              Empower your creativity with AI-driven content generation. Whether you're crafting
              stories, writing blogs, or exploring trending topics, Content Crafter is your ultimate
              tool for effortless and professional content creation.
            </p>
            <p className="mt-4 text-lg text-gray-400 italic">{typingText}</p>
            <button
              className="mt-8 px-8 py-4 font-semibold bg-gradient-to-r from-blue-500 to-teal-400 rounded-md hover:from-teal-400 hover:to-blue-500 text-white transition duration-200 ease-in-out"
              onClick={() => document.getElementById("contentModes").scrollIntoView({ behavior: "smooth" })}
            >
              Get Started
            </button>
          </div>
        </section>

        {/* Content Creation Modes */}
        <section id="contentModes" className="p-10 bg-gray-100 text-gray-900">
          <h2 className="text-3xl font-bold text-center mb-6">Choose Your Content Creation Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Genre-Based Content */}
            <div
              onClick={() => handleModeSelection("Genre-Based Content")}
              className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 text-center"
            >
              <img
                src={chat}
                alt="Genre-Based Content"
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Genre-Based Content</h3>
              <p className="text-sm text-gray-600">
                Select a genre and let AI craft tailored content for your needs.
              </p>
            </div>

            {/* Chat-Based Prompting */}
            <div
              onClick={() => handleModeSelection("Chat-Based Prompting")}
              className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 text-center"
            >
              <img
                src={chat}
                alt="Chat-Based Prompting"
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Chat-Based Prompting</h3>
              <p className="text-sm text-gray-600">
                Enter a custom prompt and watch AI generate content in real-time.
              </p>
            </div>

            {/* Trending Topics */}
            <div
              onClick={() => handleModeSelection("Trending Topics")}
              className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 text-center"
            >
              <img
                src={trending}
                alt="Trending Topics"
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Trending Topics</h3>
              <p className="text-sm text-gray-600">
                Explore trending topics and generate fresh, relevant content.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Modal for Selected Mode */}
      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      className=" bg-gradient-to-r  bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg transform transition-transform duration-300 scale-100 relative"
    >


      {/* Modal Title */}
      <h3 className="text-3xl font-extrabold text-center text-white mb-6">
        {selectedMode}
      </h3>

      {/* Content for Genre-Based Content */}
      {selectedMode === "Genre-Based Content" && (
        <>
          <GenreDropdown selectedGenre={genre} setSelectedGenre={setGenre} />
        </>
      )}

      {/* Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={handleGenerate}
          className="px-6 py-3 font-semibold bg-gradient-to-r from-blue-500 to-teal-400 rounded-md hover:from-teal-400 hover:to-blue-500 text-white transition duration-200 ease-in-out"
        >
          Generate Content
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 font-semibold bg-gray-700 rounded-md hover:bg-gray-600 text-white transition duration-200 ease-in-out"
        >
          Close
        </button>
      </div>

      {/* Alert */}
      {alert && (
        <p className="mt-4 text-sm text-red-400 text-center">
          {alert}
        </p>
      )}

      {/* Generated Content */}
      {generatedContent && (
        <div className="mt-8 p-4 bg-gray-100 rounded-md text-gray-900">
          <h4 className="text-lg font-bold mb-2">Generated Content:</h4>
          <p>{generatedContent}</p>
        </div>
      )}
    </div>
  </div>
)}

      <Footer />
    </div>
  );
};

export default UserDashboard;