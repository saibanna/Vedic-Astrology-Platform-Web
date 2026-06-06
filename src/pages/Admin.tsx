import React from 'react';
import { Compass, LineChart, ShieldAlert, Award, Calendar, CircleDollarSign } from 'lucide-react';

export const Admin: React.FC = () => {
  // Operational mock data
  const stats = {
    totalBookings: 248,
    activeAstrologers: 14,
    revenuePlatform: 84390,
    repeatCustomers: '42%',
    averageRating: 4.85,
  };

  const astrologerPayouts = [
    { name: 'Acharya Sharma', bookingsCount: 104, totalEarnings: 46800, platformCommission: 7020 },
    { name: 'Jyotishi Patel', bookingsCount: 78, totalEarnings: 29250, platformCommission: 4387 },
    { name: 'Guru Varma', bookingsCount: 66, totalEarnings: 34650, platformCommission: 5197 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', textAlign: 'left' }}>
      
      {/* Title */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2.5rem', marginBottom: '8px' }}>
            Operations & Analytics
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            VedaAstro Corporate Management Console
          </p>
        </div>
        <span style={{ fontSize: '0.8rem', background: 'rgba(212,175,55,0.15)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--color-border-gold)', color: 'var(--color-accent-gold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldAlert size={14} /> RESTRICTED ACCESS
        </span>
      </section>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        <div className="cosmic-card" style={{ padding: '20px', textAlign: 'center' }}>
          <CircleDollarSign size={32} color="var(--color-accent-gold)" style={{ margin: '0 auto 8px' }} />
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Platform Revenue</span>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>₹{stats.revenuePlatform.toLocaleString()}</p>
        </div>
        
        <div className="cosmic-card" style={{ padding: '20px', textAlign: 'center' }}>
          <Calendar size={32} color="var(--color-accent-gold)" style={{ margin: '0 auto 8px' }} />
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Total Consultations</span>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>{stats.totalBookings}</p>
        </div>

        <div className="cosmic-card" style={{ padding: '20px', textAlign: 'center' }}>
          <Award size={32} color="var(--color-accent-gold)" style={{ margin: '0 auto 8px' }} />
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Avg Customer Rating</span>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>{stats.averageRating} ★</p>
        </div>

        <div className="cosmic-card" style={{ padding: '20px', textAlign: 'center' }}>
          <LineChart size={32} color="var(--color-accent-gold)" style={{ margin: '0 auto 8px' }} />
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Repeat Booking Rate</span>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>{stats.repeatCustomers}</p>
        </div>
      </div>

      {/* Tables & Details layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1.2fr',
        gap: '40px',
        alignItems: 'start'
      }}>
        
        {/* Left: Astrologer Performance list */}
        <div className="cosmic-card">
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-accent-gold)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} /> Astrologer Earnings & Commissions
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-glass)', color: 'var(--color-accent-gold-light)', fontSize: '0.9rem' }}>
                  <th style={{ padding: '12px' }}>Name</th>
                  <th style={{ padding: '12px' }}>Sessions</th>
                  <th style={{ padding: '12px' }}>Total Earnings</th>
                  <th style={{ padding: '12px' }}>Platform Commission (15%)</th>
                </tr>
              </thead>
              <tbody>
                {astrologerPayouts.map((astro) => (
                  <tr key={astro.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{astro.name}</td>
                    <td style={{ padding: '12px' }}>{astro.bookingsCount}</td>
                    <td style={{ padding: '12px' }}>₹{astro.totalEarnings.toLocaleString()}</td>
                    <td style={{ padding: '12px', color: 'var(--color-accent-gold)' }}>₹{astro.platformCommission.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Slot Config Controls */}
        <div className="cosmic-card">
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-accent-gold)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={20} /> Slot Management Engine
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Define slot generation rules and durations for the automated booking matrix.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label>Default Session Duration</label>
              <select className="form-input" defaultValue="15" style={{ background: 'rgba(5, 6, 15, 0.8)', border: '1px solid var(--color-border-glass)' }}>
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Platform Commission (%)</label>
              <input type="number" className="form-input" defaultValue="15" style={{ background: 'rgba(5, 6, 15, 0.8)', border: '1px solid var(--color-border-glass)' }} />
            </div>

            <button onClick={() => alert('Platform booking configurations saved successfully!')} className="btn-gold" style={{ width: '100%', marginTop: '10px' }}>
              Save Configurations
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
