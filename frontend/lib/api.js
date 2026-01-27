import axios from 'axios';
import { getSession } from 'next-auth/react';

// Use relative path for same-origin API calls (no CORS issues)
const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to all requests
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 unauthorized errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getWaterQualityData = async (params) => {
  const response = await apiClient.get('/water-quality', { params });
  return response.data;
};

export const getDevices = async () => {
  const response = await apiClient.get('/devices');
  return response.data;
};

export const getAlerts = async (params) => {
  const response = await apiClient.get('/alerts', { params });
  return response.data;
};

export const acknowledgeAlert = async (alertId) => {
  await apiClient.patch(`/alerts/${alertId}/acknowledge`);
};
