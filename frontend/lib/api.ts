import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface WaterQualityData {
  timestamp: string;
  tds: number;
  ph: number;
  deviceId: string;
}

export interface Device {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  battery: number;
  lastSeen: string;
}

export interface Alert {
  id: string;
  type: 'fall_detection' | 'water_quality' | 'device_offline';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  deviceId: string;
  timestamp: string;
  acknowledged: boolean;
}

export const getWaterQualityData = async (params?: {
  deviceId?: string;
  startTime?: string;
  endTime?: string;
  limit?: number;
}): Promise<WaterQualityData[]> => {
  const response = await apiClient.get('/water-quality', { params });
  return response.data;
};

export const getDevices = async (): Promise<Device[]> => {
  const response = await apiClient.get('/devices');
  return response.data;
};

export const getAlerts = async (params?: {
  acknowledged?: boolean;
  severity?: string;
}): Promise<Alert[]> => {
  const response = await apiClient.get('/alerts', { params });
  return response.data;
};

export const acknowledgeAlert = async (alertId: string): Promise<void> => {
  await apiClient.patch(`/alerts/${alertId}/acknowledge`);
};
