import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Default Next.js port
});

export const getRaces = () => api.get('/races');
export const getClasses = () => api.get('/classes');
export const getArticles = () => api.get('/articles');
export const getItems = () => api.get('/items');
export const login = (credentials: any) => api.post('/auth', credentials);

export default api;
