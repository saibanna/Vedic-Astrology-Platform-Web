import React, { useState, useEffect, useRef } from 'react';
import { astrologyService, calculatorService, masterDataService } from '../services/api';
import { Compass, Moon, Sun, Search, ShieldAlert, Gem, Star, TrendingUp, Sparkles, Clock, Loader, Scroll } from 'lucide-react';
import { KundaliChart } from '../components/KundaliChart';
import { NavamsaChart } from '../components/NavamsaChart';
import { DashaBhuktiTable } from '../components/DashaBhuktiTable';
import { HousePredictions } from '../components/HousePredictions';

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
    lat: '',
    lon: '',
    tzone: '5.5'
  });

  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [chartResult, setChartResult] = useState<any | null>(null);
  const [navamsaResult, setNavamsaResult] = useState<any | null>(null);
  const [dashaResult, setDashaResult] = useState<any | null>(null);
  const [selectedZodiac, setSelectedZodiac] = useState<string | null>(null);
  const [horoscope, setHoroscope] = useState<string | null>(null);
  const [horoscopeLoading, setHoroscopeLoading] = useState(false);

  // Feature flags
  const [activeFeatures, setActiveFeatures] = useState<Record<string, boolean>>({
    birth_chart: true,
    navamsa_chart: true,
    dasha: true,
  });

  useEffect(() => {
    const loadActiveFeatures = async () => {
      try {
        const res = await masterDataService.getByCategory('FEATURE');
        const activeMap: Record<string, boolean> = {
          birth_chart: false,
          navamsa_chart: false,
          dasha: false,
        };
        res.data.forEach(feat => {
          if (feat.code === 'birth_chart' || feat.code === 'navamsa_chart' || feat.code === 'dasha') {
            activeMap[feat.code] = feat.isActive;
          }
        });
        setActiveFeatures(activeMap);
      } catch (err) {
        console.error('Failed to fetch active feature flags', err);
      }
    };
    loadActiveFeatures();
  }, []);

  // Calculator results — loaded after chart generation
  const [activeTab, setActiveTab] = useState('chart');
  const [calcData, setCalcData] = useState<Record<string, any>>({});
  const [calcLoading, setCalcLoading] = useState<Record<string, boolean>>({});

  const loadCalc = async (tab: string, input: any) => {
    if (calcData[tab]) return; // already loaded
    setCalcLoading(l => ({ ...l, [tab]: true }));
    try {
      let res: any;
      if (tab === 'doshas') {
        const [manglik, kaalSarp, sadeSati, pitraDosha] = await Promise.allSettled([
          calculatorService.manglik(input),
          calculatorService.kaalSarp(input),
          calculatorService.sadeSati(input),
          calculatorService.pitraDosha(input),
        ]);
        res = {
          manglik:   manglik.status   === 'fulfilled' ? manglik.value.data   : null,
          kaalSarp:  kaalSarp.status  === 'fulfilled' ? kaalSarp.value.data  : null,
          sadeSati:  sadeSati.status  === 'fulfilled' ? sadeSati.value.data  : null,
          pitraDosha:pitraDosha.status === 'fulfilled' ? pitraDosha.value.data : null,
        };
      } else if (tab === 'gemstone') {
        res = (await calculatorService.nakshatra(input)).data; // reuse nakshatra endpoint to get moon sign
        const gemRes = await fetch(`/api/v1/astrology/calc/gemstone-suggestion`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...input, concern: 'General' })
        });
        res = await gemRes.json();
      } else if (tab === 'nakshatra') {
        const [nak, atma, ishta, dhan] = await Promise.allSettled([
          calculatorService.nakshatra(input),
          calculatorService.atmakaraka(input),
          calculatorService.ishtaDevta(input),
          calculatorService.dhanYoga(input),
        ]);
        res = {
          nakshatra:  nak.status   === 'fulfilled' ? nak.value.data   : null,
          atmakaraka: atma.status  === 'fulfilled' ? atma.value.data  : null,
          ishtaDevta: ishta.status === 'fulfilled' ? ishta.value.data : null,
          dhanYoga:   dhan.status  === 'fulfilled' ? dhan.value.data  : null,
        };
      } else if (tab === 'transit') {
        res = (await calculatorService.transitReport(input)).data;
      } else if (tab === 'rudraksha') {
        res = (await calculatorService.rudraksha(input)).data;
      } else if (tab === 'lalkitab') {
        res = (await calculatorService.lalkitab(input)).data;
      }
      setCalcData(d => ({ ...d, [tab]: res }));
    } catch { /* silent — tab shows error state */ }
    finally { setCalcLoading(l => ({ ...l, [tab]: false })); }
  };

  const switchTab = (tab: string, input: any) => {
    setActiveTab(tab);
    if (tab !== 'chart') loadCalc(tab, input);
  };

  const [geoSuggestions, setGeoSuggestions] = useState<any[]>([]);
  const [calcInput, setCalcInput] = useState<any>(null);
  const skipSearchRef = useRef(false);

  const geocodePob = async (query: string) => {
    if (!query.trim()) return;
    setGeoLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (data?.length) {
        setGeoSuggestions(data);
      } else {
        setGeoSuggestions([]);
      }
    } catch {
      setGeoSuggestions([]);
    } finally {
      setGeoLoading(false);
    }
  };

  const selectGeoSuggestion = (place: any) => {
    const lat = parseFloat(place.lat).toFixed(4);
    const lon = parseFloat(place.lon).toFixed(4);
    
    // Check if the location is in India to force UTC+5.5 (IST)
    const isIndia = place.address?.country_code === 'in' || 
                    place.display_name?.toLowerCase().includes('india');
    const tzVal = isIndia ? 5.5 : Math.round(parseFloat(lon) / 15 * 2) / 2;
    const tz  = tzVal.toFixed(1);

    const address = place.address || {};
    const primary = place.name || place.display_name.split(',')[0].trim();
    const state = address.state || address.region || address.province || '';
    const country = address.country || '';
    
    const labelParts = [primary];
    if (state && state.toLowerCase() !== primary.toLowerCase()) {
      labelParts.push(state);
    }
    if (country && country.toLowerCase() !== primary.toLowerCase()) {
      labelParts.push(country);
    }
    const label = labelParts.join(', ');

    skipSearchRef.current = true;
    setFormData(f => ({
      ...f,
      pob: label,
      lat,
      lon,
      tzone: tz,
    }));
    setGeoSuggestions([]);
  };

  useEffect(() => {
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }

    if (formData.pob.trim().length < 3) {
      setGeoSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      geocodePob(formData.pob);
    }, 600); // 600ms debounce

    return () => clearTimeout(timer);
  }, [formData.pob]);

  const generateKundali = async (e: React.FormEvent) => {
    e.preventDefault();
    setChartError(null);

    if (!formData.lat || !formData.lon) {
      setChartError('Latitude and Longitude are required. Click "Lookup" to auto-fill from your city, or enter them manually.');
      return;
    }

    setLoading(true);
    try {
      const res = await astrologyService.getBirthChart({
        name: formData.name,
        dob: formData.dob,
        tob: formData.tob,
        pob: formData.pob,
        lat: parseFloat(formData.lat),
        lon: parseFloat(formData.lon),
        tzone: parseFloat(formData.tzone),
      });
      const finalData = res.data?.data ?? res.data;
      if (!finalData?.lagna) throw new Error('Invalid chart data received from server.');
      setChartResult(finalData);
      setNavamsaResult(finalData.navamsaChart ?? null);
      setDashaResult(finalData.dashaPeriods ?? null);
      const input = {
        year: parseInt(formData.dob.split('-')[0]), month: parseInt(formData.dob.split('-')[1]),
        day: parseInt(formData.dob.split('-')[2]),
        hour: parseInt((formData.tob || '12:00').split(':')[0]),
        minute: parseInt((formData.tob || '12:00').split(':')[1]),
        lat: parseFloat(formData.lat), lon: parseFloat(formData.lon), tzone: parseFloat(formData.tzone),
      };
      setCalcInput(input);
      setCalcData({});  // reset so tabs reload fresh
      setActiveTab('chart');
    } catch (err: any) {
      const msg = err?.response?.data?.detail ?? err?.response?.data?.message ?? err?.message ?? 'Failed to generate chart.';
      setChartError(msg);
      setChartResult(null);
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'pob') {
      skipSearchRef.current = false;
      if (!e.target.value.trim()) {
        setGeoSuggestions([]);
      }
    }
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
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
          {!activeFeatures.birth_chart ? (
            <div style={{ padding: '30px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '12px',
                borderRadius: '50%',
                display: 'inline-flex'
              }}>
                <Compass size={36} />
              </div>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                The Free Birth Chart generation features are currently offline for scheduled maintenance. Please consult our astrologers directly or check back later!
              </p>
            </div>
          ) : (
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
            <div className="form-group" style={{ position: 'relative' }}>
              <label>Place of Birth</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="text" 
                  name="pob" 
                  placeholder="e.g. Mumbai, India" 
                  value={formData.pob} 
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ flex: 1, paddingRight: '40px' }}
                />
                <div style={{ position: 'absolute', right: '12px', display: 'flex', alignItems: 'center', color: 'var(--color-accent-gold)', opacity: 0.8 }}>
                  {geoLoading ? (
                    <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Search size={16} />
                  )}
                </div>
              </div>
              {geoSuggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 150,
                  background: 'rgba(10, 11, 28, 0.98)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--color-border-gold)',
                  borderRadius: '10px',
                  marginTop: '6px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.6)',
                  maxHeight: '260px',
                  overflowY: 'auto'
                }}>
                  {geoSuggestions.map((s, i) => {
                    const address = s.address || {};
                    const primary = s.name || s.display_name.split(',')[0].trim();
                    const state = address.state || address.region || address.province || '';
                    const country = address.country || '';
                    
                    const mainName = primary;
                    const secondaryParts = [];
                    if (state && state.toLowerCase() !== primary.toLowerCase()) {
                      secondaryParts.push(state);
                    }
                    if (country && country.toLowerCase() !== primary.toLowerCase()) {
                      secondaryParts.push(country);
                    }
                    const secondaryName = secondaryParts.join(', ');
                    
                    return (
                      <div
                        key={i}
                        onClick={() => selectGeoSuggestion(s)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          cursor: 'pointer',
                          borderBottom: i < geoSuggestions.length - 1 ? '1px solid var(--color-border-glass)' : 'none',
                          transition: 'background 0.2s ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(212,175,55,0.1)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'rgba(212, 175, 55, 0.12)',
                          flexShrink: 0
                        }}>
                          <span style={{ fontSize: '0.9rem' }}>📍</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0, flex: 1, justifyContent: 'center' }}>
                          <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
                            {mainName}
                          </span>
                          {secondaryName && (
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.76rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
                              {secondaryName}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Latitude</label>
                <input 
                  type="number" 
                  step="any"
                  name="lat" 
                  value={formData.lat} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Longitude</label>
                <input 
                  type="number" 
                  step="any"
                  name="lon" 
                  value={formData.lon} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Timezone</label>
                <input 
                  type="number" 
                  step="any"
                  name="tzone" 
                  value={formData.tzone} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  required 
                />
              </div>
            </div>
            <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
              {loading ? 'Aligning Planets...' : 'Generate Birth Chart'}
            </button>
            {chartError && (
              <div style={{ marginTop: '12px', padding: '12px', borderRadius: '8px', background: 'rgba(231,76,60,0.1)', border: '1px solid #e74c3c', color: '#e74c3c', fontSize: '0.9rem' }}>
                ⚠ {chartError}
              </div>
            )}
          </form>
          )}
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

      {/* Calculator Tabs */}
      {calcInput && (() => {
        const TABS = [
          { id: 'chart',    label: 'Charts & Dasha', icon: <Compass size={15} /> },
          { id: 'doshas',   label: 'Dosha Report',   icon: <ShieldAlert size={15} /> },
          { id: 'lalkitab', label: 'Lal Kitab Remedies', icon: <Scroll size={15} /> },
          { id: 'gemstone', label: 'Gemstone',        icon: <Gem size={15} /> },
          { id: 'nakshatra',label: 'Nakshatra & Yogas',icon: <Star size={15} /> },
          { id: 'transit',  label: 'Transit Report',  icon: <Clock size={15} /> },
          { id: 'rudraksha',label: 'Rudraksha',       icon: <Sparkles size={15} /> },
        ];
        const TabLoader = () => <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>Calculating…</div>;

        const Dosha = ({ d, label, color }: any) => d && (
          <div className="cosmic-card" style={{ border: `1px solid ${d.isManglik||d.isKaalSarp||d.inSadeSati||d.isPitraDosha ? `${color}40` : 'rgba(80,200,80,0.2)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <ShieldAlert size={20} color={d.isManglik||d.isKaalSarp||d.inSadeSati||d.isPitraDosha ? color : '#4caf50'} />
              <strong style={{ color: '#fff' }}>{label}</strong>
              <span style={{ marginLeft: 'auto', color: d.isManglik||d.isKaalSarp||d.inSadeSati||d.isPitraDosha ? color : '#4caf50', fontWeight: 600, fontSize: '0.85rem' }}>
                {d.isManglik||d.isKaalSarp||d.inSadeSati||d.isPitraDosha ? (d.intensity||d.type||d.phase||d.intensity||'Present') : 'Not Present'}
              </span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>{d.description}</p>
            {(d.remedies||[]).slice(0,2).map((r: string, i: number) => (
              <p key={i} style={{ color: 'var(--color-accent-gold)', fontSize: '0.78rem', marginTop: '4px' }}>• {r}</p>
            ))}
          </div>
        );

        return (
          <section style={{ marginTop: '20px' }}>
            {/* Tab bar */}
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', borderBottom: '1px solid var(--color-border-glass)', marginBottom: '24px' }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => switchTab(t.id, calcInput)} style={{
                  background: activeTab === t.id ? 'rgba(212,175,55,0.15)' : 'none',
                  border: 'none', borderBottom: activeTab === t.id ? '2px solid var(--color-accent-gold)' : '2px solid transparent',
                  color: activeTab === t.id ? 'var(--color-accent-gold)' : 'var(--color-text-muted)',
                  padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                  fontWeight: activeTab === t.id ? 600 : 400, fontSize: '0.88rem', transition: 'all 0.2s',
                }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Tab: Charts & Dasha */}
            {activeTab === 'chart' && chartResult && (
              <div className="cosmic-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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

                  {navamsaResult && activeFeatures.navamsa_chart && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--color-accent-gold)', textAlign: 'center' }}>
                        Navamsa Kundali (D-9 Chart)
                      </h3>
                      <NavamsaChart navamsaLagna={navamsaResult.navamsaLagna} planets={navamsaResult.planets} />
                    </div>
                  )}
                </div>

                {dashaResult && activeFeatures.dasha && (
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

                <div style={{ marginTop: '40px' }}>
                  <HousePredictions planets={chartResult.planets} lagna={chartResult.lagna} />
                </div>
              </div>
            )}

            {/* Tab: Doshas */}
            {activeTab === 'doshas' && (
              calcLoading.doshas ? <TabLoader /> :
              calcData.doshas ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '16px' }}>
                  <Dosha d={calcData.doshas.manglik}    label="Manglik Dosha"   color="#e05252" />
                  <Dosha d={calcData.doshas.kaalSarp}   label="Kaal Sarp Dosha" color="#9b59b6" />
                  <Dosha d={calcData.doshas.sadeSati}   label="Sade Sati"       color="#6464dc" />
                  <Dosha d={calcData.doshas.pitraDosha} label="Pitra Dosha"     color="#dc9632" />
                </div>
              ) : null
            )}

            {/* Tab: Gemstone */}
            {activeTab === 'gemstone' && (
              calcLoading.gemstone ? <TabLoader /> :
              calcData.gemstone?.recommendations ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '8px' }}>
                    {[['Lagna', calcData.gemstone.lagna],['Moon Sign', calcData.gemstone.moonSign],['Nakshatra', calcData.gemstone.nakshatra],['Current Dasha', calcData.gemstone.currentDasha]].map(([k,v]) => (
                      <div key={k} className="cosmic-card" style={{ textAlign: 'center', padding: '12px' }}>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{k}</p>
                        <p style={{ color: 'var(--color-accent-gold)', fontWeight: 700 }}>{v}</p>
                      </div>
                    ))}
                  </div>
                  {calcData.gemstone.recommendations.map((rec: any) => (
                    <div key={rec.rank} className="cosmic-card" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '16px', border: rec.rank===1 ? '1px solid var(--color-border-gold)' : undefined }}>
                      <div style={{ textAlign: 'center' }}>
                        {rec.rank === 1 && <span style={{ background: 'var(--color-accent-gold)', color: '#000', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', display: 'block', marginBottom: '6px' }}>PRIMARY</span>}
                        <p style={{ color: 'var(--color-accent-gold-light)', fontWeight: 700, fontSize: '1.1rem' }}>{rec.gemstone}</p>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{rec.hindiName}</p>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{rec.metal} · {rec.dayToWear}</p>
                      </div>
                      <div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '6px' }}>{rec.reason}</p>
                        <p style={{ color: '#aed6f1', fontSize: '0.82rem' }}>{rec.benefit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null
            )}

            {/* Tab: Nakshatra & Yogas */}
            {activeTab === 'nakshatra' && (
              calcLoading.nakshatra ? <TabLoader /> :
              calcData.nakshatra ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Nakshatra */}
                  {calcData.nakshatra.nakshatra && (
                    <div className="cosmic-card" style={{ border: '1px solid var(--color-border-gold)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '16px', textAlign: 'center' }}>
                      {[['Nakshatra', calcData.nakshatra.nakshatra.nakshatra],['Pada', calcData.nakshatra.nakshatra.pada],['Lord', calcData.nakshatra.nakshatra.lord],['Deity', calcData.nakshatra.nakshatra.deity],['Symbol', calcData.nakshatra.nakshatra.symbol]].map(([k,v]) => (
                        <div key={k}><p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{k}</p><p style={{ color: 'var(--color-accent-gold)', fontWeight: 700 }}>{v}</p></div>
                      ))}
                    </div>
                  )}
                  {/* Atmakaraka */}
                  {calcData.nakshatra.atmakaraka && (
                    <div className="cosmic-card">
                      <p style={{ color: 'var(--color-accent-gold)', fontWeight: 600, marginBottom: '4px' }}>Atmakaraka: {calcData.nakshatra.atmakaraka.atmakaraka}</p>
                      <p style={{ color: '#aed6f1', fontSize: '0.88rem', fontStyle: 'italic' }}>{calcData.nakshatra.atmakaraka.meaning}</p>
                    </div>
                  )}
                  {/* Ishta Devta */}
                  {calcData.nakshatra.ishtaDevta && (
                    <div className="cosmic-card">
                      <p style={{ color: 'var(--color-accent-gold)', fontWeight: 600, marginBottom: '4px' }}>Ishta Devta: {calcData.nakshatra.ishtaDevta.ishtaDevta}</p>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>{calcData.nakshatra.ishtaDevta.description}</p>
                      <p style={{ color: '#aed6f1', fontSize: '0.85rem', fontStyle: 'italic' }}>Mantra: {calcData.nakshatra.ishtaDevta.mantra}</p>
                    </div>
                  )}
                  {/* Dhan Yoga */}
                  {calcData.nakshatra.dhanYoga && (
                    <div className="cosmic-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <TrendingUp size={18} color="var(--color-accent-gold)" />
                        <strong style={{ color: '#fff' }}>Dhan Yogas</strong>
                        <span style={{ color: calcData.nakshatra.dhanYoga.count > 0 ? '#4caf50' : 'var(--color-text-muted)', marginLeft: 'auto', fontWeight: 600, fontSize: '0.85rem' }}>{calcData.nakshatra.dhanYoga.strength}</span>
                      </div>
                      {calcData.nakshatra.dhanYoga.wealthYogas?.length > 0
                        ? calcData.nakshatra.dhanYoga.wealthYogas.map((y: any, i: number) => (
                            <p key={i} style={{ color: '#4caf50', fontSize: '0.82rem', marginBottom: '4px' }}>✓ <strong>{y.yoga}</strong> — {y.description}</p>
                          ))
                        : <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{calcData.nakshatra.dhanYoga.summary}</p>
                      }
                    </div>
                  )}
                </div>
              ) : null
            )}

            {/* Tab: Transit */}
            {activeTab === 'transit' && (
              calcLoading.transit ? <TabLoader /> :
              calcData.transit ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Current planetary transits over your natal chart as of {calcData.transit.transitDate}</p>
                  {calcData.transit.significant?.map((t: any) => (
                    <div key={t.planet} className="cosmic-card" style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '12px', alignItems: 'center' }}>
                      <div>
                        <p style={{ color: 'var(--color-accent-gold)', fontWeight: 700, marginBottom: '2px' }}>{t.planet.split(' ')[0]}</p>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{t.transitSign} → House {t.transitHouse}</p>
                      </div>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{t.effect}</p>
                    </div>
                  ))}
                </div>
              ) : null
            )}

            {/* Tab: Rudraksha */}
            {activeTab === 'rudraksha' && (
              calcLoading.rudraksha ? <TabLoader /> :
              calcData.rudraksha ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {[['Primary (Nakshatra)', calcData.rudraksha.primary], ['Secondary (Lagna)', calcData.rudraksha.secondary]].map(([label, rec]: any) => (
                    <div key={label} className="cosmic-card" style={{ border: '1px solid var(--color-border-gold)' }}>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginBottom: '4px' }}>{label}</p>
                      <p style={{ color: 'var(--color-accent-gold-light)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '4px' }}>{rec.beads} Mukhi Rudraksha</p>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: '6px' }}>Deity: {rec.deity} · Planet: {rec.planet}</p>
                      <p style={{ color: '#aed6f1', fontSize: '0.85rem', marginBottom: '8px' }}>{rec.benefit}</p>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', fontStyle: 'italic' }}>{rec.howToWear}</p>
                    </div>
                  ))}
                </div>
              ) : null
            )}

            {/* Tab: Lal Kitab Remedies */}
            {activeTab === 'lalkitab' && (
              calcLoading.lalkitab ? <TabLoader /> :
              calcData.lalkitab?.remedies ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    Lal Kitab remedies are based on the house placement of planets in your birth chart.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                    {calcData.lalkitab.remedies.map((item: any) => (
                      <div key={item.planet} className="cosmic-card" style={{ border: '1px solid var(--color-border-glass)', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid var(--color-border-glass)', paddingBottom: '14px', marginBottom: '16px' }}>
                          <div>
                            <h3 style={{ color: 'var(--color-accent-gold-light)', fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Sparkles size={16} /> {item.planet}
                            </h3>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
                              Sign: {item.sign} · Degree: {item.degree}
                            </p>
                          </div>
                          <span style={{
                            background: 'rgba(212,175,55,0.1)',
                            border: '1px solid var(--color-border-gold)',
                            color: 'var(--color-accent-gold)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            padding: '4px 12px',
                            borderRadius: '20px'
                          }}>
                            House {item.house}
                          </span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                          {item.benefic && (
                            <div>
                              <strong style={{ color: '#4caf50', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
                                ✓ Benefic Placements
                              </strong>
                              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.84rem', lineHeight: '1.6' }}>
                                {item.benefic}
                              </p>
                            </div>
                          )}
                          
                          {item.malefic && (
                            <div>
                              <strong style={{ color: '#ff7070', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
                                ⚠ Malefic Placements
                              </strong>
                              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.84rem', lineHeight: '1.6' }}>
                                {item.malefic}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {item.remedies && item.remedies.length > 0 && (
                          <div style={{ marginTop: '20px', background: 'rgba(212, 175, 55, 0.03)', border: '1px solid rgba(212, 175, 55, 0.1)', borderRadius: '8px', padding: '16px' }}>
                            <strong style={{ color: 'var(--color-accent-gold)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                              <Scroll size={14} /> Prescribed Remedies
                            </strong>
                            <ul style={{ paddingLeft: '16px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {item.remedies.map((rem: string, idx: number) => (
                                <li key={idx} style={{ color: '#eef2f3', fontSize: '0.85rem', lineHeight: '1.5', listStyleType: 'circle' }}>
                                  {rem}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>
                  No Lal Kitab remedies found.
                </div>
              )
            )}
          </section>
        );
      })()}

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
