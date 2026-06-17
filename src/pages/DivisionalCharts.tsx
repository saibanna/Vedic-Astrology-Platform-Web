import React, { useState } from 'react';
import { BirthForm } from '../components/BirthForm';
import { calculatorService, type CalcInput } from '../services/api';
import { Grid3X3 } from 'lucide-react';

const DIVISIONS = [
  { d: 3,  label: 'D3 – Drekkana',   theme: 'Siblings, courage, short travels' },
  { d: 7,  label: 'D7 – Saptamsha',  theme: 'Children, progeny, creativity' },
  { d: 10, label: 'D10 – Dashamsha', theme: 'Career, profession, public status' },
];

const PLANET_COLOR: Record<string, string> = {
  "Sun (Surya)":'#ff9d00',"Moon (Chandra)":'#c8d8e8',"Mars (Mangal)":'#e05252',
  "Mercury (Budh)":'#4caf7d',"Jupiter (Guru)":'#f0c040',"Venus (Shukra)":'#f8a8d0',
  "Saturn (Shani)":'#8888cc',"Rahu":'#9b59b6',"Ketu":'#795548',
};

export const DivisionalCharts: React.FC = () => {
  const [activeD, setActiveD] = useState(10);
  const [results, setResults] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (input: CalcInput) => {
    setLoading(true); setError(''); setSubmitted(false);
    try {
      const [d3, d7, d10] = await Promise.all(
        [3, 7, 10].map(d => calculatorService.divisionalChart({ ...input, division: d }))
      );
      setResults({ 3: d3.data, 7: d7.data, 10: d10.data });
      setSubmitted(true);
    } catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const result = results[activeD];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Grid3X3 size={32} color="var(--color-accent-gold)" />
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem' }}>Divisional Charts</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)' }}>D3 Drekkana · D7 Saptamsha · D10 Dashamsha — deeper insight into specific life areas.</p>
      </section>

      <BirthForm title="Enter Birth Details" subtitle="All three divisional charts are calculated simultaneously." onSubmit={handleSubmit} loading={loading} error={error} />

      {submitted && result && (
        <>
          {/* Tab selector */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {DIVISIONS.map(({ d, label, theme }) => (
              <button key={d} onClick={() => setActiveD(d)} style={{
                flex: 1, padding: '12px', borderRadius: '10px', cursor: 'pointer',
                background: activeD === d ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${activeD === d ? 'var(--color-accent-gold)' : 'var(--color-border-glass)'}`,
                textAlign: 'center',
              }}>
                <p style={{ color: activeD === d ? 'var(--color-accent-gold)' : '#fff', fontWeight: 700, margin: '0 0 2px' }}>{label}</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', margin: 0 }}>{theme}</p>
              </button>
            ))}
          </div>

          <div className="cosmic-card" style={{ border: '1px solid var(--color-border-gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#fff', margin: 0 }}>{result.chartName}</h3>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', margin: 0 }}>Lagna</p>
                <p style={{ color: 'var(--color-accent-gold)', fontWeight: 700, margin: 0 }}>{result.divLagna}</p>
              </div>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '20px', fontStyle: 'italic' }}>{result.theme}</p>

            {/* Planet table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border-glass)' }}>
                    {['Planet','Natal Sign','D'+activeD+' Sign','House'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', color: 'var(--color-accent-gold)', textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.planets.map((p: any) => (
                    <tr key={p.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '8px 12px', color: PLANET_COLOR[p.name] || '#fff', fontWeight: 500 }}>
                        {p.name.split(' ')[0]} {p.isRetrograde ? '℞' : ''}
                      </td>
                      <td style={{ padding: '8px 12px', color: 'var(--color-text-muted)' }}>{p.natalSign}</td>
                      <td style={{ padding: '8px 12px', color: '#fff', fontWeight: 600 }}>{p.divSign}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--color-text-muted)' }}>House {p.divHouse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
