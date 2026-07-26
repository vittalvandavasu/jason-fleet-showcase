import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  timeout: 15000,
});

export const getTrailers = () => api.get('/trailers').then((r) => r.data);

export const createBooking = (payload) => api.post('/bookings', payload).then((r) => r.data);

// admin
export const verifyAdmin = (token) =>
  api.post('/admin/verify', null, { headers: { 'X-Admin-Token': token } }).then((r) => r.data);

export const listBookings = (token) =>
  api.get('/admin/bookings', { headers: { 'X-Admin-Token': token } }).then((r) => r.data);

export const getStats = (token) =>
  api.get('/admin/stats', { headers: { 'X-Admin-Token': token } }).then((r) => r.data);

export const updateBookingStatus = (token, id, status) =>
  api
    .patch(`/admin/bookings/${id}`, { status }, { headers: { 'X-Admin-Token': token } })
    .then((r) => r.data);

export const deleteBooking = (token, id) =>
  api.delete(`/admin/bookings/${id}`, { headers: { 'X-Admin-Token': token } }).then((r) => r.data);
