import API from '../../utils/axios';
import { API_BASE_URL } from '../../../config/apiconfig';


export const fetchUsers = async () => {
  try {
    console.log("making api call ")
    const response = await API.get(`${API_BASE_URL}/manage/getuser`);
    console.log("Fetched users:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await API.delete(`${API_BASE_URL}/manage/deleteuser/${id}`);
    console.log("Deleted user:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const updateUserRole = async (id, role) => {
  try {
    const response = await API.put(`${API_BASE_URL}/manage/updaterole/${id}`, { role });
    console.log("Updated user role:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};
