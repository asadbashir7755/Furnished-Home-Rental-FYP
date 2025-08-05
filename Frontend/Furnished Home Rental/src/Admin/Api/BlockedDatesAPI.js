import API from '../../utils/axios';
import { API_BASE_URL } from '../../../config/apiconfig';

export const blockDates = async (propertyId, startDate, endDate) => {
  try {
    const response = await API.post(`${API_BASE_URL}/items/block-dates`, { propertyId, startDate, endDate });
    return response.data;
  } catch (error) {
    console.error("Error blocking dates:", error.message);
    console.error("Error details:", error.response?.data || error.message);
    throw error;
  }
};

export const getBlockedDates = async () => {
  try {
    const response = await API.get(`${API_BASE_URL}/items/blocked-dates`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blocked dates:", error.message);
    console.error("Error details:", error.response?.data || error.message);
    throw error;
  }
};

export const unblockDates = async (propertyId, startDate, endDate) => {
  try {
    const response = await API.post(`${API_BASE_URL}/items/unblock-dates`, { propertyId, startDate, endDate });
    return response.data;
  } catch (error) {
    console.error("Error unblocking dates:", error.message);
    console.error("Error details:", error.response?.data || error.message);
    throw error;
  }
};
