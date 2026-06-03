import React, { useEffect, useState, useCallback } from "react";
import { Star, Bookmark, FileText, Trash2, RefreshCw } from "lucide-react";
import DocumentCard from "../components/DocumentCard";
import ConfirmationModal from "../components/ConfirmationModal";
import { getFavorites, removeFavoriteById, removeFavoriteByDocumentId } from "../services/Api/favoriteService";
import { deleteDocument } from "../services/Api/documentService";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [favoriteModal, setFavoriteModal] = useState({ 
    isOpen: false, 
    docId: null, 
    docTitle: "", 
    favoriteId: null 
  });
  
  const [deleteModal, setDeleteModal] = useState({ 
    isOpen: false, 
    docId: null, 
    docTitle: "" 
  });

  // FETCH FAVORITES
  const fetchFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getFavorites();

      // ONLY DOCUMENT FAVORITES + REMOVE NULLS
      const favDocs = (res.favorites || []).filter(
        (fav) =>
          fav.favoriteType === "document" &&
          fav.documentId
      );

      setFavorites(favDocs);
    } catch (err) {
      console.error(
        "Favorites fetch error:",
        err.response?.data || err.message
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Handle favorite toggle with modal for removal
  const handleFavoriteToggle = (docId, isCurrentlyFavorite, favoriteId, docTitle) => {
    if (isCurrentlyFavorite) {
      // Show confirmation modal for removing from favorites
      setFavoriteModal({
        isOpen: true,
        docId,
        docTitle,
        favoriteId
      });
    }
  };

  // Confirm remove from favorites
  const confirmRemoveFromFavorites = async () => {
    const { docId, favoriteId, docTitle } = favoriteModal;
    
    try {
      if (favoriteId) {
        // Remove using favorite ID
        console.log(`Removing favorite with ID: ${favoriteId}`);
        await removeFavoriteById(favoriteId);
      } else {
        // Fallback: remove by document ID
        console.log(`Removing favorite for document: ${docId}`);
        await removeFavoriteByDocumentId(docId);
      }
      
      // Remove from UI instantly
      setFavorites((prev) =>
        prev.filter((fav) => {
          const favDocId = fav.documentId?._id || fav.documentId;
          return favDocId !== docId;
        })
      );
      
      console.log("Successfully removed from favorites");
    } catch (err) {
      console.error("Remove favorite error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to remove from favorites");
    } finally {
      setFavoriteModal({ 
        isOpen: false, 
        docId: null, 
        docTitle: "", 
        favoriteId: null 
      });
    }
  };

  // Handle delete click
  const handleDeleteClick = (docId, docTitle) => {
    setDeleteModal({ isOpen: true, docId, docTitle });
  };

  // Confirm delete document
  const confirmDelete = async () => {
    const { docId } = deleteModal;
    try {
      await deleteDocument(docId);
      
      // Remove from favorites list after deletion
      setFavorites((prev) =>
        prev.filter((fav) => {
          const favDocId = fav.documentId?._id || fav.documentId;
          return favDocId !== docId;
        })
      );
      
      console.log("Document deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete document");
    } finally {
      setDeleteModal({ isOpen: false, docId: null, docTitle: "" });
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        
        {/* HEADER - Responsive */}
        <div className="relative overflow-hidden bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 sm:mb-10 shadow-sm hover:shadow-md transition-shadow duration-300">
          
          {/* BACKGROUND GLOW */}
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-amber-100 rounded-full blur-3xl opacity-40" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* LEFT SIDE */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-amber-50 flex items-center justify-center shadow-sm">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 fill-amber-500" />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Favorite Documents
                </h1>

                <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1">
                  Your starred study materials
                </p>
              </div>
            </div>

            {/* RIGHT SIDE - Responsive */}
            <div className="flex items-center justify-between sm:justify-end gap-2">
              {/* Refresh Button */}
              <button
                onClick={fetchFavorites}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh favorites"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Refresh</span>
              </button>

              {/* Counter */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2">
                <Bookmark className="w-4 h-4 text-amber-500" />
                <span className="text-sm sm:text-base font-semibold text-gray-700">
                  {favorites.length} Saved
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 lg:py-32">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm sm:text-base text-gray-400">
              Loading favorite documents...
            </p>
          </div>
        ) : favorites.length === 0 ? (

          /* EMPTY STATE - Responsive */
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl sm:rounded-3xl py-12 sm:py-16 lg:py-20 px-4 sm:px-6 text-center">
            
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl sm:rounded-3xl bg-gray-50 flex items-center justify-center mb-4 sm:mb-6">
              <FileText className="w-8 h-8 sm:w-9 sm:h-9 text-gray-300" />
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">
              No Favorites Yet
            </h2>

            <p className="text-sm sm:text-base text-gray-400 max-w-md mx-auto px-4">
              Star important documents to quickly access them later from here.
            </p>
          </div>

        ) : (

          /* DOCUMENT GRID - Fully Responsive */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {favorites.map((fav) => {
              if (!fav.documentId) return null;

              return (
                <DocumentCard
                  key={fav._id}
                  doc={{
                    ...fav.documentId,
                    isFavorite: true,
                    favoriteId: fav._id,
                  }}
                  onFavoriteToggle={handleFavoriteToggle}
                  onDelete={handleDeleteClick}
                />
              );
            })}
          </div>

        )}

        {/* Remove from Favorites Confirmation Modal */}
        <ConfirmationModal
          isOpen={favoriteModal.isOpen}
          onClose={() => setFavoriteModal({ 
            isOpen: false, 
            docId: null, 
            docTitle: "", 
            favoriteId: null 
          })}
          onConfirm={confirmRemoveFromFavorites}
          title="Remove from Favorites"
          message={`Are you sure you want to remove "${favoriteModal.docTitle}" from your favorites?`}
          confirmText="Remove"
          cancelText="Cancel"
          isDanger={false}
        />

        {/* Delete Document Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, docId: null, docTitle: "" })}
          onConfirm={confirmDelete}
          title="Delete Document"
          message={`Are you sure you want to delete "${deleteModal.docTitle}"? This action cannot be undone and will remove it from your favorites as well.`}
          confirmText="Delete"
          cancelText="Cancel"
          isDanger={true}
        />
      </div>
    </div>
  );
};

export default Favorites;