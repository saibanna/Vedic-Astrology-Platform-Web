import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectAstrologer } from '../store';
import { remedyService, masterDataService, type MasterDataItem } from '../services/api';
import { Sparkles, ShieldAlert } from 'lucide-react';

const FALLBACK_REMEDIES = [
  { id: 101, name: 'Rahu-Ketu Shanti Puja', type: 'PUJA', description: 'Removes doshas, brings stability in career, and cures health disturbances. Done at Trimbakeshwar.', price: 2100, image: 'https://images.unsplash.com/photo-1609137144813-f86af1dfd08c?auto=format&fit=crop&q=80&w=300' },
  { id: 102, name: 'Maha Mrityunjaya Homa', type: 'HOMA', description: 'Powerful cosmic protection chant for health, longevity, and warding off negative energies.', price: 5100, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300' },
  { id: 103, name: 'Yellow Sapphire (Pukhraj)', type: 'GEMSTONE', description: 'Natural 4.25 carat unheated stone representing Jupiter. Enhances wisdom, wealth, and spiritual growth.', price: 12500, image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=300' },
  { id: 104, name: 'Saraswati Yantra', type: 'YANTRA', description: 'Sacred copper geometric grid layout supporting intellect, studies, learning clarity, and music.', price: 450, image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=300' },
];

export const Remedies: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [remedies, setRemedies] = useState<any[]>(FALLBACK_REMEDIES);
  const [remedyTypes, setRemedyTypes] = useState<MasterDataItem[]>([]);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    masterDataService.getByCategory('remedy_type').then(r => setRemedyTypes(r.data)).catch(() => {});
    remedyService.getRemedies().then(r => {
      if (Array.isArray(r.data) && r.data.length > 0) setRemedies(r.data);
    }).catch(() => {});
  }, []);

  const filtered = filterType ? remedies.filter(r => r.type === filterType) : remedies;

  const handlePurchase = (remedy: any) => {
    const simulatedAstrologer = {
      id: remedy.id,
      name: remedy.name,
      specialty: remedy.type,
      pricePerMin: Math.round(remedy.price / 15),
      image: remedy.image
    };
    dispatch(selectAstrologer(simulatedAstrologer));
    navigate('/checkout', { state: { date: 'Immediate Delivery', slot: 'Standard shipping' } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* Title */}
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2.5rem', marginBottom: '8px' }}>
          Astrological Remedies & Pujas
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
          Personalized solutions recommended by our Vedic experts to balance planetary energies.
        </p>
      </section>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[{ code: '', label: 'All Types' }, ...remedyTypes].map(t => (
          <button
            key={t.code}
            onClick={() => setFilterType(t.code)}
            style={{
              background: filterType === t.code ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${filterType === t.code ? 'var(--color-accent-gold)' : 'var(--color-border-glass)'}`,
              borderRadius: '20px',
              padding: '6px 16px',
              color: filterType === t.code ? 'var(--color-accent-gold)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: filterType === t.code ? 600 : 400,
              transition: 'all 0.2s ease'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
        textAlign: 'left'
      }}>
        {filtered.map((remedy) => (
          <div key={remedy.id} className="cosmic-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            
            {/* Header info */}
            <div>
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', marginBottom: '16px' }}>
                <img src={remedy.image} alt={remedy.name} style={{ width: '100%', height: '180px', objectFit: 'cover', border: '1px solid var(--color-border-glass)' }} />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(5, 6, 15, 0.85)',
                  border: '1px solid var(--color-border-gold)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  color: 'var(--color-accent-gold)',
                  fontWeight: 600
                }}>
                  {remedy.type}
                </span>
              </div>

              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>{remedy.name}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '16px' }}>
                {remedy.description}
              </p>
            </div>

            {/* Footer action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid var(--color-border-glass)', paddingTop: '16px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#ffffff' }}>
                ₹{remedy.price}
              </span>
              <button onClick={() => handlePurchase(remedy)} className="btn-gold" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                Order Now <Sparkles size={14} />
              </button>
            </div>
            
          </div>
        ))}
      </div>

      {/* Info Warning banner */}
      <section className="cosmic-card" style={{
        marginTop: '20px',
        border: '1px solid var(--color-border-gold)',
        background: 'rgba(212,175,55,0.02)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        textAlign: 'left'
      }}>
        <ShieldAlert size={48} color="var(--color-accent-gold)" style={{ flexShrink: 0 }} />
        <div>
          <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '4px' }}>Genuine Vedic Verification</h4>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            All pujas are executed by certified Vedic priests using precise ritual guidelines. Shipping of physical items includes planetary energization under your birth star details. For operations/proof, photo/video coordinates are loaded in your profile.
          </p>
        </div>
      </section>

    </div>
  );
};
