import axios from 'axios';
import { BACKEND_URL } from '.';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async config => {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      throw new axios.Cancel('No internet connection');
    }
    return config;
  },
  error => Promise.reject(error)
);

// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (axios.isCancel(error)) {
//       Alert.alert('Network Error', 'No internet connection');
//     } else if (error.message === 'Network Error') {
//       Alert.alert('Network Error', 'Please check your Wi-Fi or mobile data.');
//     } else if (error.code === 'ECONNABORTED') {
//       Alert.alert('Timeout', 'Request took too long — try again later.');
//     } else {
//       console.error('API Error:', error);
//     }
//     return Promise.reject(error);
//   }
// );

export default api;