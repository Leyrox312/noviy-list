import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Default Next.js port
});

export const getRaces = () => api.get('/races');
export const deleteRace = (id: number) => api.delete(`/races/${id}`);
export const createRace = (data: any) => api.post('/races', data);

export const getClasses = () => api.get('/classes');
export const deleteClass = (id: number) => api.delete(`/classes/${id}`);
export const createClass = (data: any) => api.post('/classes', data);
export const updateClass = (id: number, data: any) => api.put(`/classes/${id}`, data);

export const getArticles = () => api.get('/articles');
export const deleteArticle = (id: number) => api.delete(`/articles/${id}`);
export const createArticle = (data: any) => api.post('/articles', data);
export const updateArticle = (id: number, data: any) => api.put(`/articles/${id}`, data);

export const getItems = () => api.get('/items');
export const deleteItem = (id: number) => api.delete(`/items/${id}`);
export const createItem = (data: any) => api.post('/items', data);
export const updateItem = (id: number, data: any) => api.put(`/items/${id}`, data);

export const getPerks = () => api.get('/perks');
export const deletePerk = (id: number) => api.delete(`/perks/${id}`);
export const createPerk = (data: any) => api.post('/perks', data);
export const updatePerk = (id: number, data: any) => api.put(`/perks/${id}`, data);

export const getOrigins = () => api.get('/origins');
export const deleteOrigin = (id: number) => api.delete(`/origins/${id}`);
export const createOrigin = (data: any) => api.post('/origins', data);
export const updateOrigin = (id: number, data: any) => api.put(`/origins/${id}`, data);

export const login = (credentials: any) => api.post('/auth', credentials);

export default api;
