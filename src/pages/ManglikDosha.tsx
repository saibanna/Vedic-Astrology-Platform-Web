import React, { useState } from 'react';
import { BirthForm } from '../components/BirthForm';
import { calculatorService, type CalcInput } from '../services/api';
import { ShieldAlert, CheckCircle } from 'lucide-react';

export const ManglikDosha: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (input: CalcInput) => {
    setLoading(true); setError(''); setResult(null);
    try { setResult((await calculatorService.manglik(input)).data); }
    catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem', marginBottom: '8px' }}>Manglik Dosha Calculator</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Check if Mars creates Manglik Dosha in your birth chart and its impact on marriage.</p>
      </section>

      <BirthForm title="Enter Birth Details" subtitle="We analyse Mars placement across all 12 houses." onSubmit={handleSubmit} loading={loading} error={error} />

      {result && (
        <div className="cosmic-card" style={{ border: `1px solid ${result.isManglik ? 'rgba(220,80,80,0.4)' : 'rgba(80,200,80,0.3)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            {result.isManglik
              ? <ShieldAlert size={36} color="#e05252" />
              : <CheckCircle size={36} color="#4caf50" />}
            <div>
              <h2 style={{ color: result.isManglik ? '#e05252' : '#4caf50', fontSize: '1.4rem', margin: 0 }}>
                {result.cancelled ? 'Manglik Dosha Cancelled' : result.isManglik ? `Manglik Dosha — ${result.intensity} Intensity` : 'No Manglik Dosha'}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Mars in {result.marsSign}, House {result.marsHouse}
              </p>
            </div>
          </div>
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
