import api from "./api";

/**
 * Get summary for a document
 */
export const getDocumentSummary = async (documentId) => {
  try {
    const { data } = await api.get(`/summary/${documentId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Generate new summary for a document
 */
export const generateSummary = async (documentId) => {
  try {
    const { data } = await api.post(`/summary/${documentId}`);
    return data;
  } catch (error) {
    throw error;
  }
};