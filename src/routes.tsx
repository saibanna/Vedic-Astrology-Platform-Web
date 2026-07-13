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
// Phase 1
import { FindMyGemstone } from './pages/FindMyGemstone';
import { ManglikDosha } from './pages/ManglikDosha';
import { KaalSarpDosha } from './pages/KaalSarpDosha';
import { SadeSati } from './pages/SadeSati';
import { PitraDosha } from './pages/PitraDosha';
import { NakshatraFinder } from './pages/NakshatraFinder';
import { BasicDetails } from './pages/BasicDetails';
import { Atmakaraka } from './pages/Atmakaraka';
import { RudrakshaFinder } from './pages/RudrakshaFinder';
// Phase 2
import { KundaliMatching } from './pages/KundaliMatching';
import { Panchang } from './pages/Panchang';
import { YoginiDasha } from './pages/YoginiDasha';
// Phase 3
import { Horoscope } from './pages/Horoscope';
import { Numerology } from './pages/Numerology';
import { Biorhythm } from './pages/Biorhythm';
import { KundaliReport } from './pages/KundaliReport';
// Remaining features
import { HoraMuhurta } from './pages/HoraMuhurta';
import { Chaughadiya } from './pages/Chaughadiya';
import { NameCorrection } from './pages/NameCorrection';
import { DhanYoga } from './pages/DhanYoga';
import { IshtaDevta } from './pages/IshtaDevta';
// Final features
import { TransitReport } from './pages/TransitReport';
import { LoveCompatibility } from './pages/LoveCompatibility';
import { BabyName } from './pages/BabyName';
import { AIInterpretation } from './pages/AIInterpretation';
// New features
import { DivisionalCharts } from './pages/DivisionalCharts';
import { Ashtakavarga } from './pages/Ashtakavarga';
import { Varshphal } from './pages/Varshphal';
import { PlanetaryAspects } from './pages/PlanetaryAspects';
import { NakshatraEncyclopedia } from './pages/NakshatraEncyclopedia';
import { FestivalCalendar } from './pages/FestivalCalendar';
import { ProfileManager } from './pages/ProfileManager';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  return isAuthenticated && user?.role === 'ADMIN' ? children : <Navigate to="/" replace />;
};

export const AppRoutes: React.FC = () => (
  <Layout>
    <Routes>
      {/* Core */}
      <Route path="/" element={<Home />} />
      <Route path="/astrologers" element={<Astrologers />} />
      <Route path="/remedies" element={<Remedies />} />
      <Route path="/navamsa" element={<NavamsaChart />} />
      <Route path="/dasha" element={<Dasha />} />
      <Route path="/login" element={<Login />} />

      {/* Phase 1 — Calculators & Doshas */}
      <Route path="/find-my-gemstone" element={<FindMyGemstone />} />
      <Route path="/manglik-dosha" element={<ManglikDosha />} />
      <Route path="/kaal-sarp-dosha" element={<KaalSarpDosha />} />
      <Route path="/sade-sati" element={<SadeSati />} />
      <Route path="/pitra-dosha" element={<PitraDosha />} />
      <Route path="/nakshatra-finder" element={<NakshatraFinder />} />
      <Route path="/ascendant-moon-sign" element={<BasicDetails />} />
      <Route path="/atmakaraka" element={<Atmakaraka />} />
      <Route path="/rudraksha-suggestion" element={<RudrakshaFinder />} />

      {/* Phase 2 — Matching, Panchang, Yogini */}
      <Route path="/kundali-matching" element={<KundaliMatching />} />
      <Route path="/panchang" element={<Panchang />} />
      <Route path="/yogini-dasha" element={<YoginiDasha />} />

      {/* Phase 3 — Horoscope, Numerology, Biorhythm, PDF */}
      <Route path="/horoscope" element={<Horoscope />} />
      <Route path="/numerology" element={<Numerology />} />
      <Route path="/biorhythm" element={<Biorhythm />} />
      <Route path="/kundali-report" element={<KundaliReport />} />
      <Route path="/hora-muhurta" element={<HoraMuhurta />} />
      <Route path="/chaughadiya" element={<Chaughadiya />} />
      <Route path="/name-correction" element={<NameCorrection />} />
      <Route path="/dhan-yoga" element={<DhanYoga />} />
      <Route path="/ishta-devta" element={<IshtaDevta />} />
      <Route path="/transit-report" element={<TransitReport />} />
      <Route path="/love-compatibility" element={<LoveCompatibility />} />
      <Route path="/baby-name" element={<BabyName />} />
      <Route path="/ai-reading" element={<AIInterpretation />} />
      <Route path="/divisional-charts" element={<DivisionalCharts />} />
      <Route path="/ashtakavarga" element={<Ashtakavarga />} />
      <Route path="/varshphal" element={<Varshphal />} />
      <Route path="/planetary-aspects" element={<PlanetaryAspects />} />
      <Route path="/nakshatra-encyclopedia" element={<NakshatraEncyclopedia />} />
      <Route path="/festival-calendar" element={<FestivalCalendar />} />

      {/* Protected */}
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/consultation/:sessionId" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
      <Route path="/profiles" element={<ProtectedRoute><ProfileManager /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Layout>
);
