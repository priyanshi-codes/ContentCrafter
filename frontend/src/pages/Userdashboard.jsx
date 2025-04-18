import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Footer from "@/components/Footer/Footer";
import GenreDropdown from "../components/GenreDropdown";
import genre from "@/assets/genre.jpg";
import chat from "@/assets/chat.jpg";
import trending from "@/assets/trendytopics.jpg";
import { useNavigate } from "react-router-dom";
//import { motion } from "framer-motion"; // Consider adding framer-motion for animations

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
  const [isLoading, setIsLoading] = useState(false);
  const [savedProjects, setSavedProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'history'

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
    if (!userPrompt && selectedMode === "Chat-Based Prompting") {
      setAlert("Please enter a prompt first!");
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    setAlert("");
    
    // Simulate API call with timeout
    setTimeout(() => {
      setGeneratedContent(
        "Your AI-generated content appears here. This is a placeholder for the actual content generation that would integrate with your AI backend service. The content would be tailored to your specific requirements and would match the tone, style, and format you need for your project."
      );
      setIsLoading(false);
      
      // Add to saved projects
      const newProject = {
        id: Date.now(),
        title: selectedMode === "Genre-Based Content" 
          ? `${genre} Content` 
          : selectedMode === "Chat-Based Prompting"
            ? userPrompt.substring(0, 30) + "..."
            : "Trending Topic Content",
        type: selectedMode,
        date: new Date().toLocaleDateString(),
        status: "Completed"
      };
      
      setSavedProjects(prev => [newProject, ...prev]);
    }, 2000);
  };

  const handleReset = () => {
    // Add smooth transitions
    if (generatedContent) {
      // If there's content, fade it out first before closing
      setGeneratedContent("");
      setAlert("");
      
      // Wait briefly before closing modal
      setTimeout(() => {
        setSelectedMode("");
        setGenre("");
        setUserPrompt("");
        setIsModalOpen(false);
      }, 300);
    } else {
      // No content, reset immediately
      setSelectedMode("");
      setGenre("");
      setUserPrompt("");
      setAlert("");
      setIsModalOpen(false);
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    setAlert("Content copied to clipboard!");
    
    // Clear the alert after 3 seconds
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };

  const handleSaveContent = () => {
    setAlert("Content saved successfully!");
    
    // Clear the alert after 3 seconds
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };

  return (
    <div className="bg-gray-900 text-gray-200 font-Poppins min-h-screen">
      <Header />
      {/* Main Content Wrapper */}
      <div className={`${isModalOpen ? "blur-sm" : ""} transition-all duration-300`}>
        {/* Hero Section - Enhanced with better overlay and animations */}
        <section className="relative min-h-[75vh] flex items-center justify-center text-white">
          {/* Video Background with improved loading */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <video
              className="absolute top-0 left-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              poster="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-typing-on-smartphone-in-city-1080-large.mp4" type="video/mp4" />
            </video>
            {/* Enhanced gradient overlay for better visibility */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900/90 via-gray-900/60 to-gray-900/90"></div>
          </div>
          
          {/* Enhanced Hero Content */}
          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <div className="inline-block mb-4 px-4 py-1 bg-blue-500/20 rounded-full backdrop-blur-sm">
              <span className="text-blue-300 font-medium">AI-Powered Content Generation</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 mb-6">
              Welcome to Content Crafter
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto mb-6"></div>
            <p className="mt-6 text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Empower your creativity with AI-driven content generation. Whether you're crafting
              stories, writing blogs, or exploring trending topics, Content Crafter is your ultimate
              tool for effortless and professional content creation.
            </p>
            <p className="mt-4 text-lg text-blue-300 italic h-8">{typingText}</p>
            <button
              className="mt-8 px-10 py-4 font-semibold bg-gradient-to-r from-blue-600 to-teal-500 rounded-md hover:from-teal-500 hover:to-blue-600 text-white transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center mx-auto gap-2"
              onClick={() => document.getElementById("contentModes").scrollIntoView({ behavior: "smooth" })}
            >
              <span>Get Started</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </section>

        {/* Content Creation Modes - Enhanced with better cards and hover effects */}
        <section id="contentModes" className="py-20 bg-gray-800/90 text-gray-200 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center mb-16">
              <h2 className="text-4xl font-bold text-center mb-4">Choose Your Content Creation Mode</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>
              <p className="mt-6 text-gray-300 max-w-2xl text-center">Select the perfect approach for your content needs. Each mode offers unique advantages to help you create exceptional content.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Enhanced Mode Cards */}
              <div
                onClick={() => handleModeSelection("Genre-Based Content")}
                className="group cursor-pointer bg-gray-750 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-700 hover:border-blue-500"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={genre}
                    alt="Genre-Based Content"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-3 py-1 bg-blue-600/80 text-xs rounded-full text-white backdrop-blur-sm">Most Popular</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-blue-300 group-hover:text-blue-400 transition">Genre-Based Content</h3>
                  <p className="text-gray-300 mb-4">
                    Select a genre and let AI craft tailored content for your specific audience and purpose.
                  </p>
                  <div className="flex items-center text-blue-400 text-sm font-medium">
                    <span>Select this mode</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Chat-Based Prompting */}
              <div
                onClick={() => handleModeSelection("Chat-Based Prompting")}
                className="group cursor-pointer bg-gray-750 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-700 hover:border-blue-500"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={chat}
                    alt="Chat-Based Prompting"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-blue-300 group-hover:text-blue-400 transition">Chat-Based Prompting</h3>
                  <p className="text-gray-300 mb-4">
                    Enter custom prompts and guide the AI to generate exactly the content you need.
                  </p>
                  <div className="flex items-center text-blue-400 text-sm font-medium">
                    <span>Select this mode</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Trending Topics */}
              <div
                onClick={() => handleModeSelection("Trending Topics")}
                className="group cursor-pointer bg-gray-750 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-700 hover:border-blue-500"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={trending}
                    alt="Trending Topics"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-3 py-1 bg-green-600/80 text-xs rounded-full text-white backdrop-blur-sm">Updated Daily</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-blue-300 group-hover:text-blue-400 transition">Trending Topics</h3>
                  <p className="text-gray-300 mb-4">
                    Explore current trends and generate fresh, relevant content that resonates with today's audience.
                  </p>
                  <div className="flex items-center text-blue-400 text-sm font-medium">
                    <span>Select this mode</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Enhanced with better layout and visual elements */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center mb-16">
              <h2 className="text-4xl font-bold text-center mb-4">Powerful Features</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>
              <p className="mt-6 text-gray-300 max-w-2xl text-center">Leverage our advanced capabilities to create content that stands out and delivers results.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Enhanced Feature Cards */}
              <div className="bg-gray-800/70 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-blue-500 group hover:-translate-y-1">
                <div className="h-16 w-16 bg-blue-900/50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-4 text-blue-300">AI-Powered</h3>
                <p className="text-gray-300 text-center">Advanced language models trained on diverse data to generate human-quality content for any purpose.</p>
              </div>
              
              <div className="bg-gray-800/70 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-green-500 group hover:-translate-y-1">
                <div className="h-16 w-16 bg-green-900/50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-green-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-4 text-green-300">Versatile</h3>
                <p className="text-gray-300 text-center">Support for multiple content types including blogs, marketing copy, creative writing, and technical documentation.</p>
              </div>
              
              <div className="bg-gray-800/70 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-purple-500 group hover:-translate-y-1">
                <div className="h-16 w-16 bg-purple-900/50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-purple-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-4 text-purple-300">Time-Saving</h3>
                <p className="text-gray-300 text-center">Reduce content creation time by up to 80%, allowing you to focus on strategy and creativity rather than production.</p>
              </div>
              
              <div className="bg-gray-800/70 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-yellow-500 group hover:-translate-y-1">
                <div className="h-16 w-16 bg-yellow-900/50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-yellow-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-4 text-yellow-300">Customizable</h3>
                <p className="text-gray-300 text-center">Fine-tune tone, style, and formatting to match your brand voice and specific content requirements.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Dashboard Preview - Enhanced with better visuals */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1">
                <span className="inline-block px-3 py-1 bg-blue-900/60 text-blue-300 rounded-full text-sm font-medium mb-4">Analytics Dashboard</span>
                <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">Track Your Content Performance</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mb-6"></div>
                <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                  Monitor how your content performs with our comprehensive analytics. Get real-time insights on engagement metrics, audience demographics, and conversion rates to continuously improve your content strategy.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <svg className="h-5 w-5 text-teal-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Real-time performance tracking
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="h-5 w-5 text-teal-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Content engagement analytics
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="h-5 w-5 text-teal-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Audience demographic insights
                  </li>
                </ul>
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg hover:from-teal-500 hover:to-blue-600 transition duration-300 shadow-lg text-white font-semibold flex items-center space-x-2">
                  <span>View Analytics</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="order-1 md:order-2 relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl"></div>
                <div className="bg-gray-800 p-3 rounded-2xl shadow-2xl border border-gray-700 relative z-10 transform hover:scale-105 transition-transform duration-500">
                  <div className="bg-gray-900 rounded-xl overflow-hidden">
                    <img 
                      src="https://cdn.dribbble.com/users/2004199/screenshots/15145756/media/d5bd7de3f932e62d26c4f8b22d993a61.png" 
                      alt="Analytics Dashboard" 
                      className="w-full object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Projects - Enhanced with better table design */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center mb-16">
              <h2 className="text-4xl font-bold text-center mb-4">Your Recent Projects</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>
              <p className="mt-6 text-gray-300 max-w-2xl text-center">Track and manage all your content creation projects in one place.</p>
            </div>
            
            <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-900/80 border-b border-gray-700">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {savedProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-750 transition">
                        <td className="px-6 py-5 text-gray-200 font-medium">{project.title}</td>
                        <td className="px-6 py-5 text-gray-300">{project.type}</td>
                        <td className="px-6 py-5 text-gray-300">{project.date}</td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1.5 bg-green-900/30 text-green-400 rounded-full text-xs font-medium">
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 space-x-3">
                          <button className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-md text-sm transition-colors">View</button>
                          <button className="px-3 py-1.5 bg-gray-700/30 hover:bg-gray-700/60 text-gray-300 rounded-md text-sm transition-colors">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-850 py-4 px-6 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">Showing {savedProjects.length} of {savedProjects.length} projects</p>
                  <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center space-x-2">
                    <span>View All Projects</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Enhanced Modal Design */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 relative border border-gray-700 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-blue-600/20 to-teal-600/20 z-0"></div>
              <div className="px-8 pt-8 pb-4 relative z-10">
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={handleReset}
                    className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <h3 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-400 to-blue-400">
                  {selectedMode}
                </h3>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto mt-3"></div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6">
              {/* Content for Genre-Based Content */}
              {selectedMode === "Genre-Based Content" && (
                <>
                  <p className="text-gray-300 mb-6 text-center">Select a genre that best matches your content requirements.</p>
                  <GenreDropdown selectedGenre={genre} setSelectedGenre={setGenre} />
                </>
              )}

              {/* Content for Chat-Based Prompting */}
              {selectedMode === "Chat-Based Prompting" && (
                <div className="mb-4">
                  <label htmlFor="userPrompt" className="block text-gray-300 mb-2 font-medium">Enter your prompt:</label>
                  <textarea
                    id="userPrompt"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                    rows={4}
                    placeholder="Describe what you'd like the AI to generate..."
                  ></textarea>
                  <p className="text-gray-400 text-sm mt-2">Try to be specific about tone, style, and purpose for better results.</p>
                </div>
              )}

              {/* Content for Trending Topics */}
              {selectedMode === "Trending Topics" && (
                <>
                  <p className="text-gray-300 mb-6 text-center">Select from today's trending topics to create relevant content.</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button className="p-3 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 hover:border-blue-500 text-gray-200 transition-colors">
                      Digital Marketing
                    </button>
                    <button className="p-3 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 hover:border-blue-500 text-gray-200 transition-colors">
                      AI Technology
                    </button>
                    <button className="p-3 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 hover:border-blue-500 text-gray-200 transition-colors">
                      Remote Work
                    </button>
                    <button className="p-3 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 hover:border-blue-500 text-gray-200 transition-colors">
                      Sustainable Living
                    </button>
                    <button className="p-3 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 hover:border-blue-500 text-gray-200 transition-colors">
                      Mental Health
                    </button>
                    <button className="p-3 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 hover:border-blue-500 text-gray-200 transition-colors">
                      Financial Planning
                    </button>
                  </div>
                </>
              )}

              {/* Alert */}
              {alert && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg">
                  <p className="text-sm text-red-400 text-center">
                    {alert}
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={handleGenerate}
                  className="px-6 py-3 font-semibold bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg hover:from-teal-500 hover:to-blue-600 text-white transition duration-300 ease-in-out flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Generate Content
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 font-semibold bg-gray-700 rounded-lg hover:bg-gray-600 text-white transition duration-300 ease-in-out border border-gray-600"
                >
                  Close
                </button>
              </div>

              {/* Generated Content - Enhanced with loading state */}
              {selectedMode && (
                <div className="mt-8">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-8">
                      <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-blue-300">Generating your content...</p>
                    </div>
                  ) : generatedContent ? (
                    <div className="p-6 bg-gray-750 rounded-lg text-gray-200 border border-gray-600 transform transition-all duration-500 opacity-100 scale-100">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-bold text-blue-300">Generated Content:</h4>
                        <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">AI Generated</span>
                      </div>
                      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 mb-4 max-h-60 overflow-y-auto">
                        <p className="text-gray-300 leading-relaxed">{generatedContent}</p>
                      </div>
                      <div className="flex justify-end">
                        <button 
                          onClick={handleCopyContent}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-3 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                          Copy
                        </button>
                        <button 
                          onClick={handleSaveContent}
                          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                          </svg>
                          Save
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UserDashboard;