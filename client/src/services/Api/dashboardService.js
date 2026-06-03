import api from "./api";

/**
 * Fetch dashboard statistics
 */
export const fetchDashboardStats = async () => {
  try {
    const { data } = await api.get("/dashboard");
    return data;
  } catch (error) {
    console.error("Dashboard stats fetch failed:", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetch learning analytics
 */
export const fetchLearningAnalytics = async () => {
  try {
    const { data } = await api.get("/dashboard/analytics");
    return data;
  } catch (error) {
    console.error("Analytics fetch failed:", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetch user learning progress
 */
export const fetchLearningProgress = async () => {
  try {
    const { data } = await api.get("/dashboard/progress");
    return data;
  } catch (error) {
    console.error("Progress fetch failed:", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetch recent user activity
 */
export const fetchRecentActivity = async () => {
  try {
    const { data } = await api.get("/dashboard/recent-activity");
    return data;
  } catch (error) {
    console.error("Activity fetch failed:", error);
    throw error.response?.data || error;
  }
};