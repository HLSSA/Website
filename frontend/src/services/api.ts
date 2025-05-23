import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token and handle errors
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Add a request interceptor to add the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/login', { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAbout = async (data: any) => {
  try {
    const response = await api.put('/about', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAbout = async () => {
  try {
    const response = await api.get('/about');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Coaches API
export const getCoaches = async () => {
  try {
    const response = await api.get('/coaches');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCoach = async (data: any) => {
  try {
    const response = await api.post('/coaches', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCoach = async (id: number, data: any) => {
  try {
    const response = await api.put(`/coaches/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCoach = async (id: number) => {
  try {
    const response = await api.delete(`/coaches/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
