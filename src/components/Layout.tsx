import React from 'react';
// HIDDEN NAV — uncomment when re-enabling menu groups
// import { Link, useNavigate } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { type RootState, logout } from '../store';
// import { Compass, Calendar, ShoppingBag, MessageSquare, ShieldAlert, LogOut, LogIn, User, ChevronDown, Sun } from 'lucide-react';

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
  // HIDDEN NAV — uncomment when re-enabling nav bar
  // const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const location = useLocation();
  // const [openMenu, setOpenMenu] = useState<string | null>(null);
  // const handleLogout = () => { dispatch(logout()); navigate('/login'); };
  // const isActive = (path: string) => location.pathname === path;
  // const groupActive = (links: { to: string }[]) => links.some(l => isActive(l.to));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

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


