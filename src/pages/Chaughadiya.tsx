import React, { useState, useEffect } from 'react';
import { calculatorService } from '../services/api';
import { Loader } from 'lucide-react';

const QUALITY_COLOR: Record<string, string> = {
  Excellent: '#4caf50', Good: '#f0c040', Avoid: '#e05252',
};
const SLOT_COLOR: Record<string, string> = {
  Amrit: '#4caf50', Shubh: '#4ca6e8', Labh: '#f0c040', Char: '#e6a032',
  Udveg: '#e05252', Kaal: '#8888cc', Rog: '#e05252',
};

export const Chaughadiya: React.FC = () => {
  const today = new Date();
  const [date, setDate] = useState(today.toISOString().split('T')[0]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async (d: string) => {
    setLoading(true);
    try {
      const [y, m, day] = d.split('-').map(Number);
      setResult((await calculatorService.chaughadiya(y, m, day)).data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(date); }, []);

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border-glass)',
    borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.95rem', outline: 'none',
  };

  const nowStr = `${today.getHours().toString().padStart(2,'0')}:${today.getMinutes().toString().padStart(2,'0')}`;

  const isCurrent = (slot: any) => slot.start <= nowStr && nowStr < slot.end;

  const daySlots   = result?.slots.filter((s: any) => s.session === 'Day')   || [];
  const nightSlots = result?.slots.filter((s: any) => s.session === 'Night') || [];

  const SlotCard = ({ s }: { s: any }) => {
    const cur = isCurrent(s);
    const col = SLOT_COLOR[s.name] || '#888';
    return (
      <div className="cosmic-card" style={{ border: `1px solid ${cur ? col : 'rgba(255,255,255,0.07)'}`, background: cur ? `${col}12` : undefined, padding: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ color: col, fontWeight: 700 }}>{s.name}</span>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{s.start}–{s.end}</span>
        </div>
        <p style={{ color: QUALITY_COLOR[s.quality] || '#888', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 600 }}>{s.quality}</p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', margin: 0 }}>{s.meaning}</p>
        {cur && <p style={{ color: col, fontSize: '0.72rem', marginTop: '6px', fontWeight: 600 }}>← Now</p>}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem', marginBottom: '8px' }}>Chaughadiya Muhurta</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>8 auspicious/inauspicious time slots for day and night. Plan your activities accordingly.</p>
      </section>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
        <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Date:</label>
        <input type="date" value={date} onChange={e => { setDate(e.target.value); load(e.target.value); }} style={inputStyle} />
        {loading && <Loader size={18} color="var(--color-accent-gold)" style={{ animation: 'spin 1s linear infinite' }} />}
      </div>

      {result && (
        <>
          <p style={{ textAlign: 'center', color: 'var(--color-accent-gold)', fontWeight: 600 }}>{result.weekday}</p>
          <h3 style={{ color: '#fff' }}>☀️ Day Chaughadiya</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: '10px' }}>
            {daySlots.map((s: any, i: number) => <SlotCard key={i} s={s} />)}
          </div>
          <h3 style={{ color: '#fff' }}>🌙 Night Chaughadiya</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: '10px' }}>
            {nightSlots.map((s: any, i: number) => <SlotCard key={i} s={s} />)}
          </div>
        </>
      )}
    </div>
  );
};
