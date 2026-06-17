import React, { useState } from 'react';
import { BirthForm } from '../components/BirthForm';
import { calculatorService, type CalcInput } from '../services/api';
import { ShieldAlert, CheckCircle } from 'lucide-react';

export const PitraDosha: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (input: CalcInput) => {
    setLoading(true); setError(''); setResult(null);
    try { setResult((await calculatorService.pitraDosha(input)).data); }
    catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem', marginBottom: '8px' }}>Pitra Dosha Calculator</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Identify ancestral karma affecting your life through Sun, Rahu, and 9th house analysis.</p>
      </section>

      <BirthForm title="Enter Birth Details" subtitle="Analyses Sun, Rahu/Ketu placement and 9th house indicators." onSubmit={handleSubmit} loading={loading} error={error} />

      {result && (
        <div className="cosmic-card" style={{ border: `1px solid ${result.isPitraDosha ? 'rgba(220,150,50,0.4)' : 'rgba(80,200,80,0.3)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            {result.isPitraDosha ? <ShieldAlert size={36} color="#dc9632" /> : <CheckCircle size={36} color="#4caf50" />}
            <div>
              <h2 style={{ color: result.isPitraDosha ? '#dc9632' : '#4caf50', fontSize: '1.4rem', margin: 0 }}>
                {result.isPitraDosha ? `Pitra Dosha Present — ${result.intensity}` : 'No Pitra Dosha'}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Sun in House {result.sunHouse} ({result.sunSign})
              </p>
            </div>
          </div>
          {result.indicators?.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ color: 'var(--color-accent-gold)', marginBottom: '8px', fontSize: '0.9rem' }}>Indicators Found</h4>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {result.indicators.map((ind: string, i: number) => (
                  <li key={i} style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{ind}</li>
                ))}
              </ul>
            </div>
          )}
          <p style={{ color: 'var(--color-text-main)', lineHeight: '1.6', marginBottom: result.remedies?.length ? '20px' : 0 }}>{result.description}</p>
          {result.remedies?.length > 0 && (
            <>
              <h4 style={{ color: 'var(--color-accent-gold)', marginBottom: '10px' }}>Recommended Remedies</h4>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {result.remedies.map((r: string, i: number) => (
                  <li key={i} style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{r}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};
