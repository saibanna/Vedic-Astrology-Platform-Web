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
      // Don't redirect to login for calc/public endpoints — just reject
      const url: string = error.config?.url || '';
      const isPublicEndpoint = url.includes('/api/v1/calc/') || url.includes('/api/v1/astrology/') || url.includes('/api/v1/master/');
      if (skipRedirect || isPublicEndpoint) {
        return Promise.reject(error);
      }
      localStorage.removeItem('vap_token');
      localStorage.removeItem('vap_user');
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

export type GemstoneRequest = {
  year: number; month: number; day: number;
  hour: number; minute: number;
  lat: number; lon: number; tzone: number;
  concern?: string;
};

export type GemstoneRecommendation = {
  rank: number; planet: string; gemstone: string; hindiName: string;
  substitute: string; metal: string; dayToWear: string; minCaratWeight: number;
  benefit: string; reason: string; isDasha: boolean;
};

export type GemstoneResult = {
  lagna: string; moonSign: string; nakshatra: string; currentDasha: string;
  recommendations: GemstoneRecommendation[];
};

export const gemstoneService = {
  getSuggestion: (data: GemstoneRequest) =>
    api.post<GemstoneResult>('/api/v1/astrology/calc/gemstone-suggestion', data),
};

// Shared calculator input (all calculators use same birth details)
export type CalcInput = {
  year: number; month: number; day: number;
  hour: number; minute: number;
  lat: number; lon: number; tzone: number;
};

export const calculatorService = {
  manglik:        (d: CalcInput) => api.post('/api/v1/astrology/calc/manglik-dosha', d),
  kaalSarp:       (d: CalcInput) => api.post('/api/v1/astrology/calc/kaal-sarp-dosha', d),
  sadeSati:       (d: CalcInput) => api.post('/api/v1/astrology/calc/sade-sati', d),
  pitraDosha:     (d: CalcInput) => api.post('/api/v1/astrology/calc/pitra-dosha', d),
  nakshatra:      (d: CalcInput) => api.post('/api/v1/astrology/calc/nakshatra-finder', d),
  basicDetails:   (d: CalcInput) => api.post('/api/v1/astrology/calc/basic-details', d),
  atmakaraka:     (d: CalcInput) => api.post('/api/v1/astrology/calc/atmakaraka', d),
  rudraksha:      (d: CalcInput) => api.post('/api/v1/astrology/calc/rudraksha-suggestion', d),
  yoginiDasha:    (d: CalcInput) => api.post('/api/v1/astrology/calc/yogini-dasha', d),
  kundaliMatch:   (d: any)       => api.post('/api/v1/astrology/calc/kundali-matching', d),
  panchang:       (d: { year: number; month: number; day: number; lat: number; lon: number; tzone: number }) =>
                                    api.post('/api/v1/astrology/calc/panchang', d),
  horoscope:      (sign: string, type: 'daily' | 'monthly' | 'weekly' | 'yearly') =>
                                    api.post('/api/v1/astrology/calc/horoscope', { sign, type }),
  numerology:     (name: string, dob: string) => api.post('/api/v1/astrology/calc/numerology', { name, dob }),
  biorhythm:      (dob: string, target_date?: string) => api.post('/api/v1/astrology/calc/biorhythm', { dob, target_date: target_date || '' }),
  pdfReport:      (d: CalcInput) => api.post('/api/v1/astrology/calc/pdf-report', d, { responseType: 'blob' }),
  horaMuhurta:    (year: number, month: number, day: number) => api.post('/api/v1/astrology/calc/hora-muhurta', { year, month, day }),
  chaughadiya:    (year: number, month: number, day: number) => api.post('/api/v1/astrology/calc/chaughadiya', { year, month, day }),
  yearlyHoroscope:(sign: string, year: number) => api.get(`/api/v1/astrology/calc/yearly-horoscope?sign=${sign}&year=${year}`),
  ishtaDevta:     (d: CalcInput) => api.post('/api/v1/astrology/calc/ishta-devta', d),
  dhanYoga:       (d: CalcInput) => api.post('/api/v1/astrology/calc/dhan-yoga', d),
  nameCorrection: (current_name: string, dob: string) => api.post('/api/v1/astrology/calc/name-correction', { current_name, dob }),
  transitReport:  (d: CalcInput) => api.post('/api/v1/astrology/calc/transit-report', d),
  babyName:       (d: CalcInput) => api.post('/api/v1/astrology/calc/baby-name', d),
  loveCompat:     (sign1: string, sign2: string) => api.post('/api/v1/astrology/calc/love-compatibility', { sign1, sign2 }),
  aiInterpret:    (d: CalcInput & { question?: string }) => api.post('/api/v1/astrology/calc/ai-interpretation', d),
};
