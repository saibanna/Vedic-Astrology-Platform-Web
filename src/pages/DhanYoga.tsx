import React, { useState } from 'react';
import { BirthForm } from '../components/BirthForm';
import { calculatorService, type CalcInput } from '../services/api';
import { TrendingUp, CheckCircle } from 'lucide-react';

export const DhanYoga: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (input: CalcInput) => {
    setLoading(true); setError(''); setResult(null);
    try { setResult((await calculatorService.dhanYoga(input)).data); }
    catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const strengthColor = (s: string) => s === 'Strong' ? '#4caf50' : s === 'Moderate' ? '#f0c040' : 'var(--color-text-muted)';

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <TrendingUp size={32} color="var(--color-accent-gold)" />
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem' }}>Dhan Yoga Calculator</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)' }}>Identify wealth yogas in your birth chart — combinations that indicate financial prosperity.</p>
      </section>

      <BirthForm title="Enter Birth Details" subtitle="Analyses 2nd, 5th, 9th, and 11th house lords plus planetary conjunctions." onSubmit={handleSubmit} loading={loading} error={error} />

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="cosmic-card" style={{ textAlign: 'center', border: `1px solid ${strengthColor(result.strength)}40` }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '6px' }}>Wealth Potential</p>
            <h2 style={{ color: strengthColor(result.strength), fontSize: '1.6rem', marginBottom: '4px' }}>{result.strength}</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{result.count} Dhan Yoga{result.count !== 1 ? 's' : ''} found · Lagna: {result.lagna}</p>
          </div>

          {result.wealthYogas.length > 0 ? (
            result.wealthYogas.map((y: any, i: number) => (
              <div key={i} className="cosmic-card" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', border: '1px solid rgba(80,200,80,0.2)' }}>
                <CheckCircle size={22} color="#4caf50" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ color: '#4caf50', fontWeight: 700, marginBottom: '4px' }}>{y.yoga}</p>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>{y.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="cosmic-card">
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{result.summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
