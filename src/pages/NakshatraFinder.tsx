import React, { useState } from 'react';
import { BirthForm } from '../components/BirthForm';
import { calculatorService, type CalcInput } from '../services/api';
import { Star } from 'lucide-react';

export const NakshatraFinder: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (input: CalcInput) => {
    setLoading(true); setError(''); setResult(null);
    try { setResult((await calculatorService.nakshatra(input)).data); }
    catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem', marginBottom: '8px' }}>Nakshatra Finder</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Discover your birth Nakshatra (lunar mansion), its lord, deity, and symbol.</p>
      </section>

      <BirthForm title="Enter Birth Details" subtitle="Moon's position determines your Nakshatra." onSubmit={handleSubmit} loading={loading} error={error} />

      {result && (
        <div className="cosmic-card" style={{ border: '1px solid var(--color-border-gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Star size={36} color="var(--color-accent-gold)" />
            <div>
              <h2 style={{ color: 'var(--color-accent-gold-light)', fontSize: '1.6rem', margin: 0 }}>{result.nakshatra}</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>Pada {result.pada} · Moon in {result.moonSign} at {result.moonDegree}</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { label: 'Ruling Planet', value: result.lord },
              { label: 'Deity', value: result.deity },
              { label: 'Symbol', value: result.symbol },
            ].map(({ label, value }) => (
              <div key={label} className="cosmic-card" style={{ textAlign: 'center', padding: '16px' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', marginBottom: '6px' }}>{label}</p>
                <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>{value}</p>
              </div>
            ))}
          </div>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '16px', fontSize: '0.9rem', lineHeight: '1.6' }}>{result.description}</p>
        </div>
      )}
    </div>
  );
};
