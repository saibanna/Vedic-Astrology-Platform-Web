import React, { useState } from 'react';
import { ChevronRight, Loader } from 'lucide-react';
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

export const BirthForm: React.FC<Props> = ({ title, subtitle, onSubmit, loading, error }) => {
  const [form, setForm] = useState({ dob: '', tob: '12:00', lat: '20.5937', lon: '78.9629' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [year, month, day] = form.dob.split('-').map(Number);
    const [hour, minute] = form.tob.split(':').map(Number);
    onSubmit({ year, month, day, hour: hour||12, minute: minute||0, lat: parseFloat(form.lat), lon: parseFloat(form.lon), tzone: 5.5 });
  };

  return (
    <div className="cosmic-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#fff', marginBottom: '6px', fontSize: '1.3rem' }}>{title}</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>{subtitle}</p>
      {error && (
        <div style={{ background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.3)', borderRadius: '8px', padding: '10px 14px', color: '#ff7070', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>
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
          <div>
            <label style={labelStyle}>Latitude</label>
            <input type="number" step="any" name="lat" value={form.lat} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Longitude</label>
            <input type="number" step="any" name="lon" value={form.lon} onChange={handleChange} style={inputStyle} />
          </div>
        </div>
        <button type="submit" className="btn-gold" disabled={loading} style={{ padding: '12px 24px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Calculating…</> : <>Calculate <ChevronRight size={18} /></>}
        </button>
      </form>
    </div>
  );
};
