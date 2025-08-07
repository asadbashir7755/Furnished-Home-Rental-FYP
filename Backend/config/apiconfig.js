const API_BASE_URL = process.env.API_BASE_URL || '/api'; // Default to '/api' if not defined

const API_ENDPOINTS = {
    users: {
        base: `${API_BASE_URL}/users`,
        login: `${API_BASE_URL}/users/login`,
        register: `${API_BASE_URL}/users/register`,
        profile: `${API_BASE_URL}/users/profile`,
        refresh: `${API_BASE_URL}/users/refresh`, 
        logout: `${API_BASE_URL}/users/logout`, 
    },
    items: {
        base: `${API_BASE_URL}/items`,
        addItem: `${API_BASE_URL}/items/add`,
        getItems: `${API_BASE_URL}/items/list`,
        updateItem: (id) => `${API_BASE_URL}/items/update/${id}`,
        deleteItem: (id) => `${API_BASE_URL}/items/delete/${id}`,
    },
    checkout: {
        createSession: `${API_BASE_URL}/checkout/create-session`,
    },
};

module.exports = API_ENDPOINTS;