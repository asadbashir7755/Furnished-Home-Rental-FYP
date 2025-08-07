import API from "../../../utils/axios";

// reservationData: { propertyId, dates, total }
export const createCheckoutSession = async (reservationData) => {
  const response = await API.post("/checkout/create-session", reservationData);
  return response.data; // Should contain Stripe sessionId or clientSecret
};
