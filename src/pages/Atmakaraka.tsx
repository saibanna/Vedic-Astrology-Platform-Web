import React, { useState } from 'react';
import { BirthForm } from '../components/BirthForm';
import { calculatorService, type CalcInput } from '../services/api';
import { Sparkles } from 'lucide-react';

export const Atmakaraka: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (input: CalcInput) => {
    setLoading(true); setError(''); setResult(null);
    try { setResult((await calculatorService.atmakaraka(input)).data); }
    catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem', marginBottom: '8px' }}>Atmakaraka Calculator</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Find the planet with the highest degree — the significator of your soul's deepest desire.</p>
      </section>

      <BirthForm title="Enter Birth Details" subtitle="Jaimini astrology: the planet at the highest degree is your Atmakaraka." onSubmit={handleSubmit} loading={loading} error={error} />

      {result && (
        <div className="cosmic-card" style={{ border: '1px solid var(--color-border-gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <Sparkles size={36} color="var(--color-accent-gold)" />
            <div>
              <h2 style={{ color: 'var(--color-accent-gold-light)', fontSize: '1.5rem', margin: 0 }}>{result.atmakaraka}</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
                {result.sign} · {result.degree} · House {result.house}
              </p>
            </div>
          </div>
          <p style={{ color: '#aed6f1', lineHeight: '1.7', marginBottom: '12px', fontStyle: 'italic', fontSize: '1rem' }}>{result.meaning}</p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>{result.description}</p>
        </div>
      )}
    </div>
  );
};
