import api from './api';
export const fetchAllKhata     = (params) => api.get('/khata', { params });
export const fetchKhataById    = (id) => api.get(`/khata/${id}`);
export const fetchKhataStats   = () => api.get('/khata/stats');
export const createKhata       = (data) => api.post('/khata', data);
export const updateKhata       = (id, data) => api.put(`/khata/${id}`, data);
export const deleteKhata       = (id) => api.delete(`/khata/${id}`);
export const addTransaction    = (id, data) => api.post(`/khata/${id}/transaction`, data);
export const deleteTransaction = (id, txId) => api.delete(`/khata/${id}/transaction/${txId}`);
