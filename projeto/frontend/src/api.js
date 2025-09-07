import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

// Interceptor simples para garantir que chamadas com http://localhost:3000 sejam normalizadas
axios.interceptors.request.use((config) => {
  if (typeof config.url === 'string' && config.url.startsWith('http://localhost:3000')) {
    const relative = config.url.replace('http://localhost:3000', '');
    config.url = relative;
  }
  return config;
});

export default axios;
