import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#faf4fc] bg-opacity-80 backdrop-blur-md shadow-inner mt-10">
      <div className="max-w-6xl mx-auto px-6 py-8 text-[#360e66] flex flex-col md:flex-row justify-between items-center">
        <div className="text-lg font-bold">ContentCrafter</div>

        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="/" className="hover:text-[#a14cc0] font-medium transition">Home</Link>
          <Link to="/about" className="hover:text-[#a14cc0] font-medium transition">About</Link>
          <Link to="/features" className="hover:text-[#a14cc0] font-medium transition">Features</Link>
          <Link to="/contact" className="hover:text-[#a14cc0] font-medium transition">Contact</Link>
        </div>

        <div className="mt-4 md:mt-0 text-sm text-black">&copy; {new Date().getFullYear()} ContentCrafter. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
