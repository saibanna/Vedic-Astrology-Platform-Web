import React from 'react';

interface Planet {
  name: string;
  house: number;
  retrograde?: boolean;
}

interface HousePredictionsProps {
  planets: Planet[];
  lagna: string;
}

const HOUSE_TOPICS: Record<number, string> = {
  1: 'Self & Personality', 2: 'Wealth & Family', 3: 'Courage & Siblings',
  4: 'Home & Mother', 5: 'Intelligence & Children', 6: 'Health & Enemies',
  7: 'Marriage & Partners', 8: 'Longevity & Transformation', 9: 'Luck & Dharma',
  10: 'Career & Status', 11: 'Gains & Friends', 12: 'Expenses & Spirituality',
};

const PREDICTIONS: Record<string, Record<number, string>> = {
  "Sun (Surya)": {
    1: "Strong sense of identity and natural leadership. You carry authority and are drawn to positions of power. Health and vitality are generally robust.",
    2: "Family lineage and ancestral wealth play an important role. Speech carries authority. Desire to accumulate resources to enhance status.",
    3: "Courageous and self-motivated. Siblings may hold prominent roles. Excellent drive to initiate projects and pursue goals independently.",
    4: "Paternal influences shape the home environment. Public image tied to domestic life. Possible tension between career ambitions and home.",
    5: "Highly creative with strong self-expression. Natural affinity for leadership in education, arts, or speculation. Children may be gifted.",
    6: "Excellent capacity to overcome obstacles and defeat competition. Service-oriented careers suit well. Strong immune system and recovery ability.",
    7: "Partnerships are central to life purpose. Spouse tends to be prominent or ambitious. Business alliances can be highly productive.",
    8: "Deep interest in the occult, hidden knowledge, and transformation. Life involves significant turning points and inherited resources.",
    9: "Strong connection to father and spiritual traditions. Natural philosophical bent. Fortune comes through higher learning and long journeys.",
    10: "Exceptional career drive and public recognition. Authority, government, or leadership roles are favoured. Life purpose is closely tied to profession.",
    11: "Gains through influential networks and powerful associations. Social circle includes distinguished individuals. Goals are achieved with persistence.",
    12: "Spiritual inclinations and tendency toward introspection. Foreign connections or residence abroad likely. Hidden expenses must be monitored.",
  },
  "Moon (Chandra)": {
    1: "Highly sensitive and emotionally expressive personality. Public persona is nurturing and changeable. Strong intuition guides decisions.",
    2: "Emotional security tied to wealth and family bonds. Good memory for lineage and tradition. Financial flows can be fluctuating.",
    3: "Emotional communication style. Close emotional bonds with siblings. Writing, communication, and travel are emotionally fulfilling.",
    4: "Deep emotional connection to home and mother. Domestic comforts are essential to wellbeing. Real estate interests are favoured.",
    5: "Vivid imagination and emotional depth in creative pursuits. Strong maternal instinct. Children bring emotional fulfilment.",
    6: "Emotional resilience tested through health or service. Good at caring professions. Must avoid emotional burnout from overgiving.",
    7: "Emotional fulfilment through partnership. Spouse is nurturing or reflective. Public life involves emotional responsiveness.",
    8: "Deeply intuitive with psychic sensitivity. Emotional life involves transformations. Inherited emotional patterns require conscious healing.",
    9: "Spiritual and philosophical mind. Drawn to sacred traditions and wisdom literature. Good fortune through emotional generosity.",
    10: "Public life and career involve nurturing or emotional connection. Recognition from the public is possible. Mother's influence shapes career.",
    11: "Fulfilment of desires through social connections. Gains through women or public relationships. Fluctuating income streams.",
    12: "Rich inner emotional life and vivid dream experiences. Spiritual retreats and solitary reflection bring peace. Overseas associations likely.",
  },
  "Mars (Mangal)": {
    1: "Energetic, assertive, and competitive personality. Natural warrior spirit. Must channel aggression constructively to avoid conflict.",
    2: "Drive to accumulate wealth aggressively. Speech can be sharp. Family dynamics may involve power struggles.",
    3: "Exceptional courage and initiative. Skilled in technical and mechanical fields. Siblings play an active role in life.",
    4: "Real estate, construction, and property dealings are favoured. Domestic environment can be intense. Land and vehicles are significant.",
    5: "Passionate and competitive in creative and intellectual pursuits. Strong athletic tendencies. Romance is intense and fiery.",
    6: "Excellent at defeating enemies and overcoming illness. Thrives in competitive or combative professions. Legal battles tend to be won.",
    7: "Partnership energy is intense and passionate. Spouse is dynamic and assertive. Business partnerships require clear boundaries.",
    8: "Strong regenerative capacity. Interest in surgery, research, or occult. Life involves profound transformations through crises.",
    9: "Zealous in pursuing dharmic goals. Can be dogmatic in beliefs. Fortune is built through bold, pioneering action.",
    10: "Powerful career drive in technical, military, or engineering fields. Leadership roles suit well. Recognised for decisive action.",
    11: "Ambitious pursuit of goals through willpower. Gains through technical skills. Influential and energetic social network.",
    12: "Energy expenditure in hidden or behind-the-scenes work. Interest in spiritual combat or meditation practices. Foreign travel is significant.",
  },
  "Mercury (Budh)": {
    1: "Intellectually agile and articulate personality. Quick wit and analytical mind. Communication is a central life theme.",
    2: "Wealth through communication, trade, or intellectual work. Eloquent speech. Business acumen and financial planning are strong.",
    3: "Highly skilled communicator and writer. Short travels are frequent and purposeful. Sibling relationships involve intellectual exchange.",
    4: "Intelligent home environment with emphasis on learning. Good at real estate analysis. Mother may be educated or intellectually influential.",
    5: "Sharp analytical intellect applied to creative work. Strong in mathematics, logic, and speculation. Children may be intellectually gifted.",
    6: "Excellent problem-solving abilities in service roles. Thrives in healthcare, analysis, or dispute resolution. Health issues may relate to the nervous system.",
    7: "Partnerships based on intellectual compatibility. Skilled negotiator in business. Spouse tends to be communicative and analytical.",
    8: "Research-oriented mind drawn to hidden patterns. Interest in occult sciences, psychology, or forensics. Good at investigative analysis.",
    9: "Love of philosophy, writing, and teaching. Multiple long journeys for learning. Fortune through intellectual and literary pursuits.",
    10: "Career success through communication, writing, education, or business. Versatility is an asset. Public recognition for intellect.",
    11: "Gains through networks, information technology, or commerce. Social circle is diverse and intellectually stimulating.",
    12: "Hidden intellectual work or behind-the-scenes writing. Interest in foreign languages and esoteric study. Expenses tied to communication or travel.",
  },
  "Jupiter (Guru)": {
    1: "Magnanimous, wise, and optimistic personality. Natural counsellor and teacher. Physical stature may be impressive. Life is guided by dharma.",
    2: "Abundant wealth and strong family values. Eloquent and wise speech. Generosity in financial matters. Excellent for accumulating resources over time.",
    3: "Wisdom expressed through communication and writing. Short travels for learning. Relationship with siblings is benefic and supportive.",
    4: "Blessed home life with wisdom in the family. Strong connection to mother. Property and real estate bring fortune. Excellent for academic environment at home.",
    5: "Exceptional intelligence and creativity. Children are blessed and spiritually inclined. Strong speculative and philosophical abilities. Love affairs are meaningful.",
    6: "Ability to overcome difficulties through wisdom and grace. Good at healing professions. Enemies are overcome through patience rather than conflict.",
    7: "Blessed partnerships and marriage. Spouse is wise, learned, or spiritually oriented. Excellent for legal matters and diplomatic relations.",
    8: "Deep interest in spiritual transformation and occult wisdom. Longevity is supported. Inheritance or joint finances are generally favourable.",
    9: "Exceptional fortune and dharmic living. Strong connection to guru and sacred traditions. Higher learning, philosophy, and spirituality flourish.",
    10: "Highly respected career in teaching, law, advisory, or spiritual guidance. Public recognition for wisdom and integrity.",
    11: "Significant gains through knowledge networks and noble associations. Goals are achieved through ethical means. Social circle is learned and wise.",
    12: "Spiritual liberation is a life theme. Interest in foreign spiritual traditions. Expenses are for noble causes. Retreat and meditation are fulfilling.",
  },
  "Venus (Shukra)": {
    1: "Charming, attractive, and artistically gifted personality. Natural grace in social interactions. Sensual pleasures and aesthetics are central.",
    2: "Wealth through luxury, beauty, or artistic industries. Melodious and persuasive speech. Family environment is refined and comfortable.",
    3: "Artistic communication and creative writing. Pleasant relationships with siblings. Short journeys for pleasure or artistic inspiration.",
    4: "Beautifully decorated, comfortable home. Strong emotional bond with mother. Real estate dealings are favourable. Domestic life is harmonious.",
    5: "Highly creative with a strong aesthetic sense. Romance and love affairs are significant. Children are artistic or beautiful.",
    6: "Artistic skills applied in service. Good at health and beauty industries. Rivalry in relationships or creative competition must be managed.",
    7: "Blessed and harmonious marriage. Spouse is attractive, artistic, and refined. Excellent for business partnerships in creative or luxury sectors.",
    8: "Hidden pleasures and occult interests. Inheritance through partnerships. Transformation through intimate relationships is a key life theme.",
    9: "Love of beauty in philosophy and sacred traditions. Fortune through artistic or diplomatic pursuits. Enjoyable long journeys and foreign connections.",
    10: "Career success in arts, fashion, diplomacy, or entertainment. Admired publicly for elegance and talent. Leadership in creative industries.",
    11: "Gains through artistic networks, luxury goods, or beauty industries. Enjoyable social life with refined associates.",
    12: "Pleasures in private or hidden settings. Spiritual path involves beauty and devotion. Expenses on luxury, art, or foreign pleasures.",
  },
  "Saturn (Shani)": {
    1: "Disciplined, serious, and enduring personality. Life teaches patience and responsibility early. Late bloomers who achieve lasting results.",
    2: "Frugal attitude towards wealth, earned through hard sustained work. Family responsibilities are heavy. Speech is careful and deliberate.",
    3: "Disciplined and systematic in communication. Hard work in all short journeys and efforts. Sibling relationships involve duty and responsibility.",
    4: "Restricted or serious domestic environment. Hard work in property matters. Mother may be disciplined or emotionally distant. Emotional structure is built over time.",
    5: "Disciplined approach to education and creativity. Children may come later in life. Speculative ventures require patience and caution.",
    6: "Exceptional endurance in overcoming disease, debt, and enemies. Excellent for service professions requiring perseverance. Chronic health issues need attention.",
    7: "Serious and committed in partnerships. Marriage may be delayed or with a mature partner. Business partnerships require clear agreements and patience.",
    8: "Long life with capacity to endure chronic challenges. Deep interest in the mysteries of life and death. Hidden obstacles require systematic resolution.",
    9: "Structured and disciplined philosophical outlook. Fortune comes through sustained effort and ethical conduct. Father's life involves hardship or discipline.",
    10: "Slow and steady rise to high professional achievement. Recognised for reliability, discipline, and integrity. Careers in law, government, or administration suit.",
    11: "Gains through persistent long-term effort. Older, reliable associates in social network. Goals achieved methodically over time.",
    12: "Deep interest in solitude, meditation, and spiritual practice. Foreign residences possible. Losses or expenses require disciplined financial planning.",
  },
  "Rahu": {
    1: "Unconventional, ambitious, and intensely driven personality. Breaks social norms to forge a unique path. Foreign influences shape identity significantly.",
    2: "Unconventional sources of wealth. Accumulation through foreign connections or unusual means. Speech can be deceptive or hypnotic.",
    3: "Driven and restless in communication and short travels. Unconventional siblings. Bold, risk-taking approach to all efforts.",
    4: "Unusual or foreign home environment. Mother's life may be unconventional. Real estate dealings involve complexity. Emotional restlessness at home.",
    5: "Unconventional creativity and unusual children. Intense romantic experiences. Risky speculations attract. Intelligence is out-of-the-ordinary.",
    6: "Exceptional at defeating enemies through unconventional means. Drawn to foreign-influenced healthcare or law. Hidden enemies may manifest.",
    7: "Foreign or unconventional partnerships and marriage. Business with foreigners or in foreign lands. Intense and complex partnership dynamics.",
    8: "Deep fascination with the occult, mysteries, and sudden transformation. Sudden events shape life profoundly. Research into hidden realms is favoured.",
    9: "Unconventional philosophical and spiritual inclinations. Fortune from foreign lands or unorthodox paths. Teacher figures may be unusual or foreign.",
    10: "Ambitious and unconventional career path. Rapid rise to prominence in foreign or technical fields. Recognition comes through unique, disruptive approaches.",
    11: "Enormous gains through networks, technology, and foreign connections. Ambitious and unconventional social circles. Desires are intense and fulfilled in surprising ways.",
    12: "Foreign travels, spiritual journeys, and isolating experiences are significant. Hidden desires and subconscious drives require awareness. Liberation through unconventional paths.",
  },
  "Ketu": {
    1: "Spiritually detached and introspective personality. Past-life wisdom colours the present identity. Unconventional appearance or health matters may arise.",
    2: "Detachment from material accumulation. Spiritual wisdom expressed through speech. Family connections have a karmic quality.",
    3: "Detachment from communication and short journeys. Intuitive rather than logical in expression. Spiritual insights come through creative efforts.",
    4: "Inner spiritual life takes precedence over external domestic comforts. Past-life connections to home country. Mother has a spiritual or detached quality.",
    5: "Spiritual creativity and past-life intelligence. Detachment from speculation and romantic outcomes. Children may have spiritual qualities or karmic significance.",
    6: "Past-life capacity to deal with enemies and health obstacles. Spiritual practices heal. Detachment from conflicts leads to resolution.",
    7: "Karmic partnerships that facilitate spiritual growth. Detachment in relationships. Past-life partner connections are possible.",
    8: "Deep spiritual interest in transformation, death, and occult. Moksha-oriented life. Past-life spiritual practices re-emerge.",
    9: "Detachment from conventional religion. Inner spiritual path is unconventional. Past-life dharmic wisdom surfaces in this lifetime.",
    10: "Unconventional career path influenced by past-life skills. Detachment from public recognition. Spiritual or research-based work suits.",
    11: "Detachment from material gains. Spiritual goals replace worldly ambitions. Gains arrive unexpectedly through past-life merits.",
    12: "Excellent for spiritual liberation and moksha. Deep meditative capacity. Foreign or isolated environments facilitate spiritual growth.",
  },
};

