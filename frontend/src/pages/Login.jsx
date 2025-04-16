import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { useNavigate , Link} from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/user-dashboard");
      }
    });

    // Load Google Sign‑In script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: "",
        callback: handleCredentialResponse,
        context: "signin",
        ux_mode: "popup",
        
        auto_prompt: false
      });
    
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"), // Make sure this ID exists in your HTML
        {
          theme: "outline",
          size: "large"
        }
      );
    };

    document.body.appendChild(script);

    const handleCredentialResponse = async (response) => {
      try {
        const credential = GoogleAuthProvider.credential(response.credential);
        const result = await signInWithCredential(auth, credential);
        const user = result.user;
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userName", user.displayName || "Google User");
        navigate("/user-dashboard");
      } catch (error) {
        alert("Google login failed: " + error.message);
      }
    };

    return () => {
      unsubAuth();
      document.body.removeChild(script);
    };
  }, [navigate]);

  const loginUser = async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      return alert("Please enter both email and password!");
    }

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", user.displayName || "Guest");
      navigate("/user-dashboard");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="bg-[#ffff] text-black flex justify-center items-center h-screen flex-col">
      <h1 className="mb-6 text-4xl font-bold Poppins text-center bg-gradient-to-r from-[#3f83f8] via-[#5db1e9] to-[#4ed6cd] text-transparent bg-clip-text p-4">
        Login to ContentCrafter
      </h1>

      <div className="bg-[#ffff] p-6 rounded-lg w-96 text-center shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Login</h2>

        <input
          type="email"
          id="loginEmail"
          placeholder="Email"
          className="w-full p-2 mb-2 text-black bg-white rounded-md border-1"
        />
        <input
          type="password"
          id="loginPassword"
          placeholder="Password"
          className="w-full p-2 mb-3 text-black bg-white rounded-md border-1"
        />
        <button
          onClick={loginUser}
          className="w-full p-2 font-semibold bg-gradient-to-r from-[#3f83f8] to-[#4ed6cd] rounded-md hover:from-[#4ed6cd] hover:to-[#3f83f8] text-1xl text-white transition duration-200 ease-in-out"
        >
          Login
        </button>

        <p className="mt-3 text-sm text-gray-300">or login with</p>

        <div id="googleSignInDiv" className="mt-3"></div>

        <p className="mt-4 text-sm text-gray-300">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-300 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;