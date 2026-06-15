import React, { useState } from 'react';

interface Planet {
  name: string;
  house: number;
  retrograde?: boolean;
}

interface HousePredictionsProps {
  planets: Planet[];
  lagna: string;
}

// Vedic house general significations
const HOUSE_TOPICS: Record<number, string> = {
  1: 'Self & Personality', 2: 'Wealth & Family', 3: 'Courage & Siblings',
  4: 'Home & Mother', 5: 'Intelligence & Children', 6: 'Health & Enemies',
  7: 'Marriage & Partners', 8: 'Longevity & Transformation', 9: 'Luck & Dharma',
  10: 'Career & Status', 11: 'Gains & Friends', 12: 'Expenses & Spirituality',
};

// Per-planet, per-house general Vedic predictions
const PREDICTIONS: Record<string, Record<number, string>> = {
  'Sun (Surya)': {
    1: 'Strong sense of identity and natural leadership. You carry authority and are drawn to positions of power. Health and vitality are generally robust.',
    2: 'Family lineage and ancestral wealth play an important role. Speech carries authority. Desire to accumulate resources to enhance status.',
    3: 'Courageous and self-motivated. Siblings may hold prominent roles. Excellent drive to initiate projects and pursue goals independently.',
    4: 'Paternal influences shape the home environment. Public image tied to domestic life. Possible tension between career ambitions and home.',
    5: 'Highly creative with strong self-expression. Natural affinity for leadership in education, arts, or speculation. Children may be gifted.',
    6: 'Excellent capacity to overcome obstacles and defeat competition. Service-oriented careers suit well. Strong immune system and recovery ability.',
    7: 'Partnerships are central to life purpose. Spouse tends to be prominent or ambitious. Business alliances can be highly productive.',
    8: 'Deep interest in the occult, hidden knowledge, and transformation. Life involves significant turning points and inherited resources.',
    9: 'Strong connection to father and spiritual traditions. Natural philosophical bent. Fortune comes through higher learning and long journeys.',
    10: 'Exceptional career drive and public recognition. Authority, government, or leadership roles are favoured. Life purpose is closely tied to profession.',
    11: 'Gains through influential networks and powerful associations. Social circle includes distinguished individuals. Goals are achieved with persistence.',
    12: 'Spiritual inclinations and tendency toward introspection. Foreign connections or residence abroad likely. Hidden expenses must be monitored.',
  },
  'Moon (Chandra)': {
    1: 'Highly sensitive and emotionally expressive personality. Public persona is nurturing and changeable. Strong intuition guides decisions.',
    2: 'Emotional security tied to wealth and family bonds. Good memory for lineage and tradition. Financial flows can be fluctuating.',
    3: 'Emotional communication style. Close emotional bonds with siblings. Writing, communication, and travel are emotionally fulfilling.',
    4: 'Deep emotional connection to home and mother. Domestic comforts are essential to wellbeing. Real estate interests are favoured.',
    5: 'Vivid imagination and emotional depth in creative pursuits. Strong maternal instinct. Children bring emotional fulfilment.',
    6: 'Emotional resilience tested through health or service. Good at caring professions. Must avoid emotional burnout from overgiving.',
    7: 'Emotional fulfilment through partnership. Spouse is nurturing or reflective. Public life involves emotional responsiveness.',
    8: 'Deeply intuitive with psychic sensitivity. Emotional life involves transformations. Inherited emotional patterns require conscious healing.',
    9: 'Spiritual and philosophical mind. Drawn to sacred traditions and wisdom literature. Good fortune through emotional generosity.',
    10: 'Public life and career involve nurturing or emotional connection. Recognition from the public is possible. Mother's influence shapes career.',
    11: 'Fulfilment of desires through social connections. Gains through women or public relationships. Fluctuating income streams.',
    12: 'Rich inner emotional life and vivid dream experiences. Spiritual retreats and solitary reflection bring peace. Overseas associations likely.',
  },
  'Mars (Mangal)': {
    1: 'Energetic, assertive, and competitive personality. Natural warrior spirit. Must channel aggression constructively to avoid conflict.',
    2: 'Drive to accumulate wealth aggressively. Speech can be sharp. Family dynamics may involve power struggles.',
    3: 'Exceptional courage and initiative. Skilled in technical and mechanical fields. Siblings play an active role in life.',
    4: 'Real estate, construction, and property dealings are favoured. Domestic environment can be intense. Land and vehicles are significant.',
    5: 'Passionate and competitive in creative and intellectual pursuits. Strong athletic tendencies. Romance is intense and fiery.',
    6: 'Excellent at defeating enemies and overcoming illness. Thrives in competitive or combative professions. Legal battles tend to be won.',
    7: 'Partnership energy is intense and passionate. Spouse is dynamic and assertive. Business partnerships require clear boundaries.',
    8: 'Strong regenerative capacity. Interest in surgery, research, or occult. Life involves profound transformations through crises.',
    9: 'Zealous in pursuing dharmic goals. Can be dogmatic in beliefs. Fortune is built through bold, pioneering action.',
    10: 'Powerful career drive in technical, military, or engineering fields. Leadership roles suit well. Recognised for decisive action.',
    11: 'Ambitious pursuit of goals through willpower. Gains through technical skills. Influential and energetic social network.',
    12: 'Energy expenditure in hidden or behind-the-scenes work. Interest in spiritual combat or meditation practices. Foreign travel is significant.',
  },
  'Mercury (Budh)': {
    1: 'Intellectually agile and articulate personality. Quick wit and analytical mind. Communication is a central life theme.',
    2: 'Wealth through communication, trade, or intellectual work. Eloquent speech. Business acumen and financial planning are strong.',
    3: 'Highly skilled communicator and writer. Short travels are frequent and purposeful. Sibling relationships involve intellectual exchange.',
    4: 'Intelligent home environment with emphasis on learning. Good at real estate analysis. Mother may be educated or intellectually influential.',
    5: 'Sharp analytical intellect applied to creative work. Strong in mathematics, logic, and speculation. Children may be intellectually gifted.',
    6: 'Excellent problem-solving abilities in service roles. Thrives in healthcare, analysis, or dispute resolution. Health issues may relate to the nervous system.',
    7: 'Partnerships based on intellectual compatibility. Skilled negotiator in business. Spouse tends to be communicative and analytical.',
    8: 'Research-oriented mind drawn to hidden patterns. Interest in occult sciences, psychology, or forensics. Good at investigative analysis.',
    9: 'Love of philosophy, writing, and teaching. Multiple long journeys for learning. Fortune through intellectual and literary pursuits.',
    10: 'Career success through communication, writing, education, or business. Versatility is an asset. Public recognition for intellect.',
    11: 'Gains through networks, information technology, or commerce. Social circle is diverse and intellectually stimulating.',
    12: 'Hidden intellectual work or behind-the-scenes writing. Interest in foreign languages and esoteric study. Expenses tied to communication or travel.',
  },
  'Jupiter (Guru)': {
    1: 'Magnanimous, wise, and optimistic personality. Natural counsellor and teacher. Physical stature may be impressive. Life is guided by dharma.',
    2: 'Abundant wealth and strong family values. Eloquent and wise speech. Generosity in financial matters. Excellent for accumulating resources over time.',
    3: 'Wisdom expressed through communication and writing. Short travels for learning. Relationship with siblings is benefic and supportive.',
    4: 'Blessed home life with wisdom in the family. Strong connection to mother. Property and real estate bring fortune. Excellent for academic environment at home.',
    5: 'Exceptional intelligence and creativity. Children are blessed and spiritually inclined. Strong speculative and philosophical abilities. Love affairs are meaningful.',
    6: 'Ability to overcome difficulties through wisdom and grace. Good at healing professions. Enemies are overcome through patience rather than conflict.',
    7: 'Blessed partnerships and marriage. Spouse is wise, learned, or spiritually oriented. Excellent for legal matters and diplomatic relations.',
    8: 'Deep interest in spiritual transformation and occult wisdom. Longevity is supported. Inheritance or joint finances are generally favourable.',
    9: 'Exceptional fortune and dharmic living. Strong connection to guru and sacred traditions. Higher learning, philosophy, and spirituality flourish.',
    10: 'Highly respected career in teaching, law, advisory, or spiritual guidance. Public recognition for wisdom and integrity.',
    11: 'Significant gains through knowledge networks and noble associations. Goals are achieved through ethical means. Social circle is learned and wise.',
    12: 'Spiritual liberation is a life theme. Interest in foreign spiritual traditions. Expenses are for noble causes. Retreat and meditation are fulfilling.',
  },
  'Venus (Shukra)': {
    1: 'Charming, attractive, and artistically gifted personality. Natural grace in social interactions. Sensual pleasures and aesthetics are central.',
    2: 'Wealth through luxury, beauty, or artistic industries. Melodious and persuasive speech. Family environment is refined and comfortable.',
    3: 'Artistic communication and creative writing. Pleasant relationships with siblings. Short journeys for pleasure or artistic inspiration.',
    4: 'Beautifully decorated, comfortable home. Strong emotional bond with mother. Real estate dealings are favourable. Domestic life is harmonious.',
    5: 'Highly creative with a strong aesthetic sense. Romance and love affairs are significant. Children are artistic or beautiful.',
    6: 'Artistic skills applied in service. Good at health and beauty industries. Rivalry in relationships or creative competition must be managed.',
    7: 'Blessed and harmonious marriage. Spouse is attractive, artistic, and refined. Excellent for business partnerships in creative or luxury sectors.',
    8: 'Hidden pleasures and occult interests. Inheritance through partnerships. Transformation through intimate relationships is a key life theme.',
    9: 'Love of beauty in philosophy and sacred traditions. Fortune through artistic or diplomatic pursuits. Enjoyable long journeys and foreign connections.',
    10: 'Career success in arts, fashion, diplomacy, or entertainment. Admired publicly for elegance and talent. Leadership in creative industries.',
    11: 'Gains through artistic networks, luxury goods, or beauty industries. Enjoyable social life with refined associates.',
    12: 'Pleasures in private or hidden settings. Spiritual path involves beauty and devotion. Expenses on luxury, art, or foreign pleasures.',
  },
  'Saturn (Shani)': {
    1: 'Disciplined, serious, and enduring personality. Life teaches patience and responsibility early. Late bloomers who achieve lasting results.',
    2: 'Frugal attitude towards wealth, earned through hard sustained work. Family responsibilities are heavy. Speech is careful and deliberate.',
    3: 'Disciplined and systematic in communication. Hard work in all short journeys and efforts. Sibling relationships involve duty and responsibility.',
    4: 'Restricted or serious domestic environment. Hard work in property matters. Mother may be disciplined or emotionally distant. Emotional structure is built over time.',
    5: 'Disciplined approach to education and creativity. Children may come later in life. Speculative ventures require patience and caution.',
    6: 'Exceptional endurance in overcoming disease, debt, and enemies. Excellent for service professions requiring perseverance. Chronic health issues need attention.',
    7: 'Serious and committed in partnerships. Marriage may be delayed or with a mature partner. Business partnerships require clear agreements and patience.',
    8: 'Long life with capacity to endure chronic challenges. Deep interest in the mysteries of life and death. Hidden obstacles require systematic resolution.',
    9: 'Structured and disciplined philosophical outlook. Fortune comes through sustained effort and ethical conduct. Father's life involves hardship or discipline.',
    10: 'Slow and steady rise to high professional achievement. Recognised for reliability, discipline, and integrity. Careers in law, government, or administration suit.',
    11: 'Gains through persistent long-term effort. Older, reliable associates in social network. Goals achieved methodically over time.',
    12: 'Deep interest in solitude, meditation, and spiritual practice. Foreign residences possible. Losses or expenses require disciplined financial planning.',
  },
  'Rahu': {
    1: 'Unconventional, ambitious, and intensely driven personality. Breaks social norms to forge a unique path. Foreign influences shape identity significantly.',
    2: 'Unconventional sources of wealth. Accumulation through foreign connections or unusual means. Speech can be deceptive or hypnotic.',
    3: 'Driven and restless in communication and short travels. Unconventional siblings. Bold, risk-taking approach to all efforts.',
    4: 'Unusual or foreign home environment. Mother's life may be unconventional. Real estate dealings involve complexity. Emotional restlessness at home.',
    5: 'Unconventional creativity and unusual children. Intense romantic experiences. Risky speculations attract. Intelligence is out-of-the-ordinary.',
    6: 'Exceptional at defeating enemies through unconventional means. Drawn to foreign-influenced healthcare or law. Hidden enemies may manifest.',
    7: 'Foreign or unconventional partnerships and marriage. Business with foreigners or in foreign lands. Intense and complex partnership dynamics.',
    8: 'Deep fascination with the occult, mysteries, and sudden transformation. Sudden events shape life profoundly. Research into hidden realms is favoured.',
    9: 'Unconventional philosophical and spiritual inclinations. Fortune from foreign lands or unorthodox paths. Teacher figures may be unusual or foreign.',
    10: 'Ambitious and unconventional career path. Rapid rise to prominence in foreign or technical fields. Recognition comes through unique, disruptive approaches.',
    11: 'Enormous gains through networks, technology, and foreign connections. Ambitious and unconventional social circles. Desires are intense and fulfilled in surprising ways.',
    12: 'Foreign travels, spiritual journeys, and isolating experiences are significant. Hidden desires and subconscious drives require awareness. Liberation through unconventional paths.',
  },
  'Ketu': {
    1: 'Spiritually detached and introspective personality. Past-life wisdom colours the present identity. Unconventional appearance or health matters may arise.',
    2: 'Detachment from material accumulation. Spiritual wisdom expressed through speech. Family connections have a karmic quality.',
    3: 'Detachment from communication and short journeys. Intuitive rather than logical in expression. Spiritual insights come through creative efforts.',
    4: 'Inner spiritual life takes precedence over external domestic comforts. Past-life connections to home country. Mother has a spiritual or detached quality.',
    5: 'Spiritual creativity and past-life intelligence. Detachment from speculation and romantic outcomes. Children may have spiritual qualities or karmic significance.',
    6: 'Past-life capacity to deal with enemies and health obstacles. Spiritual practices heal. Detachment from conflicts leads to resolution.',
    7: 'Karmic partnerships that facilitate spiritual growth. Detachment in relationships. Past-life partner connections are possible.',
    8: 'Deep spiritual interest in transformation, death, and occult. Moksha-oriented life. Past-life spiritual practices re-emerge.',
    9: 'Detachment from conventional religion. Inner spiritual path is unconventional. Past-life dharmic wisdom surfaces in this lifetime.',
    10: 'Unconventional career path influenced by past-life skills. Detachment from public recognition. Spiritual or research-based work suits.',
    11: 'Detachment from material gains. Spiritual goals replace worldly ambitions. Gains arrive unexpectedly through past-life merits.',
    12: 'Excellent for spiritual liberation and moksha. Deep meditative capacity. Foreign or isolated environments facilitate spiritual growth.',
  },
};

