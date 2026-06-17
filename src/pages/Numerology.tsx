import React, { useState } from 'react';
import { calculatorService } from '../services/api';
import { Hash, ChevronRight, Loader } from 'lucide-react';

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border-glass)',
  borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '6px', color: 'var(--color-text-muted)', fontSize: '0.85rem' };

const NUM_COLORS: Record<number,string> = {1:'#e05252',2:'#aed6f1',3:'#f0c040',4:'#4caf7d',5:'#e67e22',6:'#e91e8c',7:'#9b59b6',8:'#8888cc',9:'#d4af37',11:'#c8e6f8',22:'#ff9d00',33:'#fff'};

export const Numerology: React.FC = () => {
  const [form, setForm] = useState({ name: '', dob: '' });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.dob) { setError('Name and date of birth are required.'); return; }
    setLoading(true); setError(''); setResult(null);
    try { setResult((await calculatorService.numerology(form.name, form.dob)).data); }
    catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const NumberCard = ({ label, num, info }: { label: string; num: number; info?: any }) => (
    <div className="cosmic-card" style={{ textAlign: 'center', border: `1px solid ${NUM_COLORS[num] || 'var(--color-border-glass)'}40` }}>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', marginBottom: '4px' }}>{label}</p>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${NUM_COLORS[num] || '#888'}22`, border: `2px solid ${NUM_COLORS[num] || '#888'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontSize: '1.3rem', fontWeight: 700, color: NUM_COLORS[num] || '#fff' }}>{num}</div>
      {info && <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem', marginBottom: '2px' }}>{info.title}</p>}
      {info && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{info.traits}</p>}
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Hash size={32} color="var(--color-accent-gold)" />
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem' }}>Numerology Calculator</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)' }}>Life Path, Destiny, Soul Urge, and Personality numbers from your name and date of birth.</p>
      </section>

      <div className="cosmic-card">
        {error && <div style={{ background:'rgba(220,50,50,0.1)', border:'1px solid rgba(220,50,50,0.3)', borderRadius:'8px', padding:'10px 14px', color:'#ff7070', marginBottom:'16px', fontSize:'0.9rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="As given at birth" required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Date of Birth *</label>
            <input type="date" value={form.dob} onChange={e => setForm(f => ({...f, dob: e.target.value}))} required style={inputStyle} />
          </div>
          <button type="submit" className="btn-gold" disabled={loading} style={{ padding:'12px 24px', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
            {loading ? <><Loader size={16} style={{ animation:'spin 1s linear infinite' }} /> Calculating…</> : <>Calculate Numbers <ChevronRight size={18} /></>}
          </button>
        </form>
      </div>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '14px' }}>
            <NumberCard label="Life Path" num={result.lifePathNumber} info={result.lifePathInfo} />
            <NumberCard label="Destiny" num={result.destinyNumber} info={result.destinyInfo} />
            <NumberCard label="Soul Urge" num={result.soulUrgeNumber} />
            <NumberCard label="Personality" num={result.personalityNumber} />
            <NumberCard label="Birth Day" num={result.birthDayNumber} />
          </div>

          {/* Life Path deep dive */}
          <div className="cosmic-card" style={{ border: '1px solid var(--color-border-gold)' }}>
            <h3 style={{ color: 'var(--color-accent-gold)', marginBottom: '12px' }}>Life Path {result.lifePathNumber} — {result.lifePathInfo.title}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[['Traits', result.lifePathInfo.traits], ['Challenges', result.lifePathInfo.challenges], ['Career', result.lifePathInfo.career], ['Lucky Colors', result.lifePathInfo.lucky_color]].map(([k,v]) => (
                <div key={k as string}>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', marginBottom: '3px' }}>{k}</p>
                  <p style={{ color: 'var(--color-text-main)', fontSize: '0.88rem' }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
