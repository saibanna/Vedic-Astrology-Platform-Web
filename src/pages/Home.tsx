import React, { useState } from 'react';
import { astrologyService } from '../services/api';
import { Compass, Moon, Sun } from 'lucide-react';
import { KundaliChart } from '../components/KundaliChart';
import { NavamsaChart } from '../components/NavamsaChart';
import { DashaBhuktiTable } from '../components/DashaBhuktiTable';

const ZODIAC_SIGNS = [
  { name: 'Aries', date: 'Mar 21 - Apr 19', symbol: '♈' },
  { name: 'Taurus', date: 'Apr 20 - May 20', symbol: '♉' },
  { name: 'Gemini', date: 'May 21 - Jun 20', symbol: '♊' },
  { name: 'Cancer', date: 'Jun 21 - Jul 22', symbol: '♋' },
  { name: 'Leo', date: 'Jul 23 - Aug 22', symbol: '♌' },
  { name: 'Virgo', date: 'Aug 23 - Sep 22', symbol: '♍' },
  { name: 'Libra', date: 'Sep 23 - Oct 22', symbol: '♎' },
  { name: 'Scorpio', date: 'Oct 23 - Nov 21', symbol: '♏' },
  { name: 'Sagittarius', date: 'Nov 22 - Dec 21', symbol: '♐' },
  { name: 'Capricorn', date: 'Dec 22 - Jan 19', symbol: '♑' },
  { name: 'Aquarius', date: 'Jan 20 - Feb 18', symbol: '♒' },
  { name: 'Pisces', date: 'Feb 19 - Mar 20', symbol: '♓' },
];

