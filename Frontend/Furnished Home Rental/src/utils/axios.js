import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

let isRefreshing = false;
let refreshPromise = null; // Store the refresh promise to prevent multiple refresh calls

API.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
        const originalRequest = error.config;

        // If the response is 401 (Unauthorized) and the request has not been retried yet
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // If refresh is already in progress, wait for it to complete
            if (!isRefreshing) {
                isRefreshing = true;
                refreshPromise = axios
                    .get("http://localhost:5000/api/users/refresh", { withCredentials: true })
                    .then((refreshResponse) => {
                        console.log("Token refreshed successfully:", refreshResponse.data);
                        isRefreshing = false;
                        refreshPromise = null;

                        // Store the new access token if using localStorage (optional)
                        localStorage.setItem("accessToken", refreshResponse.data.accessToken);
                        return refreshResponse.data.accessToken;
                    })
                    .catch((refreshError) => {
                        console.error("Refresh failed, logging out.");
                        isRefreshing = false;
                        refreshPromise = null;

                        // Remove tokens from storage
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");

                        // Redirect only if the user is not already on the login page
                        if (window.location.pathname !== "/login") {
                            window.location.href = "/login";
                        }

                        return Promise.reject(refreshError);
                    });
            }

            try {
                const newAccessToken = await refreshPromise;
                if (newAccessToken) {
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return API(originalRequest); // Retry the original request
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }

        // If the error is not a 401 or the request has already been retried, reject the promise
        return Promise.reject(error);
    }
);

export default API;
