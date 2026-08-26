import { apiRequest } from "./api.js";

export const registerUser = async (userData) => {
    return await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData)
    });
};

export const loginUser = async (credentials) => {
    return await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials)
    });
};

export const refreshAccessToken = async () => {
    return await apiRequest("/auth/refresh", {
        method: "POST"
    });
};

export const logoutUser = async () => {
    return await apiRequest("/auth/logout", {
        method: "POST"
    });
};