import axios from 'axios';

// Resolve the API Base URL dynamically
const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // For local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8080';
    }
    // When deployed, use the same host and port (e.g. port 80) to proxy through Nginx
    return window.location.origin;
  }
  return 'http://76.13.244.69:8080';
};

const API_BASE_URL = getApiBaseUrl();

// API Instance for general endpoints
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to dynamically inject the JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vap_token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry / unauthenticated API calls
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const skipRedirect = error.config?.headers?.['X-Skip-Auth-Redirect'] === 'true';
      if (skipRedirect) {
        return Promise.reject(error);
      }
      localStorage.removeItem('vap_token');
      localStorage.removeItem('vap_user');
      // Redirect to login if appropriate (optional check)
      if (!window.location.pathname.endsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Service calls helper definitions
export const authService = {
  sendOtp: (phone: string) => api.post('/api/v1/auth/login', { mobileNumber: phone }),
  verifyOtp: (phone: string, code: string) => api.post('/api/v1/auth/verify', { mobileNumber: phone, otp: code }),
};

export const userService = {
  getProfile: () => api.get('/api/v1/users/me'),
  updateProfile: (profile: any) => api.put('/api/v1/users/profile', profile),
};

export const bookingService = {
  getAstrologers: () => api.get('/api/v1/users/astrologers'), // Helper to fetch available astrologers
  getSlots: (astrologerId: number, date: string) => api.get(`/api/v1/slots?astrologerId=${astrologerId}&date=${date}`),
  createBooking: (bookingData: any) => api.post('/api/v1/bookings', bookingData),
  getBookings: () => api.get('/api/v1/bookings/me'),
};

export type AstrologyCalcInput = {
  year: number; month: number; day: number;
  hour: number; minute: number;
  lat: number; lon: number; tzone: number;
};

export type ChartFormInput = {
  name?: string; dob: string; tob: string; pob?: string;
  lat: number; lon: number; tzone: number;
};

export const astrologyService = {
  getBirthChart: (data: ChartFormInput) => 
    api.post('/api/v1/astrology/chart', data),
  getHoroscope: (zodiacSign: string) => 
    api.get(`/api/v1/astrology/horoscope?sign=${zodiacSign}`),
  navamsaChart: (data: AstrologyCalcInput) =>
    api.post('/api/v1/astrology/navamsa-chart', data),
  getDasha: (data: AstrologyCalcInput) =>
    api.post('/api/v1/astrology/dasha', data),
};

export const remedyService = {
  getRemedies: (type?: string) => api.get(type ? `/api/v1/remedies?type=${type}` : '/api/v1/remedies'),
  bookRemedy: (data: any) => api.post('/api/v1/remedies/book', data),
};

export type MasterDataItem = { id: number; category: string; code: string; label: string; description?: string; sortOrder: number; isActive: boolean };

export const masterDataService = {
  getByCategory: (category: string) => api.get<MasterDataItem[]>(`/api/v1/master/${category}`),
};
