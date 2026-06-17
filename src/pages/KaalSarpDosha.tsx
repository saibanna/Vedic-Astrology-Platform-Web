import React, { useState } from 'react';
import { BirthForm } from '../components/BirthForm';
import { calculatorService, type CalcInput } from '../services/api';
import { ShieldAlert, CheckCircle } from 'lucide-react';

export const KaalSarpDosha: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (input: CalcInput) => {
    setLoading(true); setError(''); setResult(null);
    try { setResult((await calculatorService.kaalSarp(input)).data); }
    catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem', marginBottom: '8px' }}>Kaal Sarp Dosha Calculator</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Discover if all planets are hemmed between Rahu and Ketu in your chart.</p>
      </section>

      <BirthForm title="Enter Birth Details" subtitle="Full planetary analysis across the Rahu-Ketu axis." onSubmit={handleSubmit} loading={loading} error={error} />

      {result && (
        <div className="cosmic-card" style={{ border: `1px solid ${result.isKaalSarp ? 'rgba(155,89,182,0.5)' : result.isPartial ? 'rgba(230,160,50,0.4)' : 'rgba(80,200,80,0.3)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            {result.isKaalSarp || result.isPartial
              ? <ShieldAlert size={36} color={result.isKaalSarp ? '#9b59b6' : '#e6a032'} />
              : <CheckCircle size={36} color="#4caf50" />}
            <div>
              <h2 style={{ color: result.isKaalSarp ? '#9b59b6' : result.isPartial ? '#e6a032' : '#4caf50', fontSize: '1.4rem', margin: 0 }}>
                {result.isKaalSarp ? `${result.type} Kaal Sarp Dosha` : result.isPartial ? 'Partial Kaal Sarp Dosha' : 'No Kaal Sarp Dosha'}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Rahu: {result.rahuSign} (House {result.rahuHouse}) · Ketu: {result.ketuSign} (House {result.ketuHouse})
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
