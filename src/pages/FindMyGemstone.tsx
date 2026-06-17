import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectAstrologer } from '../store';
import { gemstoneService, type GemstoneResult } from '../services/api';
import { Gem, Loader, ChevronRight, Star } from 'lucide-react';

const CONCERNS = ['General', 'Career', 'Health', 'Marriage', 'Wealth'];
const PLANET_COLORS: Record<string, string> = {
  Sun: '#ff9d00', Moon: '#c8d8e8', Mars: '#e05252', Mercury: '#4caf7d',
  Jupiter: '#f0c040', Venus: '#f8c8e0', Saturn: '#8888cc', Rahu: '#9b59b6', Ketu: '#795548',
};
const GEMSTONE_IMAGES: Record<string, string> = {
  Ruby: 'https://images.unsplash.com/photo-1583309219338-a582f1db9a19?auto=format&fit=crop&q=80&w=400',
  Pearl: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=400',
  'Red Coral': 'https://images.unsplash.com/photo-1509721434272-b79147e0e708?auto=format&fit=crop&q=80&w=400',
  Emerald: 'https://images.unsplash.com/photo-1599707254554-027aeb4deacd?auto=format&fit=crop&q=80&w=400',
  'Yellow Sapphire': 'https://images.unsplash.com/photo-1612969308146-066d55f37ccb?auto=format&fit=crop&q=80&w=400',
  Diamond: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=400',
  'Blue Sapphire': 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&q=80&w=400',
  'Hessonite Garnet': 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=400',
  "Cat's Eye": 'https://images.unsplash.com/photo-1583309219338-a582f1db9a19?auto=format&fit=crop&q=80&w=400',
};

function toCalcInput(form: typeof INITIAL_FORM) {
  const [year, month, day] = form.dob.split('-').map(Number);
  const [hour, minute] = form.tob.split(':').map(Number);
  return { year, month, day, hour: hour || 12, minute: minute || 0, lat: form.lat, lon: form.lon, tzone: 5.5, concern: form.concern };
}

const INITIAL_FORM = { name: '', dob: '', tob: '', pob: '', lat: 20.5937, lon: 78.9629, concern: 'General' };

