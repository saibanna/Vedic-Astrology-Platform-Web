import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Loader, MapPin, Search } from 'lucide-react';
import type { CalcInput } from '../services/api';

type Props = {
  title: string;
  subtitle: string;
  onSubmit: (input: CalcInput) => void;
  loading: boolean;
  error?: string;
};

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border-glass)',
  borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '6px', color: 'var(--color-text-muted)', fontSize: '0.85rem' };

// Approximate timezone offset from longitude
const tzFromLon = (lon: number): number => Math.round(lon / 15 * 2) / 2;

// Normalize suggestion results from either Open-Meteo or OpenStreetMap Nominatim
const normalizePlace = (place: any) => {
  if (place.latitude !== undefined && place.longitude !== undefined) {
    const lat = parseFloat(place.latitude).toFixed(4);
    const lon = parseFloat(place.longitude).toFixed(4);
    const countryCode = (place.country_code || '').toLowerCase();
    const isIndia = countryCode === 'in' || (place.country || '').toLowerCase().includes('india');
    const primary = place.name || '';
    const state = place.admin1 || '';
    const country = place.country || '';
    return { lat, lon, isIndia, primary, state, country };
  }
  
  const lat = parseFloat(place.lat || '0').toFixed(4);
  const lon = parseFloat(place.lon || '0').toFixed(4);
  const address = place.address || {};
  const countryCode = (address.country_code || '').toLowerCase();
  const isIndia = countryCode === 'in' || place.display_name?.toLowerCase().includes('india');
  const primary = place.name || place.display_name?.split(',')[0].trim() || '';
  const state = address.state || address.region || address.province || '';
  const country = address.country || '';
  return { lat, lon, isIndia, primary, state, country };
};

export const BirthForm: React.FC<Props> = ({ title, subtitle, onSubmit, loading, error }) => {
  const [form, setForm] = useState({ dob: '', tob: '12:00', pob: '', lat: '', lon: '', tzone: '' });
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const skipSearchRef = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'pob') {
      skipSearchRef.current = false;
      setGeoError('');
      if (!e.target.value.trim()) {
        setSuggestions([]);
      }
    }
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const searchCity = async (query: string) => {
    if (!query.trim()) return;
    setGeoLoading(true); setGeoError('');
    try {
      // Try Open-Meteo Geocoding API first (fast, reliable, no IP blocking)
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      );
      const data = await res.json();
      if (data?.results?.length) {
        setSuggestions(data.results);
        return;
      }
      
      // Fallback 1: OpenStreetMap Nominatim
      const resNom = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const dataNom = await resNom.json();
      if (dataNom?.length) {
        setSuggestions(dataNom);
      } else {
        setSuggestions([]);
        setGeoError('City not found. Try a different spelling or enter coordinates manually.');
      }
    } catch (err) {
      // Fallback 2: Direct Nominatim attempt on Open-Meteo failure
      try {
        const resNom = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const dataNom = await resNom.json();
        if (dataNom?.length) {
          setSuggestions(dataNom);
        } else {
          setSuggestions([]);
          setGeoError('City not found. Try a different spelling or enter coordinates manually.');
        }
      } catch {
        setSuggestions([]);
        setGeoError('Location lookup failed. Please enter coordinates manually.');
      }
    } finally {
      setGeoLoading(false);
    }
  };

  const selectSuggestion = (place: any) => {
    const { lat, lon, isIndia, primary, state, country } = normalizePlace(place);
    const tzVal = isIndia ? 5.5 : tzFromLon(parseFloat(lon));
    const tz  = tzVal.toFixed(1);
    
    const labelParts = [primary];
    if (state && state.toLowerCase() !== primary.toLowerCase()) {
      labelParts.push(state);
    }
    if (country && country.toLowerCase() !== primary.toLowerCase()) {
      labelParts.push(country);
    }
    const label = labelParts.join(', ');

    skipSearchRef.current = true;
    setForm(f => ({ ...f, pob: label, lat, lon, tzone: tz }));
    setSuggestions([]);
  };

  useEffect(() => {
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }

    if (form.pob.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      searchCity(form.pob);
    }, 600); // 600ms debounce

    return () => clearTimeout(timer);
  }, [form.pob]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [year, month, day] = form.dob.split('-').map(Number);
    const [hour, minute] = form.tob.split(':').map(Number);
    const lat   = parseFloat(form.lat)   || 20.5937;
    const lon   = parseFloat(form.lon)   || 78.9629;
    const tzone = parseFloat(form.tzone) || 5.5;
    onSubmit({ year, month, day, hour: hour || 12, minute: minute || 0, lat, lon, tzone });
  };

  return (
    <div className="cosmic-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#fff', marginBottom: '6px', fontSize: '1.3rem' }}>{title}</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>{subtitle}</p>
      {(error || geoError) && (
        <div style={{ background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.3)', borderRadius: '8px', padding: '10px 14px', color: '#ff7070', marginBottom: '16px', fontSize: '0.9rem' }}>
          {error || geoError}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Date of Birth *</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Time of Birth</label>
            <input type="time" name="tob" value={form.tob} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        {/* Place of birth with search */}
        <div style={{ position: 'relative' }}>
          <label style={labelStyle}><MapPin size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />Place of Birth</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              name="pob"
              value={form.pob}
              onChange={handleChange}
              placeholder="e.g. Mumbai, India"
              style={{ ...inputStyle, paddingRight: '40px' }}
            />
            <div style={{ position: 'absolute', right: '12px', display: 'flex', alignItems: 'center', color: 'var(--color-accent-gold)', opacity: 0.8 }}>
              {geoLoading ? (
                <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Search size={16} />
              )}
            </div>
          </div>

          {/* Dropdown suggestions */}
          {suggestions.length > 0 && (
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
              overflowY: 'auto',
              borderTop: 'none'
            }}>
               {suggestions.map((s, i) => {
                const { primary, state, country } = normalizePlace(s);
                
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
                    onClick={() => selectSuggestion(s)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: i < suggestions.length - 1 ? '1px solid var(--color-border-glass)' : 'none',
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
                      <MapPin size={14} color="var(--color-accent-gold)" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0, flex: 1, justifyContent: 'center' }}>
                      <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {mainName}
                      </span>
                      {secondaryName && (
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.76rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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

        {/* Lat / Lon / Timezone — auto-filled, still editable */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Latitude</label>
            <input type="number" step="any" name="lat" value={form.lat} onChange={handleChange} placeholder="20.5937" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Longitude</label>
            <input type="number" step="any" name="lon" value={form.lon} onChange={handleChange} placeholder="78.9629" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Timezone (UTC±)</label>
            <input type="number" step="0.5" name="tzone" value={form.tzone} onChange={handleChange} placeholder="5.5" style={inputStyle} />
          </div>
        </div>
        {form.lat && form.lon && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', marginTop: '-8px' }}>
            📍 {form.lat}, {form.lon} · UTC{parseFloat(form.tzone || '0') >= 0 ? '+' : ''}{form.tzone}
          </p>
        )}

        <button type="submit" className="btn-gold" disabled={loading} style={{ padding: '12px 24px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Calculating…</> : <>Calculate <ChevronRight size={18} /></>}
        </button>
      </form>
    </div>
  );
};
