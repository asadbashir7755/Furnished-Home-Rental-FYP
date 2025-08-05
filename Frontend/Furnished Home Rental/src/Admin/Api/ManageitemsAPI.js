import API from '../../utils/axios';
import { API_BASE_URL } from '../../../config/apiconfig';

export const sendFormData = async (formData) => {
  try {
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'mediaFiles') {
        formData[key].forEach(file => {
          formDataToSend.append('mediaFiles', file.originFileObj || file);
        });
      } else if (key === 'address' || key === 'pricing') {
        formDataToSend.append(key, JSON.stringify(formData[key])); // Convert address and pricing objects to JSON strings
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    const response = await API.post(`${API_BASE_URL}/items/add`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log("form data is : ", formDataToSend);
    console.log("Response data:", response.data);
    return response.data; // Return the response data directly
  } catch (error) {
    console.log("form data is : ", formData);
    console.error("An error occurred while submitting the form data:", error.message);
    console.error("Error details:", error.response?.data || error.message);
    throw error; // Throw the error to be handled by the caller
  }
};

export const fetchItemss = async () => {
  try {
    console.log("url for get items is : ", `${API_BASE_URL}/items/list`);
    const response = await API.get(`${API_BASE_URL}/items/list`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error.message);
    console.error("Error details:", error.response?.data || error.message);
    throw error;
  }
};

export const updateItem = async (id, updatedData) => {
  try {
    const formDataToSend = new FormData();
    Object.keys(updatedData).forEach(key => {
      if (key === 'mediaFiles') {
        updatedData[key].forEach(file => {
          formDataToSend.append('mediaFiles', file.originFileObj || file);
        });
      } else if (key === 'address' || key === 'pricing') {
        formDataToSend.append(key, JSON.stringify(updatedData[key])); // Convert address and pricing objects to JSON strings
      } else {
        formDataToSend.append(key, updatedData[key]);
      }
    });

    const response = await API.put(`${API_BASE_URL}/items/update/${id}`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log("Response data:", response.data);
    return response.data; // Return the response data directly
  } catch (error) {
    console.error("An error occurred while updating the item:", error.message);
    console.error("Error details:", error.response?.data || error.message);
    throw error; // Throw the error to be handled by the caller
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await API.delete(`${API_BASE_URL}/items/delete/${id}`);
    console.log("Response data:", response.data);
    return response.data; // Return the response data directly
  } catch (error) {
    console.error("An error occurred while deleting the item:", error.message);
    console.error("Error details:", error.response?.data || error.message);
    throw error; // Throw the error to be handled by the caller
  }
};

export const blockDates = async (propertyId, startDate, endDate) => {
  try {
    const response = await API.post(`${API_BASE_URL}/items/block-dates`, { propertyId, startDate, endDate });
    return response.data;
  } catch (error) {
    console.error("Error blocking dates:", error.message);
    console.error("Error details:", error.response?.data || error.message);
    console.log("error while blocking date : ",error)
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