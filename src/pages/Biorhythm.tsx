import React, { useState } from 'react';
import { calculatorService } from '../services/api';
import { Activity, ChevronRight, Loader } from 'lucide-react';

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border-glass)',
  borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.95rem', outline: 'none',
};

const CYCLES = [
  { key: 'physical',     label: 'Physical',     color: '#e05252', cycle: 23 },
  { key: 'emotional',    label: 'Emotional',    color: '#4caf7d', cycle: 28 },
  { key: 'intellectual', label: 'Intellectual', color: '#4ca6e8', cycle: 33 },
  { key: 'intuitive',    label: 'Intuitive',    color: '#f0c040', cycle: 38 },
];

export const Biorhythm: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const [dob, setDob]         = useState('');
  const [targetDate, setTarget] = useState(today);
  const [result, setResult]   = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) { setError('Date of birth is required.'); return; }
    setLoading(true); setError(''); setResult(null);
    try { setResult((await calculatorService.biorhythm(dob, targetDate)).data); }
    catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  // Simple SVG sparkline for 30-day series
  const Sparkline = ({ dataKey, color }: { dataKey: string; color: string }) => {
    if (!result?.series) return null;
    const pts = result.series as any[];
    const w = 560, h = 80, pad = 4;
    const xStep = (w - pad * 2) / (pts.length - 1);
    const toY = (v: number) => pad + ((100 - v) / 200) * (h - pad * 2);
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${pad + i * xStep},${toY(p[dataKey])}`).join(' ');
    // Mark today (offset=0)
    const todayIdx = pts.findIndex(p => p.offset === 0);
    const tx = pad + todayIdx * xStep;
    return (
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
        <line x1={tx} y1={pad} x2={tx} y2={h - pad} stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="3 3" />
        <line x1={pad} y1={h/2} x2={w-pad} y2={h/2} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={tx} cy={toY(pts[todayIdx][dataKey])} r={4} fill={color} />
      </svg>
    );
  };

  const GaugeMeter = ({ value, color, label }: { value: number; color: string; label: string }) => {
    const pct = (value + 100) / 2; // -100..100 → 0..100
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 8px' }}>
          <svg viewBox="0 0 80 80">
            <circle cx={40} cy={40} r={34} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={8} />
            <circle cx={40} cy={40} r={34} fill="none" stroke={color} strokeWidth={8}
              strokeDasharray={`${pct * 2.136} 213.6`}
              strokeDashoffset={53.4}
              strokeLinecap="round"
              transform="rotate(-90 40 40)" />
            <text x={40} y={44} textAnchor="middle" fill={color} fontSize={13} fontWeight={700}>{value > 0 ? '+' : ''}{value}</text>
          </svg>
        </div>
        <p style={{ color, fontWeight: 600, fontSize: '0.82rem' }}>{label}</p>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Activity size={32} color="var(--color-accent-gold)" />
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem' }}>Biorhythm Calculator</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)' }}>Track your Physical, Emotional, Intellectual, and Intuitive cycles.</p>
      </section>

      <div className="cosmic-card">
        {error && <div style={{ background:'rgba(220,50,50,0.1)', border:'1px solid rgba(220,50,50,0.3)', borderRadius:'8px', padding:'10px 14px', color:'#ff7070', marginBottom:'16px', fontSize:'0.9rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Date of Birth *</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} required style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Target Date</label>
            <input type="date" value={targetDate} onChange={e => setTarget(e.target.value)} style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" className="btn-gold" disabled={loading} style={{ gridColumn: '1/-1', padding:'12px', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
            {loading ? <><Loader size={16} style={{ animation:'spin 1s linear infinite' }} /> Calculating…</> : <>Calculate <ChevronRight size={18} /></>}
          </button>
        </form>
      </div>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Gauges */}
          <div className="cosmic-card" style={{ border: '1px solid var(--color-border-gold)' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', textAlign: 'center', marginBottom: '16px' }}>
              {result.targetDate} · Day {result.daysLived.toLocaleString()} of life
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
              {CYCLES.map(c => <GaugeMeter key={c.key} value={result[c.key].value} color={c.color} label={c.label} />)}
            </div>
            <p style={{ color: 'var(--color-accent-gold)', textAlign: 'center', marginTop: '16px', fontStyle: 'italic', fontSize: '0.9rem' }}>{result.advice}</p>
          </div>

          {/* Cycle details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px' }}>
            {CYCLES.map(c => (
              <div key={c.key} className="cosmic-card" style={{ border: `1px solid ${c.color}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: c.color, fontWeight: 600, fontSize: '0.9rem' }}>{c.label}</span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{c.cycle}-day cycle</span>
                </div>
                <Sparkline dataKey={c.key} color={c.color} />
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', marginTop: '6px', textAlign: 'center' }}>{result[c.key].level}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
