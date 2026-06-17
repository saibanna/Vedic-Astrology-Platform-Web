import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';

const FESTIVALS_2026 = [
  { date:"2026-01-14", name:"Makar Sankranti",     type:"Solar",    significance:"Sun enters Capricorn. Harvest festival, kite flying, sesame offerings.",             muhurta:"06:00–12:00" },
  { date:"2026-01-26", name:"Basant Panchami",      type:"Lunar",    significance:"Goddess Saraswati's day. Worship for education, arts, and wisdom.",                   muhurta:"07:00–12:30" },
  { date:"2026-02-17", name:"Maha Shivratri",       type:"Lunar",    significance:"Night of Shiva. Fasting and night-long vigil. Most auspicious for Shiva devotees.",  muhurta:"All night" },
  { date:"2026-03-02", name:"Holi",                 type:"Lunar",    significance:"Festival of colours. Holika Dahan the night before. Spring celebration.",            muhurta:"Evening (Holika Dahan)" },
  { date:"2026-03-29", name:"Ugadi / Gudi Padwa",   type:"Lunar",    significance:"Telugu & Marathi New Year. Reading of Panchanga for the coming year.",              muhurta:"06:00–08:00" },
  { date:"2026-04-06", name:"Ram Navami",            type:"Lunar",    significance:"Birth of Lord Rama. Fasting, recitation of Ramayana, temple celebrations.",         muhurta:"11:00–13:30" },
  { date:"2026-04-14", name:"Baisakhi / Tamil New Year",type:"Solar", significance:"Harvest festival, Sikh New Year, Sun enters Aries (Solar New Year).",               muhurta:"Morning" },
  { date:"2026-05-10", name:"Akshaya Tritiya",       type:"Lunar",    significance:"Most auspicious day of the year — any action started bears permanent fruit.",        muhurta:"All day (especially 06:00–13:00)" },
  { date:"2026-07-04", name:"Guru Purnima",          type:"Lunar",    significance:"Full moon honouring teachers and gurus. Seek blessings from your guru.",             muhurta:"All day" },
  { date:"2026-08-05", name:"Nag Panchami",          type:"Lunar",    significance:"Worship of serpent deities. Kaal Sarp Dosha remedies performed today.",             muhurta:"06:00–12:00" },
  { date:"2026-08-14", name:"Raksha Bandhan",        type:"Lunar",    significance:"Bond between siblings. Sister ties Rakhi on brother's wrist.",                       muhurta:"09:00–21:00" },
  { date:"2026-08-23", name:"Janmashtami",           type:"Lunar",    significance:"Birth of Lord Krishna. Midnight celebration, fasting, Dahi Handi.",                  muhurta:"Midnight (00:00–01:00)" },
  { date:"2026-09-07", name:"Ganesh Chaturthi",      type:"Lunar",    significance:"Birth of Lord Ganesha. 10-day festival begins. Idol installation and immersion.",    muhurta:"11:00–13:00" },
  { date:"2026-09-16", name:"Onam",                  type:"Solar",    significance:"Kerala harvest festival. Pookalam, Sadhya feast, boat races.",                       muhurta:"All day" },
  { date:"2026-10-02", name:"Navratri begins",       type:"Lunar",    significance:"Nine nights of Goddess Durga. Fasting, garba/dandiya dance, Devi worship.",         muhurta:"All 9 days" },
  { date:"2026-10-10", name:"Dussehra / Vijayadashami",type:"Lunar",  significance:"Victory of Rama over Ravana. Burning of Ravana effigy. Start new ventures today.", muhurta:"14:00–sunset" },
  { date:"2026-10-27", name:"Dhanteras",             type:"Lunar",    significance:"Purchase gold/silver/utensils. Worship of Kuber and Lakshmi for wealth.",            muhurta:"19:00–20:30" },
  { date:"2026-10-29", name:"Diwali",                type:"Lunar",    significance:"Festival of lights. Lakshmi Puja on Amavasya. Light diyas, burst fireworks.",        muhurta:"18:30–20:00 (Lakshmi Puja)" },
  { date:"2026-10-31", name:"Govardhan Puja",        type:"Lunar",    significance:"Day after Diwali. Krishna lifted Govardhan hill. Cow worship, anna kut.",            muhurta:"06:00–08:00" },
  { date:"2026-11-01", name:"Bhai Dooj",             type:"Lunar",    significance:"Sister applies tilak on brother's forehead. Bond of sibling protection.",           muhurta:"13:00–15:00" },
  { date:"2026-11-18", name:"Kartik Purnima / Dev Deepawali",type:"Lunar",significance:"Holy dip in Ganga. Thousands of diyas lit at Varanasi ghats.",                  muhurta:"All day" },
  { date:"2026-12-25", name:"Christmas",             type:"Civil",    significance:"Festival of joy and giving. Observed widely across India.",                          muhurta:"All day" },
];

const TYPE_COLOR: Record<string,string> = { Solar:'#ff9d00', Lunar:'#c8d8e8', Civil:'#4caf7d' };

export const FestivalCalendar: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const today = new Date().toISOString().split('T')[0];

  const filtered = filter === 'All' ? FESTIVALS_2026 : FESTIVALS_2026.filter(f => f.type === filter);
  const upcoming = filtered.filter(f => f.date >= today);
  const past     = filtered.filter(f => f.date < today);

  const Card = ({ f }: { f: typeof FESTIVALS_2026[0] }) => {
    const isPast = f.date < today;
    const isToday = f.date === today;
    const d = new Date(f.date + 'T12:00');
    return (
      <div className="cosmic-card" style={{ border: `1px solid ${isToday ? 'var(--color-accent-gold)' : isPast ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)'}`, opacity: isPast ? 0.6 : 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <div>
            <p style={{ color: isToday ? 'var(--color-accent-gold)' : isPast ? 'var(--color-text-muted)' : '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '2px' }}>
              {isToday && '⭐ '}{f.name}
            </p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
              {d.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'long' })}
            </p>
          </div>
          <span style={{ background:`${TYPE_COLOR[f.type]}22`, color:TYPE_COLOR[f.type], fontSize:'0.72rem', padding:'2px 8px', borderRadius:'10px', flexShrink:0 }}>{f.type}</span>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.83rem', lineHeight: '1.5', marginBottom: '6px' }}>{f.significance}</p>
        <p style={{ color: 'var(--color-accent-gold)', fontSize: '0.78rem' }}>⏰ Muhurta: {f.muhurta}</p>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <CalendarDays size={32} color="var(--color-accent-gold)" />
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem' }}>Festival Calendar 2026</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)' }}>Auspicious Hindu festivals with Muhurta timings for 2026.</p>
      </section>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {['All','Solar','Lunar','Civil'].map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding:'7px 18px', borderRadius:'20px', cursor:'pointer', fontSize:'0.88rem',
            background: filter===t ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${filter===t ? 'var(--color-accent-gold)' : 'var(--color-border-glass)'}`,
            color: filter===t ? 'var(--color-accent-gold)' : 'var(--color-text-muted)',
          }}>{t}</button>
        ))}
      </div>

      {upcoming.length > 0 && (
        <>
          <h3 style={{ color: '#fff', margin: 0 }}>Upcoming Festivals</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '12px' }}>
            {upcoming.map(f => <Card key={f.date+f.name} f={f} />)}
          </div>
        </>
      )}

      {past.length > 0 && (
        <>
          <h3 style={{ color: 'var(--color-text-muted)', margin: 0 }}>Past Festivals</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '12px' }}>
            {past.map(f => <Card key={f.date+f.name} f={f} />)}
          </div>
        </>
      )}
    </div>
  );
};
