import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// HIDDEN NAV — uncomment when re-enabling menu groups
// import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, logout } from '../store';
// HIDDEN NAV — uncomment these imports when re-enabling menu groups (see docs/hidden-menu-items.md)
// import { Compass, Calendar, ShoppingBag, MessageSquare, ShieldAlert, LogOut, LogIn, User, ChevronDown, Sun } from 'lucide-react';
import { Compass, LogOut, LogIn, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

/* HIDDEN NAV_GROUPS — uncomment when re-enabling menu dropdowns (see docs/hidden-menu-items.md)
const NAV_GROUPS = [
  {
    label: 'Kundali', icon: <Compass size={16} />,
    links: [
      { to: '/', label: 'Birth Chart (Kundali)' },
      { to: '/navamsa', label: 'Navamsa (D9) Chart' },
      { to: '/divisional-charts', label: 'Divisional Charts (D3/D7/D10)' },
      { to: '/dasha', label: 'Vimshottari Dasha' },
      { to: '/transit-report', label: 'Transit Report' },
      { to: '/planetary-aspects', label: 'Planetary Aspects' },
      { to: '/ashtakavarga', label: 'Ashtakavarga' },
      { to: '/varshphal', label: 'Varshphal (Solar Return)' },
      { to: '/ascendant-moon-sign', label: 'Ascendant & Moon Sign' },
      { to: '/nakshatra-finder', label: 'Nakshatra Finder' },
      { to: '/nakshatra-encyclopedia', label: 'Nakshatra Encyclopedia' },
      { to: '/atmakaraka', label: 'Atmakaraka' },
      { to: '/ishta-devta', label: 'Ishta Devta' },
      { to: '/dhan-yoga', label: 'Dhan Yoga' },
      { to: '/baby-name', label: 'Baby Name Suggestion' },
    ],
  },
  {
    label: 'Doshas', icon: <ShieldAlert size={16} />,
    links: [
      { to: '/manglik-dosha', label: 'Manglik Dosha' },
      { to: '/kaal-sarp-dosha', label: 'Kaal Sarp Dosha' },
      { to: '/sade-sati', label: 'Sade Sati' },
      { to: '/pitra-dosha', label: 'Pitra Dosha' },
    ],
  },
  {
    label: 'Remedies', icon: <ShoppingBag size={16} />,
    links: [
      { to: '/find-my-gemstone', label: 'Find My Gemstone' },
      { to: '/rudraksha-suggestion', label: 'Rudraksha Suggestion' },
      { to: '/remedies', label: 'Pujas & Remedies Shop' },
    ],
  },
  {
    label: 'Horoscope', icon: <Sun size={16} />,
    links: [
      { to: '/horoscope', label: 'Daily / Weekly / Monthly / Yearly' },
      { to: '/numerology', label: 'Numerology Calculator' },
      { to: '/name-correction', label: 'Name Correction' },
      { to: '/biorhythm', label: 'Biorhythm Calculator' },
      { to: '/love-compatibility', label: 'Love Compatibility' },
      { to: '/kundali-report', label: 'Download Kundali PDF' },
      { to: '/ai-reading', label: '✨ AI Chart Reading' },
    ],
  },
  {
    label: 'Consult', icon: <Calendar size={16} />,
    links: [
      { to: '/astrologers', label: 'Book Astrologer' },
      { to: '/kundali-matching', label: 'Kundali Matching' },
      { to: '/panchang', label: 'Daily Panchang' },
      { to: '/hora-muhurta', label: 'Hora Muhurta' },
      { to: '/chaughadiya', label: 'Chaughadiya' },
      { to: '/yogini-dasha', label: 'Yogini Dasha' },
      { to: '/festival-calendar', label: 'Festival Calendar 2026' },
      { to: '/festival-calendar', label: 'Festival Calendar 2026' },
    ],
  },
];
*/

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // HIDDEN NAV — uncomment when re-enabling menu groups
  // const location = useLocation();
  // HIDDEN NAV — uncomment when re-enabling menu groups
  // const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };
  // HIDDEN NAV — uncomment when re-enabling menu groups
  // const isActive = (path: string) => location.pathname === path;
  // const groupActive = (links: { to: string }[]) => links.some(l => isActive(l.to));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <nav style={{
        background: 'rgba(5, 6, 15, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border-glass)',
        position: 'sticky', top: 0, zIndex: 100, padding: '14px 0'
      }}>
        <div className="layout-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Brand */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #d4af37 0%, #b38f1d 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 15px rgba(212,175,55,0.4)'
            }}>
              <Compass size={22} color="#05060f" />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 'bold', color: '#fff', letterSpacing: '0.1em' }}>VEDAASTRO</span>
          </Link>

          {/* HIDDEN NAV GROUPS — see docs/hidden-menu-items.md for the full inventory.
             To re-enable, uncomment the block below and optionally filter NAV_GROUPS. */}
          {/*
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {NAV_GROUPS.map(group => (
              <div key={group.label} style={{ position: 'relative' }}
                onMouseEnter={() => setOpenMenu(group.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '5px',
                  color: groupActive(group.links) ? 'var(--color-accent-gold)' : 'var(--color-text-main)',
                  fontWeight: 500, fontSize: '0.9rem', padding: '8px 12px', borderRadius: '6px',
                  transition: 'color 0.2s'
                }}>
                  {group.icon} {group.label} <ChevronDown size={13} />
                </button>
                {openMenu === group.label && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, minWidth: '210px',
                    background: 'rgba(8,9,20,0.97)', border: '1px solid var(--color-border-glass)',
                    borderRadius: '10px', padding: '6px', zIndex: 200,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                  }}>
                    {group.links.map(link => (
                      <Link key={link.to} to={link.to} style={{
                        display: 'block', padding: '9px 14px', borderRadius: '6px',
                        color: isActive(link.to) ? 'var(--color-accent-gold)' : 'var(--color-text-main)',
                        background: isActive(link.to) ? 'rgba(212,175,55,0.08)' : 'transparent',
                        fontSize: '0.88rem', fontWeight: isActive(link.to) ? 600 : 400,
                        transition: 'background 0.15s'
                      }}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isAuthenticated && (
              <Link to="/consultation/active" style={{
                color: isActive('/consultation/active') ? 'var(--color-accent-gold)' : 'var(--color-text-main)',
                display: 'flex', alignItems: 'center', gap: '5px',
                fontWeight: 500, fontSize: '0.9rem', padding: '8px 12px'
              }}>
                <MessageSquare size={16} /> Live Session
              </Link>
            )}

            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link to="/admin" style={{
                color: isActive('/admin') ? 'var(--color-accent-gold)' : 'var(--color-text-main)',
                display: 'flex', alignItems: 'center', gap: '5px',
                fontWeight: 500, fontSize: '0.9rem', padding: '8px 12px'
              }}>
                <ShieldAlert size={16} /> Admin
              </Link>
            )}
          </div>
          */}

          {/* Auth */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--color-border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={14} color="var(--color-accent-gold)" />
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-main)' }}>{user?.name || 'User'}</span>
                </div>
                <button onClick={handleLogout} className="btn-outline" style={{ padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem' }}>
                  <LogOut size={13} /> Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-gold" style={{ padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem' }}>
                <LogIn size={13} /> Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main style={{ flex: '1 0 auto', padding: '40px 0' }}>
        <div className="layout-container">{children}</div>
      </main>

      <footer style={{
        background: 'rgba(5,6,15,0.95)', borderTop: '1px solid var(--color-border-glass)',
        padding: '40px 0', flexShrink: 0, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem'
      }}>
        <div className="layout-container">
          <p style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1.2rem', letterSpacing: '0.1em', marginBottom: '16px' }}>VEDAASTRO</p>
          <p style={{ maxWidth: '600px', margin: '0 auto 24px', fontSize: '0.85rem', lineHeight: '1.5' }}>
            Disclaimer: Astrology is a matter of belief and science of planetary influences. Calculations are based on standard mathematical systems; predictions are indicators rather than certainties.
          </p>
          <div style={{ height: '1px', background: 'var(--color-border-glass)', margin: '20px 0' }} />
          <p>© {new Date().getFullYear()} VedaAstro Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};


