import axios from 'axios';
import { Storage } from '../utils/storage';

const apiClient = axios.create({
  baseURL: 'https://sandbox-job-app.bosselt.com',
});

apiClient.interceptors.request.use(async (config) => {
  const token = await Storage.get('token');
  if (token) {
    config.headers.authorization = `${token}`;
  }
  return config;
});

export default apiClient;