import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            window.location.href = '/user/signin';
        }
        return Promise.reject(error);
    }
);

// API Methods
export const api = {
    // Auth APIs
    signup: (userData) => apiClient.post('/user/signup', userData),
    signin: (credentials) => apiClient.post('/user/signin', credentials),

    // Analysis APIs
    uploadAndAnalyze: (formData) => {
        // The backend route for handling multipart resume uploads is `/analysis/upload`.
        // `/analysis/save` expects a JSON analysis payload (not a file upload).
        return apiClient.post('/analysis/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    getAnalysisHistory: () => apiClient.get('/analysis/history'),

    getAnalysisById: (id) => apiClient.get(`/analysis/${id}`),

    getDashboardStats: () => apiClient.get('/analysis/statistics'),

    deleteAnalysis: (id) => apiClient.delete(`/analysis/${id}`),

    // User APIs
    updateUser: (userData) => apiClient.post('/user/update', userData),
    deleteUser: () => apiClient.post('/user/delete'),
};

export default apiClient;
