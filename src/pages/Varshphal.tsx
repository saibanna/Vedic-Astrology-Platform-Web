import React, { useState } from 'react';
import { BirthForm } from '../components/BirthForm';
import { calculatorService, type CalcInput } from '../services/api';
import { CalendarDays } from 'lucide-react';

const PLANET_COLOR: Record<string, string> = {
  "Sun (Surya)":'#ff9d00',"Moon (Chandra)":'#c8d8e8',"Mars (Mangal)":'#e05252',
  "Mercury (Budh)":'#4caf7d',"Jupiter (Guru)":'#f0c040',"Venus (Shukra)":'#f8a8d0',
  "Saturn (Shani)":'#8888cc',"Rahu":'#9b59b6',"Ketu":'#795548',
};

export const Varshphal: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (input: CalcInput) => {
    setLoading(true); setError(''); setResult(null);
    try { setResult((await calculatorService.varshphal(input)).data); }
    catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <CalendarDays size={32} color="var(--color-accent-gold)" />
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem' }}>Varshphal — Solar Return</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)' }}>Annual chart cast at the exact moment the Sun returns to its natal degree — predicts the themes of your current year.</p>
      </section>

      <BirthForm title="Enter Birth Details" subtitle="We find the exact Solar Return moment and cast a new chart." onSubmit={handleSubmit} loading={loading} error={error} />

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="cosmic-card" style={{ border: '1px solid var(--color-border-gold)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', textAlign: 'center' }}>
            {[['Solar Return Date', result.solarReturnDate],['SR Lagna', result.srLagna],['Return Year', result.solarReturnYear]].map(([k,v]) => (
              <div key={k as string}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', marginBottom: '4px' }}>{k}</p>
                <p style={{ color: 'var(--color-accent-gold)', fontWeight: 700, fontSize: '1.05rem' }}>{v}</p>
              </div>
            ))}
          </div>

          <div className="cosmic-card">
            <p style={{ color: '#aed6f1', fontStyle: 'italic', marginBottom: '16px' }}>{result.theme}</p>
            <h4 style={{ color: '#fff', marginBottom: '12px' }}>Solar Return Planetary Positions</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border-glass)' }}>
                    {['Planet','Sign','House','Degree'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', color: 'var(--color-accent-gold)', textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.planets.map((p: any) => (
                    <tr key={p.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '8px 12px', color: PLANET_COLOR[p.name] || '#fff', fontWeight: 500 }}>{p.name.split(' ')[0]}</td>
                      <td style={{ padding: '8px 12px', color: '#fff' }}>{p.sign}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--color-text-muted)' }}>House {p.house}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--color-text-muted)' }}>{p.degree}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
