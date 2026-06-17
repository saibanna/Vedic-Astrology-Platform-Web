import React, { useState, useEffect } from 'react';
import { calculatorService } from '../services/api';
import { Sun } from 'lucide-react';

const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const SIGN_EMOJIS: Record<string,string> = {
  Aries:"♈",Taurus:"♉",Gemini:"♊",Cancer:"♋",Leo:"♌",Virgo:"♍",
  Libra:"♎",Scorpio:"♏",Sagittarius:"♐",Capricorn:"♑",Aquarius:"♒",Pisces:"♓",
};

export const Horoscope: React.FC = () => {
  const [type, setType] = useState<'daily'|'monthly'|'weekly'|'yearly'>('daily');
  const [sign, setSign] = useState('Aries');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async (s: string, t: 'daily'|'monthly'|'yearly'|'weekly') => {
    setLoading(true);
    try {
      const res = t === 'yearly'
        ? await calculatorService.yearlyHoroscope(s, new Date().getFullYear())
        : await calculatorService.horoscope(s, t as 'daily'|'monthly'|'weekly');
      setResult(res.data);
    }
    catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { load(sign, type); }, [sign, type]);

  const btnBase: React.CSSProperties = { padding: '8px 20px', borderRadius: '20px', border: '1px solid var(--color-border-glass)', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', transition: 'all 0.2s' };


  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Sun size={32} color="var(--color-accent-gold)" />
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem' }}>Horoscope</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)' }}>Sun-sign predictions guided by planetary transits.</p>
      </section>

      {/* Type toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        {(['daily','weekly','monthly','yearly'] as const).map(t => (
          <button key={t} onClick={() => setType(t)} style={{
            ...btnBase,
            background: type === t ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
            color: type === t ? 'var(--color-accent-gold)' : 'var(--color-text-muted)',
            borderColor: type === t ? 'var(--color-accent-gold)' : 'var(--color-border-glass)',
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Sign grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
        {SIGNS.map(s => (
          <button key={s} onClick={() => setSign(s)} style={{
            background: sign === s ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${sign === s ? 'var(--color-accent-gold)' : 'var(--color-border-glass)'}`,
            borderRadius: '10px', padding: '10px 4px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
          }}>
            <div style={{ fontSize: '1.4rem' }}>{SIGN_EMOJIS[s]}</div>
            <div style={{ color: sign === s ? 'var(--color-accent-gold)' : 'var(--color-text-muted)', fontSize: '0.72rem', marginTop: '3px' }}>{s}</div>
          </button>
        ))}
      </div>

      {/* Result */}
      {loading && <div style={{ textAlign:'center', color:'var(--color-text-muted)', padding:'32px' }}>Loading…</div>}
      {result && !loading && (
        <div className="cosmic-card" style={{ border: '1px solid var(--color-border-gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <span style={{ fontSize: '3rem' }}>{SIGN_EMOJIS[result.sign]}</span>
            <div>
              <h2 style={{ color: 'var(--color-accent-gold-light)', fontSize: '1.6rem', margin: 0 }}>{result.sign}</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>{result.date} · {result.element} · Ruled by {result.rulingPlanet}</p>
            </div>
          </div>

          <p style={{ color: 'var(--color-text-main)', lineHeight: '1.8', fontSize: '1rem', marginBottom: '20px' }}>{result.prediction}</p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[['Lucky Color', result.luckyColor], ['Lucky Number', result.luckyNumber]].map(([k, v]) => (
              <span key={k as string} style={{ background:'rgba(212,175,55,0.08)', border:'1px solid var(--color-border-gold)', borderRadius:'20px', padding:'4px 14px', fontSize:'0.82rem', color:'var(--color-accent-gold)' }}>
                <strong style={{ color:'var(--color-text-main)' }}>{k}:</strong> {v}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
