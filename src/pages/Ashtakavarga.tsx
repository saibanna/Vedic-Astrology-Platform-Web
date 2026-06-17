import React, { useState } from 'react';
import { BirthForm } from '../components/BirthForm';
import { calculatorService, type CalcInput } from '../services/api';
import { BarChart3 } from 'lucide-react';

export const Ashtakavarga: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (input: CalcInput) => {
    setLoading(true); setError(''); setResult(null);
    try { setResult((await calculatorService.ashtakavarga(input)).data); }
    catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const strengthColor = (pts: number) => pts >= 30 ? '#4caf50' : pts >= 25 ? '#f0c040' : '#e05252';
  const maxSAV = result ? Math.max(...result.signs.map((s: any) => s.savPoints), 1) : 1;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <BarChart3 size={32} color="var(--color-accent-gold)" />
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem' }}>Ashtakavarga</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)' }}>Planetary strength scoring system — identifies strong and weak signs for each planet and transits.</p>
      </section>

      <BirthForm title="Enter Birth Details" subtitle="Calculates Sarvashtakavarga (SAV) — total benefic points across all 12 signs." onSubmit={handleSubmit} loading={loading} error={error} />

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* SAV Bar Chart */}
          <div className="cosmic-card" style={{ border: '1px solid var(--color-border-gold)' }}>
            <h3 style={{ color: '#fff', marginBottom: '4px' }}>Sarvashtakavarga (SAV) — Total Points Per Sign</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: '20px' }}>Signs with 30+ points are strong for planet transits. Below 25 is weak.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {result.signs.map((s: any) => (
                <div key={s.sign} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 36px', gap: '10px', alignItems: 'center' }}>
                  <span style={{ color: '#fff', fontSize: '0.88rem' }}>{s.sign}</span>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '18px', overflow: 'hidden' }}>
                    <div style={{ width: `${(s.savPoints / maxSAV) * 100}%`, height: '100%', background: strengthColor(s.savPoints), borderRadius: '4px', transition: 'width 0.5s' }} />
                  </div>
                  <span style={{ color: strengthColor(s.savPoints), fontWeight: 700, fontSize: '0.9rem', textAlign: 'right' }}>{s.savPoints}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Strong / Weak summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="cosmic-card" style={{ border: '1px solid rgba(80,200,80,0.3)' }}>
              <h4 style={{ color: '#4caf50', marginBottom: '10px' }}>✓ Strong Signs (30+ pts)</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {result.interpretation.strong.map((s: string) => (
                  <span key={s} style={{ background: 'rgba(80,200,80,0.1)', border: '1px solid rgba(80,200,80,0.3)', borderRadius: '16px', padding: '3px 10px', color: '#4caf50', fontSize: '0.82rem' }}>{s}</span>
                ))}
                {result.interpretation.strong.length === 0 && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>None</p>}
              </div>
            </div>
            <div className="cosmic-card" style={{ border: '1px solid rgba(220,80,80,0.3)' }}>
              <h4 style={{ color: '#e05252', marginBottom: '10px' }}>✗ Weak Signs (&lt;25 pts)</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {result.interpretation.weak.map((s: string) => (
                  <span key={s} style={{ background: 'rgba(220,80,80,0.1)', border: '1px solid rgba(220,80,80,0.3)', borderRadius: '16px', padding: '3px 10px', color: '#e05252', fontSize: '0.82rem' }}>{s}</span>
                ))}
                {result.interpretation.weak.length === 0 && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>None</p>}
              </div>
            </div>
          </div>

          {/* Planet totals */}
          <div className="cosmic-card">
            <h4 style={{ color: '#fff', marginBottom: '12px' }}>Bhinna Ashtakavarga — Planet Totals</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: '10px', textAlign: 'center' }}>
              {Object.entries(result.planetTotals).map(([planet, pts]: any) => (
                <div key={planet} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '10px' }}>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem', marginBottom: '4px' }}>{planet}</p>
                  <p style={{ color: pts >= 28 ? '#4caf50' : pts >= 22 ? '#f0c040' : '#e05252', fontWeight: 700, fontSize: '1.2rem', margin: 0 }}>{pts}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
