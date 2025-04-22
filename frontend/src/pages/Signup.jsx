import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);
      await signup(email, password, firstName, lastName);
      navigate("/user-dashboard");
    } catch (error) {
      setError("Signup failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#3f83f8] via-[#5db1e9] to-[#4ed6cd] min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Join ContentCrafter
          </h1>
          <p className="text-gray-600">
            Create an account to unlock the full potential of your content creation journey.
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Your Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">First Name</label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-gray-50 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-gray-50 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-50 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-50 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <small className="text-xs text-gray-500 mt-1 block">
              Min 8 characters, 1 number, 1 uppercase letter
            </small>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-50 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 font-semibold bg-gradient-to-r from-[#3f83f8] to-[#4ed6cd] rounded-md hover:from-[#4ed6cd] hover:to-[#3f83f8] text-white transition duration-200 ease-in-out shadow-md"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;