import React, { useEffect, useState, useCallback } from "react";
import UploadBox from "../components/UploadBox";
import DocumentCard from "../components/DocumentCard";
import ConfirmationModal from "../components/ConfirmationModal";
import { getDocuments, deleteDocument } from "../services/Api/documentService";
import { addFavorite, removeFavoriteById, removeFavoriteByDocumentId, getFavorites } from "../services/Api/favoriteService";

const Documents = () => {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, docId: null, docTitle: "" });
  const [favoriteModal, setFavoriteModal] = useState({ isOpen: false, docId: null, docTitle: "", favoriteId: null });

  const fetchDocs = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch documents and favorites separately
      const docsRes = await getDocuments();
      const favoritesRes = await getFavorites();
      
      const documents = docsRes.documents || [];
      const favorites = favoritesRes.favorites || [];
      
      console.log("Fetched favorites:", favorites);
      
      // Create a map of documentId to favorite info
      const favMap = {};
      favorites.forEach(fav => {
        // Check if documentId exists and has _id property
        const docId = fav.documentId?._id || fav.documentId;
        if (docId) {
          favMap[docId] = {
            isFavorite: true,
            favoriteId: fav._id
          };
          console.log(`Mapped document ${docId} to favorite ${fav._id}`);
        }
      });
      
      // Enrich documents with favorite info
      const enrichedDocs = documents.map(doc => ({
        ...doc,
        isFavorite: !!favMap[doc._id],
        favoriteId: favMap[doc._id]?.favoriteId || null
      }));
      
      console.log("Enriched documents:", enrichedDocs.map(d => ({ id: d._id, title: d.title, isFavorite: d.isFavorite, favoriteId: d.favoriteId })));
      
      setDocs(enrichedDocs);
    } catch (error) {
      console.error("Error fetching docs:", error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleUpload = (newDoc) => {
    setDocs((prev) => [{ ...newDoc, isFavorite: false, favoriteId: null }, ...prev]);
  };

  // Handle delete with modal
  const handleDeleteClick = (docId, docTitle) => {
    setDeleteModal({ isOpen: true, docId, docTitle });
  };

  const confirmDelete = async () => {
    const { docId } = deleteModal;
    try {
      await deleteDocument(docId);
      setDocs((prev) => prev.filter((doc) => doc._id !== docId));
      console.log("Document deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete document");
    } finally {
      setDeleteModal({ isOpen: false, docId: null, docTitle: "" });
    }
  };

  // Handle favorite toggle with modal for removal
  const handleFavoriteToggle = async (docId, isCurrentlyFavorite, favoriteId, docTitle) => {
    if (isCurrentlyFavorite) {
      // Show confirmation modal for removing from favorites
      setFavoriteModal({
        isOpen: true,
        docId,
        docTitle,
        favoriteId
      });
    } else {
      // Add to favorites directly without confirmation
      await addToFavorites(docId);
    }
  };

  const addToFavorites = async (docId) => {
    try {
      console.log(`Adding favorite for document: ${docId}`);
      const res = await addFavorite(docId);
      console.log("Add favorite response:", res);
      
      const newFavoriteId = res.favorite?._id || res._id;
      if (newFavoriteId) {
        setDocs((prev) =>
          prev.map((doc) =>
            doc._id === docId 
              ? { ...doc, isFavorite: true, favoriteId: newFavoriteId } 
              : doc
          )
        );
        console.log(`Successfully added favorite with ID: ${newFavoriteId}`);
      } else {
        console.error("No favorite ID returned from server");
        alert("Failed to add favorite: No favorite ID returned");
      }
    } catch (err) {
      console.error("Add favorite error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add to favorites");
    }
  };

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
      
      // Update local state
      setDocs((prev) =>
        prev.map((doc) =>
          doc._id === docId ? { ...doc, isFavorite: false, favoriteId: null } : doc
        )
      );
      console.log("Successfully removed from favorites");
    } catch (err) {
      console.error("Remove favorite error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to remove from favorites");
    } finally {
      setFavoriteModal({ isOpen: false, docId: null, docTitle: "", favoriteId: null });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-1 space-y-8 animate-fadeIn">
      {/* TITLE */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Documents</h1>
          <p className="text-xs text-gray-400 mt-1">
            Upload and manage your PDF files
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full">
          {docs.length} Documents
        </span>
      </div>

      {/* UPLOAD */}
      <UploadBox onUpload={handleUpload} />

      {/* LIST */}
      {isLoading ? (
        <div className="py-16 text-center text-green-700">Loading...</div>
      ) : docs.length === 0 ? (
        <div className="py-16 text-center text-gray-500">No documents found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((doc) => (
            <DocumentCard
              key={doc._id}
              doc={doc}
              onDelete={handleDeleteClick}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, docId: null, docTitle: "" })}
        onConfirm={confirmDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${deleteModal.docTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDanger={true}
      />

      {/* Remove from Favorites Confirmation Modal */}
      <ConfirmationModal
        isOpen={favoriteModal.isOpen}
        onClose={() => setFavoriteModal({ isOpen: false, docId: null, docTitle: "", favoriteId: null })}
        onConfirm={confirmRemoveFromFavorites}
        title="Remove from Favorites"
        message={`Are you sure you want to remove "${favoriteModal.docTitle}" from your favorites?`}
        confirmText="Remove"
        cancelText="Cancel"
        isDanger={false}
      />
    </div>
  );
};

export default Documents;