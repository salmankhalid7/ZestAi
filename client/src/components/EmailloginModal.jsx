import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/Api";

function EmailloginModal({ isOpen, onClose, openSignup }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      resetForm();
      onClose();
      navigate("/dashboard");

    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-50/50">

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

        {/* CLOSE */}
        <button
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <div className="p-6 sm:p-8 space-y-5">

          {/* HEADER */}
          <div className="space-y-1.5 mt-2">
            <span className="text-[10px] font-bold bg-black text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
              Secure Sign In
            </span>

            <h2 className="text-2xl font-extrabold text-gray-900">
              Welcome back
            </h2>

            <p className="text-xs text-gray-400">
              Sign in with your email credentials.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              required
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white font-bold text-sm py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-gray-900"
            >
              {isLoading ? "Signing In..." : "Sign In with Email"}
            </button>
          </form>

          {/* SWITCH */}
          <p className="text-xs text-gray-500 text-center">
            New here?{" "}
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
                openSignup();
              }}
              disabled={isLoading}
              className="text-black font-semibold hover:underline disabled:opacity-50"
            >
              Create an account
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

export default EmailloginModal;