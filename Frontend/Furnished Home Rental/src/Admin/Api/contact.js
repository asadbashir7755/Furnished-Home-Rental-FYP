import API from "../../utils/axios";
import { API_BASE_URL } from "../../../config/apiconfig";

// Get all contact messages (for admin)
export const getAllContacts = async () => {
  try {
    const response = await API.get(`${API_BASE_URL}/contacts/all`);
    console.log("Fetched contacts:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

// Update contact status (new/responded)
export const updateContactStatus = async (contactId, status) => {
  try {
    const response = await API.patch(`${API_BASE_URL}/contacts/${contactId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating contact status:", error);
    throw error;
  }
};
