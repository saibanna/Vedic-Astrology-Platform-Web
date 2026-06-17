import React, { useState } from 'react';
import { BirthForm } from '../components/BirthForm';
import { calculatorService, type CalcInput } from '../services/api';
import { ShieldAlert, CheckCircle } from 'lucide-react';

export const SadeSati: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (input: CalcInput) => {
    setLoading(true); setError(''); setResult(null);
    try { setResult((await calculatorService.sadeSati(input)).data); }
    catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const active = result && (result.inSadeSati || result.inDhaiyya);

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem', marginBottom: '8px' }}>Sade Sati Calculator</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Check if Saturn's 7.5-year transit over your Moon sign is currently active.</p>
      </section>

      <BirthForm title="Enter Birth Details" subtitle="Compares Saturn's current position with your natal Moon sign." onSubmit={handleSubmit} loading={loading} error={error} />

      {result && (
        <div className="cosmic-card" style={{ border: `1px solid ${active ? 'rgba(100,100,220,0.4)' : 'rgba(80,200,80,0.3)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            {active ? <ShieldAlert size={36} color="#6464dc" /> : <CheckCircle size={36} color="#4caf50" />}
            <div>
              <h2 style={{ color: active ? '#6464dc' : '#4caf50', fontSize: '1.4rem', margin: 0 }}>
                {result.inSadeSati ? 'Sade Sati Active' : result.inDhaiyya ? 'Dhaiyya (Small Panoti) Active' : 'No Sade Sati / Dhaiyya'}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Moon: {result.moonSign} · Saturn: {result.saturnSign} (House {result.saturnHouse})
              </p>
            </div>
          </div>
          {result.phase && <p style={{ color: 'var(--color-accent-gold)', fontSize: '0.9rem', marginBottom: '12px', fontStyle: 'italic' }}>{result.phase}</p>}
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