export const REMEDIES: Record<string, Record<number, string[]>> = {
  "Sun (Surya)": {
    1: [
      "Chant Surya mantra 'Om Hraam Hreem Hraum Sah Suryaya Namah' 108 times every Sunday at sunrise to strengthen self-confidence and vitality.",
      "Wear a natural Ruby (Manikya) set in gold on the ring finger on a Sunday morning after sunrise prayers.",
      "Donate wheat, jaggery, copper vessel, and red cloth to a priest or needy person every Sunday to enhance leadership qualities."
    ],
    2: [
      "Recite Aditya Hridayam Stotra daily to improve family harmony and stabilize wealth accumulation.",
      "Wear Ruby set in gold on the ring finger; keep a copper water vessel at the family altar for prosperity.",
      "Donate wheat and jaggery to a temple on Sundays; offer water to Surya at sunrise while chanting Gayatri Mantra."
    ],
    3: [
      "Chant 'Om Suryaya Namah' 108 times on Sundays to bolster courage, initiative, and sibling harmony.",
      "Wear Ruby set in gold on the ring finger; carry a small copper talisman for sustained motivation.",
      "Donate red-colored sweets and copper items on Sundays; offer Arghya (water) to the Sun every morning."
    ],
    4: [
      "Recite Surya Kavacham on Sundays to bring peace to the home and strengthen the bond with your father.",
      "Wear Ruby set in gold on the ring finger; place a Surya Yantra in the east-facing wall of your home.",
      "Donate wheat, jaggery, and red flowers at a Sun temple on Sundays; serve your father or father figures respectfully."
    ],
    5: [
      "Chant 'Om Hraam Hreem Hraum Sah Suryaya Namah' 108 times on Sundays to boost creativity, intelligence, and children's well-being.",
      "Wear Ruby in a gold ring on the ring finger; keep a copper Sun idol on your study desk.",
      "Donate saffron, wheat, and educational materials to children on Sundays; worship Lord Rama for blessings on progeny."
    ],
    6: [
      "Recite Aditya Hridayam Stotra daily in the morning to overcome health issues, enemies, and obstacles.",
      "Wear Ruby set in gold on the ring finger; keep a small copper Surya idol in your workplace.",
      "Donate medicines, wheat, and jaggery to the needy on Sundays; offer water to the Sun with red sandalwood."
    ],
    7: [
      "Chant Surya mantra 'Om Suryaya Namah' 108 times on Sundays to harmonize marriage and partnership dynamics.",
      "Wear Ruby set in gold on the ring finger; gift your spouse a gold ornament on a Sunday.",
      "Donate wheat, jaggery, and red cloth on Sundays; worship Lord Rama and Sita together for marital harmony."
    ],
    8: [
      "Recite Maha Mrityunjaya Mantra along with Surya mantra on Sundays to navigate transformations and protect longevity.",
      "Wear Ruby set in gold on the ring finger; keep a copper Surya Yantra for protection from hidden obstacles.",
      "Donate wheat, jaggery, copper vessels, and red cloth on Sundays; offer Arghya to Surya for ancestral blessings."
    ],
    9: [
      "Chant Gayatri Mantra 108 times at sunrise daily to strengthen dharma, fortune, and connection with father/guru.",
      "Wear Ruby set in gold on the ring finger; visit a Sun temple on Sundays for spiritual upliftment.",
      "Donate wheat, jaggery, and religious books on Sundays; serve your father, guru, or elderly mentors with devotion."
    ],
    10: [
      "Recite Aditya Hridayam Stotra every Sunday morning to boost career advancement and public recognition.",
      "Wear a high-quality Ruby set in gold on the ring finger; keep a copper Surya Yantra at your workplace.",
      "Donate wheat, jaggery, and copper items on Sundays; offer water to the rising Sun facing east for professional success."
    ],
    11: [
      "Chant 'Om Hraam Hreem Hraum Sah Suryaya Namah' 108 times on Sundays to enhance gains and fulfil desires.",
      "Wear Ruby set in gold on the ring finger; carry a gold coin or token as a prosperity charm.",
      "Donate wheat, jaggery, and red lentils on Sundays; support community leaders and mentors to strengthen your network."
    ],
    12: [
      "Recite Surya Kavacham on Sundays to minimize unnecessary expenses and enhance spiritual clarity.",
      "Wear Ruby set in gold on the ring finger; keep a copper vessel of water by your bedside overnight and offer it to a plant at sunrise.",
      "Donate wheat, jaggery, and blankets on Sundays; meditate facing east at sunrise and worship Lord Surya for inner peace."
    ],
  },
  "Moon (Chandra)": {
    1: [
      "Chant Chandra mantra 'Om Shram Shreem Shraum Sah Chandraya Namah' 108 times on Mondays to stabilize emotions and strengthen personality.",
      "Wear a natural Pearl (Moti) set in silver on the little finger on a Monday evening during Shukla Paksha.",
      "Donate white rice, milk, white cloth, and silver items on Mondays; worship Lord Shiva by offering milk on Shivling."
    ],
    2: [
      "Recite 'Om Somaya Namah' 108 times on Mondays to stabilize fluctuating finances and strengthen family bonds.",
      "Wear Pearl set in silver on the little finger; keep a silver vessel of water at the family altar.",
      "Donate white rice, sugar, and milk to a temple on Mondays; offer water mixed with milk to a Shivling for family prosperity."
    ],
    3: [
      "Chant Chandra mantra 108 times on Mondays to improve emotional communication and sibling harmony.",
      "Wear Pearl set in silver on the little finger; carry a small silver charm for creative expression.",
      "Donate white rice, white sesame, and milk on Mondays; worship Goddess Parvati for harmonious sibling relationships."
    ],
    4: [
      "Recite 'Om Shram Shreem Shraum Sah Chandraya Namah' 108 times on Mondays to bring emotional peace and domestic harmony.",
      "Wear Pearl set in silver on the little finger; place a Moon Yantra or silver Shivling in the north-west corner of the home.",
      "Donate white rice, milk, white flowers, and silver coins on Mondays; serve your mother with devotion and offer her white garments."
    ],
    5: [
      "Chant 'Om Somaya Namah' 108 times on Mondays to boost creative imagination and bless children.",
      "Wear Pearl set in silver on the little finger; keep a silver Ganesha idol on your creative workspace.",
      "Donate white rice, milk, and sweets to children on Mondays; worship Lord Shiva and Goddess Parvati for progeny blessings."
    ],
    6: [
      "Recite Chandra mantra 108 times on Mondays to overcome emotional burnout and health challenges.",
      "Wear Pearl set in silver on the little finger; keep a silver vessel of water near your bed for emotional healing.",
      "Donate white rice, milk, and curd to the needy on Mondays; perform Rudrabhishek on a Monday for protection from illness."
    ],
    7: [
      "Chant 'Om Shram Shreem Shraum Sah Chandraya Namah' 108 times on Mondays for emotional fulfilment in marriage.",
      "Wear Pearl set in silver on the little finger; gift your spouse silver jewellery on a Monday.",
      "Donate white rice, white cloth, and sugar on Mondays; fast on Mondays and worship Lord Shiva-Parvati for marital bliss."
    ],
    8: [
      "Recite Maha Mrityunjaya Mantra 108 times on Mondays to heal deep emotional wounds and protect longevity.",
      "Wear Pearl set in silver on the little finger; keep a silver Moon Yantra for protection from psychic disturbances.",
      "Donate white rice, white cloth, and milk on Mondays; visit a Shiva temple and offer Bilva leaves for transformation and healing."
    ],
    9: [
      "Chant 'Om Somaya Namah' 108 times on Mondays to strengthen spiritual devotion and attract good fortune.",
      "Wear Pearl set in silver on the little finger; keep a silver Shivling at your prayer altar.",
      "Donate white rice, milk, and white flowers on Mondays; worship Lord Shiva and read sacred texts for spiritual growth."
    ],
    10: [
      "Recite Chandra mantra 108 times on Mondays to enhance public reputation and career nurturance.",
      "Wear Pearl set in silver on the little finger; keep a small Moon Yantra at your workplace.",
      "Donate white rice, milk, and sugar on Mondays; serve your mother and offer milk on Shivling for career blessings."
    ],
    11: [
      "Chant 'Om Shram Shreem Shraum Sah Chandraya Namah' 108 times on Mondays to stabilize income and enhance social connections.",
      "Wear Pearl set in silver on the little finger; carry a silver coin as a prosperity charm.",
      "Donate white rice, white cloth, and milk on Mondays; offer water to the Moon on Purnima nights for fulfilment of desires."
    ],
    12: [
      "Recite 'Om Somaya Namah' 108 times on Mondays to enrich inner life, vivid dreams, and spiritual insight.",
      "Wear Pearl set in silver on the little finger; place a silver Moon Yantra under your pillow for peaceful sleep.",
      "Donate white rice, milk, and white flowers on Mondays; meditate on moonlit nights and worship Goddess Parvati for spiritual liberation."
    ],
  },
  "Mars (Mangal)": {
    1: [
      "Chant Mangal mantra 'Om Kraam Kreem Kraum Sah Bhaumaya Namah' 108 times on Tuesdays to channel aggression constructively.",
      "Wear Red Coral (Moonga) set in copper or gold on the ring finger on a Tuesday morning.",
      "Donate red lentils (masoor dal), jaggery, and red cloth on Tuesdays; worship Lord Hanuman and recite Hanuman Chalisa."
    ],
    2: [
      "Recite 'Om Angarakaya Namah' 108 times on Tuesdays to soften speech and stabilize aggressive wealth accumulation.",
      "Wear Red Coral set in copper on the ring finger; keep a copper vessel at the family altar.",
      "Donate red lentils, jaggery, and copper utensils on Tuesdays; offer sindoor to Lord Hanuman for family harmony."
    ],
    3: [
      "Chant Mangal mantra 108 times on Tuesdays to enhance courage, initiative, and harmonious sibling relations.",
      "Wear Red Coral set in copper or gold on the ring finger; carry a copper talisman for sustained valour.",
      "Donate red lentils, jaggery, and red-colored sweets on Tuesdays; worship Lord Kartikeya for courage and sibling blessings."
    ],
    4: [
      "Recite 'Om Kraam Kreem Kraum Sah Bhaumaya Namah' 108 times on Tuesdays for peace in the home and property matters.",
      "Wear Red Coral set in copper on the ring finger; place a Mangal Yantra in the south-facing area of your home.",
      "Donate red lentils, jaggery, and red flowers on Tuesdays; offer sindoor and oil to Hanuman temple for domestic stability."
    ],
    5: [
      "Chant 'Om Angarakaya Namah' 108 times on Tuesdays to balance intense passion and protect children's well-being.",
      "Wear Red Coral set in copper or gold on the ring finger; keep a Hanuman idol in your study area.",
      "Donate red lentils, sports equipment, and jaggery on Tuesdays; worship Lord Kartikeya for blessings on progeny and creativity."
    ],
    6: [
      "Recite Hanuman Chalisa daily and Mangal mantra 108 times on Tuesdays to defeat enemies and overcome health issues.",
      "Wear Red Coral set in copper on the ring finger; keep a Mangal Yantra at your workplace for competitive advantage.",
      "Donate red lentils, jaggery, and red cloth on Tuesdays; offer jasmine oil and sindoor at a Hanuman temple."
    ],
    7: [
      "Chant Mangal mantra 108 times on Tuesdays to balance intense partnership energy and reduce Mangal Dosha effects.",
      "Wear Red Coral set in copper or gold on the ring finger; perform Mangal Dosha Nivaran Puja if applicable.",
      "Donate red lentils, jaggery, and red cloth on Tuesdays; worship Lord Hanuman together with your spouse for marital harmony."
    ],
    8: [
      "Recite 'Om Kraam Kreem Kraum Sah Bhaumaya Namah' 108 times on Tuesdays to protect against accidents and sudden crises.",
      "Wear Red Coral set in copper on the ring finger; keep a Mangal Yantra for protection from hidden dangers.",
      "Donate red lentils, jaggery, and sharp instruments (knife/scissors symbolically) on Tuesdays; recite Hanuman Chalisa for protection."
    ],
    9: [
      "Chant 'Om Angarakaya Namah' 108 times on Tuesdays to temper zealous beliefs and channel dharmic energy positively.",
      "Wear Red Coral set in copper or gold on the ring finger; visit Hanuman temples on Tuesdays for spiritual guidance.",
      "Donate red lentils, jaggery, and religious texts on Tuesdays; worship Lord Hanuman for righteous fortune and protection."
    ],
    10: [
      "Recite Mangal mantra 108 times on Tuesdays for career success in technical, engineering, or military fields.",
      "Wear Red Coral set in copper or gold on the ring finger; keep a Mangal Yantra at your workplace.",
      "Donate red lentils, jaggery, and copper items on Tuesdays; offer sindoor at a Hanuman temple for professional recognition."
    ],
    11: [
      "Chant 'Om Kraam Kreem Kraum Sah Bhaumaya Namah' 108 times on Tuesdays to attract gains through willpower and ambition.",
      "Wear Red Coral set in copper or gold on the ring finger; carry a copper coin for sustained achievement.",
      "Donate red lentils, jaggery, and red cloth on Tuesdays; support military veterans or physical fitness causes."
    ],
    12: [
      "Recite Hanuman Chalisa daily and Mangal mantra on Tuesdays to channel hidden energy into spiritual practices.",
      "Wear Red Coral set in copper on the ring finger; keep a small Hanuman idol in your meditation space.",
      "Donate red lentils, jaggery, and blankets on Tuesdays; perform meditation and Pranayama to direct Mars energy inward."
    ],
  },
  "Mercury (Budh)": {
    1: [
      "Chant Budh mantra 'Om Braam Breem Braum Sah Budhaya Namah' 108 times on Wednesdays to sharpen intellect and communication.",
      "Wear a natural Emerald (Panna) set in gold on the little finger on a Wednesday morning.",
      "Donate green moong dal, green vegetables, and green cloth on Wednesdays; worship Lord Vishnu or Lord Ganesha."
    ],
    2: [
      "Recite 'Om Budhaya Namah' 108 times on Wednesdays to enhance business acumen and eloquent speech.",
      "Wear Emerald set in gold on the little finger; keep a brass Ganesha idol at the cash counter or family altar.",
      "Donate green moong dal, green cloth, and books on Wednesdays; offer Durva grass to Lord Ganesha for financial wisdom."
    ],
    3: [
      "Chant Budh mantra 108 times on Wednesdays to amplify writing skills, communication, and sibling bonds.",
      "Wear Emerald set in gold on the little finger; carry a green-colored pen or notebook for creative inspiration.",
      "Donate green moong dal, books, and stationery on Wednesdays; worship Lord Ganesha for smooth communication and travel."
    ],
    4: [
      "Recite 'Om Braam Breem Braum Sah Budhaya Namah' 108 times on Wednesdays for a learned home environment.",
      "Wear Emerald set in gold on the little finger; place a Budh Yantra or Ganesha idol in your study room.",
      "Donate green moong dal, green vegetables, and educational materials on Wednesdays; offer Durva grass at a Ganesha temple."
    ],
    5: [
      "Chant 'Om Budhaya Namah' 108 times on Wednesdays to boost analytical intelligence and bless children's education.",
      "Wear Emerald set in gold on the little finger; keep a brass Saraswati idol on the study desk.",
      "Donate green moong dal, books, and educational toys on Wednesdays; worship Lord Ganesha for intellectual and creative blessings."
    ],
    6: [
      "Recite Budh mantra 108 times on Wednesdays to enhance problem-solving and heal nervous system issues.",
      "Wear Emerald set in gold on the little finger; keep a Budh Yantra at your workplace for analytical clarity.",
      "Donate green moong dal, green cloth, and medicines on Wednesdays; worship Lord Vishnu for protection from health disputes."
    ],
    7: [
      "Chant 'Om Braam Breem Braum Sah Budhaya Namah' 108 times on Wednesdays for intellectual harmony in partnerships.",
      "Wear Emerald set in gold on the little finger; gift your partner a green gemstone or book on a Wednesday.",
      "Donate green moong dal, green cloth, and sweets on Wednesdays; worship Lord Vishnu for blessed negotiations and partnerships."
    ],
    8: [
      "Recite Budh mantra 108 times on Wednesdays to sharpen research and investigative faculties.",
      "Wear Emerald set in gold on the little finger; keep a Budh Yantra for protection from deception.",
      "Donate green moong dal, green cloth, and research books on Wednesdays; worship Lord Ganesha for protection during hidden investigations."
    ],
    9: [
      "Chant 'Om Budhaya Namah' 108 times on Wednesdays to enhance higher learning, teaching, and literary fortune.",
      "Wear Emerald set in gold on the little finger; visit a Vishnu temple on Wednesdays for philosophical clarity.",
      "Donate green moong dal, books, and green flowers on Wednesdays; support educational institutions and teachers."
    ],
    10: [
      "Recite Budh mantra 108 times on Wednesdays for career success in communication, education, or business fields.",
      "Wear Emerald set in gold on the little finger; keep a Budh Yantra or Ganesha idol at your office desk.",
      "Donate green moong dal, green cloth, and stationery on Wednesdays; offer Durva grass to Ganesha for professional growth."
    ],
    11: [
      "Chant 'Om Braam Breem Braum Sah Budhaya Namah' 108 times on Wednesdays to attract gains through networks and technology.",
      "Wear Emerald set in gold on the little finger; carry a green-colored charm for business networking success.",
      "Donate green moong dal, green items, and books on Wednesdays; worship Lord Ganesha for fulfilment of intellectual goals."
    ],
    12: [
      "Recite 'Om Budhaya Namah' 108 times on Wednesdays to enhance foreign language skills and minimize communication-related expenses.",
      "Wear Emerald set in gold on the little finger; keep a Budh Yantra near your bed for clarity in dreams.",
      "Donate green moong dal, green cloth, and books on Wednesdays; meditate on Lord Vishnu for inner intellectual peace."
    ],
  },
  "Jupiter (Guru)": {
    1: [
      "Chant Guru mantra 'Om Graam Greem Graum Sah Gurave Namah' 108 times on Thursdays to enhance wisdom and optimism.",
      "Wear a natural Yellow Sapphire (Pukhraj) set in gold on the index finger on a Thursday morning.",
      "Donate turmeric, yellow cloth, bananas, and chana dal on Thursdays; worship Lord Brihaspati or Lord Vishnu."
    ],
    2: [
      "Recite 'Om Gurave Namah' 108 times on Thursdays for abundant wealth and wise, eloquent speech.",
      "Wear Yellow Sapphire set in gold on the index finger; keep a brass Vishnu idol at the family altar.",
      "Donate turmeric, yellow cloth, bananas, and gold coins on Thursdays; feed Brahmins or learned scholars."
    ],
    3: [
      "Chant Guru mantra 108 times on Thursdays to channel wisdom through communication and strengthen sibling bonds.",
      "Wear Yellow Sapphire set in gold on the index finger; keep a yellow-covered journal for wise expression.",
      "Donate turmeric, yellow cloth, and educational materials on Thursdays; worship Lord Vishnu for auspicious short travels."
    ],
    4: [
      "Recite 'Om Graam Greem Graum Sah Gurave Namah' 108 times on Thursdays for a blessed, wisdom-filled home.",
      "Wear Yellow Sapphire set in gold on the index finger; place a Guru Yantra in the prayer room.",
      "Donate turmeric, yellow cloth, and sweets on Thursdays; serve your mother and maintain a sacred home altar."
    ],
    5: [
      "Chant 'Om Gurave Namah' 108 times on Thursdays to bless children, enhance intelligence, and favour speculative wisdom.",
      "Wear Yellow Sapphire set in gold on the index finger; keep a Brihaspati Yantra in the study room.",
      "Donate turmeric, yellow cloth, bananas, and educational materials on Thursdays; worship Lord Vishnu for progeny blessings."
    ],
    6: [
      "Recite Guru mantra 108 times on Thursdays to overcome difficulties through grace and wisdom.",
      "Wear Yellow Sapphire set in gold on the index finger; keep a Guru Yantra at the workplace.",
      "Donate turmeric, yellow cloth, and medicines on Thursdays; feed cows and offer bananas at a Vishnu temple."
    ],
    7: [
      "Chant 'Om Graam Greem Graum Sah Gurave Namah' 108 times on Thursdays for a blessed, wise marriage.",
      "Wear Yellow Sapphire set in gold on the index finger; gift your spouse yellow flowers or saffron on Thursdays.",
      "Donate turmeric, yellow cloth, and sweets on Thursdays; worship Lord Vishnu and Lakshmi together for marital harmony."
    ],
    8: [
      "Recite 'Om Gurave Namah' 108 times on Thursdays for spiritual protection during life transformations.",
      "Wear Yellow Sapphire set in gold on the index finger; keep a Guru Yantra for protection from occult influences.",
      "Donate turmeric, yellow cloth, and sesame on Thursdays; perform Vishnu Sahasranama for longevity and ancestral blessings."
    ],
    9: [
      "Chant Guru mantra 108 times on Thursdays — Jupiter is exalted here. Strengthen connection to guru and dharma.",
      "Wear a high-quality Yellow Sapphire set in gold on the index finger; establish a Guru Yantra in the prayer room.",
      "Donate turmeric, yellow cloth, bananas, and gold on Thursdays; serve your guru and support temple activities generously."
    ],
    10: [
      "Recite 'Om Graam Greem Graum Sah Gurave Namah' 108 times on Thursdays for respected career in teaching, law, or advisory.",
      "Wear Yellow Sapphire set in gold on the index finger; keep a Guru Yantra at the office.",
      "Donate turmeric, yellow cloth, and chana dal on Thursdays; worship Lord Brihaspati for professional wisdom and integrity."
    ],
    11: [
      "Chant 'Om Gurave Namah' 108 times on Thursdays to attract gains through noble networks and ethical endeavours.",
      "Wear Yellow Sapphire set in gold on the index finger; carry a yellow thread blessed by a priest.",
      "Donate turmeric, yellow cloth, bananas, and sweets on Thursdays; support educational causes and feed learned scholars."
    ],
    12: [
      "Recite Vishnu Sahasranama on Thursdays to deepen spiritual liberation and channelize expenses toward noble causes.",
      "Wear Yellow Sapphire set in gold on the index finger; keep a Guru Yantra near your meditation seat.",
      "Donate turmeric, yellow cloth, and bananas on Thursdays; practice meditation and visit temples for spiritual growth."
    ],
  },
  "Venus (Shukra)": {
    1: [
      "Chant Shukra mantra 'Om Draam Dreem Draum Sah Shukraya Namah' 108 times on Fridays to enhance charm and artistic grace.",
      "Wear a Diamond or White Sapphire set in silver or platinum on the middle finger on a Friday morning.",
      "Donate white rice, sugar, white cloth, and ghee on Fridays; worship Goddess Lakshmi with white flowers."
    ],
    2: [
      "Recite 'Om Shukraya Namah' 108 times on Fridays to attract luxury wealth and melodious, persuasive speech.",
      "Wear Diamond or White Sapphire set in silver on the middle finger; keep a silver Lakshmi idol at the family altar.",
      "Donate white rice, sugar, ghee, and white sweets on Fridays; offer white flowers and perfume to Goddess Lakshmi."
    ],
    3: [
      "Chant Shukra mantra 108 times on Fridays to boost artistic communication and pleasant sibling relationships.",
      "Wear Diamond or White Sapphire set in silver on the middle finger; carry a white or silver talisman.",
      "Donate white rice, sugar, white cloth, and art supplies on Fridays; worship Goddess Saraswati for creative expression."
    ],
    4: [
      "Recite 'Om Draam Dreem Draum Sah Shukraya Namah' 108 times on Fridays for a beautiful, harmonious home.",
      "Wear Diamond or White Sapphire set in silver on the middle finger; place a Shukra Yantra in the living room.",
      "Donate white rice, sugar, white flowers, and perfume on Fridays; worship Goddess Lakshmi for domestic bliss."
    ],
    5: [
      "Chant 'Om Shukraya Namah' 108 times on Fridays to enhance romantic life, creativity, and artistic talent.",
      "Wear Diamond or White Sapphire set in silver on the middle finger; keep a silver Saraswati idol on the creative desk.",
      "Donate white rice, sugar, art materials, and white flowers on Fridays; worship Goddess Lakshmi for blessings on love and children."
    ],
    6: [
      "Recite Shukra mantra 108 times on Fridays to resolve rivalry and enhance health-beauty related service.",
      "Wear Diamond or White Sapphire set in silver on the middle finger; keep a Shukra Yantra in the workplace.",
      "Donate white rice, sugar, white cloth, and cosmetics on Fridays; offer white flowers at a Lakshmi temple."
    ],
    7: [
      "Chant 'Om Draam Dreem Draum Sah Shukraya Namah' 108 times on Fridays for a blessed, harmonious marriage.",
      "Wear Diamond or White Sapphire set in silver on the middle finger; gift your spouse white flowers or perfume on Fridays.",
      "Donate white rice, sugar, ghee, and white sweets on Fridays; worship Goddess Lakshmi and Lord Vishnu for marital bliss."
    ],
    8: [
      "Recite 'Om Shukraya Namah' 108 times on Fridays to manage hidden pleasures and channel transformation through beauty.",
      "Wear Diamond or White Sapphire set in silver on the middle finger; keep a Shukra Yantra for intimate relationship protection.",
      "Donate white rice, white cloth, and perfume on Fridays; worship Goddess Lakshmi for protection from financial entanglements."
    ],
    9: [
      "Chant Shukra mantra 108 times on Fridays to attract fortune through artistic, diplomatic, and foreign connections.",
      "Wear Diamond or White Sapphire set in silver on the middle finger; visit a Lakshmi temple on Fridays.",
      "Donate white rice, sugar, white flowers, and ghee on Fridays; support artistic or cultural institutions."
    ],
    10: [
      "Recite 'Om Draam Dreem Draum Sah Shukraya Namah' 108 times on Fridays for career success in arts, fashion, or entertainment.",
      "Wear Diamond or White Sapphire set in silver on the middle finger; keep a Shukra Yantra at the office.",
      "Donate white rice, sugar, white cloth, and perfume on Fridays; worship Goddess Lakshmi for professional elegance and success."
    ],
    11: [
      "Chant 'Om Shukraya Namah' 108 times on Fridays to attract gains through beauty, luxury, and refined social circles.",
      "Wear Diamond or White Sapphire set in silver on the middle finger; carry a silver charm for social prosperity.",
      "Donate white rice, sugar, white sweets, and ghee on Fridays; support women's causes and artistic communities."
    ],
    12: [
      "Recite Shukra mantra 108 times on Fridays to channel private pleasures into spiritual devotion and minimize luxury expenses.",
      "Wear Diamond or White Sapphire set in silver on the middle finger; place a Shukra Yantra near your meditation area.",
      "Donate white rice, sugar, white flowers, and perfume on Fridays; worship Goddess Lakshmi and practice devotional arts."
    ],
  },
  "Saturn (Shani)": {
    1: [
      "Chant Shani mantra 'Om Praam Preem Praum Sah Shanaischaraya Namah' 108 times on Saturdays to build discipline and endurance.",
      "Wear Blue Sapphire (Neelam) set in iron or silver on the middle finger on a Saturday — only after trial period and astrologer consultation.",
      "Donate black sesame seeds, mustard oil, iron utensils, and dark blue/black cloth on Saturdays; worship Lord Hanuman or Shani Dev."
    ],
    2: [
      "Recite 'Om Sham Shanaischaraya Namah' 108 times on Saturdays to ease family burdens and build sustained wealth.",
      "Wear Blue Sapphire set in iron or silver on the middle finger after trial; keep an iron nail at the family altar.",
      "Donate black sesame seeds, mustard oil, and dark cloth on Saturdays; feed crows with rice and sesame on Saturday mornings."
    ],
    3: [
      "Chant Shani mantra 108 times on Saturdays to build disciplined communication skills and fulfill duties to siblings.",
      "Wear Blue Sapphire set in iron or silver on the middle finger after careful trial; carry a dark iron ring.",
      "Donate black sesame seeds, mustard oil, and black cloth on Saturdays; recite Hanuman Chalisa for strength in all efforts."
    ],
    4: [
      "Recite 'Om Praam Preem Praum Sah Shanaischaraya Namah' 108 times on Saturdays to bring stability and structure to home life.",
      "Wear Blue Sapphire set in iron or silver on the middle finger after trial; place a Shani Yantra in the south-west corner of the home.",
      "Donate black sesame seeds, mustard oil, iron items, and dark cloth on Saturdays; serve elderly family members with devotion."
    ],
    5: [
      "Chant 'Om Sham Shanaischaraya Namah' 108 times on Saturdays to overcome delays in education, creativity, and children.",
      "Wear Blue Sapphire set in iron or silver on the middle finger after trial; keep a Shani Yantra in the study room.",
      "Donate black sesame seeds, mustard oil, and educational supplies on Saturdays; worship Lord Hanuman for blessings on progeny."
    ],
    6: [
      "Recite Shani mantra 108 times on Saturdays to build exceptional endurance against disease, debt, and enemies.",
      "Wear Blue Sapphire set in iron or silver on the middle finger after trial; keep a Shani Yantra at the workplace.",
      "Donate black sesame seeds, mustard oil, iron items, and medicines on Saturdays; recite Hanuman Chalisa for protection."
    ],
    7: [
      "Chant 'Om Praam Preem Praum Sah Shanaischaraya Namah' 108 times on Saturdays to bring maturity and commitment to marriage.",
      "Wear Blue Sapphire set in iron or silver on the middle finger after trial; keep a Shani Yantra at the home altar.",
      "Donate black sesame seeds, mustard oil, and dark cloth on Saturdays; worship Lord Shani for patience in partnerships."
    ],
    8: [
      "Recite Maha Mrityunjaya Mantra and Shani mantra on Saturdays to protect longevity and navigate chronic challenges.",
      "Wear Blue Sapphire set in iron or silver on the middle finger after careful trial; keep a Shani Yantra for protection.",
      "Donate black sesame seeds, mustard oil, iron items, and blankets on Saturdays; light a mustard oil lamp at a Shani temple."
    ],
    9: [
      "Chant 'Om Sham Shanaischaraya Namah' 108 times on Saturdays to build disciplined dharma and ease father's hardships.",
      "Wear Blue Sapphire set in iron or silver on the middle finger after trial; visit a Shani temple every Saturday.",
      "Donate black sesame seeds, mustard oil, and dark cloth on Saturdays; serve elderly, disabled, or underprivileged persons."
    ],
    10: [
      "Recite Shani mantra 108 times on Saturdays for slow, steady career rise and professional recognition through integrity.",
      "Wear Blue Sapphire set in iron or silver on the middle finger after trial; keep a Shani Yantra at the office.",
      "Donate black sesame seeds, mustard oil, iron items, and dark cloth on Saturdays; recite Hanuman Chalisa for career discipline."
    ],
    11: [
      "Chant 'Om Praam Preem Praum Sah Shanaischaraya Namah' 108 times on Saturdays for persistent, long-term gains.",
      "Wear Blue Sapphire set in iron or silver on the middle finger after trial; carry an iron ring for sustained achievement.",
      "Donate black sesame seeds, mustard oil, and dark cloth on Saturdays; support elderly care organizations and feed crows."
    ],
    12: [
      "Recite 'Om Sham Shanaischaraya Namah' 108 times on Saturdays to deepen spiritual practice and manage losses wisely.",
      "Wear Blue Sapphire set in iron or silver on the middle finger after trial; place a Shani Yantra near your meditation area.",
      "Donate black sesame seeds, mustard oil, iron items, and blankets on Saturdays; light a mustard oil lamp under a Peepal tree."
    ],
  },
  "Rahu": {
    1: [
      "Chant Rahu mantra 'Om Bhram Bhreem Bhraum Sah Rahave Namah' 108 times on Saturdays to channel ambition and tame restlessness.",
      "Wear Hessonite (Gomed) set in silver or panchdhatu on the middle finger on a Saturday evening after sunset.",
      "Donate black/blue cloth, radishes, and lead items on Saturdays; worship Goddess Durga and recite Durga Chalisa for protection."
    ],
    2: [
      "Recite 'Om Rahave Namah' 108 times on Saturdays to stabilize unconventional income and guard against deceptive speech.",
      "Wear Hessonite set in silver on the middle finger; keep a Rahu Yantra at the family altar.",
      "Donate black/blue cloth, radishes, and coconut on Saturdays; offer blue flowers at a Durga temple for wealth protection."
    ],
    3: [
      "Chant Rahu mantra 108 times on Saturdays to focus driven communication and manage restless energy in travels.",
      "Wear Hessonite set in silver on the middle finger; carry a lead charm for focused initiative.",
      "Donate black/blue cloth, radishes, and stationery on Saturdays; worship Goddess Saraswati for disciplined communication."
    ],
    4: [
      "Recite 'Om Bhram Bhreem Bhraum Sah Rahave Namah' 108 times on Saturdays to calm domestic restlessness and foreign influences.",
      "Wear Hessonite set in silver on the middle finger; place a Rahu Yantra in the north-west corner of the home.",
      "Donate black/blue cloth, coconut, and radishes on Saturdays; worship Goddess Durga for peace and protection in the home."
    ],
    5: [
      "Chant 'Om Rahave Namah' 108 times on Saturdays to ground unconventional creativity and protect children.",
      "Wear Hessonite set in silver on the middle finger; keep a Rahu Yantra in the creative or study space.",
      "Donate black/blue cloth, radishes, and educational items on Saturdays; worship Goddess Durga for protection of progeny."
    ],
    6: [
      "Recite Rahu mantra 108 times on Saturdays to defeat hidden enemies and overcome foreign-influenced health issues.",
      "Wear Hessonite set in silver on the middle finger; keep a Rahu Yantra at the workplace.",
      "Donate black/blue cloth, radishes, and medicines on Saturdays; recite Durga Saptashati for victory over adversaries."
    ],
    7: [
      "Chant 'Om Bhram Bhreem Bhraum Sah Rahave Namah' 108 times on Saturdays to navigate complex foreign or unconventional partnerships.",
      "Wear Hessonite set in silver on the middle finger; keep a Rahu Yantra at the home altar for relationship clarity.",
      "Donate black/blue cloth, coconut, and radishes on Saturdays; worship Goddess Durga together with your spouse for harmony."
    ],
    8: [
      "Recite 'Om Rahave Namah' 108 times on Saturdays to channel deep occult fascination and protect against sudden upheavals.",
      "Wear Hessonite set in silver on the middle finger; keep a Rahu Yantra for protection from sudden, hidden dangers.",
      "Donate black/blue cloth, radishes, and blankets on Saturdays; recite Durga Kavacham for protection from psychic disturbances."
    ],
    9: [
      "Chant Rahu mantra 108 times on Saturdays to ground unconventional spiritual inclinations and attract foreign fortune.",
      "Wear Hessonite set in silver on the middle finger; visit a Durga or Kali temple on Saturdays.",
      "Donate black/blue cloth, radishes, and coconut on Saturdays; worship Goddess Durga and support foreign charitable causes."
    ],
    10: [
      "Recite 'Om Bhram Bhreem Bhraum Sah Rahave Namah' 108 times on Saturdays for rapid career rise in technology or foreign sectors.",
      "Wear Hessonite set in silver on the middle finger; keep a Rahu Yantra at the office.",
      "Donate black/blue cloth, radishes, and lead items on Saturdays; worship Goddess Durga for sustained professional ambition."
    ],
    11: [
      "Chant 'Om Rahave Namah' 108 times on Saturdays to channel enormous network gains wisely and manage intense desires.",
      "Wear Hessonite set in silver on the middle finger; carry a silver coin with Rahu Yantra engraving.",
      "Donate black/blue cloth, radishes, and electronic items on Saturdays; worship Goddess Saraswati for wise social networking."
    ],
    12: [
      "Recite Rahu mantra 108 times on Saturdays to manage subconscious drives and protect during foreign travels.",
      "Wear Hessonite set in silver on the middle finger; place a Rahu Yantra near your bed for peaceful sleep.",
      "Donate black/blue cloth, blankets, and coconut on Saturdays; recite Durga Saptashati and practice mindful meditation."
    ],
  },
  "Ketu": {
    1: [
      "Chant Ketu mantra 'Om Sraam Sreem Sraum Sah Ketave Namah' 108 times on Tuesdays or Saturdays to ground spiritual detachment.",
      "Wear Cat's Eye (Lehsunia/Vaidurya) set in silver or panchdhatu on the middle finger after astrologer consultation.",
      "Donate a multicolored blanket, sesame seeds, and flag-colored cloth on Tuesdays/Saturdays; worship Lord Ganesha."
    ],
    2: [
      "Recite 'Om Ketave Namah' 108 times on Tuesdays/Saturdays to balance spiritual detachment from wealth with practical needs.",
      "Wear Cat's Eye set in silver on the middle finger; keep a Ketu Yantra at the family altar.",
      "Donate multicolored cloth, sesame, and blankets on Tuesdays/Saturdays; offer Durva grass to Lord Ganesha for financial stability."
    ],
    3: [
      "Chant Ketu mantra 108 times on Tuesdays/Saturdays to channel intuitive insights into purposeful expression.",
      "Wear Cat's Eye set in silver on the middle finger; carry a panchdhatu charm for grounded communication.",
      "Donate multicolored cloth, sesame, and books on Tuesdays/Saturdays; worship Lord Ganesha for sibling harmony."
    ],
    4: [
      "Recite 'Om Sraam Sreem Sraum Sah Ketave Namah' 108 times on Tuesdays/Saturdays for inner peace despite domestic detachment.",
      "Wear Cat's Eye set in silver on the middle finger; place a Ketu Yantra in the prayer room.",
      "Donate multicolored blankets, sesame, and dog food on Tuesdays/Saturdays; worship Lord Ganesha and care for stray dogs."
    ],
    5: [
      "Chant 'Om Ketave Namah' 108 times on Tuesdays/Saturdays to channel past-life intelligence and bless children spiritually.",
      "Wear Cat's Eye set in silver on the middle finger; keep a Ganesha idol in the creative or study space.",
      "Donate multicolored cloth, sesame, and educational materials on Tuesdays/Saturdays; worship Lord Ganesha for blessings on progeny."
    ],
    6: [
      "Recite Ketu mantra 108 times on Tuesdays/Saturdays to activate past-life healing capacity against enemies and illness.",
      "Wear Cat's Eye set in silver on the middle finger; keep a Ketu Yantra at the workplace.",
      "Donate multicolored blankets, sesame, and medicines on Tuesdays/Saturdays; worship Lord Ganesha for resolution of conflicts."
    ],
    7: [
      "Chant 'Om Sraam Sreem Sraum Sah Ketave Namah' 108 times on Tuesdays/Saturdays to understand karmic partnership patterns.",
      "Wear Cat's Eye set in silver on the middle finger; keep a Ketu Yantra at the home altar.",
      "Donate multicolored cloth, sesame, and blankets on Tuesdays/Saturdays; worship Lord Ganesha for spiritual growth in relationships."
    ],
    8: [
      "Recite 'Om Ketave Namah' 108 times on Tuesdays/Saturdays to deepen moksha-oriented spiritual transformation.",
      "Wear Cat's Eye set in silver on the middle finger; keep a Ketu Yantra for protection from psychic upheavals.",
      "Donate multicolored blankets, sesame, and dark cloth on Tuesdays/Saturdays; worship Lord Ganesha and practice deep meditation."
    ],
    9: [
      "Chant Ketu mantra 108 times on Tuesdays/Saturdays to honour inner dharmic wisdom beyond conventional religion.",
      "Wear Cat's Eye set in silver on the middle finger; visit a Ganesha temple on Tuesdays.",
      "Donate multicolored cloth, sesame, and religious books on Tuesdays/Saturdays; support spiritual retreats and ashrams."
    ],
    10: [
      "Recite 'Om Sraam Sreem Sraum Sah Ketave Namah' 108 times on Tuesdays/Saturdays to align past-life skills with unconventional career.",
      "Wear Cat's Eye set in silver on the middle finger; keep a Ketu Yantra at the office.",
      "Donate multicolored blankets, sesame, and flag cloth on Tuesdays/Saturdays; worship Lord Ganesha for meaningful professional work."
    ],
    11: [
      "Chant 'Om Ketave Namah' 108 times on Tuesdays/Saturdays to receive unexpected gains from past-life merits.",
      "Wear Cat's Eye set in silver on the middle finger; carry a panchdhatu coin for spiritual prosperity.",
      "Donate multicolored cloth, sesame, and blankets on Tuesdays/Saturdays; worship Lord Ganesha and feed stray dogs."
    ],
    12: [
      "Recite Ketu mantra 108 times on Tuesdays/Saturdays — Ketu is strongest here. Embrace deep meditation and moksha.",
      "Wear Cat's Eye set in silver on the middle finger; place a Ketu Yantra in the meditation area.",
      "Donate multicolored blankets, sesame, and dog food on Tuesdays/Saturdays; practice silent meditation and worship Lord Ganesha for liberation."
    ],
  },
};

