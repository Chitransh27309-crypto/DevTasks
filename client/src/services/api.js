const API_URL = "http://localhost:5000/api/v1";

let updateAccessToken = null;
let clearAuth = null;

export const setAuthHandlers = (
    setToken,
    clearAuthentication
) => {
    updateAccessToken = setToken;
    clearAuth = clearAuthentication;
};

const refreshToken = async () => {
    const response = await fetch(
        `${API_URL}/auth/refresh`,
        {
            method: "POST",
            credentials: "include"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to refresh access token"
        );
    }

    return data;
};

export const apiRequest = async (
    endpoint,
    options = {},
    accessToken = null,
    retry = true
) => {
    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers
    });

    const data = await response.json();

    // Access token expired/invalid
    if (response.status === 401 && retry) {
        try {
            const refreshData = await refreshToken();

            const newAccessToken = refreshData.accessToken;

            if (updateAccessToken) {
                updateAccessToken(newAccessToken);
            }

            return await apiRequest(
                endpoint,
                options,
                newAccessToken,
                false
            );

        } catch (error) {
            if (clearAuth) {
                clearAuth();
            }

            throw error;
        }
    }

    if (!response.ok) {
        throw new Error(
            data.message || "Something went wrong"
        );
    }

    return data;
};