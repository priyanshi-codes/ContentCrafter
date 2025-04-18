import React from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: About */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-xl">CC</span>
              </div>
              <div className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 text-transparent bg-clip-text">
                ContentCrafter
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revolutionizing content creation with powerful AI tools. Create, optimize, and 
              manage your content effortlessly with ContentCrafter.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-400 transition duration-300"
                aria-label="Facebook"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-400 transition duration-300"
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-400 transition duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-400 transition duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-400 transition duration-300"
                aria-label="GitHub"
              >
                <FaGithub size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-800 inline-block text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-teal-400 transition duration-300 flex items-center">
                  <span className="mr-2">›</span> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-teal-400 transition duration-300 flex items-center">
                  <span className="mr-2">›</span> Pricing
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-teal-400 transition duration-300 flex items-center">
                  <span className="mr-2">›</span> Blog
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-400 hover:text-teal-400 transition duration-300 flex items-center">
                  <span className="mr-2">›</span> Features
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-gray-400 hover:text-teal-400 transition duration-300 flex items-center">
                  <span className="mr-2">›</span> Tutorials
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-800 inline-block text-white">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/documentation" className="text-gray-400 hover:text-teal-400 transition duration-300 flex items-center">
                  <span className="mr-2">›</span> Documentation
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-teal-400 transition duration-300 flex items-center">
                  <span className="mr-2">›</span> Help Center
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-gray-400 hover:text-teal-400 transition duration-300 flex items-center">
                  <span className="mr-2">›</span> API Reference
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-teal-400 transition duration-300 flex items-center">
                  <span className="mr-2">›</span> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-teal-400 transition duration-300 flex items-center">
                  <span className="mr-2">›</span> Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-800 inline-block text-white">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MdLocationOn className="text-teal-400 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-400 text-sm">
                  123 Innovation Drive, Tech Valley,<br/>San Francisco, CA 94107
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <MdPhone className="text-teal-400 flex-shrink-0" size={18} />
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <MdEmail className="text-teal-400 flex-shrink-0" size={18} />
                <span className="text-gray-400 text-sm">support@contentcrafter.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <button className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-5 py-2 rounded-md text-sm font-medium shadow-md hover:shadow-glow hover:from-blue-600 hover:to-teal-500 transition duration-300 transform hover:scale-105">
                Subscribe to Newsletter
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-10"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} ContentCrafter. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-x-6 gap-y-2 justify-center">
            <Link to="/privacy" className="hover:text-teal-400 transition duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-teal-400 transition duration-300">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-teal-400 transition duration-300">
              Cookie Policy
            </Link>
            <Link to="/sitemap" className="hover:text-teal-400 transition duration-300">
              Sitemap
            </Link>
          </div>
        </div>
      </div>

      {/* Custom CSS for glow effects */}
      <style jsx>{`
        .shadow-glow {
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.5);
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;