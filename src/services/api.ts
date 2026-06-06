import axios from 'axios';

// Default to the Hostinger Gateway deployed IP, or read from env variables if set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://76.13.244.69:8080';

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

export const astrologyService = {
  getBirthChart: (data: { name: string; dob: string; tob: string; pob: string }) => 
    api.post('/api/v1/astrology/birth-chart', data),
  getHoroscope: (zodiacSign: string) => 
    api.get(`/api/v1/astrology/horoscope?sign=${zodiacSign}`),
};

export const remedyService = {
  getRemedies: () => api.get('/api/v1/remedies'),
  bookRemedy: (data: any) => api.post('/api/v1/remedies/book', data),
};
