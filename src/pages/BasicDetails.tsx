import React, { useState } from 'react';
import { BirthForm } from '../components/BirthForm';
import { calculatorService, type CalcInput } from '../services/api';
import { Compass } from 'lucide-react';

export const BasicDetails: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (input: CalcInput) => {
    setLoading(true); setError(''); setResult(null);
    try { setResult((await calculatorService.basicDetails(input)).data); }
    catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem', marginBottom: '8px' }}>Ascendant & Moon Sign Calculator</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Find your rising sign (Lagna), Moon sign (Rashi), Sun sign, and birth Nakshatra instantly.</p>
      </section>

      <BirthForm title="Enter Birth Details" subtitle="Accurate time of birth gives the most precise Ascendant." onSubmit={handleSubmit} loading={loading} error={error} />

      {result && (
        <div className="cosmic-card" style={{ border: '1px solid var(--color-border-gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Compass size={32} color="var(--color-accent-gold)" />
            <h3 style={{ color: '#fff', margin: 0 }}>Your Vedic Chart Basics</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {[
              { label: 'Ascendant (Lagna)', value: result.ascendant, sub: result.ascendantDegree },
              { label: 'Moon Sign (Rashi)', value: result.moonSign, sub: 'Your emotional nature' },
              { label: 'Sun Sign', value: result.sunSign, sub: 'Your core identity' },
              { label: 'Birth Nakshatra', value: result.nakshatra, sub: `Ruled by ${result.nakshatraLord}` },
            ].map(({ label, value, sub }) => (
              <div key={label} className="cosmic-card" style={{ textAlign: 'center', padding: '20px' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', marginBottom: '6px' }}>{label}</p>
                <p style={{ color: 'var(--color-accent-gold)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '4px' }}>{value}</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', margin: 0 }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
