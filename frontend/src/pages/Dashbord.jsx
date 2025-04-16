import React, { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { ModeToggle } from "@/components/mode-toggle"; // Import the ModeToggle component

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
        text += `\n\n${genre} is a constantly evolving field. Stay updated with trends and strategies to succeed.`;
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
    <div className="text-white font- Poppins">
      <Header />

      {/* Hero Section */}
      <section className="text-center py-30 px-4 bg-[#000000] ">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Content{" "}
          <span className="text-[#ffff] relative inline-block">
            made simple
            <span className="absolute left-0 -bottom-1 h-1 w-full bg-blue-500 rounded-full"></span>
          </span>
          <br />
          for creators & marketers.
        </h1>
        <p className="mt-6 text-lg text-white max-w-xl mx-auto">
          Say goodbye to boring content workflows. We help you create, manage,
          and publish with ease.
        </p>
      </section>

            {/* Animated Banner Section */}
            <div className="overflow-hidden bg-black py-3">
        <div
          className="whitespace-nowrap text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#2d94d4] bg-clip-text text-transparent animate-marquee">
        
          <span className="inline-block mx-8">
             ContentCrafter empowers creators & marketers to do more with less — powered by AI, driven by you!
          </span>
          
          <span className="inline-block mx-8">
             Automate the boring. Amplify the meaningful.
          </span>
        </div>
        <style>
          {`
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .animate-marquee {
              display: inline-block;
              animation: marquee 12s linear infinite;
            }
          `}
        </style>
      </div>


      {/* About Section */}
      <section className="py-40 px-6 bg-[#0000] ">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#ffff]">
            About ContentCrafter
          </h2>
          <p className="text-white text-lg leading-relaxed">
            ContentCrafter is not just a tool — it’s your creative intelligence
            engine. Designed for the fast-paced digital world, we help creators,
            marketers, and businesses automate the mundane and amplify the
            meaningful. With AI-powered insights, smart templates, and
            collaborative workflows, your content creation becomes faster,
            smarter, and more impactful. Scale your creativity, optimize your
            efforts, and stay ahead of the curve — all in one powerful platform.
            Welcome to the future of content.
          </p>
        </div>
      </section>
      

      {/* Features Section */}
      <section className="py-40 px-6 bg-[#0000] ">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#ffff] mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-xl shadow-md hover:scale-105 transition-transform">
              <h3 className="text-xl font-semibold text-[#4b2aad] mb-3">
                AI-Powered Suggestions
              </h3>
              <p className="text-black">
                Get intelligent content ideas based on your industry and
                audience trends.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md hover:scale-105 transition-transform">
              <h3 className="text-xl font-semibold text-[#4b2aad] mb-3">
                Easy Scheduling
              </h3>
              <p className="text-black">
                Plan, schedule, and auto-publish content across multiple
                platforms.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md hover:scale-105 transition-transform">
              <h3 className="text-xl font-semibold-Poppins text-[#4b2aad] mb-3">
                Analytics & Insights
              </h3>
              <p className="text-black">
                Track performance and optimize your content with smart
                analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-40 px-6 bg-[#0000] ">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-[#ffff] ">
            Why Everyone Chooses ContentCrafter
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
              <h4 className="font-semibold text-lg mb-2 text-[#4b2aad]">
                🚀 Super Fast Workflow
              </h4>
              <p className="text-black">
                Create, edit, and publish content in minutes with our intuitive
                tools.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
              <h4 className="font-semibold-Poppins text-lg mb-2 text-[#4b2aad]">
                🤖 AI that Feels Human
              </h4>
              <p className="text-black">
                Our AI writes naturally and adapts to your tone and brand voice.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
              <h4 className="font-semibold-Poppins text-lg mb-2 text-[#4b2aad]">
                🎯 Targeted for Results
              </h4>
              <p className="text-black">
                Create content that converts using insights and keyword trends.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
              <h4 className="font-semibold-Poppins text-lg mb-2 text-[#4b2aad]">
                🔐 Secure & Reliable
              </h4>
              <p className="text-black">
                We prioritize your data security and platform reliability —
                always.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
