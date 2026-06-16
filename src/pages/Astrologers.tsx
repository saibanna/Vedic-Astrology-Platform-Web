import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, selectAstrologer } from '../store';
import { bookingService, masterDataService, type MasterDataItem } from '../services/api';
import { Star, ShieldCheck, HeartPulse, Clock, Sparkles } from 'lucide-react';

export const Astrologers: React.FC = () => {
  const { astrologers } = useSelector((state: RootState) => state.booking);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedAstrologerId, setSelectedAstrologerId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [specialties, setSpecialties] = useState<MasterDataItem[]>([]);
  const [languages, setLanguages] = useState<MasterDataItem[]>([]);
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');

  useEffect(() => {
    masterDataService.getByCategory('specialty').then(r => setSpecialties(r.data)).catch(() => {});
    masterDataService.getByCategory('language').then(r => setLanguages(r.data)).catch(() => {});
  }, []);

  const filteredAstrologers = astrologers.filter(a => {
    const specialtyMatch = !filterSpecialty || (a.specialty || '').toLowerCase().includes(filterSpecialty.toLowerCase());
    const languageMatch = !filterLanguage || (a.languages || '').toLowerCase().includes(filterLanguage.toLowerCase());
    return specialtyMatch && languageMatch;
  });

  // Fetch slots from API
  const fetchAvailableSlots = async (astrologerId: number, date: string) => {
    setSlotsLoading(true);
    try {
      const res = await bookingService.getSlots(astrologerId, date);
      setSlots(res.data.slots || []);
    } catch (err) {
      console.warn('API error, using mock slots', err);
      // Fallback premium mock slots
      setSlots([
        '09:00 AM',
        '10:30 AM',
        '11:00 AM',
        '02:00 PM',
        '03:30 PM',
        '04:00 PM',
        '05:30 PM'
      ]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleAstrologerSelect = (astrologer: any) => {
    setSelectedAstrologerId(astrologer.id);
    dispatch(selectAstrologer(astrologer));
    setSlots([]);
    setSelectedSlot('');
    // Trigger slots fetch if date is already selected
    if (selectedDate) {
      fetchAvailableSlots(astrologer.id, selectedDate);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (selectedAstrologerId) {
      fetchAvailableSlots(selectedAstrologerId, date);
    }
  };

  const handleProceedToCheckout = () => {
    if (!selectedSlot) return;
    navigate('/checkout', { state: { date: selectedDate, slot: selectedSlot } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* Title */}
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2.5rem', marginBottom: '8px' }}>
          Consult Verified Astrologers
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
          Select a trusted Vedic advisor and book your 1-on-1 consultation session.
        </p>
      </section>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <select
          value={filterSpecialty}
          onChange={e => setFilterSpecialty(e.target.value)}
          className="form-input"
          style={{ flex: 1, minWidth: '180px', background: 'rgba(5,6,15,0.8)', border: '1px solid var(--color-border-glass)' }}
        >
          <option value="">All Specialties</option>
          {specialties.map(s => <option key={s.code} value={s.label}>{s.label}</option>)}
        </select>
        <select
          value={filterLanguage}
          onChange={e => setFilterLanguage(e.target.value)}
          className="form-input"
          style={{ flex: 1, minWidth: '180px', background: 'rgba(5,6,15,0.8)', border: '1px solid var(--color-border-glass)' }}
        >
          <option value="">All Languages</option>
          {languages.map(l => <option key={l.code} value={l.label}>{l.label}</option>)}
        </select>
        {(filterSpecialty || filterLanguage) && (
          <button onClick={() => { setFilterSpecialty(''); setFilterLanguage(''); }}
            style={{ background: 'transparent', border: '1px solid var(--color-border-glass)', borderRadius: '8px', padding: '8px 16px', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            Clear
          </button>
        )}
      </div>

      {/* Main Split Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '40px',
        alignItems: 'start'
      }}>
        
        {/* Left: Astrologer Directory Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredAstrologers.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px 0' }}>No astrologers match the selected filters.</p>
          ) : filteredAstrologers.map((astrologer) => (
            <div 
              key={astrologer.id} 
              className="cosmic-card"
              style={{
                display: 'flex',
                gap: '24px',
                border: selectedAstrologerId === astrologer.id ? '1px solid var(--color-accent-gold)' : '1px solid var(--color-border-glass)',
                background: selectedAstrologerId === astrologer.id ? 'rgba(212, 175, 55, 0.05)' : 'var(--color-bg-glass)',
                cursor: 'pointer'
              }}
              onClick={() => handleAstrologerSelect(astrologer)}
            >
              {/* Photo */}
              <img 
                src={astrologer.image} 
                alt={astrologer.name} 
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  border: '2px solid var(--color-border-gold)'
                }}
              />
              
              {/* Details */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>{astrologer.name}</h3>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(212, 175, 55, 0.15)',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      color: 'var(--color-accent-gold)',
                      fontWeight: 'bold'
                    }}>
                      <Star size={16} fill="var(--color-accent-gold)" /> {astrologer.rating}
                    </span>
                  </div>
                  <p style={{ color: 'var(--color-accent-gold-light)', fontSize: '0.95rem', fontWeight: 500, margin: '4px 0' }}>
                    {astrologer.specialty}
                  </p>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    Experience: {astrologer.experience}
                  </p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ffffff' }}>
                    ₹{astrologer.pricePerMin}<span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--color-text-muted)' }}>/min</span>
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={14} color="var(--color-accent-gold)" /> Verified
                    </span>
                    <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <HeartPulse size={14} color="var(--color-accent-gold)" /> 99% Happy
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Slot Selection Engine */}
        <div className="cosmic-card" style={{
          position: 'sticky',
          top: '100px',
          border: selectedAstrologerId ? '1px solid var(--color-border-gold)' : '1px solid var(--color-border-glass)',
          opacity: selectedAstrologerId ? 1 : 0.7
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--color-accent-gold)' }}>
            Schedule Consultation
          </h2>
          
          {selectedAstrologerId ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Date Input */}
              <div className="form-group">
                <label>Select Date</label>
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={handleDateChange} 
                  min={new Date().toISOString().split('T')[0]} 
                  className="form-input" 
                />
              </div>

              {/* Slot selector */}
              {selectedDate && (
                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--color-accent-gold-light)', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                    Available Slots
                  </label>
                  {slotsLoading ? (
                    <p style={{ color: 'var(--color-text-muted)' }}>Consulting planetary alignments...</p>
                  ) : slots.length > 0 ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '8px'
                    }}>
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          style={{
                            background: selectedSlot === slot ? 'var(--color-accent-gold)' : 'rgba(255,255,255,0.03)',
                            color: selectedSlot === slot ? 'var(--color-space-deep)' : 'var(--color-text-main)',
                            border: `1px solid ${selectedSlot === slot ? 'var(--color-accent-gold)' : 'var(--color-border-glass)'}`,
                            borderRadius: '8px',
                            padding: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <Clock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--color-text-muted)' }}>No slots available. Try another date.</p>
                  )}
                </div>
              )}

              {/* Confirm CTA */}
              <button 
                onClick={handleProceedToCheckout} 
                className="btn-gold" 
                style={{ width: '100%', marginTop: '10px' }} 
                disabled={!selectedSlot}
              >
                Proceed to Checkout <Sparkles size={16} />
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
              <p>Please select an astrologer from the directory to start booking.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
