import React, { useState } from 'react';
import { Star } from 'lucide-react';

const NAKSHATRAS = [
  { name:"Ashwini",   lord:"Ketu",    deity:"Ashwini Kumars",symbol:"Horse head",   element:"Fire",  quality:"Movable",  sign:"Aries",       traits:"Dynamic, healing, swift, pioneering, enthusiastic",       favorable:"Starting new ventures, travel, healing, sports",          mantra:"Om Ashwinyai Namah" },
  { name:"Bharani",   lord:"Venus",   deity:"Yama",          symbol:"Yoni",         element:"Earth", quality:"Fixed",    sign:"Aries",       traits:"Determined, disciplined, creative, sensual, transformative",favorable:"Creative work, entertainment, dealing with endings",       mantra:"Om Bharanyai Namah" },
  { name:"Krittika",  lord:"Sun",     deity:"Agni",          symbol:"Razor/flame",  element:"Fire",  quality:"Mixed",    sign:"Aries/Taurus",traits:"Sharp, critical, ambitious, purifying, courageous",         favorable:"Cutting through obstacles, cooking, ceremonies",           mantra:"Om Krittikaabhyo Namah" },
  { name:"Rohini",    lord:"Moon",    deity:"Brahma",        symbol:"Cart/chariot", element:"Earth", quality:"Fixed",    sign:"Taurus",      traits:"Beautiful, fertile, nurturing, artistic, romantic",         favorable:"Agriculture, arts, marriage, financial dealings",          mantra:"Om Rohinyai Namah" },
  { name:"Mrigashira",lord:"Mars",    deity:"Chandra",       symbol:"Deer head",    element:"Earth", quality:"Soft",     sign:"Taurus/Gemini",traits:"Gentle, searching, curious, restless, charming",           favorable:"Research, travel, learning, starting activities",          mantra:"Om Mrigashirasai Namah" },
  { name:"Ardra",     lord:"Rahu",    deity:"Rudra",         symbol:"Teardrop",     element:"Water", quality:"Sharp",    sign:"Gemini",      traits:"Intense, transformative, intellectual, stormy, persistent", favorable:"Destruction of obstacles, scientific research",            mantra:"Om Ardraayai Namah" },
  { name:"Punarvasu", lord:"Jupiter", deity:"Aditi",         symbol:"Bow/quiver",   element:"Water", quality:"Movable",  sign:"Gemini/Cancer",traits:"Optimistic, generous, philosophical, rejuvenating, wise",  favorable:"Travel, business, healing, spiritual studies",             mantra:"Om Punarvaasuvaabhyaam Namah" },
  { name:"Pushya",    lord:"Saturn",  deity:"Brihaspati",    symbol:"Flower/circle",element:"Water", quality:"Fixed",    sign:"Cancer",      traits:"Nourishing, protective, generous, spiritual, devoted",      favorable:"All auspicious activities — best nakshatra overall",       mantra:"Om Pushyaaya Namah" },
  { name:"Ashlesha",  lord:"Mercury", deity:"Sarpas",        symbol:"Coiled serpent",element:"Water",quality:"Sharp",   sign:"Cancer",      traits:"Intense, mystical, cunning, penetrating, transformative",   favorable:"Occult studies, healing, dealing with enemies",            mantra:"Om Aashleshaayai Namah" },
  { name:"Magha",     lord:"Ketu",    deity:"Pitras",        symbol:"Palanquin",    element:"Fire",  quality:"Fierce",   sign:"Leo",         traits:"Regal, proud, ancestral, authoritative, generous",          favorable:"Honoring ancestors, ceremonies, leadership, politics",      mantra:"Om Maghaayai Namah" },
  { name:"Purva Phalguni",lord:"Venus",deity:"Bhaga",        symbol:"Fig tree",     element:"Fire",  quality:"Fierce",   sign:"Leo",         traits:"Luxurious, romantic, creative, playful, pleasure-seeking",  favorable:"Marriage, romance, creativity, leisure",                  mantra:"Om Purva Phaalgunyai Namah" },
  { name:"Uttara Phalguni",lord:"Sun",deity:"Aryama",        symbol:"Bed",          element:"Fire",  quality:"Fixed",    sign:"Leo/Virgo",   traits:"Generous, stable, dutiful, friendly, responsible",          favorable:"Marriage, partnerships, social work, helping others",      mantra:"Om Uttara Phaalgunyai Namah" },
  { name:"Hasta",     lord:"Moon",    deity:"Savitar",       symbol:"Hand",         element:"Earth", quality:"Movable",  sign:"Virgo",       traits:"Skilled, practical, witty, charming, artistic",             favorable:"Crafts, business, healing, travel",                        mantra:"Om Hastaaya Namah" },
  { name:"Chitra",    lord:"Mars",    deity:"Tvastar",       symbol:"Pearl/lamp",   element:"Fire",  quality:"Soft",     sign:"Virgo/Libra", traits:"Brilliant, artistic, glamorous, creative, magnetic",        favorable:"Art, design, construction, making things beautiful",       mantra:"Om Chitraayai Namah" },
  { name:"Svati",     lord:"Rahu",    deity:"Vayu",          symbol:"Coral/sword",  element:"Air",   quality:"Movable",  sign:"Libra",       traits:"Independent, flexible, diplomatic, spiritual, business-minded",favorable:"Business, learning, travel, spiritual practice",          mantra:"Om Swaatayai Namah" },
  { name:"Visakha",   lord:"Jupiter", deity:"Indragni",      symbol:"Tri-junction", element:"Fire",  quality:"Mixed",    sign:"Libra/Scorpio",traits:"Goal-oriented, ambitious, competitive, determined",          favorable:"Achieving goals, ceremonies, debates",                     mantra:"Om Vishaakhaabhyaam Namah" },
  { name:"Anuradha",  lord:"Saturn",  deity:"Mitra",         symbol:"Lotus",        element:"Water", quality:"Soft",     sign:"Scorpio",     traits:"Devoted, cooperative, balanced, success-oriented, friendly", favorable:"Friendships, travel abroad, spiritual groups",             mantra:"Om Anuraadhaayai Namah" },
  { name:"Jyeshtha",  lord:"Mercury", deity:"Indra",         symbol:"Umbrella",     element:"Water", quality:"Sharp",    sign:"Scorpio",     traits:"Elder, protective, powerful, chief, responsible",            favorable:"Leadership, protective work, dealing with authority",       mantra:"Om Jyeshthaaayai Namah" },
  { name:"Mula",      lord:"Ketu",    deity:"Nirriti",       symbol:"Root/tail",    element:"Fire",  quality:"Fierce",   sign:"Sagittarius", traits:"Investigative, philosophical, transformative, rooted",       favorable:"Research, medicine, digging deep, spiritual inquiry",      mantra:"Om Muulaaya Namah" },
  { name:"Purva Ashadha",lord:"Venus",deity:"Apas",          symbol:"Fan/basket",   element:"Fire",  quality:"Fierce",   sign:"Sagittarius", traits:"Invincible, proud, philosophical, independent, energetic",  favorable:"Purification, debates, water activities",                 mantra:"Om Purva Ashaadhaaayai Namah" },
  { name:"Uttara Ashadha",lord:"Sun", deity:"Vishvedevas",   symbol:"Elephant tusk",element:"Earth", quality:"Fixed",    sign:"Sagittarius/Capricorn",traits:"Responsible, virtuous, leadership, righteous, stable",   favorable:"Starting permanent ventures, government work",             mantra:"Om Uttara Ashaadhaaayai Namah" },
  { name:"Sravana",   lord:"Moon",    deity:"Vishnu",        symbol:"Ear/trident",  element:"Air",   quality:"Movable",  sign:"Capricorn",   traits:"Listening, learning, connection, media, communication",      favorable:"Education, media, travel, religious activities",           mantra:"Om Shravaanaaya Namah" },
  { name:"Dhanishta", lord:"Mars",    deity:"Asta Vasus",    symbol:"Drum/flute",   element:"Air",   quality:"Movable",  sign:"Capricorn/Aquarius",traits:"Wealthy, musical, generous, ambitious, social",           favorable:"Music, dance, sports, charitable activities",              mantra:"Om Dhanishthaayai Namah" },
  { name:"Shatabhisha",lord:"Rahu",   deity:"Varuna",        symbol:"Empty circle", element:"Air",   quality:"Movable",  sign:"Aquarius",    traits:"Secretive, healing, scientific, independent, mystical",      favorable:"Healing, occult, technical work, meditation",             mantra:"Om Shatabhi Shaaje Namah" },
  { name:"Purva Bhadrapada",lord:"Jupiter",deity:"Ajikapada",symbol:"Sword/legs",  element:"Air",   quality:"Fixed",    sign:"Aquarius/Pisces",traits:"Intense, passionate, spiritually oriented, humanitarian",  favorable:"Spiritual practice, occult, dealing with extremes",        mantra:"Om Purva Bhaadrapadaayai Namah" },
  { name:"Uttara Bhadrapada",lord:"Saturn",deity:"Ahirbudhnya",symbol:"Snake in water",element:"Water",quality:"Fixed", sign:"Pisces",      traits:"Wise, patient, deep, compassionate, serpentine wisdom",     favorable:"Charity, spiritual practice, research, long-term plans",  mantra:"Om Uttara Bhaadrapadaayai Namah" },
  { name:"Revati",    lord:"Mercury", deity:"Pusha",         symbol:"Fish/drum",    element:"Water", quality:"Soft",     sign:"Pisces",      traits:"Compassionate, creative, protective, gentle, spiritual",     favorable:"Travel, completing things, spiritual studies, nurturing",  mantra:"Om Revatyai Namah" },
];

