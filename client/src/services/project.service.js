import { apiRequest } from "./api.js";

export const getProjects = async (accessToken) => {
    return await apiRequest(
        "/projects",
        {
            method: "GET"
        },
        accessToken
    );
};

export const getProjectById = async (projectId, accessToken) => {
    return await apiRequest(
        `/projects/${projectId}`,
        {
            method: "GET"
        },
        accessToken
    );
};

export const createProject = async (projectData, accessToken) => {
    return await apiRequest(
        "/projects",
        {
            method: "POST",
            body: JSON.stringify(projectData)
        },
        accessToken
    );
};

export const updateProject = async (
    projectId,
    projectData,
    accessToken
) => {
    return await apiRequest(
        `/projects/${projectId}`,
        {
            method: "PUT",
            body: JSON.stringify(projectData)
        },
        accessToken
    );
};

export const deleteProject = async (projectId, accessToken) => {
    return await apiRequest(
        `/projects/${projectId}`,
        {
            method: "DELETE"
        },
        accessToken
    );
};