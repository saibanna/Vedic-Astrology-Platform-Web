import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';
import { savedProfileService, type SavedProfileInput } from '../services/api';
import { Plus, Trash2, Edit2, ArrowLeft, Loader, Search, Clock, Calendar, User } from 'lucide-react';

export const ProfileManager: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [profiles, setProfiles] = useState<SavedProfileInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<SavedProfileInput | null>(null);

  // Form fields
  const [form, setForm] = useState({
    profileName: '',
    fullName: '',
    gender: 'Male',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    latitude: '',
    longitude: '',
    timezone: '5.5',
    isDefault: false
  });

  const [geoSuggestions, setGeoSuggestions] = useState<any[]>([]);
  const [geoLoading, setGeoLoading] = useState(false);
  const skipSearchRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadProfiles();
  }, [isAuthenticated]);

  const loadProfiles = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await savedProfileService.list();
      setProfiles(res.data || []);
    } catch (err: any) {
      setErrorMsg('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  // Geocoding debounce POB
  useEffect(() => {
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }
    if (!form.placeOfBirth || form.placeOfBirth.length < 3) {
      setGeoSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      geocodePob(form.placeOfBirth);
    }, 600);

    return () => clearTimeout(timer);
  }, [form.placeOfBirth]);

  const geocodePob = async (query: string) => {
    setGeoLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      setGeoSuggestions(data || []);
    } catch {
      setGeoSuggestions([]);
    } finally {
      setGeoLoading(false);
    }
  };

  const selectGeoSuggestion = (place: any) => {
    const lat = parseFloat(place.lat).toFixed(4);
    const lon = parseFloat(place.lon).toFixed(4);
    const isIndia = place.address?.country_code === 'in' || place.display_name?.toLowerCase().includes('india');
    const tzVal = isIndia ? 5.5 : Math.round(parseFloat(lon) / 15 * 2) / 2;

    const address = place.address || {};
    const primary = place.name || place.display_name.split(',')[0].trim();
    const state = address.state || address.region || address.province || '';
    const country = address.country || '';

    const labelParts = [primary];
    if (state && state.toLowerCase() !== primary.toLowerCase()) labelParts.push(state);
    if (country && country.toLowerCase() !== primary.toLowerCase()) labelParts.push(country);
    const label = labelParts.join(', ');

    skipSearchRef.current = true;
    setForm(prev => ({
      ...prev,
      placeOfBirth: label,
      latitude: lat,
      longitude: lon,
      timezone: tzVal.toFixed(1)
    }));
    setGeoSuggestions([]);
  };

  const handleOpenAdd = () => {
    setEditingProfile(null);
    setForm({
      profileName: '',
      fullName: '',
      gender: 'Male',
      dateOfBirth: '',
      timeOfBirth: '',
      placeOfBirth: '',
      latitude: '',
      longitude: '',
      timezone: '5.5',
      isDefault: false
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p: SavedProfileInput) => {
    setEditingProfile(p);
    skipSearchRef.current = true;
    setForm({
      profileName: p.profileName,
      fullName: p.fullName,
      gender: p.gender,
      dateOfBirth: p.dateOfBirth,
      timeOfBirth: p.timeOfBirth,
      placeOfBirth: p.placeOfBirth,
      latitude: String(p.latitude),
      longitude: String(p.longitude),
      timezone: String(p.timezone),
      isDefault: p.isDefault || false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.latitude || !form.longitude) {
      alert('Please lookup and select a birth place from suggestions.');
      return;
    }

    const payload: SavedProfileInput = {
      profileName: form.profileName,
      fullName: form.fullName,
      gender: form.gender,
      dateOfBirth: form.dateOfBirth,
      timeOfBirth: form.timeOfBirth,
      placeOfBirth: form.placeOfBirth,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      timezone: parseFloat(form.timezone),
      isDefault: form.isDefault
    };

    try {
      if (editingProfile?.id) {
        await savedProfileService.update(editingProfile.id, payload);
      } else {
        await savedProfileService.create(payload);
      }
      setShowModal(false);
      loadProfiles();
    } catch (err) {
      alert('Failed to save profile');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this profile?')) return;
    try {
      await savedProfileService.delete(id);
      loadProfiles();
    } catch {
      alert('Failed to delete profile');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', textAlign: 'left', animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-accent-gold)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.95rem',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={18} /> Back to Calculator
        </button>
        <button onClick={handleOpenAdd} className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '30px' }}>
          <Plus size={18} /> Add Profile
        </button>
      </div>

      <div className="cosmic-card" style={{ padding: '32px', border: '1px solid var(--color-border-gold)' }}>
        
        {/* Title */}
        <h2 style={{ fontSize: '2rem', color: 'var(--color-accent-gold-light)', margin: '0 0 8px 0', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
          Manage Birth Profiles
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: '0 0 24px 0' }}>
          Save coordinates of family, friends, or clients to auto-populate free charts.
        </p>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent-gold)' }} />
          </div>
        ) : profiles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)', border: '1px dashed var(--color-border-glass)', borderRadius: '12px' }}>
            <User size={48} style={{ opacity: 0.5, marginBottom: '12px' }} />
            <p style={{ margin: 0 }}>No profiles saved yet. Click "Add Profile" to create one.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {profiles.map(p => (
              <div key={p.id} className="cosmic-card" style={{
                position: 'relative',
                padding: '24px',
                border: '1px solid var(--color-border-glass)',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff', margin: 0 }}>{p.profileName}</h3>
                    {p.isDefault && (
                      <span style={{ fontSize: '0.7rem', background: 'rgba(212,175,55,0.15)', color: 'var(--color-accent-gold)', border: '1px solid var(--color-border-gold)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>DEFAULT</span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.95rem', color: 'var(--color-accent-gold-light)', margin: 0, fontWeight: 500 }}>{p.fullName}</p>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p style={{ margin: 0 }}>📅 Born: {p.dateOfBirth} at {p.timeOfBirth}</p>
                  <p style={{ margin: 0 }}>📍 Place: {p.placeOfBirth}</p>
                  <p style={{ margin: 0 }}>🌐 Lat/Lon: {p.latitude}, {p.longitude} (TZ: {p.timezone})</p>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', borderTop: '1px solid var(--color-border-glass)', paddingTop: '12px' }}>
                  <button 
                    onClick={() => handleOpenEdit(p)} 
                    style={{ background: 'transparent', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', cursor: 'pointer', opacity: 0.8 }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id!)} 
                    style={{ background: 'transparent', border: 'none', color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', cursor: 'pointer', opacity: 0.8 }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(5,6,15,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="cosmic-card" style={{
            maxWidth: '500px', width: '100%', padding: '32px',
            border: '1px solid var(--color-border-gold)', background: 'rgba(10, 11, 28, 0.95)',
            textAlign: 'left'
          }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-accent-gold-light)', margin: '0 0 20px 0', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
              {editingProfile ? 'Edit Profile' : 'Add Birth Profile'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--color-accent-gold-light)', fontSize: '0.85rem', fontWeight: 600 }}>RELATION / PROFILE NAME (e.g. My Profile, Wife, Friend)</label>
                <input 
                  type="text" 
                  placeholder="My Profile"
                  value={form.profileName}
                  onChange={(e) => setForm(prev => ({ ...prev, profileName: e.target.value }))}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--color-accent-gold-light)', fontSize: '0.85rem', fontWeight: 600 }}>FULL NAME</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={(e) => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: 'var(--color-accent-gold-light)', fontSize: '0.85rem', fontWeight: 600 }}>GENDER</label>
                  <select 
                    value={form.gender}
                    onChange={(e) => setForm(prev => ({ ...prev, gender: e.target.value }))}
                    className="form-input"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: 'var(--color-accent-gold-light)', fontSize: '0.85rem', fontWeight: 600 }}>DATE OF BIRTH</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="date" 
                      value={form.dateOfBirth}
                      onChange={(e) => setForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="form-input"
                      required
                    />
                    <Calendar size={14} color="var(--color-accent-gold)" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: 'var(--color-accent-gold-light)', fontSize: '0.85rem', fontWeight: 600 }}>TIME OF BIRTH</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="time" 
                      step="1"
                      value={form.timeOfBirth}
                      onChange={(e) => setForm(prev => ({ ...prev, timeOfBirth: e.target.value }))}
                      className="form-input"
                      required
                    />
                    <Clock size={14} color="var(--color-accent-gold)" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0, position: 'relative' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: 'var(--color-accent-gold-light)', fontSize: '0.85rem', fontWeight: 600 }}>PLACE OF BIRTH</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      placeholder="Search city"
                      value={form.placeOfBirth}
                      onChange={(e) => setForm(prev => ({ ...prev, placeOfBirth: e.target.value }))}
                      className="form-input"
                      required
                    />
                    <div style={{ position: 'absolute', right: '12px', display: 'flex', alignItems: 'center', color: 'var(--color-accent-gold)' }}>
                      {geoLoading ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={14} />}
                    </div>
                  </div>

                  {geoSuggestions.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1100,
                      background: '#0a0b1c', border: '1px solid var(--color-border-glass)',
                      maxHeight: '160px', overflowY: 'auto', borderRadius: '8px', marginTop: '4px'
                    }}>
                      {geoSuggestions.map((place, idx) => (
                        <div 
                          key={idx}
                          onClick={() => selectGeoSuggestion(place)}
                          style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', fontSize: '0.85rem', color: '#fff' }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(212,175,55,0.08)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          {place.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border-glass)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Latitude</span>
                  <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{form.latitude || '-'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Longitude</span>
                  <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{form.longitude || '-'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Timezone</span>
                  <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{form.timezone || '-'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input 
                  type="checkbox" 
                  id="isDefault"
                  checked={form.isDefault}
                  onChange={(e) => setForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="isDefault" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}>Set as default profile</label>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="btn-gold" style={{ flex: 1, padding: '12px' }}>Save Profile</button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1, padding: '12px', background: 'transparent',
                    border: '1px solid var(--color-border-glass)', borderRadius: '8px',
                    color: '#fff', cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