export const FindMyGemstone: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [result, setResult] = useState<GemstoneResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.dob) { setError('Date of birth is required.'); return; }
    setError('');
    setLoading(true);
    setStep(2);
    try {
      const res = await gemstoneService.getSuggestion(toCalcInput(form));
      setResult(res.data);
      setStep(3);
    } catch {
      setError('Could not calculate. Please check your details and try again.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = (gemstone: string, price: number) => {
    dispatch(selectAstrologer({ id: 0, name: gemstone, specialty: 'GEMSTONE', pricePerMin: 0, image: GEMSTONE_IMAGES[gemstone] || '' }));
    navigate('/checkout', { state: { date: 'Home Delivery', slot: '3–7 business days', price } });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border-glass)',
    borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '6px', color: 'var(--color-text-muted)', fontSize: '0.85rem' };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <Gem size={36} color="var(--color-accent-gold)" />
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2.2rem' }}>Find My Gemstone</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto' }}>
          Get personalised Vedic gemstone recommendations based on your Lagna, planetary positions, and current Dasha period.
        </p>
      </section>

      {/* Step Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0', alignItems: 'center' }}>
        {['Birth Details', 'Analysis', 'Your Gemstones'].map((label, i) => {
          const num = i + 1;
          const active = step === num;
          const done = step > num;
          return (
            <React.Fragment key={num}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? 'var(--color-accent-gold)' : active ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${active || done ? 'var(--color-accent-gold)' : 'var(--color-border-glass)'}`,
                  color: done ? '#000' : active ? 'var(--color-accent-gold)' : 'var(--color-text-muted)',
                  fontWeight: 700, fontSize: '0.9rem',
                }}>
                  {done ? '✓' : num}
                </div>
                <span style={{ fontSize: '0.75rem', color: active ? 'var(--color-accent-gold)' : 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
              {i < 2 && <div style={{ width: '60px', height: '2px', background: done ? 'var(--color-accent-gold)' : 'var(--color-border-glass)', margin: '0 8px', marginBottom: '20px' }} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step 1: Form */}
      {step === 1 && (
        <div className="cosmic-card">
          <h2 style={{ color: '#fff', marginBottom: '24px', fontSize: '1.3rem' }}>Enter Your Birth Details</h2>
          {error && <div style={{ background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.3)', borderRadius: '8px', padding: '10px 14px', color: '#ff7070', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <div>
                <label style={labelStyle}>Full Name (optional)</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Concern *</label>
                <select name="concern" value={form.concern} onChange={handleChange} style={inputStyle}>
                  {CONCERNS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Date of Birth *</label>
                <input type="date" name="dob" value={form.dob} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Time of Birth (approx. is fine)</label>
                <input type="time" name="tob" value={form.tob} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Place of Birth</label>
              <input name="pob" value={form.pob} onChange={handleChange} placeholder="City, Country (e.g. Hyderabad, India)" style={inputStyle} />
              <p style={{ marginTop: '4px', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                For precise results, enter coordinates below. Default: India centre.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <div>
                <label style={labelStyle}>Latitude</label>
                <input type="number" step="any" name="lat" value={form.lat} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Longitude</label>
                <input type="number" step="any" name="lon" value={form.lon} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
            <button type="submit" className="btn-gold" style={{ padding: '12px 24px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
              Reveal My Gemstones <ChevronRight size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Loading */}
      {step === 2 && loading && (
        <div className="cosmic-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <Loader size={48} color="var(--color-accent-gold)" style={{ animation: 'spin 1s linear infinite', marginBottom: '20px' }} />
          <h3 style={{ color: '#fff', marginBottom: '8px' }}>Casting your Kundali…</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Analysing Lagna, planetary strengths, and Dasha periods</p>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Chart Summary */}
          <div className="cosmic-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
            {[
              { label: 'Lagna', value: result.lagna },
              { label: 'Moon Sign', value: result.moonSign },
              { label: 'Nakshatra', value: result.nakshatra },
              { label: 'Current Dasha', value: result.currentDasha },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>{label}</p>
                <p style={{ color: 'var(--color-accent-gold)', fontWeight: 700, fontSize: '1.05rem' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <h2 style={{ color: '#fff', fontSize: '1.4rem' }}>Your Recommended Gemstones</h2>
          {result.recommendations.map((rec) => (
            <div key={rec.rank} className="cosmic-card" style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '20px', alignItems: 'start', border: rec.rank === 1 ? '1px solid var(--color-border-gold)' : undefined }}>
              {/* Image */}
              <div style={{ position: 'relative' }}>
                <img
                  src={GEMSTONE_IMAGES[rec.gemstone] || GEMSTONE_IMAGES['Ruby']}
                  alt={rec.gemstone}
                  style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--color-border-glass)' }}
                />
                {rec.rank === 1 && (
                  <span style={{ position: 'absolute', top: '6px', left: '6px', background: 'var(--color-accent-gold)', color: '#000', fontSize: '0.7rem', fontWeight: 700, padding: '2px 7px', borderRadius: '4px' }}>
                    PRIMARY
                  </span>
                )}
                {rec.isDasha && (
                  <span style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(5,6,15,0.85)', border: '1px solid var(--color-border-gold)', color: 'var(--color-accent-gold)', fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px' }}>
                    <Star size={10} style={{ marginRight: '3px' }} />Dasha
                  </span>
                )}
              </div>

              {/* Details */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>{rec.gemstone}</h3>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>({rec.hindiName})</span>
                  <span style={{ marginLeft: 'auto', background: PLANET_COLORS[rec.planet] || '#888', color: '#000', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
                    {rec.planet}
                  </span>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '10px', lineHeight: '1.5' }}>{rec.reason}</p>
                <p style={{ color: '#aed6f1', fontSize: '0.85rem', marginBottom: '12px' }}>{rec.benefit}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                  {[
                    { k: 'Metal', v: rec.metal },
                    { k: 'Wear on', v: rec.dayToWear },
                    { k: 'Min. carat', v: `${rec.minCaratWeight}+` },
                    { k: 'Substitute', v: rec.substitute },
                  ].map(({ k, v }) => (
                    <span key={k} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border-glass)', borderRadius: '6px', padding: '3px 10px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      <strong style={{ color: 'var(--color-text-main)' }}>{k}:</strong> {v}
                    </span>
                  ))}
                </div>
                <button
                  className="btn-gold"
                  onClick={() => handleOrder(rec.gemstone, rec.minCaratWeight * 2500)}
                  style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Gem size={14} /> Order Certified {rec.gemstone}
                </button>
              </div>
            </div>
          ))}

          <button onClick={() => { setStep(1); setResult(null); }} style={{ background: 'none', border: '1px solid var(--color-border-glass)', borderRadius: '8px', padding: '10px 20px', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.9rem', alignSelf: 'flex-start' }}>
            ← Try Different Details
          </button>
        </div>
      )}
    </div>
  );
};
