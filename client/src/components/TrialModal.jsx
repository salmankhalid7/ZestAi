import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/Api/api";
import google from "../assets/images/google.png";

function TrialModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      // Store token if returned from registration
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      resetForm();
      onClose();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => {
          resetForm();
          onClose();
        }}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden">
        {/* CLOSE BUTTON */}
        <button
          onClick={() => {
            resetForm();
            onClose();
          }}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition p-1 rounded-full hover:bg-gray-50 disabled:opacity-50"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* CONTENT */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* HEADER */}
          <div className="space-y-1.5 mt-2">
            <span className="text-[10px] font-bold bg-black text-white px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
              Beta Access Offer
            </span>

            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
              Create your account
            </h2>

            <p className="text-xs text-gray-400">
              Get unrestricted access to all automated educational modules.
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* GOOGLE LOGIN */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img
                src={google}
                alt="Google"
                className="w-5 h-5 object-contain shrink-0"
              />
              Continue with Google
            </button>
          </div>

          {/* DIVIDER */}
          <div className="flex items-center my-2">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="px-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              or use credentials
            </span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-3 text-left">
            {/* NAME */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                User name
              </label>
              <input
                type="text"
                required
                disabled={isLoading}
                placeholder="your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1e293b] font-medium placeholder-gray-400 focus:outline-none focus:border-black transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                disabled={isLoading}
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1e293b] font-medium placeholder-gray-400 focus:outline-none focus:border-black transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                disabled={isLoading}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="6"
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1e293b] font-medium placeholder-gray-400 focus:outline-none focus:border-black transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-bold text-sm py-3 rounded-xl transition duration-200 mt-2 shadow-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account with Email"}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-xs text-gray-500 text-center pt-1">
            Already have an account?{" "}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                resetForm();
                onClose();
                navigate("/login");
              }}
              className="text-black font-semibold hover:underline focus:outline-none disabled:opacity-50"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default TrialModal;