const PLANET_ICONS: Record<string, string> = {
  "Sun (Surya)": "☉", "Moon (Chandra)": "☽", "Mars (Mangal)": "♂",
  "Mercury (Budh)": "☿", "Jupiter (Guru)": "♃", "Venus (Shukra)": "♀",
  "Saturn (Shani)": "♄", "Rahu": "☊", "Ketu": "☋",
};

export const HousePredictions: React.FC<HousePredictionsProps> = ({ planets, lagna }) => {
  const predictable = planets.filter(p => PREDICTIONS[p.name]?.[p.house]);

  return (
    <div>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', borderBottom: '1px solid var(--color-border-gold)', paddingBottom: '8px' }}>
        House-Based Planetary Predictions
      </h3>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
        Based on your {lagna} Lagna.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {predictable.map(planet => {
          const key = `${planet.name}-${planet.house}`;
          return (
            <div
              key={key}
              style={{
                border: '1px solid var(--color-border-glass)',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.02)',
                padding: '18px',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.3rem', minWidth: '24px' }}>{PLANET_ICONS[planet.name] || '★'}</span>
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--color-accent-gold)', fontSize: '1.1rem' }}>
                    {planet.name}
                    {planet.retrograde && <span style={{ color: '#ff7043', fontSize: '0.8rem', marginLeft: '6px' }}>⟲ (R)</span>}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginLeft: '12px' }}>
                    House {planet.house} — {HOUSE_TOPICS[planet.house]}
                  </span>
                </div>
              </div>
              <div style={{ paddingLeft: '36px', color: 'var(--color-text-main)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                {planet.retrograde && (
                  <p style={{ color: '#ff7043', fontSize: '0.85rem', marginBottom: '8px', fontStyle: 'italic' }}>
                    Retrograde: This planet's energy is internalized, requiring deeper reflection before its themes fully manifest externally.
                  </p>
                )}
                {PREDICTIONS[planet.name][planet.house]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
