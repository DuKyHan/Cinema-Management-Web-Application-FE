import axios from 'axios';

export const BASE_URL = 'http://128.199.251.131:3000/api/v1';

export const rawAxiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const authAxiosInstance = axios.create({
  baseURL: BASE_URL,
});

authAxiosInstance.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
