import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import AuthSuccess from "./Pages/AuthSuccess";
import ContactUs from "./Pages/ContactUs";
import About from "./Pages/About";
import Pricing from "./Pages/Pricing";
import NotFound from "./Pages/NotFound"; // Ensure this component exists

// Dashboard Components
import DashboardLayout from "./layouts/DashboardLayout";
import Overview from "./Pages/dashboard/Overview";
import Documents from "./Pages/Documents";
import Favorites from "./Pages/Favorites";
import AiChatPage from "./Pages/AiChatPage";  // List of all docs to start chat
import Analytics from "./Pages/Analytics";
import Profile from "./Pages/Profile";

// Interactive Workspace Components
import DocumentFeature from "./Pages/DocumentFeature"; // Full workspace (includes Quiz/Chat tabs)
import Flashcards from "./Pages/Flashcards";
import Quiz from "./Pages/Quiz";              // Active quiz taking view
import Chat from "./Pages/ChatBox";           // Active chat view

// Helper
import ProtectedRoute from "./components/ProtectedRoute";


const App = () => {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* DASHBOARD LAYOUT (PROTECTED) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="documents" element={<Documents />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="ai-chat" element={<AiChatPage />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile/>} />
        </Route>

        {/* INTERACTIVE STUDIO WORKSPACES */}
        <Route
          path="/document/:id"
          element={<ProtectedRoute><DocumentFeature /></ProtectedRoute>}
        />
        <Route
          path="/flashcards/:id"
          element={<ProtectedRoute><Flashcards /></ProtectedRoute>}
        />
        <Route
          path="/quiz/:id"
          element={<ProtectedRoute><Quiz /></ProtectedRoute>}
        />
        <Route
          path="/chat/:id"
          element={<ProtectedRoute><Chat /></ProtectedRoute>}
        />

        {/* CATCH-ALL */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;