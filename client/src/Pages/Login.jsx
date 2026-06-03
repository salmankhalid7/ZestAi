import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import google from "../assets/images/google.png";
import login from "../assets/images/login.svg";
import EmailloginModal from "../components/EmailloginModal";
import TrialModal from "../components/TrialModal";

const Login = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in - redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50/50 text-black font-sans flex flex-col justify-between">
        {/* MAIN CONTAINER */}
        <div className="w-full flex flex-col">
          
          {/* NAVBAR */}
          <div className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <Link
              to="/"
              className="text-lg font-bold tracking-tight text-gray-900"
            >
              Zest AI
            </Link>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link to="/" className="hover:text-black transition">
                Home
              </Link>

              <Link to="/about" className="hover:text-black transition">
                About
              </Link>

              <Link to="/contact" className="hover:text-black transition">
                Contact
              </Link>
            </div>
          </div>

          {/* CONTENT BOX */}
          <div className="max-w-5xl mx-auto my-12 p-8 sm:p-12 border border-gray-200 rounded-3xl shadow-xl shadow-black/[0.02] bg-white w-[calc(100%-2rem)] sm:w-full">
            
            {/* GRID STRUCTURE */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-12 lg:gap-8 items-center w-full">
              
              {/* LEFT SIDE: LOGIN FORM */}
              <div className="max-w-md w-full mx-auto lg:mx-0 lg:pr-4">
                <h1 className="text-3xl font-bold tracking-tight mb-3 text-gray-900">
                  Welcome to Zest AI
                </h1>

                <p className="text-gray-500 mb-8 text-sm sm:text-base">
                  Sign in to continue your personalized learning journey with Zest AI.
                </p>

                {/* GOOGLE BUTTON */}
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-black text-white py-3.5 rounded-xl font-medium hover:opacity-90 transition shadow-sm text-sm"
                >
                  <img
                    src={google}
                    alt="Google"
                    className="w-7 h-7 object-contain shrink-0"
                  />
                  Continue with Google
                </button>

                {/* DIVIDER */}
                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="px-3 text-xs text-gray-400 font-medium uppercase tracking-wider">
                    or
                  </span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* EMAIL BUTTON */}
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition text-sm text-gray-800"
                >
                  <svg
                    className="w-4 h-4 text-gray-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  Continue with Email
                </button>

                {/* SIGNUP LINK */}
                <p className="text-sm text-gray-500 mt-6 text-center">
                  New here?{" "}
                  <button
                    onClick={() => setShowSignupModal(true)}
                    className="text-black font-semibold hover:underline"
                  >
                    Create an account
                  </button>
                </p>

                {/* FOOTER TEXT */}
                <p className="text-[11px] text-gray-400 mt-6 text-center tracking-wide">
                  Secure authentication powered by OAuth & encrypted sessions
                </p>
              </div>

              {/* VERTICAL DIVIDER LINE */}
              <div className="hidden lg:block w-px bg-gray-200 h-64 self-center justify-self-center"></div>

              {/* RIGHT SIDE: ILLUSTRATION */}
              <div className="hidden lg:flex justify-center items-center w-full lg:pl-4">
                <img
                  src={login}
                  alt="Login Illustration"
                  className="w-full max-w-sm h-auto object-contain"
                />
              </div>

            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="w-full py-6 text-center border-t border-gray-200 px-6 bg-white">
          <p className="text-xs text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} Zest AI. All rights reserved.
          </p>
        </footer>
      </div>

      {/* LOGIN MODAL */}
      <EmailloginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        openSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />

      {/* SIGNUP MODAL */}
      <TrialModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      />
    </>
  );
};

export default Login;