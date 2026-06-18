import React, { useState } from 'react';
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

export const BirthForm: React.FC<Props> = ({ title, subtitle, onSubmit, loading, error }) => {
  const [form, setForm] = useState({ dob: '', tob: '12:00', pob: '', lat: '', lon: '', tzone: '' });
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (e.target.name === 'pob') { setSuggestions([]); setGeoError(''); }
  };

  const searchCity = async () => {
    if (!form.pob.trim()) return;
    setGeoLoading(true); setGeoError(''); setSuggestions([]);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(form.pob)}&format=json&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (data?.length) {
        setSuggestions(data);
      } else {
        setGeoError('City not found. Try a different spelling or enter coordinates manually.');
      }
    } catch {
      setGeoError('Location lookup failed. Please enter coordinates manually.');
    } finally {
      setGeoLoading(false);
    }
  };

  const selectSuggestion = (place: any) => {
    const lat = parseFloat(place.lat).toFixed(4);
    const lon = parseFloat(place.lon).toFixed(4);
    
    // Check if the location is in India to force UTC+5.5 (IST)
    const isIndia = place.address?.country_code === 'in' || 
                    place.display_name?.toLowerCase().includes('india');
    const tzVal = isIndia ? 5.5 : tzFromLon(parseFloat(lon));
    const tz  = tzVal.toFixed(1);
    
    const label = place.display_name.split(',').slice(0, 3).join(', ');
    setForm(f => ({ ...f, pob: label, lat, lon, tzone: tz }));
    setSuggestions([]);
  };

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
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              name="pob"
              value={form.pob}
              onChange={handleChange}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), searchCity())}
              placeholder="e.g. Mumbai, India"
              style={inputStyle}
            />
            <button
              type="button"
              onClick={searchCity}
              disabled={geoLoading}
              style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid var(--color-border-gold)', borderRadius: '8px', padding: '0 14px', cursor: 'pointer', color: 'var(--color-accent-gold)', flexShrink: 0 }}
            >
              {geoLoading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={16} />}
            </button>
          </div>

          {/* Dropdown suggestions */}
          {suggestions.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: 'rgba(8,9,20,0.98)', border: '1px solid var(--color-border-gold)', borderRadius: '8px', marginTop: '4px', overflow: 'hidden' }}>
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => selectSuggestion(s)}
                  style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: i < suggestions.length - 1 ? '1px solid var(--color-border-glass)' : 'none', fontSize: '0.85rem', color: 'var(--color-text-main)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ color: 'var(--color-accent-gold)', marginRight: '6px' }}>📍</span>
                  {s.display_name.split(',').slice(0, 4).join(', ')}
                </div>
              ))}
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
