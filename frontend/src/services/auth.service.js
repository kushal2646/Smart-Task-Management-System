import axios from 'axios';

// In production (Vercel), use the full backend URL from env variable
// In development, use relative URL (Vite proxy handles it)
const BACKEND_URL = import.meta.env.VITE_API_URL || '';
const API_URL = `${BACKEND_URL}/api/auth`;

export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('username', response.data.username);
    }
    return response.data;
};

export const register = async (username, password, role) => {
    const response = await axios.post(`${API_URL}/register`, { username, password, role });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
};

export const getCurrentUser = () => {
    return {
        username: localStorage.getItem('username'),
        role: localStorage.getItem('role'),
    };
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};
