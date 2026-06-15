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
}

const SIGN_MAP: Record<string, number> = {
  Aries: 1, Taurus: 2, Gemini: 3, Cancer: 4, Leo: 5, Virgo: 6,
  Libra: 7, Scorpio: 8, Sagittarius: 9, Capricorn: 10, Aquarius: 11, Pisces: 12
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

export const NavamsaChart: React.FC<NavamsaChartProps> = ({ navamsaLagna, planets, showLegend = true }) => {
  const lagnaSignNum = SIGN_MAP[navamsaLagna] || 1;

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

  // Coordinates for placing text inside the 12 houses in a 400x400 North Indian chart SVG
  const houseConfig: Record<number, { signX: number; signY: number; planetX: number; planetY: number; align: 'start' | 'middle' | 'end' }> = {
    1: { signX: 200, signY: 120, planetX: 200, planetY: 155, align: 'middle' },     // Top Center Diamond
    2: { signX: 125, signY: 75, planetX: 110, planetY: 55, align: 'start' },        // Top Left Triangle
    3: { signX: 75, signY: 125, planetX: 55, planetY: 110, align: 'start' },        // Left Top Triangle
    4: { signX: 120, signY: 200, planetX: 85, planetY: 215, align: 'middle' },      // Left Center Diamond
    5: { signX: 75, signY: 275, planetX: 55, planetY: 290, align: 'start' },        // Left Bottom Triangle
    6: { signX: 125, signY: 325, planetX: 110, planetY: 345, align: 'start' },      // Bottom Left Triangle
    7: { signX: 200, signY: 280, planetX: 200, planetY: 250, align: 'middle' },     // Bottom Center Diamond
    8: { signX: 275, signY: 325, planetX: 290, planetY: 345, align: 'end' },        // Bottom Right Triangle
    9: { signX: 325, signY: 275, planetX: 345, planetY: 290, align: 'end' },        // Right Bottom Triangle
    10: { signX: 280, signY: 200, planetX: 315, planetY: 215, align: 'middle' },    // Right Center Diamond
    11: { signX: 325, signY: 125, planetX: 345, planetY: 110, align: 'end' },       // Right Top Triangle
    12: { signX: 275, signY: 75, planetX: 290, planetY: 55, align: 'end' }         // Top Right Triangle
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

          {/* Loop through all 12 houses to plot sign numbers and planets */}
          {Object.entries(houseConfig).map(([houseStr, cfg]) => {
            const houseNum = parseInt(houseStr, 10);
            const signNum = getSignForHouse(houseNum);
            const housePlanets = planetsByHouse[houseNum];

            return (
              <g key={houseNum}>
                {/* House Sign Number */}
                <text 
                  x={cfg.signX} 
                  y={cfg.signY} 
                  fill="var(--color-text-muted)" 
                  fontSize="12" 
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {signNum}
                </text>

                {/* Planets text list inside the house */}
                {housePlanets.length > 0 && (
                  <text 
                    x={cfg.planetX} 
                    y={cfg.planetY} 
                    fill="#ffffff" 
                    fontSize="13" 
                    fontWeight="600"
                    textAnchor={cfg.align}
                    dominantBaseline="middle"
                    style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.8))' }}
                  >
                    {housePlanets.map(p => (PLANET_ABBR[p.name] || p.name) + (p.retrograde ? '(R)' : '')).join(', ')}
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
