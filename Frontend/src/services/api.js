import axios from 'axios';

const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');

const authInterceptor = (config) => {
  const user = getUser();
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
};

const errorInterceptor = (err) => {
  if (err.response?.status === 401) {
    localStorage.removeItem('user');
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }
  return Promise.reject(err);
};

// ── Default API instance (15s timeout) ────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

api.interceptors.request.use(authInterceptor);
api.interceptors.response.use((res) => res, errorInterceptor);

// ── Upload API instance (60s timeout for Cloudinary on slow mobile) ───────────
export const uploadApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
});

uploadApi.interceptors.request.use(authInterceptor);
uploadApi.interceptors.response.use((res) => res, errorInterceptor);

export default api;