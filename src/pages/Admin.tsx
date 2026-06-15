import React, { useState } from 'react';
import { Compass, LineChart, ShieldAlert, Award, Calendar, CircleDollarSign, Terminal, Send, Play, FileJson, Eye } from 'lucide-react';
import { api } from '../services/api';
import { KundaliChart } from '../components/KundaliChart';
import { NavamsaChart } from '../components/NavamsaChart';
import { DashaBhuktiTable } from '../components/DashaBhuktiTable';

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'api-explorer'>('analytics');

  // Operational mock data
  const stats = {
    totalBookings: 248,
    activeAstrologers: 14,
    revenuePlatform: 84390,
    repeatCustomers: '42%',
    averageRating: 4.85,
  };

  const astrologerPayouts = [
    { name: 'Acharya Sharma', bookingsCount: 104, totalEarnings: 46800, platformCommission: 7020 },
    { name: 'Jyotishi Patel', bookingsCount: 78, totalEarnings: 29250, platformCommission: 4387 },
    { name: 'Guru Varma', bookingsCount: 66, totalEarnings: 34650, platformCommission: 5197 },
  ];

  // API Explorer Preconfigured endpoints
  const ENDPOINTS = [
    {
      name: 'Get Birth Chart (Kundali)',
      path: '/api/v1/astrology/birth-chart',
      method: 'POST',
      description: 'Generates planetary house coordinates and placements based on birth details.',
      defaultPayload: JSON.stringify({
        name: "Test Admin",
        dob: "1995-11-12",
        tob: "08:12",
        pob: "Mumbai, India",
        lat: 19.0760,
        lon: 72.8777,
        tzone: 5.5
      }, null, 2)
    },
    {
      name: 'Get Navamsa Chart (D-9)',
      path: '/api/v1/astrology/navamsa-chart',
      method: 'POST',
      description: 'Calculates the D-9 divisional Navamsa chart coordinates and house placements.',
      defaultPayload: JSON.stringify({
        name: "Test Admin",
        dob: "1995-11-12",
        tob: "08:12",
        pob: "Mumbai, India",
        lat: 19.0760,
        lon: 72.8777,
        tzone: 5.5
      }, null, 2)
    },
    {
      name: 'Get Dasha Periods',
      path: '/api/v1/astrology/dasha',
      method: 'POST',
      description: 'Calculates the Vimshottari Mahadasha and Bhukti planetary periods.',
      defaultPayload: JSON.stringify({
        name: "Test Admin",
        dob: "1995-11-12",
        tob: "08:12",
        pob: "Mumbai, India",
        lat: 19.0760,
        lon: 72.8777,
        tzone: 5.5
      }, null, 2)
    },
    {
      name: 'Get Horoscope Forecast',
      path: '/api/v1/astrology/horoscope?sign=Leo',
      method: 'GET',
      description: 'Retrieves daily astrological horoscopic forecasts for the selected zodiac sign.',
      defaultPayload: ''
    },
    {
      name: 'List Astrologers',
      path: '/api/v1/users/astrologers',
      method: 'GET',
      description: 'Queries catalog database for active corporate astrologers and profiles.',
      defaultPayload: ''
    },
    {
      name: 'Get User Profile',
      path: '/api/v1/users/me',
      method: 'GET',
      description: 'Fetches profile metadata and account details for the authenticated user.',
      defaultPayload: ''
    },
    {
      name: 'Query Astrologer Slots',
      path: '/api/v1/slots?astrologerId=1&date=2026-06-06',
      method: 'GET',
      description: 'Checks scheduling database for available slot intervals for selected dates.',
      defaultPayload: ''
    },
    {
      name: 'Get My Bookings',
      path: '/api/v1/bookings/me',
      method: 'GET',
      description: 'Retrieves active and historical consultation bookings for authenticated sessions.',
      defaultPayload: ''
    },
    {
      name: 'Get Remedy Catalog',
      path: '/api/v1/remedies',
      method: 'GET',
      description: 'Returns available gemstones, yantras, homas, and pujas.',
      defaultPayload: ''
    }
  ];

  // Explorer states
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [method, setMethod] = useState<string>('POST');
  const [urlPath, setUrlPath] = useState<string>('/api/v1/astrology/birth-chart');
  const [payload, setPayload] = useState<string>(ENDPOINTS[0].defaultPayload);
  const [executing, setExecuting] = useState<boolean>(false);
  
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<string>('');
  const [responseBody, setResponseBody] = useState<string>('');
  const [responseData, setResponseData] = useState<any>(null);
  const [responseViewTab, setResponseViewTab] = useState<'json' | 'visual'>('json');

  const handleSelectEndpoint = (idx: number) => {
    setSelectedIdx(idx);
    const ep = ENDPOINTS[idx];
    setMethod(ep.method);
    setUrlPath(ep.path);
    setPayload(ep.defaultPayload);
    setResponseData(null);
    setResponseViewTab('json');
  };

  const handleExecuteRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setExecuting(true);
    setResponseStatus(null);
    setResponseBody('');
    setResponseHeaders('');
    setResponseData(null);

    try {
      let res;
      const config = {
        headers: {
          'X-Skip-Auth-Redirect': 'true'
        }
      };

      if (method === 'GET') {
        res = await api.get(urlPath, config);
      } else if (method === 'POST') {
        const parsedPayload = payload ? JSON.parse(payload) : {};
        res = await api.post(urlPath, parsedPayload, config);
      } else if (method === 'PUT') {
        const parsedPayload = payload ? JSON.parse(payload) : {};
        res = await api.put(urlPath, parsedPayload, config);
      } else if (method === 'DELETE') {
        res = await api.delete(urlPath, config);
      } else {
        throw new Error('Unsupported method type');
      }

      setResponseStatus(res.status);
      setResponseBody(JSON.stringify(res.data, null, 2));
      setResponseHeaders(JSON.stringify(res.headers, null, 2));
      
      const finalData = res.data && res.data.data ? res.data.data : res.data;
      setResponseData(finalData);

      if (finalData && (
        (finalData.lagna && finalData.planets) ||
        (finalData.navamsaLagna && finalData.planets) ||
        finalData.dashas ||
        (finalData.lagna && finalData.navamsaChart)
      )) {
        setResponseViewTab('visual');
      } else {
        setResponseViewTab('json');
      }
    } catch (err: any) {
      console.error(err);
      setResponseStatus(err.response?.status || 500);
      const errData = err.response?.data || { error: err.message };
      setResponseBody(JSON.stringify(errData, null, 2));
      setResponseHeaders(JSON.stringify(err.response?.headers || {}, null, 2));
      setResponseData(null);
      setResponseViewTab('json');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', textAlign: 'left' }}>
      
      {/* Title & Restrict Access Tag */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2.5rem', marginBottom: '8px' }}>
            Corporate Management Console
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            Restricted operations, scheduling controls, and raw microservice analytics.
          </p>
        </div>
        <span style={{ fontSize: '0.8rem', background: 'rgba(239,68,68,0.15)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldAlert size={14} /> RESTRICTED SECURITY
        </span>
      </section>

      {/* Modern Tabs Navigator */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--color-border-glass)', paddingBottom: '10px' }}>
        <button 
          onClick={() => setActiveTab('analytics')}
          style={{
            background: activeTab === 'analytics' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
            border: `1px solid ${activeTab === 'analytics' ? 'var(--color-accent-gold)' : 'transparent'}`,
            color: activeTab === 'analytics' ? 'var(--color-accent-gold)' : 'var(--color-text-muted)',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
        >
          <LineChart size={18} /> Analytics & Operations
        </button>
        <button 
          onClick={() => setActiveTab('api-explorer')}
          style={{
            background: activeTab === 'api-explorer' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
            border: `1px solid ${activeTab === 'api-explorer' ? 'var(--color-accent-gold)' : 'transparent'}`,
            color: activeTab === 'api-explorer' ? 'var(--color-accent-gold)' : 'var(--color-text-muted)',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
        >
          <Terminal size={18} /> API Explorer
        </button>
      </div>

      {activeTab === 'analytics' ? (
        <>
          {/* Metrics Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div className="cosmic-card" style={{ padding: '20px', textAlign: 'center' }}>
              <CircleDollarSign size={32} color="var(--color-accent-gold)" style={{ margin: '0 auto 8px' }} />
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Platform Revenue</span>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>₹{stats.revenuePlatform.toLocaleString()}</p>
            </div>
            
            <div className="cosmic-card" style={{ padding: '20px', textAlign: 'center' }}>
              <Calendar size={32} color="var(--color-accent-gold)" style={{ margin: '0 auto 8px' }} />
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Total Consultations</span>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>{stats.totalBookings}</p>
            </div>

            <div className="cosmic-card" style={{ padding: '20px', textAlign: 'center' }}>
              <Award size={32} color="var(--color-accent-gold)" style={{ margin: '0 auto 8px' }} />
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Avg Customer Rating</span>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>{stats.averageRating} ★</p>
            </div>

            <div className="cosmic-card" style={{ padding: '20px', textAlign: 'center' }}>
              <LineChart size={32} color="var(--color-accent-gold)" style={{ margin: '0 auto 8px' }} />
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Repeat Booking Rate</span>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>{stats.repeatCustomers}</p>
            </div>
          </div>

          {/* Tables & Details layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.2fr',
            gap: '40px',
            alignItems: 'start'
          }}>
            
            {/* Left: Astrologer Performance list */}
            <div className="cosmic-card">
              <h2 style={{ fontSize: '1.5rem', color: 'var(--color-accent-gold)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} /> Astrologer Earnings & Commissions
              </h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border-glass)', color: 'var(--color-accent-gold-light)', fontSize: '0.9rem' }}>
                      <th style={{ padding: '12px' }}>Name</th>
                      <th style={{ padding: '12px' }}>Sessions</th>
                      <th style={{ padding: '12px' }}>Total Earnings</th>
                      <th style={{ padding: '12px' }}>Platform Commission (15%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {astrologerPayouts.map((astro) => (
                      <tr key={astro.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '12px', fontWeight: 600 }}>{astro.name}</td>
                        <td style={{ padding: '12px' }}>{astro.bookingsCount}</td>
                        <td style={{ padding: '12px' }}>₹{astro.totalEarnings.toLocaleString()}</td>
                        <td style={{ padding: '12px', color: 'var(--color-accent-gold)' }}>₹{astro.platformCommission.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Slot Config Controls */}
            <div className="cosmic-card">
              <h2 style={{ fontSize: '1.5rem', color: 'var(--color-accent-gold)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={20} /> Slot Management Engine
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Define slot generation rules and durations for the automated booking matrix.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label>Default Session Duration</label>
                  <select className="form-input" defaultValue="15" style={{ background: 'rgba(5, 6, 15, 0.8)', border: '1px solid var(--color-border-glass)' }}>
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">60 Minutes</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Platform Commission (%)</label>
                  <input type="number" className="form-input" defaultValue="15" style={{ background: 'rgba(5, 6, 15, 0.8)', border: '1px solid var(--color-border-glass)' }} />
                </div>

                <button onClick={() => alert('Platform booking configurations saved successfully!')} className="btn-gold" style={{ width: '100%', marginTop: '10px' }}>
                  Save Configurations
                </button>
              </div>
            </div>

          </div>
        </>
      ) : (
        /* API Explorer View */
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '30px', alignItems: 'start' }}>
          
          {/* Left Panel: Request Configuration */}
          <div className="cosmic-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-accent-gold)', borderBottom: '1px solid var(--color-border-glass)', paddingBottom: '10px', margin: 0 }}>
              Endpoint Catalog
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ENDPOINTS.map((ep, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectEndpoint(idx)}
                  style={{
                    background: selectedIdx === idx ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${selectedIdx === idx ? 'var(--color-accent-gold)' : 'var(--color-border-glass)'}`,
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{
                      background: ep.method === 'POST' ? '#3b82f6' : '#22c55e',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {ep.method}
                    </span>
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{ep.name}</span>
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', margin: 0 }}>{ep.description}</p>
                </button>
              ))}
            </div>

            <form onSubmit={handleExecuteRequest} style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--color-border-glass)', paddingTop: '20px' }}>
              <div className="form-group">
                <label>HTTP Method & Path</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select 
                    value={method} 
                    onChange={(e) => setMethod(e.target.value)} 
                    className="form-input" 
                    style={{ flex: '0 0 100px', background: 'rgba(5,6,15,0.8)', border: '1px solid var(--color-border-glass)' }}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                  <input
                    type="text"
                    value={urlPath}
                    onChange={(e) => setUrlPath(e.target.value)}
                    className="form-input"
                    style={{ flex: 1, background: 'rgba(5,6,15,0.8)', border: '1px solid var(--color-border-glass)' }}
                    required
                  />
                </div>
              </div>

              {(method === 'POST' || method === 'PUT') && (
                <div className="form-group">
                  <label>JSON Request Body</label>
                  <textarea
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                    className="form-input"
                    style={{ 
                      height: '140px', 
                      fontFamily: 'monospace', 
                      fontSize: '0.85rem',
                      background: 'rgba(5,6,15,0.8)', 
                      border: '1px solid var(--color-border-glass)',
                      resize: 'vertical'
                    }}
                  />
                </div>
              )}

              <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '10px' }} disabled={executing}>
                {executing ? (
                  'Executing query...'
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Play size={16} fill="var(--color-space-deep)" /> Execute Request
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Right Panel: Live Response Display */}
          <div className="cosmic-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignSelf: 'stretch', minHeight: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border-glass)', paddingBottom: '10px' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--color-accent-gold)', margin: 0 }}>
                Response Panel
              </h2>
              {responseStatus !== null && (
                <span style={{
                  background: responseStatus >= 200 && responseStatus < 300 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                  border: `1px solid ${responseStatus >= 200 && responseStatus < 300 ? '#22c55e' : '#ef4444'}`,
                  color: responseStatus >= 200 && responseStatus < 300 ? '#22c55e' : '#ef4444',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}>
                  HTTP {responseStatus}
                </span>
              )}
            </div>

            {responseStatus === null ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', gap: '12px' }}>
                <Send size={48} style={{ strokeWidth: 1 }} />
                <p style={{ margin: 0, fontSize: '0.95rem' }}>Configure and trigger an API request to see the live microservice response here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                
                {/* Headers Box */}
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--color-accent-gold-light)' }}>Response Headers</h4>
                  <pre style={{
                    background: 'rgba(5, 6, 15, 0.9)',
                    border: '1px solid var(--color-border-glass)',
                    borderRadius: '8px',
                    padding: '12px',
                    margin: 0,
                    overflow: 'auto',
                    fontSize: '0.8rem',
                    fontFamily: 'monospace',
                    maxHeight: '100px',
                    color: '#a78bfa',
                    textAlign: 'left'
                  }}>
                    {responseHeaders}
                  </pre>
                </div>

                {/* Body Box */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-accent-gold-light)' }}>Response Body</h4>
                    {responseData && (
                      (responseData.lagna && responseData.planets) ||
                      (responseData.navamsaLagna && responseData.planets) ||
                      responseData.dashas ||
                      (responseData.lagna && responseData.navamsaChart)
                    ) && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setResponseViewTab('json')}
                          style={{
                            background: responseViewTab === 'json' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${responseViewTab === 'json' ? 'var(--color-accent-gold)' : 'var(--color-border-glass)'}`,
                            borderRadius: '6px',
                            padding: '4px 10px',
                            color: responseViewTab === 'json' ? 'var(--color-accent-gold)' : 'var(--color-text-muted)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <FileJson size={12} /> JSON
                        </button>
                        <button
                          type="button"
                          onClick={() => setResponseViewTab('visual')}
                          style={{
                            background: responseViewTab === 'visual' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${responseViewTab === 'visual' ? 'var(--color-accent-gold)' : 'var(--color-border-glass)'}`,
                            borderRadius: '6px',
                            padding: '4px 10px',
                            color: responseViewTab === 'visual' ? 'var(--color-accent-gold)' : 'var(--color-text-muted)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Eye size={12} /> Visual
                        </button>
                      </div>
                    )}
                  </div>

                  {responseViewTab === 'visual' && responseData ? (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      background: 'rgba(5, 6, 15, 0.4)',
                      border: '1px solid var(--color-border-glass)',
                      borderRadius: '12px',
                      padding: '20px',
                      flex: 1,
                      minHeight: '480px',
                      overflowY: 'auto'
                    }}>
                      {/* Combined Chart & Dasha Render */}
                      {responseData.lagna && responseData.navamsaChart && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '20px',
                            alignItems: 'start'
                          }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <h5 style={{ color: 'var(--color-accent-gold)', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>Rasi D1 Chart</h5>
                              <div style={{ width: '100%', maxWidth: '340px' }}>
                                <KundaliChart lagna={responseData.lagna} planets={responseData.planets} showLegend={false} />
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <h5 style={{ color: 'var(--color-accent-gold)', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>Navamsa D-9 Chart</h5>
                              <div style={{ width: '100%', maxWidth: '340px' }}>
                                <NavamsaChart 
                                  navamsaLagna={responseData.navamsaChart.navamsaLagna} 
                                  planets={responseData.navamsaChart.planets} 
                                  showLegend={false}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Shared Legend */}
                          <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            justifyContent: 'center', 
                            gap: '10px', 
                            fontSize: '0.75rem', 
                            color: 'var(--color-text-muted)',
                            background: 'rgba(255, 255, 255, 0.01)',
                            border: '1px solid var(--color-border-glass)',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            margin: '5px 0'
                          }}>
                            {Object.entries({
                              'Asc': 'Ascendant', 'Su': 'Sun', 'Mo': 'Moon', 'Ma': 'Mars', 
                              'Me': 'Mercury', 'Ju': 'Jupiter', 'Ve': 'Venus', 'Sa': 'Saturn', 
                              'Ra': 'Rahu', 'Ke': 'Ketu'
                            }).map(([abbr, fullName]) => (
                              <span key={abbr} style={{ background: 'rgba(255,255,255,0.02)', padding: '2px 6px', borderRadius: '4px' }}>
                                <strong>{abbr}</strong>: {fullName}
                              </span>
                            ))}
                          </div>

                          {responseData.dashaPeriods && (
                            <div style={{ borderTop: '1px solid var(--color-border-glass)', paddingTop: '16px', width: '100%' }}>
                              <h5 style={{ color: 'var(--color-accent-gold)', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 'bold' }}>Vimshottari Dasha Periods</h5>
                              <DashaBhuktiTable 
                                nakshatra={responseData.dashaPeriods.nakshatra}
                                nakshatraLord={responseData.dashaPeriods.nakshatraLord}
                                currentDasha={responseData.dashaPeriods.currentDasha}
                                currentBhukti={responseData.dashaPeriods.currentBhukti}
                                dashas={responseData.dashaPeriods.dashas}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Individual Navamsa Chart Render */}
                      {responseData.navamsaLagna && responseData.planets && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <h4 style={{ color: 'var(--color-accent-gold)', marginBottom: '10px' }}>Navamsa D-9 Chart</h4>
                          <div style={{ width: '100%', maxWidth: '340px' }}>
                            <NavamsaChart navamsaLagna={responseData.navamsaLagna} planets={responseData.planets} />
                          </div>
                        </div>
                      )}

                      {/* Individual Dasha Table Render */}
                      {responseData.dashas && (
                        <div>
                          <h4 style={{ color: 'var(--color-accent-gold)', marginBottom: '10px' }}>Vimshottari Dasha Periods</h4>
                          <DashaBhuktiTable 
                            nakshatra={responseData.nakshatra}
                            nakshatraLord={responseData.nakshatraLord}
                            currentDasha={responseData.currentDasha}
                            currentBhukti={responseData.currentBhukti}
                            dashas={responseData.dashas}
                          />
                        </div>
                      )}

                      {/* Standard Rasi Chart Render (without combined sub-objects) */}
                      {responseData.lagna && !responseData.navamsaChart && !responseData.navamsaLagna && responseData.planets && (
                        <>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '10px'
                          }}>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border-glass)' }}>
                              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>Lagna</span>
                              <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', margin: '2px 0 0 0' }}>{responseData.lagna}</p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border-glass)' }}>
                              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>Janma Nakshatra</span>
                              <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', margin: '2px 0 0 0' }}>{responseData.nakshatra || 'Ashwini'}</p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border-glass)' }}>
                              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>Moon Sign</span>
                              <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', margin: '2px 0 0 0' }}>{responseData.moonSign || 'N/A'}</p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border-glass)' }}>
                              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>Sun Sign</span>
                              <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', margin: '2px 0 0 0' }}>{responseData.sunSign || 'N/A'}</p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ width: '100%', maxWidth: '340px' }}>
                              <KundaliChart lagna={responseData.lagna} planets={responseData.planets} />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <pre style={{
                      background: 'rgba(5, 6, 15, 0.9)',
                      border: '1px solid var(--color-border-glass)',
                      borderRadius: '8px',
                      padding: '16px',
                      margin: 0,
                      overflow: 'auto',
                      fontSize: '0.85rem',
                      fontFamily: 'monospace',
                      color: '#67e8f9',
                      height: '380px',
                      textAlign: 'left'
                    }}>
                      {responseBody}
                    </pre>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
