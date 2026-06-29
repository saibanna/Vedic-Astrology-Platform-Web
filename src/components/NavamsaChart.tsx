import React from 'react';

interface NavamsaPlanet {
  name: string;
  natalSign: string;
  navamsaSign: string;
  navamsaHouse: number;
  retrograde?: boolean;
}

interface NavamsaChartProps {
  navamsaLagna: string;
  planets: NavamsaPlanet[];
  showLegend?: boolean;
  style?: 'north' | 'south';
}

const SIGN_MAP: Record<string, number> = {
  Aries: 1, Taurus: 2, Gemini: 3, Cancer: 4, Leo: 5, Virgo: 6,
  Libra: 7, Scorpio: 8, Sagittarius: 9, Capricorn: 10, Aquarius: 11, Pisces: 12
};

const SIGN_ABBR: Record<number, string> = {
  1: 'Ar', 2: 'Ta', 3: 'Ge', 4: 'Cn', 5: 'Le', 6: 'Vi',
  7: 'Li', 8: 'Sc', 9: 'Sg', 10: 'Cp', 11: 'Aq', 12: 'Pi'
};

const PLANET_ABBR: Record<string, string> = {
  'Ascendant (Lagna)': 'Asc',
  'Sun (Surya)': 'Su',
  'Moon (Chandra)': 'Mo',
  'Mars (Mangal)': 'Ma',
  'Mercury (Budh)': 'Me',
  'Jupiter (Guru)': 'Ju',
  'Venus (Shukra)': 'Ve',
  'Saturn (Shani)': 'Sa',
  'Rahu': 'Ra',
  'Ketu': 'Ke'
};

const SOUTH_SIGN_COORDS: Record<number, { x: number; y: number }> = {
  1: { x: 100, y: 0 },
  2: { x: 200, y: 0 },
  3: { x: 300, y: 0 },
  4: { x: 300, y: 100 },
  5: { x: 300, y: 200 },
  6: { x: 300, y: 300 },
  7: { x: 200, y: 300 },
  8: { x: 100, y: 300 },
  9: { x: 0, y: 300 },
  10: { x: 0, y: 200 },
  11: { x: 0, y: 100 },
  12: { x: 0, y: 0 }
};

const HOUSE_DETAILS: Record<number, { name: string; meaning: string }> = {
  1: { name: '1st (Lagna)', meaning: 'Self, Health' },
  2: { name: '2nd House', meaning: 'Wealth, Speech' },
  3: { name: '3rd House', meaning: 'Courage, Siblings' },
  4: { name: '4th House', meaning: 'Home, Assets' },
  5: { name: '5th House', meaning: 'Children, Mind' },
  6: { name: '6th House', meaning: 'Debts, Health' },
  7: { name: '7th House', meaning: 'Marriage, Spouse' },
  8: { name: '8th House', meaning: 'Longevity, Occult' },
  9: { name: '9th House', meaning: 'Luck, Father, Dharma' },
  10: { name: '10th House', meaning: 'Career, Status' },
  11: { name: '11th House', meaning: 'Gains, Profits' },
  12: { name: '12th House', meaning: 'Losses, Moksha' }
};

const SOUTH_SIGN_MEANINGS: Record<number, string> = {
  1: 'Self, Personality',
  2: 'Wealth, Family',
  3: 'Courage, Siblings',
  4: 'Home, Mother',
  5: 'Children, Mind',
  6: 'Health, Enemies',
  7: 'Marriage, Partner',
  8: 'Longevity, Occult',
  9: 'Fortune, Dharma',
  10: 'Career, Status',
  11: 'Gains, Profits',
  12: 'Losses, Expenses'
};

