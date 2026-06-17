import React, { useState } from 'react';
import { calculatorService } from '../services/api';
import { Heart, ChevronRight, Loader } from 'lucide-react';

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border-glass)',
  borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '5px', color: 'var(--color-text-muted)', fontSize: '0.8rem' };

const DEFAULT = { dob: '', tob: '12:00', lat: '20.5937', lon: '78.9629' };

export const KundaliMatching: React.FC = () => {
  const [boy, setBoy]   = useState({ ...DEFAULT });
  const [girl, setGirl] = useState({ ...DEFAULT });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const parse = (f: typeof DEFAULT) => {
    const [yr, mo, dy] = f.dob.split('-').map(Number);
    const [hr, mn]     = f.tob.split(':').map(Number);
    return { year: yr, month: mo, day: dy, hour: hr||12, minute: mn||0, lat: parseFloat(f.lat), lon: parseFloat(f.lon), tzone: 5.5 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boy.dob || !girl.dob) { setError('Both dates of birth are required.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const bp = parse(boy), gp = parse(girl);
      const payload = {
        boy_year: bp.year, boy_month: bp.month, boy_day: bp.day, boy_hour: bp.hour, boy_minute: bp.minute,
        boy_lat: bp.lat, boy_lon: bp.lon, boy_tzone: bp.tzone,
        girl_year: gp.year, girl_month: gp.month, girl_day: gp.day, girl_hour: gp.hour, girl_minute: gp.minute,
        girl_lat: gp.lat, girl_lon: gp.lon, girl_tzone: gp.tzone,
      };
      setResult((await calculatorService.kundaliMatch(payload)).data);
    } catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const PersonForm = ({ label, val, set }: { label: string; val: typeof DEFAULT; set: (v: typeof DEFAULT) => void }) => (
    <div className="cosmic-card" style={{ flex: 1 }}>
      <h4 style={{ color: 'var(--color-accent-gold)', marginBottom: '16px' }}>{label}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div><label style={labelStyle}>Date of Birth *</label><input type="date" value={val.dob} onChange={e => set({...val, dob: e.target.value})} required style={inputStyle} /></div>
        <div><label style={labelStyle}>Time of Birth</label><input type="time" value={val.tob} onChange={e => set({...val, tob: e.target.value})} style={inputStyle} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div><label style={labelStyle}>Latitude</label><input type="number" step="any" value={val.lat} onChange={e => set({...val, lat: e.target.value})} style={inputStyle} /></div>
          <div><label style={labelStyle}>Longitude</label><input type="number" step="any" value={val.lon} onChange={e => set({...val, lon: e.target.value})} style={inputStyle} /></div>
        </div>
      </div>
    </div>
  );

  const scoreColor = (pct: number) => pct >= 78 ? '#4caf50' : pct >= 58 ? '#f0c040' : '#e05252';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Heart size={32} color="var(--color-accent-gold)" />
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem' }}>Kundali Matching</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)' }}>Ashtakoot Gun Milan — 36-point compatibility analysis for marriage.</p>
      </section>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {error && <div style={{ background:'rgba(220,50,50,0.1)', border:'1px solid rgba(220,50,50,0.3)', borderRadius:'8px', padding:'10px 14px', color:'#ff7070', fontSize:'0.9rem' }}>{error}</div>}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <PersonForm label="👦 Boy's Details" val={boy} set={setBoy} />
          <PersonForm label="👧 Girl's Details" val={girl} set={setGirl} />
        </div>
        <button type="submit" className="btn-gold" disabled={loading} style={{ padding:'12px 32px', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', alignSelf:'center' }}>
          {loading ? <><Loader size={16} style={{ animation:'spin 1s linear infinite' }} /> Matching…</> : <>Check Compatibility <ChevronRight size={18} /></>}
        </button>
      </form>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Score Hero */}
          <div className="cosmic-card" style={{ textAlign: 'center', border: `1px solid ${scoreColor(result.percentage)}40` }}>
            <div style={{ fontSize: '4rem', fontWeight: 700, color: scoreColor(result.percentage), lineHeight: 1 }}>{result.totalPoints}<span style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>/36</span></div>
            <p style={{ color: scoreColor(result.percentage), fontSize: '1.3rem', fontWeight: 600, margin: '8px 0 4px' }}>{result.compatibility}</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{result.percentage}% compatibility score</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '16px', flexWrap: 'wrap' }}>
              {[['Boy', result.boyMoonSign, result.boyNakshatra], ['Girl', result.girlMoonSign, result.girlNakshatra]].map(([who, sign, nak]) => (
                <div key={who as string} style={{ textAlign: 'center' }}>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{who}</p>
                  <p style={{ color: 'var(--color-accent-gold)', fontWeight: 600 }}>{sign} · {nak}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Koota table */}
          <div className="cosmic-card">
            <h3 style={{ color: '#fff', marginBottom: '16px' }}>Ashtakoot Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {result.kootas.map((k: any) => {
                const pct = (k.scored / k.maxPoints) * 100;
                return (
                  <div key={k.name} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 60px', gap: '12px', alignItems: 'center' }}>
                    <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>{k.name}</span>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: scoreColor(pct), borderRadius: '4px', transition: 'width 0.6s' }} />
                    </div>
                    <span style={{ color: scoreColor(pct), fontWeight: 600, textAlign: 'right', fontSize: '0.9rem' }}>{k.scored}/{k.maxPoints}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Descriptions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {result.kootas.map((k: any) => (
              <div key={k.name} className="cosmic-card" style={{ padding: '14px' }}>
                <p style={{ color: 'var(--color-accent-gold)', fontWeight: 600, marginBottom: '4px', fontSize: '0.88rem' }}>{k.name} ({k.scored}/{k.maxPoints})</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{k.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
