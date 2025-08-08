import API from '../../../utils/axios';
import { API_BASE_URL } from '../../../config/apiconfig';

// Submit a new review for a property
export const submitReview = async (reviewData) => {
  try {
    const response = await API.post(`${API_BASE_URL}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

// Get all reviews for a specific property
export const getPropertyReviews = async (propertyId) => {
  try {
    const response = await API.get(`${API_BASE_URL}/reviews/property/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property reviews:', error);
    throw error;
  }
};
