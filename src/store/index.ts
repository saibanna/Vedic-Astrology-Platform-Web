import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Auth State Interface
interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialUserJson = localStorage.getItem('vap_user');
const initialToken = localStorage.getItem('vap_token');

const initialAuthState: AuthState = {
  user: initialUserJson ? JSON.parse(initialUserJson) : null,
  token: initialToken || null,
  isAuthenticated: !!initialToken,
  loading: false,
  error: null,
};

// Create Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: any; token: string }>) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('vap_user', JSON.stringify(action.payload.user));
      localStorage.setItem('vap_token', action.payload.token);
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('vap_user');
      localStorage.removeItem('vap_token');
    },
  },
});

// Booking State Interface
interface BookingState {
  astrologers: any[];
  selectedAstrologer: any | null;
  slots: string[];
  bookings: any[];
  loading: boolean;
}

const initialBookingState: BookingState = {
  astrologers: [
    { id: 1, name: 'Acharya Sharma', rating: 4.9, specialty: 'Vedic Kundali, Career', pricePerMin: 30, experience: '15 Years', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { id: 2, name: 'Jyotishi Patel', rating: 4.8, specialty: 'Relationships, Marriage matching', pricePerMin: 25, experience: '10 Years', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
    { id: 3, name: 'Guru Varma', rating: 4.7, specialty: 'Gemology, Remedies, Pujas', pricePerMin: 35, experience: '18 Years', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' }
  ],
  selectedAstrologer: null,
  slots: [],
  bookings: [],
  loading: false,
};

// Create Booking Slice
const bookingSlice = createSlice({
  name: 'booking',
  initialState: initialBookingState,
  reducers: {
    setAstrologers(state, action: PayloadAction<any[]>) {
      state.astrologers = action.payload;
    },
    selectAstrologer(state, action: PayloadAction<any>) {
      state.selectedAstrologer = action.payload;
    },
    setSlots(state, action: PayloadAction<string[]>) {
      state.slots = action.payload;
    },
    setBookings(state, action: PayloadAction<any[]>) {
      state.bookings = action.payload;
    },
  },
});

// Actions Export
export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export const { setAstrologers, selectAstrologer, setSlots, setBookings } = bookingSlice.actions;

// Store configuration
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    booking: bookingSlice.reducer,
  },
});

// RootState and AppDispatch Types definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
