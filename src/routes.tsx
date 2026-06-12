import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from './store';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Astrologers } from './pages/Astrologers';
import { Checkout } from './pages/Checkout';
import { Consultation } from './pages/Consultation';
import { Remedies } from './pages/Remedies';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { NavamsaChart } from './pages/NavamsaChart';
import { Dasha } from './pages/Dasha';

// Protected Route Component for General Users
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Admin Route Component
const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  return isAuthenticated && user?.role === 'ADMIN' ? children : <Navigate to="/" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/astrologers" element={<Astrologers />} />
        <Route path="/remedies" element={<Remedies />} />
        <Route path="/navamsa" element={<NavamsaChart />} />
        <Route path="/dasha" element={<Dasha />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Client Routes */}
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/consultation/:sessionId" 
          element={
            <ProtectedRoute>
              <Consultation />
            </ProtectedRoute>
          } 
        />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } 
        />

        {/* Catch-all fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};
