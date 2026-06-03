// src/services/Api/chatService.js
import api from "./api";

export const fetchChatHistory = async (documentId) => {
  try {
    const { data } = await api.get(`/chat/${documentId}`);
    return data;
  } catch (error) {
    console.error("Chat history API error:", error);
    throw error;
  }
};

export const askQuestion = async (documentId, question) => {
  try {
    const { data } = await api.post("/chat/ask", { documentId, question });
    return data;
  } catch (error) {
    console.error("Ask question API error:", error);
    throw error;
  }
};