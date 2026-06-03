import api from "./api";

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/user/me");
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (profileData) => {
  try {
    const { data } = await api.put("/user/me", profileData);
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Upload avatar
 */
export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const { data } = await api.post("/user/upload-avatar", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Remove avatar
 */
export const removeAvatar = async () => {
  try {
    const { data } = await api.delete("/user/avatar");
    return data;
  } catch (error) {
    throw error;
  }
};