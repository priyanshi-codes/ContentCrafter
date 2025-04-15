import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header'
import Footer from '@/components/Footer/Footer';

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
    <div className="text-gray-900 font-sans bg-[linear-gradient(135deg,#f0e8ff,#ffffff)] animate-bgGradient min-h-screen">
      {/* Navbar */}
      <Header />
      {/* Generator Section */}
      <section className="p-10 bg-gradient-to-r from-[#5c2d91] to-[#360e66] text-white min-h-screen">
        <div className="w-full max-w-4xl bg-[#3d156e] p-10 rounded-3xl shadow-2xl mx-auto transition-all hover:scale-105">
          {!showOutput ? (
            <div>
              <h3 className="text-3xl font-bold text-center text-blue-300 mb-4">Generate Hybrid Content</h3>
              <div className="relative h-8 mb-6 text-center overflow-hidden">
                <p className="text-pink-300 text-lg font-medium tracking-wide transition-all duration-500 ease-in-out">{typingText}</p>
              </div>
              {alert && <div className="mb-4 bg-red-500 text-white p-3 rounded text-center font-semibold">{alert}</div>}
              <label className="block mb-2 text-sm text-gray-300">Select Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full p-3 mb-6 rounded-md bg-gray-800 text-white transition-colors hover:bg-gray-700"
              >
                <option value="">-- Choose Genre --</option>
                <option value="technology">Technology</option>
                <option value="education">Education</option>
                <option value="marketing">Marketing</option>
                <option value="health">Health & Wellness</option>
                <option value="finance">Finance</option>
              </select>

              <label className="block mb-2 text-sm text-gray-300">Add your custom prompt (optional)</label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                rows="4"
                className="w-full p-3 mb-6 rounded-md bg-gray-800 text-white resize-none transition-all hover:bg-gray-700"
                placeholder="Write something you want to focus on..."
              ></textarea>

              <button
                onClick={handleGenerate}
                className="w-full bg-gradient-to-r from-[#4b2aad] to-[#d16ba5] hover:opacity-90 text-white p-3 rounded-lg font-bold text-lg transition duration-300 transform hover:scale-105"
              >
                🚀 Generate Final Content
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center text-green-400">Your Final Content</h3>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
                <p>{generatedContent}</p>
              </div>
              <button
                onClick={handleReset}
                className="mt-6 w-full bg-gradient-to-r from-[#d16ba5] to-[#4b2aad] text-white p-3 rounded-lg font-semibold text-lg transition duration-300 transform hover:scale-105"
              >
                🔁 Generate New
              </button>
            </div>
          )}
        </div>
      </section>
      <Footer />
          </div>
  );
};

export default UserDashboard;