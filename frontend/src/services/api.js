import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tasks';

// Set up interceptor to prepend the token to all authenticated requests
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export const getTasks = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getStats = async () => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
};

export const addTask = async (task) => {
    const response = await axios.post(API_URL, task);
    return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
    const response = await axios.put(`${API_URL}/${taskId}/status`, { status });
    return response.data;
};

export const deleteTask = async (taskId) => {
    await axios.delete(`${API_URL}/${taskId}`);
};

export const getAllUsers = async () => {
    const response = await axios.get('http://localhost:8080/api/users');
    return response.data;
};
