import React, { useState } from 'react';
import { BirthForm } from '../components/BirthForm';
import { calculatorService, type CalcInput } from '../services/api';
import { Baby } from 'lucide-react';

export const BabyName: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (input: CalcInput) => {
    setLoading(true); setError(''); setResult(null);
    try { setResult((await calculatorService.babyName(input)).data); }
    catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Baby size={32} color="var(--color-accent-gold)" />
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem' }}>Baby Name Suggestion</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)' }}>Vedic naming based on the baby's birth Nakshatra and Pada — the traditional Nama Akshara system.</p>
      </section>

      <BirthForm title="Enter Baby's Birth Details" subtitle="The Moon's nakshatra at birth determines the auspicious first syllable." onSubmit={handleSubmit} loading={loading} error={error} />

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="cosmic-card" style={{ border: '1px solid var(--color-border-gold)', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '6px' }}>Birth Nakshatra</p>
            <h2 style={{ color: 'var(--color-accent-gold-light)', fontSize: '1.6rem', marginBottom: '4px' }}>{result.nakshatra} · Pada {result.pada}</h2>
            <div style={{ display: 'inline-block', background: 'rgba(212,175,55,0.12)', border: '2px solid var(--color-accent-gold)', borderRadius: '12px', padding: '10px 28px', margin: '12px 0' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginBottom: '2px' }}>Recommended starting syllable</p>
              <p style={{ color: 'var(--color-accent-gold)', fontWeight: 700, fontSize: '2rem', margin: 0 }}>{result.recommendedStartingSyllable}</p>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
              All syllables for {result.nakshatra}: <strong style={{ color: '#fff' }}>{result.allSyllablesForNakshatra.join(', ')}</strong>
            </p>
          </div>

          <div className="cosmic-card">
            <h4 style={{ color: 'var(--color-accent-gold)', marginBottom: '14px' }}>Sample Names Starting with "{result.recommendedStartingSyllable}"</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {result.sampleNames.map((name: string) => (
                <span key={name} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border-glass)', borderRadius: '20px', padding: '6px 16px', color: '#fff', fontSize: '0.95rem' }}>{name}</span>
              ))}
            </div>
          </div>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', fontStyle: 'italic', textAlign: 'center' }}>{result.note}</p>
        </div>
      )}
    </div>
  );
};