const PLANET_ICONS: Record<string, string> = {
  'Sun (Surya)': '☉', 'Moon (Chandra)': '☽', 'Mars (Mangal)': '♂',
  'Mercury (Budh)': '☿', 'Jupiter (Guru)': '♃', 'Venus (Shukra)': '♀',
  'Saturn (Shani)': '♄', 'Rahu': '☊', 'Ketu': '☋',
};

export const HousePredictions: React.FC<HousePredictionsProps> = ({ planets, lagna }) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const predictable = planets.filter(p => PREDICTIONS[p.name] && PREDICTIONS[p.name][p.house]);

  return (
    <div>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', borderBottom: '1px solid var(--color-border-gold)', paddingBottom: '8px' }}>
        House-Based Planetary Predictions
      </h3>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
        Based on your {lagna} Lagna — click any planet to expand its reading.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {predictable.map(planet => {
          const key = `${planet.name}-${planet.house}`;
          const isOpen = expanded === key;
          const text = PREDICTIONS[planet.name][planet.house];
          return (
            <div
              key={key}
              style={{
                border: `1px solid ${isOpen ? 'var(--color-border-gold)' : 'var(--color-border-glass)'}`,
                borderRadius: '10px',
                overflow: 'hidden',
                background: isOpen ? 'rgba(212,175,55,0.04)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s',
              }}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : key)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '14px 18px', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.3rem', minWidth: '24px' }}>{PLANET_ICONS[planet.name] || '★'}</span>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-accent-gold)', fontSize: '1rem' }}>
                      {planet.name}
                      {planet.retrograde && <span style={{ color: '#ff7043', fontSize: '0.8rem', marginLeft: '6px' }}>⟲ (R)</span>}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginLeft: '8px' }}>
                      House {planet.house} — {HOUSE_TOPICS[planet.house]}
                    </span>
                  </div>
                </div>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div style={{ padding: '0 18px 16px 54px', color: 'var(--color-text-main)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                  {planet.retrograde && (
                    <p style={{ color: '#ff7043', fontSize: '0.85rem', marginBottom: '8px', fontStyle: 'italic' }}>
                      Retrograde: This planet's energy is internalized, requiring deeper reflection before its themes fully manifest externally.
                    </p>
                  )}
                  {text}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