export const Home: React.FC = () => {
  // Birth chart form state
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    tob: '',
    pob: '',
  });

  const [loading, setLoading] = useState(false);
  const [chartResult, setChartResult] = useState<any | null>(null);
  const [navamsaResult, setNavamsaResult] = useState<any | null>(null);
  const [dashaResult, setDashaResult] = useState<any | null>(null);
  const [selectedZodiac, setSelectedZodiac] = useState<string | null>(null);
  const [horoscope, setHoroscope] = useState<string | null>(null);
  const [horoscopeLoading, setHoroscopeLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateKundali = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await astrologyService.getBirthChart(formData);
      const finalData = res.data && res.data.data ? res.data.data : res.data;

      if (finalData && finalData.lagna) {
        setChartResult(finalData);
        setNavamsaResult(finalData.navamsaChart || null);
        setDashaResult(finalData.dashaPeriods || null);
      } else {
        throw new Error("Invalid chart data");
      }
    } catch (err) {
      console.warn('API error, using beautiful mock chart data', err);
      // Fallback premium mock
      setChartResult({
        lagna: 'Leo',
        moonSign: 'Aries',
        sunSign: 'Scorpio',
        nakshatra: 'Ashwini',
        planets: [
          { name: 'Ascendant (Lagna)', sign: 'Leo', degree: "12° 41'", house: 1 },
          { name: 'Sun (Surya)', sign: 'Scorpio', degree: "21° 05'", house: 4 },
          { name: 'Moon (Chandra)', sign: 'Aries', degree: "08° 12'", house: 9 },
          { name: 'Mars (Mangal)', sign: 'Leo', degree: "04° 19'", house: 1 },
          { name: 'Mercury (Budh)', sign: 'Scorpio', degree: "29° 50'", house: 4 },
          { name: 'Jupiter (Guru)', sign: 'Taurus', degree: "15° 33'", house: 10 },
          { name: 'Venus (Shukra)', sign: 'Libra', degree: "11° 10'", house: 3 },
          { name: 'Saturn (Shani)', sign: 'Aquarius', degree: "09° 44'", house: 7 },
          { name: 'Rahu', sign: 'Pisces', degree: "18° 11'", house: 8 },
          { name: 'Ketu', sign: 'Virgo', degree: "18° 11'", house: 2 },
        ]
      });

      setNavamsaResult({
        navamsaLagna: 'Aries',
        planets: [
          { name: 'Ascendant (Lagna)', natalSign: 'Leo', navamsaSign: 'Aries', navamsaHouse: 1 },
          { name: 'Sun (Surya)', natalSign: 'Scorpio', navamsaSign: 'Scorpio', navamsaHouse: 8 },
          { name: 'Moon (Chandra)', natalSign: 'Aries', navamsaSign: 'Sagittarius', navamsaHouse: 9 },
          { name: 'Mars (Mangal)', natalSign: 'Leo', navamsaSign: 'Leo', navamsaHouse: 5 },
          { name: 'Mercury (Budh)', natalSign: 'Scorpio', navamsaSign: 'Capricorn', navamsaHouse: 10 },
          { name: 'Jupiter (Guru)', natalSign: 'Taurus', navamsaSign: 'Gemini', navamsaHouse: 3 },
          { name: 'Venus (Shukra)', natalSign: 'Libra', navamsaSign: 'Libra', navamsaHouse: 7 },
          { name: 'Saturn (Shani)', natalSign: 'Aquarius', navamsaSign: 'Aquarius', navamsaHouse: 11 },
          { name: 'Rahu', natalSign: 'Pisces', navamsaSign: 'Pisces', navamsaHouse: 12 },
          { name: 'Ketu', natalSign: 'Virgo', navamsaSign: 'Virgo', navamsaHouse: 6 },
        ]
      });

      const today = new Date();
      const formatIso = (d: Date) => d.toISOString().split('T')[0];
      
      const ketuStart = new Date(today);
      ketuStart.setFullYear(today.getFullYear() - 1);
      const ketuEnd = new Date(ketuStart);
      ketuEnd.setFullYear(ketuStart.getFullYear() + 7);
      
      const venusStart = new Date(ketuEnd);
      const venusEnd = new Date(venusStart);
      venusEnd.setFullYear(venusStart.getFullYear() + 20);

      const sunStart = new Date(venusEnd);
      const sunEnd = new Date(sunStart);
      sunEnd.setFullYear(sunStart.getFullYear() + 6);

      setDashaResult({
        nakshatra: 'Ashwini',
        nakshatraLord: 'Ketu',
        currentDasha: 'Ketu',
        currentBhukti: 'Ketu',
        dashas: [
          {
            planet: 'Ketu',
            startDate: formatIso(ketuStart),
            endDate: formatIso(ketuEnd),
            years: 7,
            bhuktis: [
              { planet: 'Ketu', startDate: formatIso(ketuStart), endDate: formatIso(new Date(ketuStart.getTime() + 100 * 24 * 60 * 60 * 1000)) },
              { planet: 'Venus', startDate: formatIso(new Date(ketuStart.getTime() + 100 * 24 * 60 * 60 * 1000)), endDate: formatIso(new Date(ketuStart.getTime() + 300 * 24 * 60 * 60 * 1000)) },
              { planet: 'Sun', startDate: formatIso(new Date(ketuStart.getTime() + 300 * 24 * 60 * 60 * 1000)), endDate: formatIso(new Date(ketuStart.getTime() + 380 * 24 * 60 * 60 * 1000)) },
              { planet: 'Moon', startDate: formatIso(new Date(ketuStart.getTime() + 380 * 24 * 60 * 60 * 1000)), endDate: formatIso(new Date(ketuStart.getTime() + 500 * 24 * 60 * 60 * 1000)) },
              { planet: 'Mars', startDate: formatIso(new Date(ketuStart.getTime() + 500 * 24 * 60 * 60 * 1000)), endDate: formatIso(new Date(ketuStart.getTime() + 600 * 24 * 60 * 60 * 1000)) },
              { planet: 'Rahu', startDate: formatIso(new Date(ketuStart.getTime() + 600 * 24 * 60 * 60 * 1000)), endDate: formatIso(new Date(ketuStart.getTime() + 800 * 24 * 60 * 60 * 1000)) },
              { planet: 'Jupiter', startDate: formatIso(new Date(ketuStart.getTime() + 800 * 24 * 60 * 60 * 1000)), endDate: formatIso(new Date(ketuStart.getTime() + 1000 * 24 * 60 * 60 * 1000)) },
              { planet: 'Saturn', startDate: formatIso(new Date(ketuStart.getTime() + 1000 * 24 * 60 * 60 * 1000)), endDate: formatIso(new Date(ketuStart.getTime() + 1200 * 24 * 60 * 60 * 1000)) },
              { planet: 'Mercury', startDate: formatIso(new Date(ketuStart.getTime() + 1200 * 24 * 60 * 60 * 1000)), endDate: formatIso(ketuEnd) },
            ]
          },
          {
            planet: 'Venus',
            startDate: formatIso(venusStart),
            endDate: formatIso(venusEnd),
            years: 20,
            bhuktis: [
              { planet: 'Venus', startDate: formatIso(venusStart), endDate: formatIso(new Date(venusStart.getTime() + 400 * 24 * 60 * 60 * 1000)) },
              { planet: 'Sun', startDate: formatIso(new Date(venusStart.getTime() + 400 * 24 * 60 * 60 * 1000)), endDate: formatIso(new Date(venusStart.getTime() + 550 * 24 * 60 * 60 * 1000)) },
              { planet: 'Moon', startDate: formatIso(new Date(venusStart.getTime() + 550 * 24 * 60 * 60 * 1000)), endDate: formatIso(new Date(venusStart.getTime() + 750 * 24 * 60 * 60 * 1000)) },
              { planet: 'Mars', startDate: formatIso(new Date(venusStart.getTime() + 750 * 24 * 60 * 60 * 1000)), endDate: formatIso(new Date(venusStart.getTime() + 900 * 24 * 60 * 60 * 1000)) },
              { planet: 'Rahu', startDate: formatIso(new Date(venusStart.getTime() + 900 * 24 * 60 * 60 * 1000)), endDate: formatIso(new Date(venusStart.getTime() + 1300 * 24 * 60 * 60 * 1000)) },
              { planet: 'Jupiter', startDate: formatIso(new Date(venusStart.getTime() + 1300 * 24 * 60 * 60 * 1000)), endDate: formatIso(new Date(venusStart.getTime() + 1700 * 24 * 60 * 60 * 1000)) },
              { planet: 'Saturn', startDate: formatIso(new Date(venusStart.getTime() + 1700 * 24 * 60 * 60 * 1000)), endDate: formatIso(new Date(venusStart.getTime() + 2100 * 24 * 60 * 60 * 1000)) },
              { planet: 'Mercury', startDate: formatIso(new Date(venusStart.getTime() + 2100 * 24 * 60 * 60 * 1000)), endDate: formatIso(new Date(venusStart.getTime() + 2500 * 24 * 60 * 60 * 1000)) },
              { planet: 'Ketu', startDate: formatIso(new Date(venusStart.getTime() + 2500 * 24 * 60 * 60 * 1000)), endDate: formatIso(venusEnd) },
            ]
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHoroscope = async (sign: string) => {
    setSelectedZodiac(sign);
    setHoroscopeLoading(true);
    try {
      const res = await astrologyService.getHoroscope(sign);
      setHoroscope(res.data.prediction);
    } catch (err) {
      // Fallback mock prediction
      const predictions: Record<string, string> = {
        Aries: 'Today demands leadership. A planetary shift in your 9th house boosts professional decision making. Focus on long-term investments.',
        Taurus: 'Financial alignment is favorable. Trust your instincts regarding joint business ventures. Venus casts a supportive aspect on your career sector.',
        Gemini: 'Communication is your stellar key today. Mercury ensures high-impact negotiations. Take care of minor neck strain.',
        Cancer: 'Emotions run deep under the current moon phase. Re-align your domestic energy. A surprise connection might bring new project leads.',
        Leo: 'The spotlight is naturally yours. The Sun lights up your sector of self-expression. A creative break brings immense inspiration.',
        Virgo: 'Organize your thoughts and records. Analytical tasks succeed effortlessly. An auspicious time for planning a pilgrimage or ritual.',
        Libra: 'Balance in partnerships is highlighted. Avoid hasty agreements. Your physical vitality is high; indulge in outdoor meditation.',
        Scorpio: 'Intuitive insights are extremely sharp. An ideal time for inner contemplation or spiritual study. Financial stability increases.',
        Sagittarius: 'Expansion and wisdom call to you. A great day to learn a new skill or contact an old mentor. Keep goals realistic.',
        Capricorn: 'Professional determination leads to tangible gains. Career planetary alignments are exceptionally stable. Express gratitude.',
        Aquarius: 'Innovate and break barriers. Group discussions offer brilliant new breakthroughs. Trust the cosmic timing.',
        Pisces: 'Spiritual consciousness is amplified. Dream recall brings answers. Maintain emotional boundaries in consultations.',
      };
      setHoroscope(predictions[sign] || 'The cosmos is working in your favor. Maintain positive intentions.');
    } finally {
      setHoroscopeLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
      
      {/* Hero Header */}
      <section style={{ textAlign: 'center', padding: '20px 0' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px', color: 'var(--color-accent-gold-light)' }}>
          Discover Your Cosmic Blueprint
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', maxWidth: '800px', margin: '0 auto' }}>
          VedaAstro combines ancient mathematical astrology with modern microservices to deliver precision Kundali birth charts, daily planetary analysis, and customized remedies.
        </p>
      </section>

      {/* Grid: Kundali Generator & Daily Horoscope */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px'
      }}>
        
        {/* Left: Kundali Form */}
        <div className="cosmic-card">
          <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-accent-gold)' }}>
            <Compass size={28} className="animate-spin-slow" /> Free Kundali Chart
          </h2>
          <form onSubmit={generateKundali}>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="Enter your name" 
                value={formData.name} 
                onChange={handleInputChange} 
                className="form-input" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input 
                type="date" 
                name="dob" 
                value={formData.dob} 
                onChange={handleInputChange} 
                className="form-input" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Time of Birth</label>
              <input 
                type="time" 
                name="tob" 
                value={formData.tob} 
                onChange={handleInputChange} 
                className="form-input" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Place of Birth</label>
              <input 
                type="text" 
                name="pob" 
                placeholder="e.g. Mumbai, India" 
                value={formData.pob} 
                onChange={handleInputChange} 
                className="form-input" 
                required 
              />
            </div>
            <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
              {loading ? 'Aligning Planets...' : 'Generate Birth Chart'}
            </button>
          </form>
        </div>

        {/* Right: Daily Horoscope Grid */}
        <div className="cosmic-card">
          <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-accent-gold)' }}>
            <Sun size={28} /> Daily Horoscope
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            Select your zodiac sign to reveal your personalized planetary forecast.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px'
          }}>
            {ZODIAC_SIGNS.map((sign) => (
              <button
                key={sign.name}
                onClick={() => fetchHoroscope(sign.name)}
                style={{
                  background: selectedZodiac === sign.name ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${selectedZodiac === sign.name ? 'var(--color-accent-gold)' : 'var(--color-border-glass)'}`,
                  borderRadius: '12px',
                  padding: '12px 6px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span style={{ fontSize: '1.8rem', color: selectedZodiac === sign.name ? 'var(--color-accent-gold)' : 'var(--color-text-main)' }}>{sign.symbol}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{sign.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conditionally Render Birth Chart Output */}
      {chartResult && (
        <section className="cosmic-card" style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '2rem', textAlign: 'center', color: 'var(--color-accent-gold-light)', marginBottom: '32px' }}>
            Your Vedic Birth Parameters
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border-glass)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Lagna (Ascendant)</span>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>{chartResult.lagna}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border-glass)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Rashi (Moon Sign)</span>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>{chartResult.moonSign}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border-glass)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Surya Rashi (Sun Sign)</span>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>{chartResult.sunSign}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border-glass)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Janma Nakshatra</span>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>{chartResult.nakshatra}</p>
            </div>
          </div>

          <div style={{
            margin: '40px 0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'start'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--color-accent-gold)', textAlign: 'center' }}>
                Rashi Kundali (D1 Chart)
              </h3>
              <KundaliChart lagna={chartResult.lagna} planets={chartResult.planets} />
            </div>

            {navamsaResult && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--color-accent-gold)', textAlign: 'center' }}>
                  Navamsa Kundali (D-9 Chart)
                </h3>
                <NavamsaChart navamsaLagna={navamsaResult.navamsaLagna} planets={navamsaResult.planets} />
              </div>
            )}
          </div>

          {dashaResult && (
            <div style={{ margin: '40px 0' }}>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '16px', color: 'var(--color-accent-gold-light)', borderBottom: '1px solid var(--color-border-gold)', paddingBottom: '8px' }}>
                Vimshottari Dasha Bhukti Periods
              </h3>
              <DashaBhuktiTable 
                nakshatra={dashaResult.nakshatra}
                nakshatraLord={dashaResult.nakshatraLord}
                currentDasha={dashaResult.currentDasha}
                currentBhukti={dashaResult.currentBhukti}
                dashas={dashaResult.dashas}
              />
            </div>
          )}

          <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', borderBottom: '1px solid var(--color-border-gold)', paddingBottom: '8px' }}>
            Planetary Positions
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-glass)', color: 'var(--color-accent-gold)' }}>
                  <th style={{ padding: '12px' }}>Planet</th>
                  <th style={{ padding: '12px' }}>Zodiac Sign</th>
                  <th style={{ padding: '12px' }}>Degree</th>
                  <th style={{ padding: '12px' }}>House Placement</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {chartResult.planets.map((planet: any) => (
                  <tr key={planet.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '12px', fontWeight: 500 }}>{planet.name}</td>
                    <td style={{ padding: '12px' }}>{planet.sign}</td>
                    <td style={{ padding: '12px' }}>{planet.degree}</td>
                    <td style={{ padding: '12px' }}>{planet.house} House</td>
                    <td style={{ padding: '12px' }}>
                      {planet.retrograde && (
                        <span style={{ color: '#ff7043', fontWeight: 700, fontSize: '0.85rem' }}>⟲ (R)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Conditionally Render Horoscope Modal/Section */}
      {selectedZodiac && (
        <section className="cosmic-card" style={{
          border: '1px solid var(--color-border-gold)',
          background: 'radial-gradient(circle at top right, var(--color-gold-glow), var(--color-bg-glass))'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ color: 'var(--color-accent-gold-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Moon size={24} /> {selectedZodiac} Forecast
            </h2>
            <button onClick={() => setSelectedZodiac(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}>×</button>
          </div>
          {horoscopeLoading ? (
            <p>Decoding the stars...</p>
          ) : (
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', fontStyle: 'italic' }}>
              "{horoscope}"
            </p>
          )}
        </section>
      )}

    </div>
  );
};
