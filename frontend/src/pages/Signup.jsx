import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../services/firebase"; // Ensure this is correctly configured
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const fullName = `${firstName} ${lastName}`;
      await updateProfile(user, { displayName: fullName });

      localStorage.setItem("username", fullName);
      localStorage.setItem("userEmail", email);

      navigate("/user-dashboard");
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#3f83f8] via-[#5db1e9] to-[#4ed6cd] min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Join ContentCrafter
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Create an account to unlock the full potential of your content creation journey.
        </p>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full p-2 rounded-md bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full p-2 rounded-md bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full p-2 rounded-md bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 font-semibold bg-gradient-to-r from-[#3f83f8] to-[#4ed6cd] rounded-md hover:from-[#4ed6cd] hover:to-[#3f83f8] text-white transition duration-200 ease-in-out"
          >
            Create Account
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;