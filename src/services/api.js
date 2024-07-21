import axios from 'axios';
import { getToken, setToken } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

api.interceptors.request.use(
  (config) => {
    const token = getToken().access;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const token = getToken().refresh;
        const response = await api.post('/api/token/refresh/', {
          refresh: token,
        });
        const newToken = response.data.access;
        setToken({ access: newToken, refresh: token });
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const signup = async (userData) => {
  try {
    const response = await api.post('/signup/', userData);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error('An error occurred during signup');
  }
};

export const login = async (userData) => {
  const response = await api.post('/login/', userData);
  return response.data;
};

export const getTasks = async () => {
  const response = await api.get('/tasks/');
  return response.data;
};

export const createTask = async (taskData, token) => {
  const response = await api.post('/tasks/', taskData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUsers = async (token) => {
  const response = await api.get('/users/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateTask = async (taskId, taskData, token) => {
  const response = await api.put(`/tasks/${taskId}/`, taskData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteTask = async (taskId, token) => {
  await api.delete(`/tasks/${taskId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const toggleTaskCompletion = async (taskId, newStatus, token) => {
  const response = await api.patch(
    `/tasks/${taskId}/`,
    { status: newStatus },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getTaskSummary = async (token) => {
  try {
    const response = await api.get('/tasks/summary/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error('Failed to fetch task summary');
  }
};

export const getTaskDetail = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}/`);
  return response.data;
};
