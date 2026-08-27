import { apiRequest } from "./api.js";

export const getDashboardStats = async (accessToken) => {
    return await apiRequest("/dashboard/stats", {
        method: "GET"
    },
        accessToken
    );
};