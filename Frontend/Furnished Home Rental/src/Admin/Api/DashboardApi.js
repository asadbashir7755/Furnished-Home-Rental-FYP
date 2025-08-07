import API from '../../utils/axios';
import { API_BASE_URL } from '../../../config/apiconfig';

export const fetchUsersStats = async () => {
  try {
    const response = await API.get(`${API_BASE_URL}/admin/fetchusers`);
    // Returns: { usersCount }
    return response.data;
  } catch (error) {
    console.error("Error fetching users stats:", error);
    throw error;
  }
};

export const fetchItemsStats = async () => {
  try {
    const response = await API.get(`${API_BASE_URL}/admin/items`);
    // Returns: { itemsCount }
    return response.data;
  } catch (error) {
    console.error("Error fetching items stats:", error);
    throw error;
  }
};

export const fetchReservationsStats = async () => {
  try {
    const response = await API.get(`${API_BASE_URL}/admin/reservations`);
    // Returns: { reservationsCount }
    return response.data;
  } catch (error) {
    console.error("Error fetching reservations stats:", error);
    throw error;
  }
};

export const fetchContactsStats = async () => {
  try {
    const response = await API.get(`${API_BASE_URL}/admin/contacts`);
    // Returns: { contactsCount }
    return response.data;
  } catch (error) {
    console.error("Error fetching contacts stats:", error);
    throw error;
  }
};
 



