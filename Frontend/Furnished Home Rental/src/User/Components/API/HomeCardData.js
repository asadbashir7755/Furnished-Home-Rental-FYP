import API from "../../../utils/axios";
// import { API_BASE_URL } from "../../../config/apiconfig";
const API_BASE_URL="http://localhost:5000/api"

const API_URL = `${API_BASE_URL}/items/list`;

export const fetchProperties = async () => {
  try {
    const response = await API.get(API_URL);
    console.log("Fetched properties:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
};

export const fetchPropertiesBySearch = async (searchParams) => {
  try {
    const response = await API.get(`${API_BASE_URL}/items/search`, { params: searchParams });
    console.log("Fetched properties by search:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching properties by search:", error);
    return [];
  }
};