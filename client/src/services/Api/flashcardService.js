import api from "./api";

/**
 * Get flashcards for a document
 */
export const getFlashcards = async (documentId) => {
  try {
    const { data } = await api.get(`/flashcards/${documentId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Generate flashcards for a document
 */
export const generateFlashcards = async (documentId) => {
  try {
    const { data } = await api.post(`/flashcards/${documentId}`, {});
    return data;
  } catch (error) {
    throw error;
  }
};