const ELEMENT_COLOR: Record<string,string> = { Fire:'#e05252', Earth:'#8b6914', Water:'#4ca6e8', Air:'#4caf7d' };

export const NakshatraEncyclopedia: React.FC = () => {
  const [selected, setSelected] = useState<typeof NAKSHATRAS[0] | null>(null);
  const [search, setSearch] = useState('');

  const filtered = NAKSHATRAS.filter(n =>
    n.name.toLowerCase().includes(search.toLowerCase()) ||
    n.lord.toLowerCase().includes(search.toLowerCase()) ||
    n.sign.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Star size={32} color="var(--color-accent-gold)" />
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem' }}>Nakshatra Encyclopedia</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)' }}>All 27 lunar mansions — traits, deities, symbols, and guidance.</p>
      </section>

      <input
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search by name, ruling planet, or sign…"
        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid var(--color-border-glass)', borderRadius:'8px', padding:'10px 16px', color:'#fff', fontSize:'0.95rem', outline:'none', width:'100%', boxSizing:'border-box' }}
      />

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
        {filtered.map((n, i) => (
          <div key={n.name} onClick={() => setSelected(selected?.name === n.name ? null : n)}
            className="cosmic-card"
            style={{ cursor: 'pointer', border: selected?.name === n.name ? '1px solid var(--color-accent-gold)' : undefined, padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem' }}>#{i+1}</span>
              <span style={{ background: `${ELEMENT_COLOR[n.element] || '#888'}22`, color: ELEMENT_COLOR[n.element] || '#888', fontSize: '0.68rem', padding: '1px 6px', borderRadius: '8px' }}>{n.element}</span>
            </div>
            <p style={{ color: selected?.name === n.name ? 'var(--color-accent-gold)' : '#fff', fontWeight: 700, marginBottom: '2px' }}>{n.name}</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', margin: 0 }}>{n.lord} · {n.sign}</p>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="cosmic-card" style={{ border: '1px solid var(--color-border-gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h2 style={{ color: 'var(--color-accent-gold-light)', fontSize: '1.6rem', marginBottom: '4px' }}>{selected.name}</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                {selected.sign} · Ruled by {selected.lord} · Deity: {selected.deity}
              </p>
            </div>
            <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', color:'var(--color-text-muted)', cursor:'pointer', fontSize:'1.2rem' }}>×</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px', marginBottom: '16px' }}>
            {[['Symbol', selected.symbol],['Element', selected.element],['Quality', selected.quality],['Deity', selected.deity]].map(([k,v]) => (
              <div key={k as string} style={{ background:'rgba(255,255,255,0.03)', borderRadius:'8px', padding:'12px' }}>
                <p style={{ color:'var(--color-text-muted)', fontSize:'0.75rem', marginBottom:'4px' }}>{k}</p>
                <p style={{ color:'#fff', fontWeight:600, margin:0 }}>{v}</p>
              </div>
            ))}
          </div>

          <p style={{ color: 'var(--color-text-main)', marginBottom: '10px' }}><strong style={{ color: 'var(--color-accent-gold)' }}>Traits: </strong>{selected.traits}</p>
          <p style={{ color: 'var(--color-text-main)', marginBottom: '10px' }}><strong style={{ color: 'var(--color-accent-gold)' }}>Favorable for: </strong>{selected.favorable}</p>
          <p style={{ color: '#aed6f1', fontSize: '0.9rem', fontStyle: 'italic' }}>Mantra: {selected.mantra}</p>
        </div>
      )}
    </div>
  );
};
