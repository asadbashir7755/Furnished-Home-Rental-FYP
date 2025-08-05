import API from '../../utils/axios';
import { API_BASE_URL } from '../../../config/apiconfig';

export const fetchUsersStats = async () => {
  try {
    const response = await API.get(`${API_BASE_URL}/admin/fetchusers`);
    console.log("Users stats:", response.data.usersCount);
    // console.log("Users stats:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching users stats:", error);
    throw error;
  }
};

export const fetchItemsStats = async () => {
  try {
    const response = await API.get(`${API_BASE_URL}/admin/items`);
    console.log("item stats:", response.data.itemsCount);
    // console.log("item stats:", response.data);


    return response.data;
  } catch (error) {
    console.error("Error fetching items stats:", error);
    throw error;
  }
};


