import http from '../utils/http';

export const getUserAssistantPermissions = async (userId) => {
    const response = await http.get(`/users/${userId}/assistant-permissions`);
    return response.data;
};

export const updateUserAssistantPermission = async (userId, assistantId, data) => {
    const response = await http.put(`/users/${userId}/assistant-permissions/${assistantId}`, data);
    return response.data;
};

export const batchUpdateUserAssistantPermissions = async (userId, permissions) => {
    const response = await http.put(`/users/${userId}/assistant-permissions`, { permissions });
    return response.data;
}; 