import api from "./api";

/**
 * Get all favorites
 */
export const getFavorites = async () => {
  try {
    const { data } = await api.get("/favorites");
    console.log("Get favorites response:", data);
    return data;
  } catch (error) {
    console.error("Get favorites error:", error);
    throw error;
  }
};

/**
 * Add a document to favorites
 */
export const addFavorite = async (documentId) => {
  try {
    const { data } = await api.post("/favorites", { 
      documentId,
      favoriteType: "document" 
    });
    console.log("Add favorite response:", data);
    return data;
  } catch (error) {
    console.error("Add favorite error:", error.response?.data || error);
    throw error;
  }
};

/**
 * Remove favorite by favorite ID
 */
export const removeFavoriteById = async (favoriteId) => {
  try {
    console.log(`Attempting to delete favorite with ID: ${favoriteId}`);
    const { data } = await api.delete(`/favorites/${favoriteId}`);
    console.log("Remove favorite response:", data);
    return data;
  } catch (error) {
    console.error("Remove favorite error:", error.response?.data || error);
    throw error;
  }
};

/**
 * Remove favorite by document ID
 */
export const removeFavoriteByDocumentId = async (documentId) => {
  try {
    console.log(`Attempting to delete favorite for document: ${documentId}`);
    const { data } = await api.delete(`/favorites/by-document/${documentId}`);
    console.log("Remove favorite by document response:", data);
    return data;
  } catch (error) {
    console.error("Remove favorite by document error:", error.response?.data || error);
    throw error;
  }
};

/**
 * Check if a document is favorited
 */
export const checkFavoriteStatus = async (documentId) => {
  try {
    const { data } = await api.get(`/favorites/check/${documentId}`);
    return data;
  } catch (error) {
    console.error("Check favorite status error:", error);
    throw error;
  }
};