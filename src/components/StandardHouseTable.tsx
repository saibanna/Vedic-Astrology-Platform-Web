import React from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Planet {
  name: string;
  sign: string;
  degree: string;
  house: number;
  retrograde?: boolean;
}

interface StandardHouseTableProps {
  planets: Planet[];
  lagna: string; // e.g. 'Aries', 'Taurus', etc.
}

/* ------------------------------------------------------------------ */
/*  Reference Maps                                                     */
/* ------------------------------------------------------------------ */

const SIGN_ORDER: string[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const SIGN_MAP: Record<string, number> = {
  Aries: 1, Taurus: 2, Gemini: 3, Cancer: 4,
  Leo: 5, Virgo: 6, Libra: 7, Scorpio: 8,
  Sagittarius: 9, Capricorn: 10, Aquarius: 11, Pisces: 12,
};

const SIGN_SANSKRIT: Record<string, string> = {
  Aries: 'Mesha', Taurus: 'Vrishabha', Gemini: 'Mithuna', Cancer: 'Karka',
  Leo: 'Simha', Virgo: 'Kanya', Libra: 'Tula', Scorpio: 'Vrischika',
  Sagittarius: 'Dhanu', Capricorn: 'Makara', Aquarius: 'Kumbha', Pisces: 'Meena',
};

const SIGN_LORD: Record<string, string> = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
  Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars',
  Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter',
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
  'Ketu': 'Ke',
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Given a Lagna sign name, return the sign that falls in the given house (1-12). */
function signForHouse(lagna: string, house: number): string {
  const lagnaIndex = SIGN_MAP[lagna] - 1; // 0-based
  const idx = (lagnaIndex + house - 1) % 12;
  return SIGN_ORDER[idx];
}

/** Build a lookup: house number → list of planets in that house. */
function groupPlanetsByHouse(planets: Planet[]): Record<number, Planet[]> {
  const map: Record<number, Planet[]> = {};
  for (const p of planets) {
    // Skip the Ascendant — only actual planets should appear
    if (p.name === 'Ascendant (Lagna)') continue;
    if (!map[p.house]) map[p.house] = [];
    map[p.house].push(p);
  }
  return map;
}

function abbreviate(planet: Planet): string {
  const abbr = PLANET_ABBR[planet.name] ?? planet.name;
  return planet.retrograde ? `${abbr}(R)` : abbr;
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const styles: Record<string, React.CSSProperties> = {
  section: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'var(--font-heading, Cinzel, serif)',
    fontSize: '1.35rem',
    color: 'var(--color-accent-gold, #d4af37)',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'var(--font-sans, Outfit, sans-serif)',
    fontSize: '0.92rem',
    color: 'var(--color-text-muted, #9ca3af)',
    marginBottom: 18,
  },
  wrapper: {
    overflowX: 'auto' as const,
    borderRadius: 12,
    border: '1px solid var(--color-border-gold, rgba(212,175,55,0.25))',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontFamily: 'var(--font-sans, Outfit, sans-serif)',
    fontSize: '0.9rem',
  },
  th: {
    padding: '12px 14px',
    textAlign: 'left' as const,
    fontWeight: 600,
    color: 'var(--color-accent-gold, #d4af37)',
    borderBottom: '2px solid var(--color-border-gold, rgba(212,175,55,0.25))',
    whiteSpace: 'nowrap' as const,
    letterSpacing: '0.03em',
  },
  td: {
    padding: '10px 14px',
    color: 'var(--color-text-main, #f3f4f6)',
    borderBottom: '1px solid var(--color-border-glass, rgba(255,255,255,0.07))',
    whiteSpace: 'nowrap' as const,
  },
  muted: {
    color: 'var(--color-text-muted, #9ca3af)',
  },
  planetText: {
    fontWeight: 700,
    color: '#fff',
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const StandardHouseTable: React.FC<StandardHouseTableProps> = ({
  planets,
  lagna,
}) => {
  const planetsByHouse = groupPlanetsByHouse(planets);

  const rows = Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1;
    const sign = signForHouse(lagna, houseNum);
    const signNum = SIGN_MAP[sign];
    const sanskrit = SIGN_SANSKRIT[sign] ?? '';
    const lord = SIGN_LORD[sign] ?? '-';
    const housePlanets = planetsByHouse[houseNum] ?? [];
    const hasPlanets = housePlanets.length > 0;

    return { houseNum, sign, signNum, sanskrit, lord, housePlanets, hasPlanets };
  });

  return (
    <div style={styles.section}>
      <h3 style={styles.title}>Standard House Analysis (Bhāva Chart)</h3>
      <p style={styles.subtitle}>
        Houses mapped from your {lagna} Lagna — showing sign rulers and planetary occupants.
      </p>

      <div style={styles.wrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>House</th>
              <th style={styles.th}>House Name (Rāśi)</th>
              <th style={styles.th}>House Lord</th>
              <th style={styles.th}>Native Planets</th>
              <th style={styles.th}>Native House #</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const rowBg =
                idx % 2 === 0
                  ? 'rgba(255,255,255,0.02)'
                  : 'rgba(255,255,255,0.04)';

              const rowStyle: React.CSSProperties = {
                background: rowBg,
                borderLeft: row.hasPlanets
                  ? '3px solid var(--color-accent-gold, #d4af37)'
                  : '3px solid transparent',
              };

              return (
                <tr key={row.houseNum} style={rowStyle}>
                  <td style={styles.td}>{row.houseNum}</td>
                  <td style={styles.td}>
                    {row.sign} ({row.sanskrit})
                  </td>
                  <td style={styles.td}>{row.lord}</td>
                  <td style={styles.td}>
                    {row.hasPlanets ? (
                      <span style={styles.planetText}>
                        {row.housePlanets.map(abbreviate).join(', ')}
                      </span>
                    ) : (
                      <span style={styles.muted}>-</span>
                    )}
                  </td>
                  <td style={styles.td}>{row.signNum}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
