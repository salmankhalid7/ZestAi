import api from "./api";

/**
 * Generate or fetch quiz for a document
 */
export const generateQuiz = async (documentId) => {
  try {
    const { data } = await api.post(`/quiz/${documentId}`, {});
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Submit quiz attempt
 */
export const submitQuizAttempt = async (attemptData) => {
  try {
    const { data } = await api.post("/quiz/attempt", attemptData);
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get quiz history for a document
 */
export const getQuizHistory = async (documentId) => {
  try {
    const { data } = await api.get(`/quiz/history/${documentId}`);
    return data;
  } catch (error) {
    throw error;
  }
};