import React, { useState } from 'react';
import { BirthForm } from '../components/BirthForm';
import { calculatorService, type CalcInput } from '../services/api';
import { GitBranch } from 'lucide-react';

const PLANET_COLOR: Record<string, string> = {
  "Sun (Surya)":'#ff9d00',"Moon (Chandra)":'#c8d8e8',"Mars (Mangal)":'#e05252',
  "Mercury (Budh)":'#4caf7d',"Jupiter (Guru)":'#f0c040',"Venus (Shukra)":'#f8a8d0',
  "Saturn (Shani)":'#8888cc',"Rahu":'#9b59b6',"Ketu":'#795548',
};

export const PlanetaryAspects: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (input: CalcInput) => {
    setLoading(true); setError(''); setResult(null);
    try { setResult((await calculatorService.planetaryAspects(input)).data); }
    catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <GitBranch size={32} color="var(--color-accent-gold)" />
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem' }}>Planetary Aspects</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)' }}>Vedic whole-sign drishti — which planets and houses each planet aspects in your chart.</p>
      </section>

      <BirthForm title="Enter Birth Details" subtitle="Shows all Vedic aspects including Mars 4th/8th, Jupiter 5th/9th, Saturn 3rd/10th." onSubmit={handleSubmit} loading={loading} error={error} />

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', fontStyle: 'italic' }}>{result.note}</p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Lagna: <strong style={{ color: 'var(--color-accent-gold)' }}>{result.lagna}</strong></p>

          {result.aspects.map((a: any) => (
            <div key={a.planet} className="cosmic-card" style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '16px', alignItems: 'start' }}>
              <div>
                <p style={{ color: PLANET_COLOR[a.planet] || '#fff', fontWeight: 700, marginBottom: '2px' }}>{a.planet.split(' ')[0]}</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                  {a.fromSign} · House {a.fromHouse} {a.isRetrograde ? '℞' : ''}
                </p>
              </div>
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                  {a.aspectHouses.map((h: number, i: number) => (
                    <span key={h} style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--color-border-gold)', borderRadius: '6px', padding: '3px 10px', fontSize: '0.82rem', color: 'var(--color-accent-gold)' }}>
                      House {h} ({a.aspectSigns[i]})
                    </span>
                  ))}
                </div>
                {a.aspectsPlanets.length > 0 && (
                  <p style={{ color: '#4caf50', fontSize: '0.82rem' }}>
                    Aspects: {a.aspectsPlanets.map((p: string) => p.split(' ')[0]).join(', ')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
