import React, { useState } from 'react';
import { astrologyService, type AstrologyCalcInput } from '../services/api';
import { Grid3X3 } from 'lucide-react';

const DEFAULT_INPUT: AstrologyCalcInput = {
  year: 1990, month: 11, day: 1,
  hour: 12, minute: 0,
  lat: 0, lon: 0, tzone: 5.5,
};

export const NavamsaChart: React.FC = () => {
  const [form, setForm] = useState<AstrologyCalcInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await astrologyService.navamsaChart(form);
      setResult(res.data?.data ?? res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to fetch Navamsa chart.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--color-accent-gold-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
          <Grid3X3 size={32} /> Navamsa Chart (D9)
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>
          The Navamsa (D9) chart reveals the soul's deeper dharmic path, marriage potential, and spiritual destiny.
        </p>
      </section>

      <div className="cosmic-card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {(['year', 'month', 'day', 'hour', 'minute', 'lat', 'lon', 'tzone'] as (keyof AstrologyCalcInput)[]).map((field) => (
              <div className="form-group" key={field}>
                <label style={{ textTransform: 'capitalize' }}>{field === 'lat' ? 'Latitude' : field === 'lon' ? 'Longitude' : field === 'tzone' ? 'Timezone' : field}</label>
                <input
                  type="number"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="form-input"
                  step="any"
                  required
                />
              </div>
            ))}
          </div>
          <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
            {loading ? 'Calculating...' : 'Generate Navamsa Chart'}
          </button>
        </form>
      </div>

      {error && (
        <div className="cosmic-card" style={{ borderColor: '#e74c3c', color: '#e74c3c', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {result && (
        <section className="cosmic-card">
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-accent-gold)', marginBottom: '24px' }}>
            Navamsa Chart Result
          </h2>
          <pre style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '12px',
            padding: '20px',
            overflowX: 'auto',
            fontSize: '0.9rem',
            color: 'var(--color-text-main)',
            border: '1px solid var(--color-border-glass)',
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
};
