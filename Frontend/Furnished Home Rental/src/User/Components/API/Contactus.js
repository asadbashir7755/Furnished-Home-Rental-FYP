// import axios from 'axios';
import API from "../../../utils/axios";


export const submitContactForm = async (formData) => {
  try {
    await API.post('/users/contact', formData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


