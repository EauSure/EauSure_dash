import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
