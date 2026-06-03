import api from "./api";

/**
 * Get all documents
 */
export const getDocuments = async () => {
  try {
    const { data } = await api.get("/documents");
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get single document by ID
 */
export const getDocumentById = async (id) => {
  try {
    const { data } = await api.get(`/documents/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Upload document
 */
export const uploadDocument = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete document
 */
export const deleteDocument = async (id) => {
  try {
    const { data } = await api.delete(`/documents/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};