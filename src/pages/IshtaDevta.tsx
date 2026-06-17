import React, { useState } from 'react';
import { BirthForm } from '../components/BirthForm';
import { calculatorService, type CalcInput } from '../services/api';
import { Star } from 'lucide-react';

export const IshtaDevta: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (input: CalcInput) => {
    setLoading(true); setError(''); setResult(null);
    try { setResult((await calculatorService.ishtaDevta(input)).data); }
    catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Star size={32} color="var(--color-accent-gold)" />
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem' }}>Ishta Devta Calculator</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)' }}>Discover your personal deity — the divine force most aligned with your soul's journey.</p>
      </section>

      <BirthForm title="Enter Birth Details" subtitle="Derived from your 12th house lord and Atmakaraka." onSubmit={handleSubmit} loading={loading} error={error} />

      {result && (
        <div className="cosmic-card" style={{ border: '1px solid var(--color-border-gold)', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '8px' }}>Your Ishta Devta</p>
          <h2 style={{ color: 'var(--color-accent-gold-light)', fontSize: '1.8rem', marginBottom: '4px' }}>{result.ishtaDevta}</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Lagna: {result.lagna} · 12th House: {result.twelfthSign} · Lord: {result.twelfthLord}
          </p>
          <div style={{ background: 'rgba(212,175,55,0.06)', borderRadius: '10px', padding: '14px 18px', marginBottom: '16px', border: '1px solid var(--color-border-gold)' }}>
            <p style={{ color: 'var(--color-accent-gold)', fontWeight: 600, marginBottom: '4px', fontSize: '1rem' }}>Your Mantra</p>
            <p style={{ color: '#fff', fontSize: '1.1rem', fontFamily: 'serif' }}>{result.mantra}</p>
          </div>
          <p style={{ color: 'var(--color-text-main)', lineHeight: '1.6', marginBottom: '12px', fontSize: '0.9rem' }}>{result.description}</p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>{result.practice}</p>
        </div>
      )}
    </div>
  );
};
