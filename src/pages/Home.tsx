import React, { useState, useEffect, useRef } from 'react';
import { astrologyService, calculatorService, masterDataService } from '../services/api';
import { Compass, Moon, Sun, Search, ShieldAlert, Gem, Star, TrendingUp, Sparkles, Clock, Loader, Scroll, Flame, RefreshCw, Calendar } from 'lucide-react';
import { KundaliChart } from '../components/KundaliChart';
import { NavamsaChart } from '../components/NavamsaChart';
import { DashaBhuktiTable } from '../components/DashaBhuktiTable';
import { HousePredictions } from '../components/HousePredictions';
import { StandardHouseTable } from '../components/StandardHouseTable';

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
  // Wizard steps: 'concern' | 'birthForm' | 'results'
  const [wizardStep, setWizardStep] = useState<'concern' | 'birthForm' | 'results'>('birthForm');
  const [selectedConcern, setSelectedConcern] = useState<'career' | 'marriage' | 'finance' | 'health' | 'spirituality' | 'general' | null>('general');
  const [chartStyle, setChartStyle] = useState<'north' | 'south'>('north');

  const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '6px', color: 'var(--color-accent-gold-light)', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.03em' };

  // Birth chart form state
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    tob: '',
    pob: '',
    lat: '',
    lon: '',
    tzone: '5.5',
    mobile: '',
    email: '',
    gender: ''
  });

  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [chartResult, setChartResult] = useState<any | null>(null);
  const [navamsaResult, setNavamsaResult] = useState<any | null>(null);
  const [dashaResult, setDashaResult] = useState<any | null>(null);
  const [allVargas, setAllVargas] = useState<any | null>(null);
  const [selectedZodiac, setSelectedZodiac] = useState<string | null>(null);
  const [horoscope, setHoroscope] = useState<string | null>(null);
  const [horoscopeLoading, setHoroscopeLoading] = useState(false);

  // Feature flags
  const [activeFeatures, setActiveFeatures] = useState<Record<string, boolean>>({
    birth_chart: true,
    navamsa_chart: true,
    dasha: true,
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        const concernMap: Record<string, string> = {
          career: 'Career',
          marriage: 'Marriage',
          finance: 'Wealth',
          health: 'Health',
          spirituality: 'General',
          general: 'General',
        };
        const activeConcern = selectedConcern ? concernMap[selectedConcern] : 'General';
        
        const gemRes = await fetch(`/api/v1/astrology/calc/gemstone-suggestion`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...input, concern: activeConcern })
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

  // Pre-load necessary tabs in the background based on selected concern
  useEffect(() => {
    if (!calcInput || !selectedConcern) return;

    if (selectedConcern === 'career') {
      loadCalc('gemstone', calcInput);
      loadCalc('transit', calcInput);
    } else if (selectedConcern === 'marriage') {
      loadCalc('doshas', calcInput);
      loadCalc('gemstone', calcInput);
    } else if (selectedConcern === 'finance') {
      loadCalc('nakshatra', calcInput);
      loadCalc('gemstone', calcInput);
    } else if (selectedConcern === 'health') {
      loadCalc('doshas', calcInput);
      loadCalc('rudraksha', calcInput);
      loadCalc('gemstone', calcInput);
    } else if (selectedConcern === 'spirituality') {
      loadCalc('nakshatra', calcInput);
      loadCalc('rudraksha', calcInput);
    } else if (selectedConcern === 'general') {
      loadCalc('doshas', calcInput);
      loadCalc('gemstone', calcInput);
      loadCalc('nakshatra', calcInput);
    }
  }, [calcInput, selectedConcern]);

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
        mobile: formData.mobile,
        email: formData.email,
        concern: selectedConcern || 'general',
        gender: formData.gender,
        style: chartStyle,
      });
      const finalData = res.data?.data ?? res.data;
      if (!finalData?.lagna) throw new Error('Invalid chart data received from server.');
      setChartResult(finalData);
      setNavamsaResult(finalData.navamsaChart ?? null);
      setDashaResult(finalData.dashaPeriods ?? null);
      setAllVargas(finalData.allVargas ?? null);
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
      setWizardStep('results');
    } catch (err: any) {
      const msg = err?.response?.data?.detail ?? err?.response?.data?.message ?? err?.message ?? 'Failed to generate chart.';
      setChartError(msg);
      setChartResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!calcInput) return;
    
    const pdfInput = {
      ...calcInput,
      name: formData.name,
      dob: formData.dob,
      tob: formData.tob,
      pob: formData.pob,
      mobile: formData.mobile,
      email: formData.email,
      concern: selectedConcern || 'general',
      style: chartStyle
    };
    
    try {
      const response = await calculatorService.pdfReport(pdfInput as any);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Astrology_Report_${formData.name.replace(/\s+/g, '_') || 'Kundali'}.pdf`;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error('Failed to download PDF report', err);
      alert('Failed to download PDF report. Please try again.');
    }
  };

  const handleResetWizard = () => {
    setWizardStep('birthForm');
    setSelectedConcern('general');
    setChartResult(null);
    setCalcInput(null);
    setCalcData({});
    setFormData({
      name: '',
      dob: '',
      tob: '',
      pob: '',
      lat: '',
      lon: '',
      tzone: '5.5',
      mobile: '',
      email: '',
      gender: ''
    });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', minHeight: '80vh' }}>
      


      {/* STEP 1: LANDING PAGE INFO & CTA */}
      {wizardStep === 'concern' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', animation: 'fadeIn 0.5s ease-out' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            maxWidth: '900px',
            width: '100%'
          }}>
            {/* Feature 1 */}
            <div className="cosmic-card" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px', 
              padding: '30px',
              textAlign: 'left'
            }}>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '10px', 
                background: 'rgba(212, 175, 55, 0.1)', 
                border: '1px solid rgba(212, 175, 55, 0.25)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'var(--color-accent-gold)' 
              }}>
                <Sparkles size={22} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                Transforming Remedies
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
                Detailed readings & remedies tailored to your chart.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="cosmic-card" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px', 
              padding: '30px',
              textAlign: 'left'
            }}>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '10px', 
                background: 'rgba(168, 85, 247, 0.1)', 
                border: '1px solid rgba(168, 85, 247, 0.25)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#a855f7' 
              }}>
                <Scroll size={22} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                Mantra Remedies
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
                Career, wealth, health & relationships through sacred mantras.
              </p>
            </div>
          </div>

          <button 
            onClick={() => setWizardStep('birthForm')}
            className="btn-gold"
            style={{ 
              padding: '16px 40px', 
              fontSize: '1.1rem', 
              borderRadius: '30px', 
              boxShadow: '0 0 25px rgba(212, 175, 55, 0.35)', 
              fontWeight: 700 
            }}
          >
            Get your chart Free
          </button>
        </div>
      )}

      {/* STEP 2: SINGLE SCREEN COORDINATES FORM */}
      {wizardStep === 'birthForm' && (
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
          {/* Top Header Row with Brand & Login */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #d4af37 0%, #b38f1d 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(212,175,55,0.4)'
              }}>
                <Compass size={22} color="#05060f" />
              </div>
              <span style={{
                fontSize: '1.4rem',
                fontFamily: 'var(--font-heading)',
                color: '#ffffff',
                fontWeight: 'bold',
                letterSpacing: '0.1em'
              }}>
                VEDAASTRO
              </span>
            </div>
            <a
              href="/login"
              className="btn-gold"
              style={{
                padding: '8px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                borderRadius: '20px',
                textDecoration: 'none'
              }}
            >
              Login
            </a>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr',
            gap: '40px',
            alignItems: 'start',
            marginTop: '20px'
          }}>
            {/* Left Column - Info Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'left' }}>

              {/* Tagline Badge */}
              <div style={{
                alignSelf: 'flex-start',
                border: '1px solid var(--color-border-gold)',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                color: 'var(--color-accent-gold)',
                fontWeight: 600,
                textTransform: 'uppercase',
                background: 'rgba(212,175,55,0.05)'
              }}>
                YOUR STARS MAKE YOU
              </div>

              {/* Main Heading */}
              <h1 style={{
                fontSize: isMobile ? '2.2rem' : '2.8rem',
                lineHeight: '1.2',
                color: '#ffffff',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                margin: 0,
                letterSpacing: '0.02em',
              }}>
                Cosmos works for you you have to align Best life awaits you.
              </h1>

              {/* Description Paragraph */}
              <p style={{
                fontSize: '1.05rem',
                lineHeight: '1.65',
                color: 'var(--color-text-muted)',
                margin: 0
              }}>
                Share your birth details and we'll draw your natal chart Readings, predictions with Yogas and Doshas. Simple remedies that change small things for big results. BE THE BEST YOU.
              </p>

              {/* Bottom Remedy Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '20px',
                marginTop: '12px'
              }}>
                {/* Transforming Remedies Card */}
                <div className="cosmic-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid var(--color-border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-accent-gold)'
                  }}>
                    <Sparkles size={16} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: '#fff' }}>
                    Transforming Remedies
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.5' }}>
                    Detailed readings & remedies tailored to your chart.
                  </p>
                  <a href="#remedies" style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-accent-gold)',
                    letterSpacing: '0.05em',
                    marginTop: '12px'
                  }}>
                    SPECIAL OFFERS FOR YOU →
                  </a>
                </div>

                {/* Mantra Remedies Card */}
                <div className="cosmic-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid var(--color-border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-accent-gold)'
                  }}>
                    <Scroll size={16} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: '#fff' }}>
                    Mantra Remedies
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.5' }}>
                    Career, wealth, health & relationships through sacred mantras.
                  </p>
                  <a href="#mantras" style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-accent-gold)',
                    letterSpacing: '0.05em',
                    marginTop: '12px'
                  }}>
                    SPECIAL OFFERS FOR YOU →
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Form Card */}
            <div className="cosmic-card" style={{
              padding: '40px',
              border: '1px solid var(--color-border-gold)',
              background: 'rgba(10, 11, 28, 0.75)'
            }}>
              <div style={{ textAlign: 'left', marginBottom: '24px' }}>
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--color-accent-gold)', fontWeight: 700, display: 'block' }}>
                  BEGIN
                </span>
                <h2 style={{
                  fontSize: '2rem',
                  color: 'var(--color-accent-gold-light)',
                  margin: '4px 0 0 0',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600
                }}>
                  Your cosmic coordinates
                </h2>
              </div>

              {chartError && (
                <div style={{
                  background: 'rgba(231,76,60,0.1)',
                  border: '1px solid #e74c3c',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#e74c3c',
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                  textAlign: 'left'
                }}>
                  ⚠ {chartError}
                </div>
              )}

              <form onSubmit={generateKundali} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Full Name */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: 'var(--color-accent-gold-light)', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.03em' }}>FULL NAME *</label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Cassiopeia Vance" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    className="form-input" 
                    required 
                  />
                </div>

                {/* Sex & Date of Birth Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', marginBottom: '6px', color: 'var(--color-accent-gold-light)', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.03em' }}>SEX *</label>
                    <select 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleInputChange} 
                      className="form-input"
                      style={{ background: 'rgba(5, 6, 15, 0.85)', cursor: 'pointer' }}
                      required
                    >
                      <option value="" disabled>Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', marginBottom: '6px', color: 'var(--color-accent-gold-light)', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.03em' }}>DATE OF BIRTH *</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input 
                        type="date" 
                        name="dob" 
                        value={formData.dob} 
                        onChange={handleInputChange} 
                        className="form-input" 
                        required 
                      />
                      <Calendar size={16} color="var(--color-accent-gold)" style={{ position: 'absolute', right: '16px', pointerEvents: 'none', opacity: 0.8 }} />
                    </div>
                  </div>
                </div>

                {/* Time of Birth & Place of Birth Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', marginBottom: '6px', color: 'var(--color-accent-gold-light)', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.03em' }}>TIME OF BIRTH *</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input 
                        type="time" 
                        name="tob" 
                        value={formData.tob} 
                        onChange={handleInputChange} 
                        className="form-input" 
                        required 
                      />
                      <Clock size={16} color="var(--color-accent-gold)" style={{ position: 'absolute', right: '16px', pointerEvents: 'none', opacity: 0.8 }} />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0, position: 'relative' }}>
                    <label style={{ display: 'block', marginBottom: '6px', color: 'var(--color-accent-gold-light)', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.03em' }}>PLACE OF BIRTH *</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        name="pob" 
                        placeholder="City, Country" 
                        value={formData.pob} 
                        onChange={handleInputChange}
                        className="form-input"
                        style={{ paddingRight: '40px' }}
                        required
                      />
                      <div style={{ position: 'absolute', right: '14px', display: 'flex', alignItems: 'center', color: 'var(--color-accent-gold)', opacity: 0.8 }}>
                        {geoLoading ? (
                          <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <Search size={16} />
                        )}
                      </div>
                    </div>

                    {/* Location Autocomplete Dropdown */}
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
                        maxHeight: '200px',
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
                              <span style={{ fontSize: '0.9rem' }}>📍</span>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1, justifyContent: 'center' }}>
                                <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
                                  {mainName}
                                </span>
                                {secondaryName && (
                                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
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
                </div>

                {/* Mobile Number & Email Address Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', marginBottom: '6px', color: 'var(--color-accent-gold-light)', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.03em' }}>MOBILE NUMBER *</label>
                    <input 
                      type="tel" 
                      name="mobile" 
                      placeholder="e.g. +91 98765 43210" 
                      value={formData.mobile} 
                      onChange={handleInputChange} 
                      className="form-input" 
                      required 
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', marginBottom: '6px', color: 'var(--color-accent-gold-light)', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.03em' }}>EMAIL ADDRESS *</label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="celestial@archive.com" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      className="form-input" 
                      required
                    />
                  </div>
                </div>

                {/* Focus Concern & Chart Style Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', marginBottom: '6px', color: 'var(--color-accent-gold-light)', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.03em' }}>PRIMARY LIFE FOCUS</label>
                    <select
                      name="selectedConcern"
                      value={selectedConcern || 'general'}
                      onChange={(e) => setSelectedConcern(e.target.value as any)}
                      className="form-input"
                      style={{ background: 'rgba(5, 6, 15, 0.85)', cursor: 'pointer' }}
                    >
                      <option value="general">General Reading</option>
                      <option value="career">Career & Growth</option>
                      <option value="marriage">Marriage & Relations</option>
                      <option value="finance">Wealth & Finance</option>
                      <option value="health">Health & Vitality</option>
                      <option value="spirituality">Spirituality & Soul</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', marginBottom: '6px', color: 'var(--color-accent-gold-light)', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.03em' }}>CHART STYLE</label>
                    <div style={{ display: 'flex', gap: '0', borderRadius: '25px', overflow: 'hidden', border: '1px solid var(--color-border-gold)', height: '42px' }}>
                      <button
                        type="button"
                        onClick={() => setChartStyle('north')}
                        style={{
                          flex: 1,
                          padding: '0 8px',
                          background: chartStyle === 'north'
                            ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.15))'
                            : 'rgba(5, 6, 15, 0.6)',
                          border: 'none',
                          color: chartStyle === 'north' ? '#fff' : 'var(--color-text-muted)',
                          fontWeight: chartStyle === 'north' ? 700 : 500,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          borderRight: '1px solid var(--color-border-gold)'
                        }}
                      >
                        ◇ NORTH
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartStyle('south')}
                        style={{
                          flex: 1,
                          padding: '0 8px',
                          background: chartStyle === 'south'
                            ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.15))'
                            : 'rgba(5, 6, 15, 0.6)',
                          border: 'none',
                          color: chartStyle === 'south' ? '#fff' : 'var(--color-text-muted)',
                          fontWeight: chartStyle === 'south' ? 700 : 500,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        ▦ SOUTH
                      </button>
                    </div>
                  </div>
                </div>

                {/* Manual Coordinates Overrides */}
                <details style={{ width: '100%', color: 'var(--color-text-muted)', fontSize: '0.82rem', marginTop: '4px' }}>
                  <summary style={{ cursor: 'pointer', userSelect: 'none', color: 'var(--color-accent-gold-light)', fontWeight: 700 }}>
                    COORDINATE OVERRIDES (OPTIONAL)
                  </summary>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ ...labelStyle, fontSize: '0.65rem', marginBottom: 0 }}>LATITUDE</label>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ ...labelStyle, fontSize: '0.65rem', marginBottom: 0 }}>LONGITUDE</label>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ ...labelStyle, fontSize: '0.65rem', marginBottom: 0 }}>TIMEZONE</label>
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
                </details>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="btn-gold" 
                  disabled={loading || !formData.lat || !formData.lon}
                  style={{
                    width: '100%',
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    borderRadius: '30px',
                    padding: '16px 20px',
                    fontWeight: 700
                  }}
                >
                  {loading ? (
                    <>
                      <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Generating Chart...
                    </>
                  ) : (
                    'OPEN MY CHART — FREE'
                  )}
                </button>
              </form>

              {/* Sub-buttons/tabs below the button */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '20px', justifyContent: 'center' }}>
                <button 
                  type="button" 
                  className="btn-outline"
                  style={{
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}
                >
                  TRANSFORMING REMEDIES
                </button>
                <button 
                  type="button" 
                  className="btn-outline"
                  style={{
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}
                >
                  MANTRA REMEDIES
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: RESULTS (Tab calculations, customized Remedies Advisor) */}
      {wizardStep === 'results' && calcInput && (() => {
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

        const getConcernTitle = () => {
          switch (selectedConcern) {
            case 'career': return 'Career & Professional Growth';
            case 'marriage': return 'Marriage & Relationships';
            case 'finance': return 'Wealth, Finance & Prosperity';
            case 'health': return 'Health, Vitality & Well-being';
            case 'spirituality': return 'Spirituality & Soul Purpose';
            default: return 'General Cosmic Blueprint';
          }
        };

        const renderRemediesAdvisor = () => {
          const loadingText = "Analyzing planetary placements...";
          
          if (selectedConcern === 'career') {
            const hasGemstone = calcData.gemstone?.recommendations;
            const primaryGem = hasGemstone?.find((r: any) => r.rank === 1);
            const currentDashaPlanet = dashaResult?.currentDasha;
            
            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {/* Gemstone card */}
                <div className="cosmic-card" style={{ border: '1px solid rgba(212, 175, 55, 0.3)', background: 'rgba(212, 175, 55, 0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent-gold)', marginBottom: '12px' }}>
                    <Gem size={20} />
                    <strong>Career Gemstone Recommendation</strong>
                  </div>
                  {calcLoading.gemstone ? <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{loadingText}</p> :
                   primaryGem ? (
                    <div>
                      <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>{primaryGem.gemstone} ({primaryGem.hindiName})</p>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '0 0 10px 0' }}>Metal: {primaryGem.metal} · Day: {primaryGem.dayToWear}</p>
                      <p style={{ color: '#aed6f1', fontSize: '0.85rem', margin: 0 }}>{primaryGem.benefit}</p>
                    </div>
                  ) : <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>No gemstone suggested for career.</p>}
                </div>

                {/* Dasha card */}
                <div className="cosmic-card" style={{ border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7', marginBottom: '12px' }}>
                    <Clock size={20} />
                    <strong>Dasha Cycle Influence</strong>
                  </div>
                  {currentDashaPlanet ? (
                    <div>
                      <p style={{ fontSize: '1.15rem', fontWeight: 600, color: '#fff', margin: '0 0 6px 0' }}>Active Period: {currentDashaPlanet} Mahadasha</p>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                        Your career matters are currently influenced by {currentDashaPlanet}. Strengthening this planet via mantra recitation or charity on its ruling day will help remove professional hurdles and boost career progression.
                      </p>
                    </div>
                  ) : <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Loading dasha cycle details...</p>}
                </div>

                {/* Transit card */}
                <div className="cosmic-card" style={{ border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', marginBottom: '12px' }}>
                    <TrendingUp size={20} />
                    <strong>Transit Alert & Actions</strong>
                  </div>
                  {calcLoading.transit ? <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{loadingText}</p> :
                   calcData.transit?.significant?.length ? (
                    <div>
                      <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>Key transit: {calcData.transit.significant[0].planet}</p>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: '1.5' }}>
                        {calcData.transit.significant[0].effect}
                      </p>
                    </div>
                  ) : <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Your transits are stable. Keep pursuing your professional goals with dedication.</p>}
                </div>
              </div>
            );
          }

          if (selectedConcern === 'marriage') {
            const hasDoshas = calcData.doshas;
            const isManglik = hasDoshas?.manglik?.isManglik;
            const intensity = hasDoshas?.manglik?.intensity;
            const primaryGem = calcData.gemstone?.recommendations?.find((r: any) => r.rank === 1);
            
            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {/* Manglik card */}
                <div className="cosmic-card" style={{ border: isManglik ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(34, 197, 94, 0.4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isManglik ? '#ef4444' : '#22c55e', marginBottom: '12px' }}>
                    <ShieldAlert size={20} />
                    <strong>Manglik Dosha Assessment</strong>
                  </div>
                  {calcLoading.doshas ? <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{loadingText}</p> :
                   hasDoshas?.manglik ? (
                    <div>
                      <p style={{ fontSize: '1.25rem', fontWeight: 700, color: isManglik ? '#ef4444' : '#22c55e', margin: '0 0 6px 0' }}>
                        {isManglik ? `Manglik (${intensity})` : 'No Manglik Dosha'}
                      </p>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                        {hasDoshas.manglik.description}
                      </p>
                      {isManglik && hasDoshas.manglik.remedies?.length > 0 && (
                        <p style={{ color: 'var(--color-accent-gold)', fontSize: '0.8rem', marginTop: '8px', fontWeight: 500 }}>
                          Remedy: {hasDoshas.manglik.remedies[0]}
                        </p>
                      )}
                    </div>
                  ) : <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>No dosha assessment available.</p>}
                </div>

                {/* Gemstone card */}
                <div className="cosmic-card" style={{ border: '1px solid rgba(236, 72, 153, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ec4899', marginBottom: '12px' }}>
                    <Gem size={20} />
                    <strong>Relationship Gemstone</strong>
                  </div>
                  {calcLoading.gemstone ? <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{loadingText}</p> :
                   primaryGem ? (
                    <div>
                      <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>{primaryGem.gemstone} ({primaryGem.hindiName})</p>
                      <p style={{ color: '#aed6f1', fontSize: '0.85rem', margin: 0, lineHeight: '1.4' }}>{primaryGem.benefit}</p>
                    </div>
                  ) : <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Gemstone analysis is loading...</p>}
                </div>
              </div>
            );
          }

          if (selectedConcern === 'finance') {
            const dhanYoga = calcData.nakshatra?.dhanYoga;
            const primaryGem = calcData.gemstone?.recommendations?.find((r: any) => r.rank === 1);

            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {/* Dhan Yoga Card */}
                <div className="cosmic-card" style={{ border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', marginBottom: '12px' }}>
                    <TrendingUp size={20} />
                    <strong>Wealth Alignments (Dhan Yoga)</strong>
                  </div>
                  {calcLoading.nakshatra ? <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{loadingText}</p> :
                   dhanYoga ? (
                    <div>
                      <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: '0 0 6px 0' }}>Wealth Potential: {dhanYoga.strength}</p>
                      {dhanYoga.wealthYogas?.length > 0 ? (
                        <div>
                          <p style={{ color: '#22c55e', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 4px 0' }}>Active Yoga: {dhanYoga.wealthYogas[0].yoga}</p>
                          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', margin: 0, lineHeight: '1.4' }}>{dhanYoga.wealthYogas[0].description}</p>
                        </div>
                      ) : (
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>{dhanYoga.summary}</p>
                      )}
                    </div>
                  ) : <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Wealth parameters loading...</p>}
                </div>

                {/* Gemstone card */}
                <div className="cosmic-card" style={{ border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent-gold)', marginBottom: '12px' }}>
                    <Gem size={20} />
                    <strong>Prosperity Gemstone</strong>
                  </div>
                  {calcLoading.gemstone ? <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{loadingText}</p> :
                   primaryGem ? (
                    <div>
                      <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>{primaryGem.gemstone} ({primaryGem.hindiName})</p>
                      <p style={{ color: '#aed6f1', fontSize: '0.85rem', margin: 0, lineHeight: '1.4' }}>{primaryGem.benefit}</p>
                    </div>
                  ) : <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Gemstone analysis is loading...</p>}
                </div>
              </div>
            );
          }

          if (selectedConcern === 'health') {
            const sadeSati = calcData.doshos?.sadeSati ?? calcData.doshas?.sadeSati;
            const rudraksha = calcData.rudraksha?.primary;
            const primaryGem = calcData.gemstone?.recommendations?.find((r: any) => r.rank === 1);

            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {/* Sade Sati Card */}
                <div className="cosmic-card" style={{ border: sadeSati?.inSadeSati ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(34, 197, 94, 0.4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: sadeSati?.inSadeSati ? '#ef4444' : '#22c55e', marginBottom: '12px' }}>
                    <ShieldAlert size={20} />
                    <strong>Saturn Cycle (Sade Sati)</strong>
                  </div>
                  {calcLoading.doshas ? <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{loadingText}</p> :
                   sadeSati ? (
                    <div>
                      <p style={{ fontSize: '1.2rem', fontWeight: 700, color: sadeSati.inSadeSati ? '#ef4444' : '#22c55e', margin: '0 0 4px 0' }}>
                        {sadeSati.inSadeSati ? `Sade Sati Active (${sadeSati.phase})` : 'Sade Sati Inactive'}
                      </p>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: '1.4', margin: 0 }}>
                        {sadeSati.description}
                      </p>
                    </div>
                  ) : <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Saturn metrics loading...</p>}
                </div>

                {/* Rudraksha Card */}
                <div className="cosmic-card" style={{ border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', marginBottom: '12px' }}>
                    <Sparkles size={20} />
                    <strong>Shielding Rudraksha Recommendation</strong>
                  </div>
                  {calcLoading.rudraksha ? <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{loadingText}</p> :
                   rudraksha ? (
                    <div>
                      <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>{rudraksha.beads} Mukhi Rudraksha</p>
                      <p style={{ color: '#aed6f1', fontSize: '0.82rem', margin: 0, lineHeight: '1.4' }}>{rudraksha.benefit}</p>
                    </div>
                  ) : <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Rudraksha metrics loading...</p>}
                </div>

                {/* Gemstone card */}
                <div className="cosmic-card" style={{ border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent-gold)', marginBottom: '12px' }}>
                    <Gem size={20} />
                    <strong>Health Gemstone Recommendation</strong>
                  </div>
                  {calcLoading.gemstone ? <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{loadingText}</p> :
                   primaryGem ? (
                    <div>
                      <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>{primaryGem.gemstone} ({primaryGem.hindiName})</p>
                      <p style={{ color: '#aed6f1', fontSize: '0.85rem', margin: 0, lineHeight: '1.4' }}>{primaryGem.benefit}</p>
                    </div>
                  ) : <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Gemstone analysis is loading...</p>}
                </div>
              </div>
            );
          }

          if (selectedConcern === 'spirituality') {
            const ishta = calcData.nakshatra?.ishtaDevta;
            const atmakaraka = calcData.nakshatra?.atmakaraka;
            
            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {/* Ishta Devta Card */}
                <div className="cosmic-card" style={{ border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', marginBottom: '12px' }}>
                    <Flame size={20} />
                    <strong>Your Ishta Devta (Spiritual Guide)</strong>
                  </div>
                  {calcLoading.nakshatra ? <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{loadingText}</p> :
                   ishta ? (
                    <div>
                      <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>{ishta.ishtaDevta}</p>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '6px', lineHeight: '1.4' }}>{ishta.description}</p>
                      <p style={{ color: 'var(--color-accent-gold)', fontSize: '0.8rem', fontStyle: 'italic', margin: 0 }}>Mantra: {ishta.mantra}</p>
                    </div>
                  ) : <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Spiritual metrics loading...</p>}
                </div>

                {/* Atmakaraka Card */}
                <div className="cosmic-card" style={{ border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7', marginBottom: '12px' }}>
                    <Star size={20} />
                    <strong>Atmakaraka (Soul Planet Purpose)</strong>
                  </div>
                  {calcLoading.nakshatra ? <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{loadingText}</p> :
                   atmakaraka ? (
                    <div>
                      <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>{atmakaraka.atmakaraka}</p>
                      <p style={{ color: '#aed6f1', fontSize: '0.82rem', fontStyle: 'italic', margin: 0, lineHeight: '1.4' }}>{atmakaraka.meaning}</p>
                    </div>
                  ) : <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Soul planet metrics loading...</p>}
                </div>
              </div>
            );
          }

          // General readings card summary
          const primaryGem = calcData.gemstone?.recommendations?.find((r: any) => r.rank === 1);
          const ishta = calcData.nakshatra?.ishtaDevta;

          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div className="cosmic-card" style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Primary Stone</p>
                {calcLoading.gemstone ? <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{loadingText}</p> :
                 primaryGem ? <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-accent-gold)', margin: 0 }}>{primaryGem.gemstone} ({primaryGem.hindiName})</p> :
                 <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>Lagna stone loading...</p>}
              </div>

              <div className="cosmic-card" style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Spiritual Guide</p>
                {calcLoading.nakshatra ? <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{loadingText}</p> :
                 ishta ? <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-accent-gold-light)', margin: 0 }}>{ishta.ishtaDevta}</p> :
                 <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>Ishta Devta loading...</p>}
              </div>
            </div>
          );
        };

        return (
          <section style={{ marginTop: '20px', animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header Action Bar in Aetheris Style */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '24px',
              marginBottom: '32px',
              borderBottom: '1px solid var(--color-border-glass)',
              paddingBottom: '24px',
              textAlign: 'left'
            }}>
              <div>
                <p style={{ color: 'var(--color-accent-gold)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 8px 0', fontWeight: 600 }}>
                  Today · Welcome
                </p>
                <h1 style={{ fontSize: '2.5rem', color: '#fff', margin: '0 0 12px 0', fontFamily: 'var(--font-heading)' }}>
                  Your chart awaits.
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', margin: 0, maxWidth: '650px', lineHeight: '1.6' }}>
                  This is your celestial home. Daily transits, lunar phases, and your natal blueprint will appear here.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignSelf: 'center' }}>
                <button 
                  onClick={handleDownloadPdf}
                  className="btn-gold"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                >
                  <Sparkles size={14} /> Download PDF Report
                </button>
                <button 
                  onClick={handleResetWizard}
                  className="btn-outline"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={14} /> Edit Chart
                </button>
              </div>
            </div>

            {/* Aetheris Big Three summary grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              marginBottom: '40px'
            }}>
              <div className="cosmic-card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--color-border-glass)' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '8px' }}>Sun</span>
                <p style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff', margin: 0, fontFamily: 'var(--font-sans)' }}>
                  {chartResult?.planets?.find((p: any) => p.name === 'Sun')?.sign || 'N/A'}
                </p>
              </div>
              <div className="cosmic-card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--color-border-glass)' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '8px' }}>Moon</span>
                <p style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff', margin: 0, fontFamily: 'var(--font-sans)' }}>
                  {chartResult?.planets?.find((p: any) => p.name === 'Moon')?.sign || 'N/A'}
                </p>
              </div>
              <div className="cosmic-card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--color-border-glass)' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '8px' }}>Rising</span>
                <p style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff', margin: 0, fontFamily: 'var(--font-sans)' }}>
                  {chartResult?.lagna || 'N/A'}
                </p>
              </div>
            </div>

            {/* Personalized Remedies Advisory Grid */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-accent-gold-light)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-heading)' }}>
                <Sparkles size={18} /> Personalized Remedies Advisor (Focus: {getConcernTitle()})
              </h3>
              {renderRemediesAdvisor()}
            </div>

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

                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                  <button
                    onClick={() => setChartStyle('north')}
                    style={{
                      background: chartStyle === 'north' ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                      border: `1px solid ${chartStyle === 'north' ? 'var(--color-accent-gold)' : 'var(--color-border-glass)'}`,
                      color: chartStyle === 'north' ? 'var(--color-accent-gold)' : 'var(--color-text-muted)',
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    North Indian Chart
                  </button>
                  <button
                    onClick={() => setChartStyle('south')}
                    style={{
                      background: chartStyle === 'south' ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                      border: `1px solid ${chartStyle === 'south' ? 'var(--color-accent-gold)' : 'var(--color-border-glass)'}`,
                      color: chartStyle === 'south' ? 'var(--color-accent-gold)' : 'var(--color-text-muted)',
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    South Indian Chart
                  </button>
                </div>

                <div style={{
                  margin: '20px 0 40px 0',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '24px',
                  alignItems: 'start'
                }}>
                  {allVargas ? (
                    ["D1", "D9", "D30", "D3", "D10", "D60", "D7", "D12", "D20", "D24", "D16", "D2"]
                      .filter(key => allVargas[key])
                      .map(key => {
                        const v = allVargas[key];
                        let title = v.name;
                        if (key === 'D2') title = 'Hora D-2 (US)';
                        else if (key === 'D3') title = 'Drekkana D-3 (Trd)';
                        else if (key === 'D10') title = 'Dashamsha D-10 (Trd)';
                        else if (key === 'D60') title = 'Shastiamsha D-60 (Trd)';
                        else if (key === 'D7') title = 'Saptamsha D-7 (Trd)';
                        else if (key === 'D12') title = 'Dwadasamsha D-12 (Trd)';
                        else if (key === 'D20') title = 'Vimsamsha D-20 (Trd)';
                        else if (key === 'D24') title = 'Chaturvimshamsha D-24 (Trd)';
                        else if (key === 'D16') title = 'Shodashamsha D-16 (Trd)';
                        else if (key === 'D30') title = 'Trimshamsha D-30 (Trd)';

                        return (
                          <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <h3 style={{ fontSize: '1.15rem', marginBottom: '12px', color: 'var(--color-accent-gold)', textAlign: 'center', fontWeight: 600 }}>
                              {title}
                            </h3>
                            <KundaliChart 
                              lagna={v.lagna} 
                              planets={v.planets} 
                              style={chartStyle} 
                              showLegend={false} 
                              title={key} 
                            />
                          </div>
                        );
                      })
                  ) : (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--color-accent-gold)', textAlign: 'center' }}>
                          Rashi Kundali (D1 Chart)
                        </h3>
                        <KundaliChart lagna={chartResult.lagna} planets={chartResult.planets} style={chartStyle} />
                      </div>

                      {navamsaResult && activeFeatures.navamsa_chart && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--color-accent-gold)', textAlign: 'center' }}>
                            Navamsa Kundali (D-9 Chart)
                          </h3>
                          <NavamsaChart navamsaLagna={navamsaResult.navamsaLagna} planets={navamsaResult.planets} style={chartStyle} />
                        </div>
                      )}
                    </>
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
                        <th style={{ padding: '12px' }}>Nakshatra (Star)</th>
                        <th style={{ padding: '12px' }}>Pada</th>
                        <th style={{ padding: '12px' }}>Star Lord</th>
                        <th style={{ padding: '12px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartResult.planets.map((planet: any) => {
                        const isRetro = planet.retrograde || planet.name.includes('Rahu') || planet.name.includes('Ketu') || planet.name === 'Ra' || planet.name === 'Ke';
                        return (
                          <tr key={planet.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '12px', fontWeight: 500 }}>{planet.name}</td>
                            <td style={{ padding: '12px' }}>{planet.sign}</td>
                            <td style={{ padding: '12px' }}>{planet.degree}</td>
                            <td style={{ padding: '12px' }}>{planet.house} House</td>
                            <td style={{ padding: '12px' }}>{planet.nakshatra || '-'}</td>
                            <td style={{ padding: '12px' }}>{planet.pada || '-'}</td>
                            <td style={{ padding: '12px' }}>{planet.lord || '-'}</td>
                            <td style={{ padding: '12px' }}>
                              {isRetro && (
                                <span style={{ color: '#ff7043', fontWeight: 700, fontSize: '0.85rem' }}>⟲ (R)</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: '40px' }}>
                  <StandardHouseTable planets={chartResult.planets} lagna={chartResult.lagna} />
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

      {/* Daily Horoscope Grid at the bottom (Secondary card for general discovery) */}
      {wizardStep !== 'results' && (
        <section className="cosmic-card" style={{ maxWidth: '800px', width: '100%', margin: '40px auto 0 auto', animation: 'fadeIn 0.5s ease-out' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent-gold-light)' }}>
            <Sun size={22} /> Daily Horoscope
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
            Select your zodiac sign to reveal your personalized daily forecast.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '12px'
          }}>
            {ZODIAC_SIGNS.map((sign) => (
              <button
                key={sign.name}
                onClick={() => fetchHoroscope(sign.name)}
                style={{
                  background: selectedZodiac === sign.name ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${selectedZodiac === sign.name ? 'var(--color-accent-gold)' : 'var(--color-border-glass)'}`,
                  borderRadius: '10px',
                  padding: '10px 4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span style={{ fontSize: '1.5rem', color: selectedZodiac === sign.name ? 'var(--color-accent-gold)' : 'var(--color-text-main)' }}>{sign.symbol}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{sign.name}</span>
              </button>
            ))}
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
