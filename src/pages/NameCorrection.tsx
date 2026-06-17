import React, { useState } from 'react';
import { calculatorService } from '../services/api';
import { Edit3, ChevronRight, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border-glass)',
  borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
};

export const NameCorrection: React.FC = () => {
  const [form, setForm] = useState({ name: '', dob: '' });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.dob) { setError('Both fields are required.'); return; }
    setLoading(true); setError(''); setResult(null);
    try { setResult((await calculatorService.nameCorrection(form.name, form.dob)).data); }
    catch { setError('Calculation failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Edit3 size={32} color="var(--color-accent-gold)" />
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem' }}>Name Correction</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)' }}>Check if your name's numerological vibration aligns with your life path and get spelling suggestions.</p>
      </section>

      <div className="cosmic-card">
        {error && <div style={{ background:'rgba(220,50,50,0.1)', border:'1px solid rgba(220,50,50,0.3)', borderRadius:'8px', padding:'10px 14px', color:'#ff7070', marginBottom:'16px', fontSize:'0.9rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Current Full Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="As currently used" required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Date of Birth *</label>
            <input type="date" value={form.dob} onChange={e => setForm(f => ({...f, dob: e.target.value}))} required style={inputStyle} />
          </div>
          <button type="submit" className="btn-gold" disabled={loading} style={{ padding:'12px', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
            {loading ? <><Loader size={16} style={{ animation:'spin 1s linear infinite' }} /> Analysing…</> : <>Analyse Name <ChevronRight size={18} /></>}
          </button>
        </form>
      </div>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Compatibility */}
          <div className="cosmic-card" style={{ border: `1px solid ${result.isCompatible ? 'rgba(80,200,80,0.3)' : 'rgba(220,120,50,0.3)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              {result.isCompatible
                ? <CheckCircle size={28} color="#4caf50" />
                : <AlertCircle size={28} color="#e6a032" />}
              <div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize:'0.82rem' }}>Name Destiny: <strong style={{color:'var(--color-accent-gold)'}}>{result.currentDestinyNumber}</strong></span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize:'0.82rem' }}>Life Path: <strong style={{color:'var(--color-accent-gold)'}}>{result.lifePathNumber}</strong></span>
                </div>
              </div>
            </div>
            <p style={{ color: 'var(--color-text-main)', lineHeight: '1.6', fontSize: '0.9rem' }}>{result.compatibilityNote}</p>
          </div>

          {/* Suggestions */}
          {result.suggestions?.length > 0 && (
            <div className="cosmic-card">
              <h4 style={{ color: 'var(--color-accent-gold)', marginBottom: '12px' }}>Suggested Name Spellings</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {result.suggestions.map((s: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--color-border-glass)' }}>
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: '1.05rem' }}>{s.name}</span>
                    <span style={{ color: 'var(--color-accent-gold)', background: 'rgba(212,175,55,0.1)', borderRadius: '12px', padding: '2px 10px', fontSize: '0.82rem' }}>Destiny {s.destinyNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontStyle: 'italic', textAlign: 'center' }}>{result.advice}</p>
        </div>
      )}
    </div>
  );
};
