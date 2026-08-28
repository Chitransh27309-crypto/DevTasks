import { apiRequest } from "./api.js";

export const getTasks = async (
    projectId,
    accessToken,
    filters = {}
) => {
    const queryParams = new URLSearchParams();

    if (filters.search) {
        queryParams.append("search", filters.search);
    }

    if (filters.status) {
        queryParams.append("status", filters.status);
    }

    if (filters.priority) {
        queryParams.append("priority", filters.priority);
    }

    if (filters.sort) {
        queryParams.append("sort", filters.sort);
    }

    if (filters.order) {
        queryParams.append("order", filters.order);
    }

    const queryString = queryParams.toString();

    return await apiRequest(
        `/projects/${projectId}/tasks${queryString ? `?${queryString}` : ""}`,
        {
            method: "GET"
        },
        accessToken
    );
};

export const createTask = async (
    projectId,
    taskData,
    accessToken
) => {
    return await apiRequest(
        `/projects/${projectId}/tasks`,
        {
            method: "POST",
            body: JSON.stringify(taskData)
        },
        accessToken
    );
};

export const updateTask = async (
    projectId,
    taskId,
    taskData,
    accessToken
) => {
    return await apiRequest(
        `/projects/${projectId}/tasks/${taskId}`,
        {
            method: "PUT",
            body: JSON.stringify(taskData)
        },
        accessToken
    );
};

export const deleteTask = async (
    projectId,
    taskId,
    accessToken
) => {
    return await apiRequest(
        `/projects/${projectId}/tasks/${taskId}`,
        {
            method: "DELETE"
        },
        accessToken
    );
};