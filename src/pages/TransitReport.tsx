import React, { useState } from 'react';
import { BirthForm } from '../components/BirthForm';
import { calculatorService, type CalcInput } from '../services/api';
import { ArrowRight } from 'lucide-react';

const PLANET_COLOR: Record<string,string> = {
  "Sun (Surya)":'#ff9d00',"Moon (Chandra)":'#c8d8e8',"Mars (Mangal)":'#e05252',
  "Mercury (Budh)":'#4caf7d',"Jupiter (Guru)":'#f0c040',"Venus (Shukra)":'#f8c8e0',
  "Saturn (Shani)":'#8888cc',"Rahu":'#9b59b6',"Ketu":'#795548',
};

export const TransitReport: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (input: CalcInput) => {
    setLoading(true); setError(''); setResult(null);
    try { setResult((await calculatorService.transitReport(input)).data); }
    catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem', marginBottom: '8px' }}>Transit Report</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Current planetary positions compared with your natal chart — what the planets are activating in your life right now.</p>
      </section>

      <BirthForm title="Enter Your Birth Details" subtitle="We'll compare today's sky against your natal chart." onSubmit={handleSubmit} loading={loading} error={error} />

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#fff' }}>Transit Date: {result.transitDate}</h3>
            <span style={{ color: 'var(--color-accent-gold)', fontSize: '0.9rem' }}>Lagna: {result.lagna}</span>
          </div>

          {/* Significant transits first */}
          {result.significant?.length > 0 && (
            <div>
              <h4 style={{ color: 'var(--color-accent-gold)', marginBottom: '12px' }}>⭐ Major Transits (Jupiter, Saturn, Rahu, Ketu)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {result.significant.map((t: any) => (
                  <div key={t.planet} className="cosmic-card" style={{ border: `1px solid ${PLANET_COLOR[t.planet] || '#888'}40`, display: 'grid', gridTemplateColumns: '180px 1fr', gap: '16px', alignItems: 'center' }}>
                    <div>
                      <p style={{ color: PLANET_COLOR[t.planet] || '#888', fontWeight: 700 }}>{t.planet}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                        <span>House {t.natalHouse}</span>
                        <ArrowRight size={12} />
                        <span style={{ color: PLANET_COLOR[t.planet] || '#888', fontWeight: 600 }}>House {t.transitHouse}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{t.transitSign} {t.isRetrograde ? '℞' : ''}</p>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>{t.effect}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All transits table */}
          <div className="cosmic-card">
            <h4 style={{ color: '#fff', marginBottom: '14px' }}>All Planetary Transits</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0', fontSize: '0.8rem' }}>
              {['Planet','Transit Sign / House','Natal Sign / House','Speed'].map(h => (
                <div key={h} style={{ padding: '8px 10px', background: 'rgba(212,175,55,0.1)', color: 'var(--color-accent-gold)', fontWeight: 600 }}>{h}</div>
              ))}
              {result.transits.map((t: any, i: number) => (
                [
                  <div key={`a${i}`} style={{ padding: '8px 10px', borderBottom: '1px solid var(--color-border-glass)', color: PLANET_COLOR[t.planet] || '#fff', fontWeight: 500 }}>{t.planet.split(' ')[0]} {t.isRetrograde ? '℞' : ''}</div>,
                  <div key={`b${i}`} style={{ padding: '8px 10px', borderBottom: '1px solid var(--color-border-glass)', color: '#fff' }}>{t.transitSign} / H{t.transitHouse}</div>,
                  <div key={`c${i}`} style={{ padding: '8px 10px', borderBottom: '1px solid var(--color-border-glass)', color: 'var(--color-text-muted)' }}>{t.natalSign} / H{t.natalHouse}</div>,
                  <div key={`d${i}`} style={{ padding: '8px 10px', borderBottom: '1px solid var(--color-border-glass)', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{t.speed}</div>,
                ]
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
