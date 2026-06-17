import React, { useState } from 'react';
import { calculatorService } from '../services/api';
import { Heart, ChevronRight, Loader } from 'lucide-react';

const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const SIGN_EMOJIS: Record<string,string> = {Aries:"♈",Taurus:"♉",Gemini:"♊",Cancer:"♋",Leo:"♌",Virgo:"♍",Libra:"♎",Scorpio:"♏",Sagittarius:"♐",Capricorn:"♑",Aquarius:"♒",Pisces:"♓"};
const selectStyle: React.CSSProperties = { background:'rgba(255,255,255,0.04)', border:'1px solid var(--color-border-glass)', borderRadius:'8px', padding:'10px 14px', color:'#fff', fontSize:'0.95rem', outline:'none', width:'100%' };

export const LoveCompatibility: React.FC = () => {
  const [sign1, setSign1] = useState('Aries');
  const [sign2, setSign2] = useState('Leo');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { setResult((await calculatorService.loveCompat(sign1, sign2)).data); }
    catch { } finally { setLoading(false); }
  };

  const scoreColor = (s: number) => s >= 80 ? '#4caf50' : s >= 60 ? '#f0c040' : '#e05252';

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Heart size={32} color="#e91e8c" />
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem' }}>Love Compatibility</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)' }}>Moon sign compatibility check based on Vedic elemental harmony.</p>
      </section>

      <div className="cosmic-card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'end' }}>
            <div>
              <label style={{ display:'block', marginBottom:'6px', color:'var(--color-text-muted)', fontSize:'0.85rem' }}>Your Moon / Sun Sign</label>
              <select value={sign1} onChange={e => setSign1(e.target.value)} style={selectStyle}>
                {SIGNS.map(s => <option key={s} value={s}>{SIGN_EMOJIS[s]} {s}</option>)}
              </select>
            </div>
            <div style={{ textAlign:'center', paddingBottom:'10px', fontSize:'1.4rem' }}>💞</div>
            <div>
              <label style={{ display:'block', marginBottom:'6px', color:'var(--color-text-muted)', fontSize:'0.85rem' }}>Partner's Moon / Sun Sign</label>
              <select value={sign2} onChange={e => setSign2(e.target.value)} style={selectStyle}>
                {SIGNS.map(s => <option key={s} value={s}>{SIGN_EMOJIS[s]} {s}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn-gold" disabled={loading} style={{ padding:'12px', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
            {loading ? <><Loader size={16} style={{ animation:'spin 1s linear infinite' }} /> Checking…</> : <>Check Compatibility <ChevronRight size={18} /></>}
          </button>
        </form>
      </div>

      {result && (
        <div className="cosmic-card" style={{ border:`1px solid ${scoreColor(result.score)}40`, textAlign:'center' }}>
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:'16px', marginBottom:'16px' }}>
            <span style={{ fontSize:'2rem' }}>{SIGN_EMOJIS[result.sign1]}</span>
            <div>
              <div style={{ fontSize:'3rem', fontWeight:700, color:scoreColor(result.score), lineHeight:1 }}>{result.score}%</div>
              <p style={{ color:scoreColor(result.score), fontWeight:600, fontSize:'1.1rem', margin:'4px 0 0' }}>{result.label}</p>
            </div>
            <span style={{ fontSize:'2rem' }}>{SIGN_EMOJIS[result.sign2]}</span>
          </div>
          <p style={{ color:'var(--color-text-main)', lineHeight:'1.7', marginBottom:'16px' }}>{result.description}</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'6px', textAlign:'left' }}>
            {result.tips?.map((tip: string, i: number) => (
              <p key={i} style={{ color:'var(--color-text-muted)', fontSize:'0.85rem', paddingLeft:'12px', borderLeft:'2px solid var(--color-border-gold)' }}>{tip}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