export const NavamsaChart: React.FC<NavamsaChartProps> = ({ navamsaLagna, planets, showLegend = true, style = 'north' }) => {
  const lagnaSignNum = SIGN_MAP[navamsaLagna] || 1;

  if (style === 'south') {
    // Group planets by sign
    const planetsBySign: Record<number, NavamsaPlanet[]> = {};
    for (let i = 1; i <= 12; i++) {
      planetsBySign[i] = [];
    }
    planets.forEach(p => {
      const signNum = SIGN_MAP[p.navamsaSign];
      if (signNum) {
        planetsBySign[signNum].push(p);
      }
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', margin: '10px 0' }}>
        <div style={{
          background: 'radial-gradient(circle at center, #0c0f24, #05060f)',
          border: '3px solid var(--color-border-gold)',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 8px 32px rgba(212, 175, 55, 0.15)',
          width: '100%',
          maxWidth: '432px',
          position: 'relative'
        }}>
          {/* D-9 Badge */}
          <div style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: '#d4af37',
            color: '#05060f',
            fontSize: '11px',
            fontWeight: 'bold',
            padding: '3px 8px',
            borderRadius: '4px',
            zIndex: 10
          }}>
            D-9
          </div>

          <svg viewBox="0 0 400 400" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Outer border */}
            <rect x="0" y="0" width="400" height="400" fill="none" stroke="var(--color-border-gold)" strokeWidth="2.5" />
            
            {/* Center Area */}
            <rect x="100" y="100" width="200" height="200" fill="rgba(212, 175, 55, 0.03)" stroke="var(--color-border-gold)" strokeWidth="1.5" />
            <text x="200" y="185" fill="var(--color-accent-gold)" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
              NAVAMSA D-9
            </text>
            <text x="200" y="210" fill="var(--color-text-muted)" fontSize="9.5" textAnchor="middle" dominantBaseline="middle">
              Signs Fixed | Houses Change
            </text>

            {/* Render the 12 cells */}
            {Array.from({ length: 12 }, (_, index) => {
              const signNum = index + 1;
              const { x, y } = SOUTH_SIGN_COORDS[signNum];
              const isLagna = signNum === lagnaSignNum;
              const cellPlanets = planetsBySign[signNum];

              // Calculate house number relative to Lagna
              const houseNum = (signNum - lagnaSignNum + 12) % 12 + 1;
              const houseSuffix = houseNum === 1 ? 'st' : houseNum === 2 ? 'nd' : houseNum === 3 ? 'rd' : 'th';

              return (
                <g key={signNum}>
                  {/* Cell border */}
                  <rect x={x} y={y} width="100" height="100" fill="none" stroke="var(--color-border-glass)" strokeWidth="1.5" />
                  
                  {/* Sign label & Sanskrit Name */}
                  <text x={x + 6} y={y + 15} fill="var(--color-accent-gold)" fontSize="9" fontWeight="bold" textAnchor="start">
                    {signNum}. {SIGN_ABBR[signNum]}
                  </text>

                  {/* House Label relative to Ascendant */}
                  <text x={x + 94} y={y + 15} fill="#ffffff" fontSize="8" fontWeight="600" textAnchor="end" style={{ opacity: 0.85 }}>
                    {isLagna ? 'Lagna' : `${houseNum}${houseSuffix}`}
                  </text>

                  {/* Lagna line & text */}
                  {isLagna && (
                    <>
                      <line x1={x + 100} y1={y} x2={x} y2={y + 100} stroke="rgba(212, 175, 55, 0.25)" strokeWidth="1" />
                      <rect x={x + 35} y={y + 2} width="30" height="14" rx="3" fill="rgba(212,175,55,0.2)" stroke="var(--color-accent-gold)" strokeWidth="0.5" />
                      <text x={x + 50} y={y + 9} fill="var(--color-accent-gold)" fontSize="8.5" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
                        ASC
                      </text>
                    </>
                  )}

                  {/* House Meaning at bottom of cell */}
                  <text x={x + 50} y={y + 88} fill="var(--color-text-muted)" fontSize="7" textAnchor="middle">
                    {SOUTH_SIGN_MEANINGS[signNum]}
                  </text>

                  {/* Planets list */}
                  {cellPlanets.map((p, idx) => {
                    const abbr = PLANET_ABBR[p.name] || p.name;
                    const isRetro = p.retrograde || p.name.includes('Rahu') || p.name.includes('Ketu') || p.name === 'Ra' || p.name === 'Ke';
                    const text = abbr + (isRetro ? '(R)' : '');
                    return (
                      <text
                        key={idx}
                        x={x + 50}
                        y={y + 38 + idx * 14}
                        fill="#ffffff"
                        fontSize="11.5"
                        fontWeight="700"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.8))' }}
                      >
                        {text}
                      </text>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>
        {showLegend && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            {Object.entries(PLANET_ABBR).map(([fullName, abbr]) => (
              <span key={abbr} style={{ background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--color-border-glass)' }}>
                <strong>{abbr}</strong>: {fullName.replace(' (Lagna)', '').replace(' (Chandra)', '').replace(' (Surya)', '').replace(' (Mangal)', '').replace(' (Budh)', '').replace(' (Guru)', '').replace(' (Shukra)', '').replace(' (Shani)', '')}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Calculate the sign number for each of the 12 houses (1-indexed house positions)
  const getSignForHouse = (houseNum: number): number => {
    const num = (lagnaSignNum + houseNum - 1) % 12;
    return num === 0 ? 12 : num;
  };

  // Group planets by their house number
  const planetsByHouse: Record<number, NavamsaPlanet[]> = {};
  for (let i = 1; i <= 12; i++) {
    planetsByHouse[i] = [];
  }

  planets.forEach(p => {
    if (p.navamsaHouse >= 1 && p.navamsaHouse <= 12) {
      planetsByHouse[p.navamsaHouse].push(p);
    }
  });

  // Coordinates mapping inside the 12 houses of a 400x400 North Indian chart SVG
  const houseConfig: Record<number, { 
    signX: number; signY: number; 
    labelX: number; labelY: number;
    meaningX: number; meaningY: number;
    planetX: number; planetY: number; 
    align: 'start' | 'middle' | 'end' 
  }> = {
    1: { signX: 200, signY: 155, labelX: 200, labelY: 122, meaningX: 200, meaningY: 135, planetX: 200, planetY: 178, align: 'middle' },    // Top Center Diamond
    2: { signX: 135, signY: 28, labelX: 100, labelY: 48, meaningX: 100, meaningY: 60, planetX: 100, planetY: 78, align: 'middle' },       // Top Left Triangle
    3: { signX: 58, signY: 65, labelX: 45, labelY: 100, meaningX: 45, meaningY: 112, planetX: 45, planetY: 130, align: 'middle' },       // Left Top Triangle
    4: { signX: 150, signY: 200, labelX: 100, labelY: 205, meaningX: 100, meaningY: 218, planetX: 100, planetY: 242, align: 'middle' },   // Left Center Diamond
    5: { signX: 58, signY: 335, labelX: 45, labelY: 300, meaningX: 45, meaningY: 288, planetX: 45, planetY: 268, align: 'middle' },       // Left Bottom Triangle
    6: { signX: 135, signY: 372, labelX: 100, labelY: 352, meaningX: 100, meaningY: 340, planetX: 100, planetY: 322, align: 'middle' },   // Bottom Left Triangle
    7: { signX: 200, signY: 245, labelX: 200, labelY: 278, meaningX: 200, meaningY: 290, planetX: 200, planetY: 222, align: 'middle' },   // Bottom Center Diamond
    8: { signX: 265, signY: 372, labelX: 300, labelY: 352, meaningX: 300, meaningY: 340, planetX: 300, planetY: 322, align: 'middle' },   // Bottom Right Triangle
    9: { signX: 342, signY: 335, labelX: 355, labelY: 300, meaningX: 355, meaningY: 288, planetX: 355, planetY: 268, align: 'middle' },   // Right Bottom Triangle
    10: { signX: 250, signY: 200, labelX: 300, labelY: 205, meaningX: 300, meaningY: 218, planetX: 300, planetY: 242, align: 'middle' },  // Right Center Diamond
    11: { signX: 342, signY: 65, labelX: 355, labelY: 100, meaningX: 355, meaningY: 112, planetX: 355, planetY: 130, align: 'middle' },   // Right Top Triangle
    12: { signX: 265, signY: 28, labelX: 300, labelY: 48, meaningX: 300, meaningY: 60, planetX: 300, planetY: 78, align: 'middle' }       // Top Right Triangle
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', margin: '10px 0' }}>
      <div style={{
        background: 'radial-gradient(circle at center, #0c0f24, #05060f)',
        border: '3px solid var(--color-border-gold)',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '0 8px 32px rgba(212, 175, 55, 0.15)',
        width: '100%',
        maxWidth: '432px',
        position: 'relative'
      }}>
        <svg viewBox="0 0 400 400" width="100%" height="100%" style={{ overflow: 'visible' }}>
          {/* Background Grid Lines */}
          <rect x="0" y="0" width="400" height="400" fill="none" stroke="var(--color-border-gold)" strokeWidth="2.5" />
          
          {/* Diagonals */}
          <line x1="0" y1="0" x2="400" y2="400" stroke="var(--color-border-glass)" strokeWidth="1.5" />
          <line x1="400" y1="0" x2="0" y2="400" stroke="var(--color-border-glass)" strokeWidth="1.5" />
          
          {/* Inner Diamond */}
          <polygon points="200,0 400,200 200,400 0,200" fill="none" stroke="var(--color-border-gold)" strokeWidth="2" />
          
          {/* D-9 Badge */}
          <g transform="translate(345, 12)">
            <rect x="0" y="0" width="42" height="22" rx="6" fill="#d4af37" />
            <text x="21" y="12" fill="#05060f" fontSize="11" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">D-9</text>
          </g>

          {/* Loop through all 12 houses to plot sign numbers, labels, meanings, and planets */}
          {Object.entries(houseConfig).map(([houseStr, cfg]) => {
            const houseNum = parseInt(houseStr, 10);
            const signNum = getSignForHouse(houseNum);
            const housePlanets = planetsByHouse[houseNum];
            const details = HOUSE_DETAILS[houseNum];

            return (
              <g key={houseNum}>
                {/* House Sign Number */}
                <text 
                  x={cfg.signX} 
                  y={cfg.signY} 
                  fill="var(--color-accent-gold)" 
                  fontSize="14" 
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {signNum}
                </text>

                {/* House Label */}
                <text 
                  x={cfg.labelX} 
                  y={cfg.labelY} 
                  fill="#ffffff" 
                  fontSize="8.5" 
                  fontWeight="700"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ opacity: 0.95 }}
                >
                  {details.name}
                </text>

                {/* House Meaning */}
                <text 
                  x={cfg.meaningX} 
                  y={cfg.meaningY} 
                  fill="var(--color-text-muted)" 
                  fontSize="7" 
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ opacity: 0.8 }}
                >
                  {details.meaning}
                </text>

                {/* Planets text list inside the house */}
                {housePlanets.length > 0 && (
                  <text 
                    x={cfg.planetX} 
                    y={cfg.planetY} 
                    fill="#ffffff" 
                    fontSize="12.5" 
                    fontWeight="700"
                    textAnchor={cfg.align}
                    dominantBaseline="middle"
                    style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.8))' }}
                  >
                    {housePlanets.map(p => {
                      const abbr = PLANET_ABBR[p.name] || p.name;
                      const isRetro = p.retrograde || p.name.includes('Rahu') || p.name.includes('Ketu') || p.name === 'Ra' || p.name === 'Ke';
                      return abbr + (isRetro ? '(R)' : '');
                    }).join(', ')}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      {showLegend && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          {Object.entries(PLANET_ABBR).map(([fullName, abbr]) => (
            <span key={abbr} style={{ background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--color-border-glass)' }}>
              <strong>{abbr}</strong>: {fullName.replace(' (Lagna)', '').replace(' (Chandra)', '').replace(' (Surya)', '').replace(' (Mangal)', '').replace(' (Budh)', '').replace(' (Guru)', '').replace(' (Shukra)', '').replace(' (Shani)', '')}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
