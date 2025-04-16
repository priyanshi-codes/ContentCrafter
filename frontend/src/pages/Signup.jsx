// Signup.jsx
import React, { useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import { auth } from "../services/firebase"; // Make sure this is correctly configured
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

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

  // const strongPassword = /^(?=.*[A-Z])(?=.\d).*{4,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, password, confirmPassword } = formData;

    // if (!strongPassword.test(password)) {
      // // alert("Password must be at least 8 characters, include 1 uppercase letter and 1 number.");
      // return;
    // }

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
    <div className="bg-[#ffff] text-black min-h-screen flex items-center justify-center p-4">
      <div className="bg-[#ffff] p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Create Your Account</h2>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-1.5 rounded-md bg-white text-black border border-gray-700 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-1.5 rounded-md bg-white text-black border border-gray-700 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-1.5 rounded-md bg-white text-black border border-gray-700 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-1.5 rounded-md bg-white text-black border border-gray-700 text-sm"
              required
            />
            <small className="text-xs text-gray-200 mt-1 block">
              Min 8 chars, 1 number, 1 capital letter
            </small>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-1.5 rounded-md bg-white text-black border border-gray-700 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 font-semibold bg-gradient-to-r from-[#3f83f8] to-[#4ed6cd] rounded-md hover:from-[#4ed6cd] hover:to-[#3f83f8] text-1xl 
                text-white transition duration-200 ease-in-out"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;