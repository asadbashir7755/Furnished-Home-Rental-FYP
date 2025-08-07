import API from "../../utils/axios";

// Helper function to parse MongoDB extended JSON format
const parseMongoDBResponse = (data) => {
  if (!data) return null;
  
  // Handle array of documents
  if (Array.isArray(data)) {
    return data.map(item => parseMongoDBResponse(item));
  }
  
  // If not an object, return as is
  if (typeof data !== 'object') return data;
  
  // Create a new object to store parsed values
  const parsed = {};
  
  // Process each key in the object
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    // Handle special MongoDB types
    if (value && typeof value === 'object') {
      // Handle ObjectId
      if (value.$oid) {
        parsed[key] = value.$oid;
      }
      // Handle Date
      else if (value.$date) {
        if (value.$date.$numberLong) {
          parsed[key] = new Date(parseInt(value.$date.$numberLong));
        } else {
          parsed[key] = new Date(value.$date);
        }
      }
      // Handle Number (Int)
      else if (value.$numberInt) {
        parsed[key] = parseInt(value.$numberInt);
      }
      // Handle Number (Long)
      else if (value.$numberLong) {
        parsed[key] = parseInt(value.$numberLong);
      }
      // Handle nested objects
      else {
        parsed[key] = parseMongoDBResponse(value);
      }
    } else {
      // Regular value, assign as is
      parsed[key] = value;
    }
  });
  
  return parsed;
};

// Get all reservations (for admin)
export const getAllReservations = async () => {
  try {
    console.log("Fetching all reservations from API");
    const response = await API.get(`/reservations/all`);
    // Parse the MongoDB format
    const parsedData = parseMongoDBResponse(response.data);
    console.log("Successfully parsed reservations:", parsedData);
    return parsedData;
  } catch (error) {
    console.error("Error fetching all reservations:", error);
    console.error("API Error details:", error.response?.data || "No response data");
    console.error("API Status code:", error.response?.status);
    throw error;
  }
};

// Get reservations for a specific property
export const getPropertyReservations = async (propertyId) => {
  try {
    console.log(`Fetching reservations for property ID: ${propertyId}`);
    const response = await API.get(`/reservations/property/${propertyId}`);
    console.log(`Raw response for property ${propertyId}:`, response.data);
    
    // First check the structure of the response
    if (response.data === null || response.data === undefined) {
      console.warn("API returned null or undefined data");
      return { property: null, reservations: [] };
    }
    
    // Parse the MongoDB format
    let parsedData;
    if (typeof response.data === 'object' && response.data !== null) {
      if (response.data.reservations) {
        // Data has the expected structure
        parsedData = {
          property: parseMongoDBResponse(response.data.property),
          reservations: parseMongoDBResponse(response.data.reservations)
        };
      } else if (Array.isArray(response.data)) {
        // Direct array of reservations
        parsedData = {
          property: null, // We don't have property info
          reservations: parseMongoDBResponse(response.data)
        };
      } else if (response.data._id) {
        // Single reservation object
        parsedData = {
          property: null,
          reservations: [parseMongoDBResponse(response.data)]
        };
      } else {
        // Some other structure, just parse it
        parsedData = parseMongoDBResponse(response.data);
        // If it doesn't have reservations field, add an empty one
        if (!parsedData.reservations) {
          parsedData = { ...parsedData, reservations: [] };
        }
      }
    } else {
      // Unexpected data type
      console.warn("Unexpected data type:", typeof response.data);
      parsedData = { property: null, reservations: [] };
    }
    
    console.log(`Successfully parsed reservations for property ${propertyId}:`, parsedData);
    return parsedData;
  } catch (error) {
    console.error(`Error fetching reservations for property ${propertyId}:`, error);
    console.error("API Error details:", error.response?.data || "No response data");
    console.error("API Status code:", error.response?.status);
    // Return empty data structure instead of mock data
    return { property: null, reservations: [] };
  }
};

// Get details of a specific reservation
export const getReservation = async (reservationId) => {
  try {
    console.log(`Fetching reservation details for ID: ${reservationId}`);
    const response = await API.get(`/reservations/${reservationId}`);
    // Parse the MongoDB format
    const parsedData = parseMongoDBResponse(response.data);
    console.log(`Successfully parsed reservation ${reservationId}:`, parsedData);
    return parsedData;
  } catch (error) {
    console.error(`Error fetching reservation ${reservationId}:`, error);
    console.error("API Error details:", error.response?.data || "No response data");
    console.error("API Status code:", error.response?.status);
    throw error;
  }
};

// Get current user's reservations
export const getUserReservations = async () => {
  try {
    console.log("Fetching user reservations");
    const response = await API.get(`/reservations`);
    // Parse the MongoDB format
    const parsedData = parseMongoDBResponse(response.data);
    console.log("Successfully parsed user reservations:", parsedData);
    return parsedData;
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    console.error("API Error details:", error.response?.data || "No response data");
    console.error("API Status code:", error.response?.status);
    throw error;
  }
};

// Update reservation status
export const updateReservationStatus = async (reservationId, status) => {
  try {
    console.log(`Updating reservation ${reservationId} status to: ${status}`);
    const response = await API.patch(`/reservations/${reservationId}/status`, { status });
    // Parse the MongoDB format
    const parsedData = parseMongoDBResponse(response.data);
    console.log(`Successfully parsed updated reservation ${reservationId} status:`, parsedData);
    return parsedData;
  } catch (error) {
    console.error(`Error updating reservation ${reservationId} status to ${status}:`, error);
    console.error("API Error details:", error.response?.data || "No response data");
    console.error("API Status code:", error.response?.status);
    // Return error information instead of mock success
    return { 
      success: false, 
      message: `Failed to update reservation status: ${error.message}` 
    };
  }
};

// Create a new reservation
export const createReservation = async (reservationData) => {
  try {
    console.log("Creating new reservation with data:", reservationData);
    const response = await API.post(`/reservations`, reservationData);
    // Parse the MongoDB format
    const parsedData = parseMongoDBResponse(response.data);
    console.log("Successfully parsed created reservation:", parsedData);
    return parsedData;
  } catch (error) {
    console.error("Error creating reservation:", error);
    console.error("API Error details:", error.response?.data || "No response data");
    console.error("API Status code:", error.response?.status);
    throw error;
  }
};

// Cancel a reservation
export const cancelReservation = async (reservationId) => {
  try {
    console.log(`Cancelling reservation ${reservationId}`);
    const response = await API.patch(`/reservations/${reservationId}/cancel`, {});
    // Parse the MongoDB format
    const parsedData = parseMongoDBResponse(response.data);
    console.log(`Successfully parsed cancelled reservation ${reservationId}:`, parsedData);
    return parsedData;
  } catch (error) {
    console.error(`Error cancelling reservation ${reservationId}:`, error);
    console.error("API Error details:", error.response?.data || "No response data");
    console.error("API Status code:", error.response?.status);
    throw error;
  }
};
