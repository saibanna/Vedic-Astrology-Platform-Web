import React, { useState, useEffect } from 'react';
import { calculatorService } from '../services/api';
import { Loader } from 'lucide-react';

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border-glass)',
  borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.95rem', outline: 'none',
};

export const Panchang: React.FC = () => {
  const today = new Date();
  const [date, setDate] = useState(today.toISOString().split('T')[0]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async (d: string) => {
    setLoading(true);
    try {
      const [y, m, day] = d.split('-').map(Number);
      setResult((await calculatorService.panchang({ year: y, month: m, day, lat: 20.5937, lon: 78.9629, tzone: 5.5 })).data);
    } catch { /* silently fail, show stale */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(date); }, []);

  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    load(e.target.value);
  };

  const Cell = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div className="cosmic-card" style={{ textAlign: 'center', padding: '16px 12px' }}>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginBottom: '4px' }}>{label}</p>
      <p style={{ color: 'var(--color-accent-gold)', fontWeight: 700, fontSize: '1rem', marginBottom: sub ? '2px' : 0 }}>{value}</p>
      {sub && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', margin: 0 }}>{sub}</p>}
    </div>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem', marginBottom: '8px' }}>Daily Panchang</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Tithi, Nakshatra, Yoga, Karana, Vara — the five limbs of the Vedic calendar.</p>
      </section>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
        <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Select Date:</label>
        <input type="date" value={date} onChange={handleDate} style={inputStyle} />
        {loading && <Loader size={18} color="var(--color-accent-gold)" style={{ animation: 'spin 1s linear infinite' }} />}
      </div>

      {result && (
        <>
          {/* Header bar */}
          <div className="cosmic-card" style={{ textAlign: 'center', border: '1px solid var(--color-border-gold)', padding: '16px' }}>
            <h2 style={{ color: '#fff', marginBottom: '4px', fontSize: '1.2rem' }}>
              {new Date(result.date + 'T12:00').toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
            <p style={{ color: 'var(--color-accent-gold)', fontWeight: 600, margin: 0 }}>{result.vara} · Ruled by {result.varaLord}</p>
          </div>

          {/* 5 limbs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: '12px' }}>
            <Cell label="Tithi" value={result.tithi} sub={`#${result.tithiNumber} · ${result.paksha.split(' ')[0]}`} />
            <Cell label="Nakshatra" value={result.nakshatra} sub={`Lord: ${result.nakshatraLord}`} />
            <Cell label="Yoga" value={result.yoga} />
            <Cell label="Karana" value={result.karana} />
            <Cell label="Paksha" value={result.paksha.includes('Shukla') ? 'Shukla ☽' : 'Krishna ☾'} sub={result.paksha.split(' (')[0]} />
          </div>

          {/* Muhurtas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '12px' }}>
            <div className="cosmic-card" style={{ border: '1px solid rgba(220,50,50,0.3)' }}>
              <p style={{ color: '#e05252', fontWeight: 600, marginBottom: '4px', fontSize: '0.9rem' }}>🚫 Rahu Kaal</p>
              <p style={{ color: '#fff', fontWeight: 700 }}>{result.rahuKaal}</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Avoid important activities</p>
            </div>
            <div className="cosmic-card" style={{ border: '1px solid rgba(80,200,80,0.3)' }}>
              <p style={{ color: '#4caf50', fontWeight: 600, marginBottom: '4px', fontSize: '0.9rem' }}>✨ Brahma Muhurta</p>
              <p style={{ color: '#fff', fontWeight: 700 }}>{result.brahmaMuhurta}</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Best for meditation & study</p>
            </div>
            <div className="cosmic-card" style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
              <p style={{ color: 'var(--color-accent-gold)', fontWeight: 600, marginBottom: '4px', fontSize: '0.9rem' }}>⭐ Abhijit Muhurta</p>
              <p style={{ color: '#fff', fontWeight: 700 }}>{result.abhijitMuhurta}</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Auspicious midday window</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
