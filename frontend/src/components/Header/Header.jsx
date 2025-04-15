import React from "react";
import { Link , useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { app } from "../../services/firebase"; 


const auth = getAuth(app);

const Header = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
  
    const onLogoutClick = () => {
      signOut(auth)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    };


  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-sm bg-[#faf4fc] bg-opacity-80 backdrop-blur-md sticky top-0 z-50">
      <div className="text-2xl font-bold text-[#360e66]">ContentCrafter</div>
      <div className="flex items-center space-x-8">
        <nav className="hidden md:flex space-x-6 font-medium">
          <div className="space-x-4">
            <Link to="/" className="px-5 py-2 font-semibold rounded-md hover:text-blue-300">
              Home
            </Link>
            <Link to="#about" className="px-5 py-2 font-semibold rounded-md hover:text-blue-300">
              About
            </Link>
            <Link to="#features" className="px-5 py-2 font-semibold rounded-md hover:text-blue-300">
              Features
            </Link>
            {!user ? (
                <>
            <Link
              to="/login"
              className="bg-gradient-to-r from-[#4b2aad] to-[#d16ba5] rounded-full font-semibold shadow-md hover:opacity-90 transition px-5 py-2 text-white"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-[#4b2aad] to-[#d16ba5] rounded-full font-semibold shadow-md hover:opacity-90 transition px-5 py-2 text-white"
            >
              Sign Up
            </Link>
            </>
            ):(
                <button
                onClick={onLogoutClick}
                className="bg-gradient-to-r from-[#4b2aad] to-[#d16ba5] text-white px-5 py-2 rounded-full font-semibold shadow-md hover:opacity-90 transition"
              >
                Logout
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
