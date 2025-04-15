import React, { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Header from '../components/Header/Header';
import Footer from "@/components/Footer/Footer";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [genre, setGenre] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [finalContent, setFinalContent] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Manage authentication + scroll animations
  useEffect(() => {
    let isMounted = true;

    const unsub = onAuthStateChanged(auth, (u) => {
      if (isMounted) setUser(u);
    });

    const handleScroll = () => {
      document.querySelectorAll(".fade-up").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      isMounted = false;
      unsub();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleGenerate = () => {
    if (!genre) {
      alert("Please select a genre.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      let text = `Here’s some high‑quality content in the ${genre.toUpperCase()} domain.`;

      if (userPrompt) {
        text += `\n\nBased on your input: "${userPrompt}", we've crafted the following:\n\n👉 ${userPrompt} is an essential topic in ${genre}. Here's why it matters…`;
      } else {
        text +=`\n\n${genre} is a constantly evolving field. Stay updated with trends and strategies to succeed.`;
      }

      setFinalContent(text);
      setShowOutput(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setGenre("");
    setUserPrompt("");
    setFinalContent("");
    setShowOutput(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="text-gray-900 font-sans">
      <Header />

      {/* Hero Section */}
      <section className="text-center py-30 px-4 bg-[#f5f0ff]">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Content{" "}
          <span className="text-[#360e66] relative inline-block">
            made simple
            <span className="absolute left-0 -bottom-1 h-1 w-full bg-[#7f52b3] rounded-full"></span>
          </span>
          <br />
          for creators & marketers.
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto">
          Say goodbye to boring content workflows. We help you create, manage, and publish with ease.
        </p>
      </section>

      {/* About Section */}
      <section className="py-40 px-6 bg-[#ffffff] fade-up">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#360e66]">About ContentCrafter</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            ContentCrafter is your ultimate partner in content creation. Whether you're a marketer, social media
            manager, or content creator, we provide tools that simplify and supercharge your content journey.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-40 px-6 bg-[#f5f0ff] fade-up">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#360e66] mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-xl shadow-md hover:scale-105 transition-transform">
              <h3 className="text-xl font-semibold text-[#4b2aad] mb-3">AI-Powered Suggestions</h3>
              <p className="text-gray-600">Get intelligent content ideas based on your industry and audience trends.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md hover:scale-105 transition-transform">
              <h3 className="text-xl font-semibold text-[#4b2aad] mb-3">Easy Scheduling</h3>
              <p className="text-gray-600">Plan, schedule, and auto-publish content across multiple platforms.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md hover:scale-105 transition-transform">
              <h3 className="text-xl font-semibold text-[#4b2aad] mb-3">Analytics & Insights</h3>
              <p className="text-gray-600">Track performance and optimize your content with smart analytics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-40 px-6 bg-[#f8f8f8] fade-up">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-[#360e66]">Why Everyone Chooses ContentCrafter</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
              <h4 className="font-semibold text-lg mb-2 text-[#4b2aad]">🚀 Super Fast Workflow</h4>
              <p className="text-gray-600">Create, edit, and publish content in minutes with our intuitive tools.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
              <h4 className="font-semibold text-lg mb-2 text-[#4b2aad]">🤖 AI that Feels Human</h4>
              <p className="text-gray-600">Our AI writes naturally and adapts to your tone and brand voice.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
              <h4 className="font-semibold text-lg mb-2 text-[#4b2aad]">🎯 Targeted for Results</h4>
              <p className="text-gray-600">Create content that converts using insights and keyword trends.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
              <h4 className="font-semibold text-lg mb-2 text-[#4b2aad]">🔐 Secure & Reliable</h4>
              <p className="text-gray-600">We prioritize your data security and platform reliability — always.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard