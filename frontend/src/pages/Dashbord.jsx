import React, { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "@/components/Footer/Footer";
import hero1 from "@/assets/hero1.jpg";
import hero2 from "@/assets/hero2.jpg";
import hero3 from "@/assets/hero3.jpg";
import genre from "@/assets/genre.jpg";
import chat from "@/assets/chat.jpg";
import trending from "@/assets/trendytopics.jpg";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const heroImages = [hero1, hero2, hero3];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="text-white font-Poppins">
      <Header />

      {/* Hero Section with Auto-Scrolling and Navigation Dots */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Scrolling Background Images */}
        <div className="absolute top-0 left-0 w-full h-full flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {heroImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Hero Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ))}
        </div>

        {/* Overlay Text */}
        <div className="absolute inset-0 bg-transparent bg-opacity-60 flex flex-col items-center justify-center text-center z-10 px-4" id="home">
          <h1 className="text-5xl font-extrabold mb-4 text-white">
            Welcome to <span className="text-teal-400">ContentCrafter</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Empowering creators with AI-driven content solutions.
          </p>
          <button className="mt-6 bg-gradient-to-r from-blue-500 via-teal-400 to-green-400 text-white px-8 py-4 rounded-lg font-bold text-lg transition-transform duration-300 hover:scale-105">
            Get Started
          </button>
        </div>
        {/* Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${currentSlide === index ? "bg-teal-400" : "bg-gray-400"} transition-colors duration-300`}
            ></button>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto" id="features">
          <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-xl shadow-md hover:scale-105 transition-transform">
              <img
                src={genre}
                alt="Genre-Based Content"
                className="rounded-lg mb-4 w-full h-40 object-cover"
              />
              <h3 className="text-xl font-semibold text-[#4b2aad] mb-3">
                Genre-Based Content
              </h3>
              <p className="text-black">
                Select a genre, and let AI refine pre-stored content for you.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md hover:scale-105 transition-transform">
              <img
                src={chat}
                alt="Chat-Based Prompting"
                className="rounded-lg mb-4 w-full h-40 object-cover"
              />
              <h3 className="text-xl font-semibold text-[#4b2aad] mb-3">
                Chat-Based Prompting
              </h3>
              <p className="text-black">
                Enter a custom prompt, and let AI craft content tailored to your
                needs.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md hover:scale-105 transition-transform">
              <img
                src={trending}
                alt="Trending Topics"
                className="rounded-lg mb-4 w-full h-40 object-cover"
              />
              <h3 className="text-xl font-semibold text-[#4b2aad] mb-3">
                Trending Topics
              </h3>
              <p className="text-black">
                Explore trending topics and generate fresh, relevant content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-gray-800" id="about">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-blue-400">
            About ContentCrafter
          </h2>
          <p className="text-white text-lg leading-relaxed">
            ContentCrafter is not just a tool — it’s your creative intelligence
            engine. Designed for the fast-paced digital world, we help creators,
            marketers, and businesses automate the mundane and amplify the
            meaningful. With AI-powered insights, smart templates, and
            collaborative workflows, your content creation becomes faster,
            smarter, and more impactful.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 text-center">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 mb-6">
          Ready to Create?
        </h2>
        <p className="text-gray-300 mb-8">
          Start your journey with AI-powered content creation today.
        </p>
        <button className="bg-gradient-to-r from-blue-500 via-teal-400 to-green-400 text-white px-6 py-3 rounded-lg font-bold text-lg transition-transform duration-300 hover:scale-105">
          Get Started
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;