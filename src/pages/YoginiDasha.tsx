import React, { useState } from 'react';
import { BirthForm } from '../components/BirthForm';
import { calculatorService, type CalcInput } from '../services/api';

const YOGINI_COLORS: Record<string, string> = {
  Mangala:'#e05252', Pingala:'#ff9d00', Dhanya:'#4caf7d', Bhramari:'#e05252',
  Bhadrika:'#4caf50', Ulka:'#8888cc', Siddha:'#f8c8e0', Sankata:'#9b59b6',
};

export const YoginiDasha: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (input: CalcInput) => {
    setLoading(true); setError(''); setResult(null);
    try { setResult((await calculatorService.yoginiDasha(input)).data); }
    catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem', marginBottom: '8px' }}>Yogini Dasha Calculator</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>An alternative 36-year dasha cycle based on 8 Yoginis — swift and revealing for short-term predictions.</p>
      </section>

      <BirthForm title="Enter Birth Details" subtitle="Moon's nakshatra determines your Yogini Dasha sequence." onSubmit={handleSubmit} loading={loading} error={error} />

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="cosmic-card" style={{ border: '1px solid var(--color-border-gold)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', textAlign: 'center' }}>
            {[['Nakshatra', result.nakshatra], ['Current Yogini', result.currentYogini], ['Ruling Planet', result.currentPlanet]].map(([k,v]) => (
              <div key={k}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', marginBottom: '4px' }}>{k}</p>
                <p style={{ color: 'var(--color-accent-gold)', fontWeight: 700, fontSize: '1.1rem' }}>{v}</p>
              </div>
            ))}
          </div>

          <h3 style={{ color: '#fff' }}>All 8 Yogini Periods</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {result.dashas.map((d: any) => {
              const isCurrent = d.startDate <= today && today <= d.endDate;
              return (
                <div key={d.yogini} className="cosmic-card" style={{
                  display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 18px',
                  border: isCurrent ? `1px solid ${YOGINI_COLORS[d.yogini] || 'var(--color-border-gold)'}` : undefined,
                  background: isCurrent ? 'rgba(212,175,55,0.04)' : undefined,
                }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: YOGINI_COLORS[d.yogini] || '#888', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ color: isCurrent ? 'var(--color-accent-gold)' : '#fff', fontWeight: isCurrent ? 700 : 400 }}>
                      {d.yogini} {isCurrent && '← Current'}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginLeft: '10px' }}>ruled by {d.planet}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: 0 }}>{d.startDate} → {d.endDate}</p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', margin: 0 }}>{d.years} yrs</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
