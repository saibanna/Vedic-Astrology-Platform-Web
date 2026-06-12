import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, logout } from '../store';
import { Compass, Calendar, ShoppingBag, MessageSquare, ShieldAlert, LogOut, LogIn, User, Grid3X3, Clock } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <nav style={{
        background: 'rgba(5, 6, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border-glass)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '16px 0'
      }}>
        <div className="layout-container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #d4af37 0%, #b38f1d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(212, 175, 55, 0.4)'
            }}>
              <Compass size={24} color="#05060f" className="animate-spin-slow" />
            </div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#ffffff',
              letterSpacing: '0.1em'
            }}>VEDAASTRO</span>
          </Link>

          {/* Navigation Items */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <Link to="/" style={{
              color: isActive('/') ? 'var(--color-accent-gold)' : 'var(--color-text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500
            }}>
              <Compass size={18} /> Kundali & Horoscope
            </Link>

            <Link to="/astrologers" style={{
              color: isActive('/astrologers') ? 'var(--color-accent-gold)' : 'var(--color-text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500
            }}>
              <Calendar size={18} /> Book Astrologer
            </Link>

            <Link to="/remedies" style={{
              color: isActive('/remedies') ? 'var(--color-accent-gold)' : 'var(--color-text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500
            }}>
              <ShoppingBag size={18} /> Pujas & Remedies
            </Link>

            <Link to="/navamsa" style={{
              color: isActive('/navamsa') ? 'var(--color-accent-gold)' : 'var(--color-text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500
            }}>
              <Grid3X3 size={18} /> Navamsa (D9)
            </Link>

            <Link to="/dasha" style={{
              color: isActive('/dasha') ? 'var(--color-accent-gold)' : 'var(--color-text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500
            }}>
              <Clock size={18} /> Dasha
            </Link>

            {isAuthenticated && (
              <Link to="/consultation/active" style={{
                color: isActive('/consultation/active') ? 'var(--color-accent-gold)' : 'var(--color-text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 500
              }}>
                <MessageSquare size={18} /> Live Session
              </Link>
            )}

            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link to="/admin" style={{
                color: isActive('/admin') ? 'var(--color-accent-gold)' : 'var(--color-text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 500
              }}>
                <ShieldAlert size={18} /> Admin
              </Link>
            )}
          </div>

          {/* Auth Button */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid var(--color-border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User size={16} color="var(--color-accent-gold)" />
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                    {user?.name || 'User'}
                  </span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="btn-outline" 
                  style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="btn-gold" 
                style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
              >
                <LogIn size={14} /> Login / Register
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: '1 0 auto', padding: '40px 0' }}>
        <div className="layout-container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: 'rgba(5, 6, 15, 0.95)',
        borderTop: '1px solid var(--color-border-glass)',
        padding: '40px 0',
        flexShrink: 0,
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        fontSize: '0.9rem'
      }}>
        <div className="layout-container">
          <p style={{ fontFamily: 'var(--font-heading)', color: '#ffffff', fontSize: '1.2rem', letterSpacing: '0.1em', marginBottom: '16px' }}>
            VEDAASTRO
          </p>
          <p style={{ maxWidth: '600px', margin: '0 auto 24px', fontSize: '0.85rem', lineHeight: '1.5' }}>
            Disclaimer: Astrology is a matter of belief and science of planetary influences. The calculations are based on standard mathematical systems, but predictions are indicators rather than absolute certainties.
          </p>
          <div style={{ height: '1px', background: 'var(--color-border-glass)', margin: '20px 0' }}></div>
          <p>© {new Date().getFullYear()} VedaAstro Platform. All rights reserved. Designed for Top Management Review.</p>
        </div>
      </footer>
    </div>
  );
};
