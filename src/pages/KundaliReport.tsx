import React, { useState } from 'react';
import { BirthForm } from '../components/BirthForm';
import { calculatorService, type CalcInput } from '../services/api';
import { FileDown, CheckCircle } from 'lucide-react';

export const KundaliReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (input: CalcInput) => {
    setLoading(true); setError(''); setDone(false);
    try {
      const res = await calculatorService.pdfReport(input);
      const blob = new Blob([res.data as BlobPart], { type: String(res.headers['content-type'] || 'application/pdf') });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      const cd   = (res.headers['content-disposition'] as string) || '';
      const match = cd.match(/filename="?([^"]+)"?/);
      a.href = url;
      a.download = match ? match[1] : `kundali_report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch {
      setError('Report generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <FileDown size={32} color="var(--color-accent-gold)" />
          <h1 style={{ color: 'var(--color-accent-gold-light)', fontSize: '2rem' }}>Kundali PDF Report</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)' }}>Download your complete birth chart report with planetary positions, Dasha, and Nakshatra analysis.</p>
      </section>

      <BirthForm title="Enter Birth Details" subtitle="Your personalised Kundali report will be generated and downloaded automatically." onSubmit={handleSubmit} loading={loading} error={error} />

      {done && (
        <div className="cosmic-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid rgba(80,200,80,0.3)' }}>
          <CheckCircle size={32} color="#4caf50" />
          <div>
            <p style={{ color: '#4caf50', fontWeight: 600, marginBottom: '2px' }}>Report downloaded successfully!</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Check your Downloads folder for the Kundali PDF.</p>
          </div>
        </div>
      )}

      <div className="cosmic-card" style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid var(--color-border-gold)' }}>
        <h4 style={{ color: 'var(--color-accent-gold)', marginBottom: '10px' }}>What's included in the report</h4>
        <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {['Ascendant (Lagna), Moon Sign, Sun Sign', 'Complete planetary positions (sign, house, degree)', 'Birth Nakshatra and Nakshatra lord', 'Current Vimshottari Mahadasha', 'Vedic chart summary with interpretations'].map((item, i) => (
            <li key={i} style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
