import API from '../../../utils/axios';
import { API_BASE_URL } from '../../../config/apiconfig';

// Fetch reservations for the current user
export const fetchUserReservations = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await API.get(`${API_BASE_URL}/user/reservations/check`);
        console.log('User reservations fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Cancel a reservation by ID
export const cancelUserReservation = async (reservationId) => {
    // eslint-disable-next-line no-useless-catch
    try {
        return await API.patch(`/reservations/${reservationId}/cancel`);
    } catch (error) {
        throw error;
    }
};
