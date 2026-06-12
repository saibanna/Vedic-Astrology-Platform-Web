import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronUp, Calendar, Zap, Maximize2, Minimize2 } from 'lucide-react';

interface Bhukti {
  planet: string;
  startDate: string;
  endDate: string;
}

interface Dasha {
  planet: string;
  startDate: string;
  endDate: string;
  years: number;
  bhuktis: Bhukti[];
}

interface DashaBhuktiTableProps {
  nakshatra: string;
  nakshatraLord: string;
  currentDasha: string;
  currentBhukti: string;
  dashas: Dasha[];
}

export const DashaBhuktiTable: React.FC<DashaBhuktiTableProps> = ({
  nakshatra,
  nakshatraLord,
  currentDasha,
  currentBhukti,
  dashas
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullScreen]);

  const toggleExpand = (planet: string) => {
    setExpanded(prev => ({ ...prev, [planet]: !prev[planet] }));
  };

  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Helper to render the table content (reused for both small and full screen views)
  const renderTable = (isFS: boolean = false) => {
    const paddingVal = isFS ? '20px' : '16px';
    const rowFontSize = isFS ? '1.05rem' : '0.95rem';

    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{
              borderBottom: '1px solid var(--color-border-gold)',
              background: 'rgba(5, 6, 15, 0.5)',
              color: 'var(--color-accent-gold)',
              fontSize: isFS ? '1rem' : '0.9rem',
              fontWeight: 'bold'
            }}>
              <th style={{ padding: paddingVal }}>Planet</th>
              <th style={{ padding: paddingVal }}>Start Date</th>
              <th style={{ padding: paddingVal }}>End Date</th>
              <th style={{ padding: paddingVal }}>Duration (Years)</th>
              <th style={{ padding: paddingVal, textAlign: 'center' }}>Status</th>
              <th style={{ padding: paddingVal, width: '60px' }}></th>
            </tr>
          </thead>
          <tbody>
            {dashas.map((dasha) => {
              const isCurrent = currentDasha.toLowerCase() === dasha.planet.toLowerCase();
              const isExpanded = !!expanded[dasha.planet];
              const uniqueKey = isFS ? `${dasha.planet}-fs` : dasha.planet;

              return (
                <React.Fragment key={uniqueKey}>
                  {/* Mahadasha Row */}
                  <tr 
                    onClick={() => toggleExpand(dasha.planet)}
                    style={{
                      borderBottom: '1px solid var(--color-border-glass)',
                      cursor: 'pointer',
                      background: isCurrent ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
                      transition: 'background 0.2s ease',
                      fontWeight: isCurrent ? 600 : 'normal',
                      fontSize: rowFontSize
                    }}
                    className="dasha-row"
                  >
                    <td style={{ padding: paddingVal, color: isCurrent ? 'var(--color-accent-gold)' : '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={isFS ? 18 : 16} style={{ color: isCurrent ? 'var(--color-accent-gold)' : 'var(--color-text-muted)' }} />
                      {dasha.planet} Mahadasha
                    </td>
                    <td style={{ padding: paddingVal, color: 'var(--color-text-main)' }}>{formatDate(dasha.startDate)}</td>
                    <td style={{ padding: paddingVal, color: 'var(--color-text-main)' }}>{formatDate(dasha.endDate)}</td>
                    <td style={{ padding: paddingVal, color: 'var(--color-text-muted)' }}>{dasha.years} yrs</td>
                    <td style={{ padding: paddingVal, textAlign: 'center' }}>
                      {isCurrent ? (
                        <span style={{
                          background: 'rgba(212, 175, 55, 0.2)',
                          color: 'var(--color-accent-gold-light)',
                          padding: isFS ? '6px 12px' : '4px 10px',
                          borderRadius: '12px',
                          fontSize: isFS ? '0.8rem' : '0.75rem',
                          fontWeight: 'bold',
                          border: '1px solid var(--color-accent-gold)'
                        }}>
                          ACTIVE
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', fontSize: isFS ? '0.8rem' : '0.75rem' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: paddingVal, textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      {isExpanded ? <ChevronUp size={isFS ? 20 : 18} /> : <ChevronDown size={isFS ? 20 : 18} />}
                    </td>
                  </tr>

                  {/* Nested Bhukti Rows */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={6} style={{ padding: 0, background: 'rgba(0, 0, 0, 0.2)' }}>
                        <div style={{
                          padding: isFS ? '20px 30px' : '12px 24px',
                          borderLeft: '3px solid var(--color-accent-gold)',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                          gap: isFS ? '16px' : '12px'
                        }}>
                          {dasha.bhuktis.map((bhukti) => {
                            const isBhuktiActive = isCurrent && currentBhukti.toLowerCase() === bhukti.planet.toLowerCase();
                            const bhuktiKey = isFS ? `${bhukti.planet}-fs-b` : bhukti.planet;

                            return (
                              <div 
                                key={bhuktiKey}
                                style={{
                                  background: isBhuktiActive ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                                  border: `1px solid ${isBhuktiActive ? 'var(--color-accent-gold)' : 'var(--color-border-glass)'}`,
                                  borderRadius: '8px',
                                  padding: isFS ? '12px 18px' : '10px 14px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <div>
                                  <div style={{ fontWeight: 600, color: isBhuktiActive ? 'var(--color-accent-gold-light)' : '#ffffff', fontSize: isFS ? '0.95rem' : '0.9rem' }}>
                                    {bhukti.planet} Bhukti
                                  </div>
                                  <div style={{ fontSize: isFS ? '0.8rem' : '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                                    {formatDate(bhukti.startDate)} - {formatDate(bhukti.endDate)}
                                  </div>
                                </div>
                                {isBhuktiActive && (
                                  <span style={{
                                    background: 'var(--color-accent-gold)',
                                    color: '#05060f',
                                    fontSize: isFS ? '0.7rem' : '0.65rem',
                                    fontWeight: 'bold',
                                    padding: '2px 6px',
                                    borderRadius: '4px'
                                  }}>
                                    NOW
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', margin: '30px 0', width: '100%' }}>
      {/* Header Controls & Info Cards Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Info Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          flex: 1
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--color-border-glass)',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Nakshatra / Lord</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-accent-gold-light)' }}>
              {nakshatra} ({nakshatraLord})
            </span>
          </div>
          
          <div style={{
            background: 'rgba(212, 175, 55, 0.05)',
            border: '1px solid var(--color-border-gold)',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Zap size={20} style={{ color: 'var(--color-accent-gold)' }} className="animate-pulse" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Current Period</span>
              <span style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#ffffff' }}>
                {currentDasha} - {currentBhukti}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <button 
          onClick={toggleFullScreen}
          className="btn-outline"
          style={{
            padding: '10px 16px',
            fontSize: '0.85rem',
            height: 'fit-content',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Maximize2 size={15} /> Full Screen
        </button>
      </div>

      {/* Main Table Container */}
      <div style={{
        background: 'rgba(13, 15, 33, 0.65)',
        border: '1px solid var(--color-border-glass)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        {renderTable(false)}
      </div>

      {/* Fixed Full Screen Overlay Dialog */}
      {isFullScreen && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'radial-gradient(circle at center, #0c0f24, #05060f)',
          zIndex: 99999,
          padding: '40px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px'
        }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderBottom: '1px solid var(--color-border-gold)', 
            paddingBottom: '20px' 
          }}>
            <div>
              <h2 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem', margin: 0, fontFamily: 'var(--font-heading)' }}>
                Vimshottari Dasha Periods
              </h2>
              <p style={{ color: 'var(--color-text-muted)', margin: '6px 0 0 0', fontSize: '1rem' }}>
                Nakshatra: <strong style={{ color: '#fff' }}>{nakshatra}</strong> ({nakshatraLord}) | Current Period: <strong style={{ color: '#fff' }}>{currentDasha} - {currentBhukti}</strong>
              </p>
            </div>
            <button 
              onClick={toggleFullScreen}
              className="btn-gold"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Minimize2 size={16} /> Exit Full Screen
            </button>
          </div>

          {/* Table Container in Full Screen */}
          <div style={{
            background: 'rgba(13, 15, 33, 0.65)',
            border: '1px solid var(--color-border-glass)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            width: '100%',
            marginBottom: '40px'
          }}>
            {renderTable(true)}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
