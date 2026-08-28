import { apiRequest } from "./api.js";

export const getTasks = async (projectId, accessToken) => {
    return await apiRequest(
        `/projects/${projectId}/tasks`,
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