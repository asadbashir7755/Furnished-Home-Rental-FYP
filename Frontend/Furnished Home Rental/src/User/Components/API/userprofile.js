import API from "../../../utils/axios";

// Get user profile
export const getUserProfile = async () => {
  try {
    // API baseURL is already set in utils/axios.js
    const response = await API.get("/users/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await API.put("/users/profile", profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await API.post("/users/logout");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
