import React from "react";
import { useNavigate } from "react-router-dom";

const formatUploadTime = (dateString) => {
  if (!dateString) return "Uploaded recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  if (diffInMins < 1) return "Uploaded just now";
  if (diffInMins < 60) return `Uploaded ${diffInMins}m ago`;
  if (diffInHours < 24) return `Uploaded ${diffInHours}h ago`;
  return date.toLocaleDateString();
};

const formatFileSize = (bytes) => {
  if (!bytes) return "1.2 MB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const DocumentCard = ({ doc, onDelete, onFavoriteToggle }) => {
  const navigate = useNavigate();
  if (!doc) return null;

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on buttons
    if (e.target.closest('button')) return;
    navigate(`/document/${doc._id}`);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    onFavoriteToggle(doc._id, doc.isFavorite, doc.favoriteId, doc.title);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(doc._id, doc.title);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative w-full bg-[#f8fbfb] border border-[#eaf2f2] hover:border-emerald-500/30 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      {/* TOP ROW */}
      <div className="flex justify-between items-start mb-4">
        <div className="p-3.5 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-2xl">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <div className="flex items-center gap-1">
          {/* FAVORITE BUTTON */}
          <button
            onClick={handleFavorite}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              doc.isFavorite 
                ? "text-amber-400 hover:text-amber-500 hover:bg-amber-50" 
                : "text-gray-300 hover:text-amber-400 hover:bg-gray-50"
            }`}
            title={doc.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <svg
              className="w-5 h-5"
              fill={doc.isFavorite ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>

          {/* DELETE BUTTON */}
          <button
            onClick={handleDelete}
            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            title="Delete document"
          >
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* TITLE */}
      <div className="mb-4">
        <h3 className="text-[16px] font-bold text-gray-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {doc.title || "Untitled Document"}
        </h3>
        <p className="text-xs text-gray-400 mt-1">{formatFileSize(doc.fileSize)}</p>
      </div>

      {/* DOCUMENT INFO */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg
            className="w-4 h-4 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10M7 12h6m-6 4h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
            />
          </svg>
          <span className="font-medium">Click Here</span>
        </div>
        <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full">
          PDF
        </div>
      </div>

      {/* TIME */}
      <div className="text-xs text-gray-400 border-t pt-2">
        {formatUploadTime(doc.createdAt)}
      </div>
    </div>
  );
};

export default DocumentCard;