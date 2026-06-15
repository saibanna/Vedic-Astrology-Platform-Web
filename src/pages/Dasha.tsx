import React, { useState } from 'react';
import { astrologyService, type AstrologyCalcInput } from '../services/api';
import { Clock } from 'lucide-react';

const DEFAULT_INPUT: AstrologyCalcInput = {
  year: 1990, month: 11, day: 1,
  hour: 12, minute: 0,
  lat: 0, lon: 0, tzone: 5.5,
};

export const Dasha: React.FC = () => {
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
      const res = await astrologyService.getDasha(form);
      setResult(res.data?.data ?? res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to fetch Dasha periods.');
    } finally {
      setLoading(false);
    }
  };

  // Render array of dasha periods as a table if the result is an array
  const dashaList: any[] = Array.isArray(result) ? result : result?.dashas ?? result?.periods ?? null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--color-accent-gold-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
          <Clock size={32} /> Vimshottari Dasha
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>
          Dasha periods reveal planetary timelines that govern key life events, transitions, and karmic cycles.
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
            {loading ? 'Calculating...' : 'Get Dasha Periods'}
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
            Dasha Periods
          </h2>

          {dashaList ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border-glass)', color: 'var(--color-accent-gold)' }}>
                    {Object.keys(dashaList[0] ?? {}).map((col) => (
                      <th key={col} style={{ padding: '12px', textTransform: 'capitalize' }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dashaList.map((row: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'top' }}>
                      {Object.values(row).map((val: any, j: number) => (
                        <td key={j} style={{ padding: '12px' }}>
                          {Array.isArray(val) ? (
                            <table style={{ borderCollapse: 'collapse', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                              <thead>
                                <tr style={{ color: 'var(--color-accent-gold)' }}>
                                  {Object.keys(val[0] ?? {}).map((k) => (
                                    <th key={k} style={{ padding: '4px 8px', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{k}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {val.map((sub: any, si: number) => (
                                  <tr key={si} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                    {Object.values(sub).map((sv: any, sj: number) => (
                                      <td key={sj} style={{ padding: '4px 8px', whiteSpace: 'nowrap' }}>{String(sv)}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            String(val)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
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
          )}
        </section>
      )}
    </div>
  );
};
