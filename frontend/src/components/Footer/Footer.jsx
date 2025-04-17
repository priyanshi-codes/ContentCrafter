import React from "react";
import { Link } from "react-scroll"; // Use react-scroll for smooth scrolling
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"; // Social media icons

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 text-transparent bg-clip-text">
          ContentCrafter
        </div>
        {/* Social Media Links */}
        <div className="flex space-x-4 mt-6 md:mt-0">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-teal-400 transition"
          >
            <FaFacebook size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-teal-400 transition"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-teal-400 transition"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-teal-400 transition"
          >
            <FaLinkedin size={20} />
          </a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} ContentCrafter. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;