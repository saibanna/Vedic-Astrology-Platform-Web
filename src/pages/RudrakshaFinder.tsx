import React, { useState } from 'react';
import { BirthForm } from '../components/BirthForm';
import { calculatorService, type CalcInput } from '../services/api';
import { Circle } from 'lucide-react';

export const RudrakshaFinder: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (input: CalcInput) => {
    setLoading(true); setError(''); setResult(null);
    try { setResult((await calculatorService.rudraksha(input)).data); }
    catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const BeadCard = ({ label, rec }: { label: string; rec: any }) => (
    <div className="cosmic-card" style={{ border: '1px solid var(--color-border-gold)', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <Circle size={28} color="var(--color-accent-gold)" fill="rgba(212,175,55,0.15)" />
        <div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', margin: 0 }}>{label}</p>
          <h3 style={{ color: 'var(--color-accent-gold-light)', fontSize: '1.3rem', margin: 0 }}>{rec.beads} Mukhi Rudraksha</h3>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
        {[['Deity', rec.deity], ['Planet', rec.planet]].map(([k, v]) => (
          <p key={k} style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
            <strong style={{ color: 'var(--color-text-main)' }}>{k}:</strong> {v}
          </p>
        ))}
      </div>
      <p style={{ color: '#aed6f1', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '12px' }}>{rec.benefit}</p>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>{rec.howToWear}</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem', marginBottom: '8px' }}>Rudraksha Suggestion</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Find the right Rudraksha bead based on your birth Nakshatra and Lagna.</p>
      </section>

      <BirthForm title="Enter Birth Details" subtitle="Nakshatra and Lagna determine your ideal Rudraksha." onSubmit={handleSubmit} loading={loading} error={error} />

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[['Nakshatra', result.nakshatra], ['Lagna', result.lagna]].map(([k, v]) => (
              <span key={k} style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid var(--color-border-gold)', borderRadius: '20px', padding: '4px 14px', fontSize: '0.85rem', color: 'var(--color-accent-gold)' }}>
                {k}: {v}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <BeadCard label="Primary (Nakshatra-based)" rec={result.primary} />
            <BeadCard label="Secondary (Lagna-based)" rec={result.secondary} />
          </div>
        </div>
      )}
    </div>
  );
};
