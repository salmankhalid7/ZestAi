// ===============================
// DocumentFeature.jsx
// ===============================

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocumentById } from "../services/Api/documentService";
import { addFavorite, removeFavoriteById, getFavorites } from "../services/Api/favoriteService";

import PdfViewer from "../components/PdfViewer";
import ChatBox from "./ChatBox";
import Summary from "./Summary";
import Flashcards from "./Flashcards";
import Quiz from "./Quiz";

const DocumentFeature = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Content");
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const tabs = [
    "Content",
    "Chat",
    "Summary",
    "Flashcards",
    "Quizzes",
  ];

  // Fetch document details and favorite status
  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        // Fetch document
        const response = await getDocumentById(id);
        const documentData = response.document || response;
        setDoc(documentData);

        // Fetch favorites to check if this document is favorited
        try {
          const favoritesRes = await getFavorites();
          const favorites = favoritesRes.favorites || [];
          const foundFavorite = favorites.find(
            (fav) => (fav.documentId?._id || fav.documentId) === id
          );
          
          if (foundFavorite) {
            setIsFavorite(true);
            setFavoriteId(foundFavorite._id);
          }
        } catch (favErr) {
          console.error("Error fetching favorites:", favErr);
        }
      } catch (err) {
        console.error(err);
        setFetchError(
          err.response?.data?.message || "Failed to load document. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDocumentDetails();
    }
  }, [id]);

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    setFavoriteLoading(true);
    try {
      if (isFavorite && favoriteId) {
        // Remove from favorites
        await removeFavoriteById(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        // Add to favorites
        const res = await addFavorite(id);
        setIsFavorite(true);
        setFavoriteId(res.favorite?._id || res._id);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      alert(err.response?.data?.message || "Failed to update favorite status");
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Document</h3>
          <p className="text-gray-600 mb-4">{fetchError}</p>
          <button
            onClick={() => navigate("/dashboard/documents")}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Back to Documents
          </button>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Document not found.</p>
          <button
            onClick={() => navigate("/dashboard/documents")}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Back to Documents
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Document Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <button
            onClick={() => navigate("/dashboard/documents")}
                className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1 transition-colors"
              >
                ← Back to Documents
              </button>
              
              {/* Favorite Button */}
              <button
                onClick={handleFavoriteToggle}
                disabled={favoriteLoading}
                className={`p-2 rounded-lg transition-all ${
                  isFavorite 
                    ? "text-amber-500 hover:text-amber-600" 
                    : "text-gray-400 hover:text-amber-500"
                } ${favoriteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <svg
                  className="w-5 h-5"
                  fill={isFavorite ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </button>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate pr-8">
              {doc.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <p className="text-sm text-gray-500">
                Uploaded on {new Date(doc.createdAt || doc.uploadedAt).toLocaleDateString()}
              </p>
              {doc.fileSize && (
                <p className="text-sm text-gray-500">
                  {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab
                    ? "text-emerald-600 border-emerald-600"
                    : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Content Tab */}
        {activeTab === "Content" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <PdfViewer file={doc.fileUrl || doc.filePath} />
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "Chat" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[600px]">
            <ChatBox documentId={id} />
          </div>
        )}

        {/* Summary Tab */}
        {activeTab === "Summary" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Summary documentId={id} title={doc?.title} />
          </div>
        )}

        {/* Flashcards Tab */}
        {activeTab === "Flashcards" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Flashcards documentId={id} />
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === "Quizzes" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Quiz documentId={id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentFeature;