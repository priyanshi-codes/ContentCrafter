import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link } from "react-scroll"; // Import Link from react-scroll
import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { app } from "../../services/firebase";
import { ModeToggle } from "@/components/mode-toggle";

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
    <header className="flex items-center justify-between px-8 py-4 shadow-md bg-gradient-to-r from-gray-900 via-black to-gray-900 sticky top-0 z-50">
      {/* Logo */}
      <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 text-transparent bg-clip-text">
        <RouterLink to="/">ContentCrafter</RouterLink>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center space-x-6 font-medium">
        <Link
          to="home"
          smooth={true}
          duration={500}
          className="text-white hover:text-teal-400 transition duration-300 cursor-pointer"
        >
          Home
        </Link>
        <Link
          to="about"
          smooth={true}
          duration={500}
          className="text-white hover:text-teal-400 transition duration-300 cursor-pointer"
        >
          About
        </Link>
        <Link
          to="features"
          smooth={true}
          duration={500}
          className="text-white hover:text-teal-400 transition duration-300 cursor-pointer"
        >
          Features
        </Link>
      </nav>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            <RouterLink
              to="/login"
              className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:opacity-90 transition duration-300"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/signup"
              className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:opacity-90 transition duration-300"
            >
              Sign Up
            </RouterLink>
          </>
        ) : (
          <button
            onClick={onLogoutClick}
            className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:opacity-90 transition duration-300"
          >
            Logout
          </button>
        )}

        {/* Dark Mode Toggle */}
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;