import axios from 'axios';

// In production (Vercel), use the full backend URL from env variable
// In development, use relative URL (Vite proxy handles it)
const BACKEND_URL = import.meta.env.VITE_API_URL || '';

// Create a dedicated axios instance for authenticated API calls
const api = axios.create({
    baseURL: BACKEND_URL,
});

const API_URL = '/api/tasks';

// Request interceptor — attach token to every request
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor — only handle 401 (Unauthorized), NOT 403 (Forbidden)
// 403 = valid token but insufficient permissions (normal behavior for role-based access)
// 401 = invalid or expired token (should logout)
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            const token = localStorage.getItem('token');
            if (token) {
                console.warn('Session expired. Logging out...');
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('username');
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

export const getTasks = async () => {
    const response = await api.get(API_URL);
    return response.data;
};

export const getStats = async () => {
    const response = await api.get(`${API_URL}/stats`);
    return response.data;
};

export const addTask = async (task) => {
    const response = await api.post(API_URL, task);
    return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
    const response = await api.put(`${API_URL}/${taskId}/status`, { status });
    return response.data;
};

export const deleteTask = async (taskId) => {
    await api.delete(`${API_URL}/${taskId}`);
};

export const getAllUsers = async () => {
    const response = await api.get('/api/users');
    return response.data;
};
