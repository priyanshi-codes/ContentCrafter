import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header'
import Footer from '@/components/Footer/Footer';
import GenreDropdown from '../components/GenreDropdown';
import ContentDisplay from '../components/ContentDropdown';

const UserDashboard = () => {
  const [typingText, setTypingText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [genre, setGenre] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [alert, setAlert] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');

  const typingPhrases = [
    "A best hybrid content awaits...",
    "AI-powered creativity, at your fingertips.",
    "Craft. Refine. Publish. Effortlessly."
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

  const handleGenerate = () => {
    if (!genre) {
      setAlert('Please choose a genre first!');
      return;
    }
    setAlert('');
    const fakeOutput = `Here is your AI-generated hybrid content for "${genre}"${userPrompt ? ` with your prompt: ${userPrompt}` : ''}. 🚀✨`;
    setGeneratedContent(fakeOutput);
    setShowOutput(true);
  };

  const handleReset = () => {
    setShowOutput(false);
    setGenre('');
    setUserPrompt('');
  };

  return (
    <div className="text-gray-900 font-Poppins animate-bgGradient min-h-screen">
      <Header />
      {/* Generator Section */}
      <section className="p-10 bg-gradient-to-b from-gray-900 to-black text-white min-h-screen flex items-center justify-center">
      <div
        className="w-full max-w-2xl bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#475569] 
        p-8 rounded-2xl shadow-xl mx-auto transition-transform duration-500 
        hover:scale-105 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)] animate-fadeIn"
      >
        <h3 className="text-4xl font-bold text-center text-transparent bg-clip-text 
        bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 mb-6">
          Your Content Hub
        </h3>

        {/* Genre Dropdown */}
        <GenreDropdown selectedGenre={genre} setSelectedGenre={setGenre}/>

        {/* Content Display */}
        <ContentDisplay genreId={genre} />
      </div>
      </section>

<Footer />
          </div>
  );
};

export default UserDashboard;