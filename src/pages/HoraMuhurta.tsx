import React, { useState, useEffect } from 'react';
import { calculatorService } from '../services/api';
import { Clock, Loader } from 'lucide-react';

export const HoraMuhurta: React.FC = () => {
  const today = new Date();
  const [date, setDate] = useState(today.toISOString().split('T')[0]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async (d: string) => {
    setLoading(true);
    try {
      const [y, m, day] = d.split('-').map(Number);
      setResult((await calculatorService.horaMuhurta(y, m, day)).data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(date); }, []);

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border-glass)',
    borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.95rem', outline: 'none',
  };

  const PLANET_COLOR: Record<string, string> = {
    Sun: '#ff9d00', Moon: '#c8d8e8', Mars: '#e05252', Mercury: '#4caf7d',
    Jupiter: '#f0c040', Venus: '#f8c8e0', Saturn: '#8888cc',
  };

  const nowHour = new Date().getHours();

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Clock size={32} color="var(--color-accent-gold)" />
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem' }}>Hora Muhurta</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)' }}>Each hour of the day is ruled by a planet. Choose the right hora for your activity.</p>
      </section>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
        <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Date:</label>
        <input type="date" value={date} onChange={e => { setDate(e.target.value); load(e.target.value); }} style={inputStyle} />
        {loading && <Loader size={18} color="var(--color-accent-gold)" style={{ animation: 'spin 1s linear infinite' }} />}
      </div>

      {result && (
        <>
          <p style={{ textAlign: 'center', color: 'var(--color-accent-gold)', fontWeight: 600 }}>{result.weekday}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {result.horas.map((h: any) => {
              const isCurrent = parseInt(h.start) <= nowHour && nowHour < parseInt(h.end);
              const col = PLANET_COLOR[h.lord] || '#888';
              return (
                <div key={h.hora} className="cosmic-card" style={{
                  border: `1px solid ${isCurrent ? col : h.auspicious ? 'rgba(80,200,80,0.25)' : 'rgba(255,255,255,0.05)'}`,
                  background: isCurrent ? `${col}15` : undefined, padding: '12px 14px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: col, fontWeight: 700, fontSize: '0.95rem' }}>{h.lord}</span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{h.start}–{h.end}</span>
                  </div>
                  <p style={{ color: h.auspicious ? '#4caf50' : '#e05252', fontSize: '0.75rem', margin: 0 }}>{h.auspicious ? '✓ Auspicious' : '✗ Avoid'}</p>
                  {isCurrent && <p style={{ color: col, fontSize: '0.72rem', marginTop: '4px', fontWeight: 600 }}>← Current hora</p>}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
