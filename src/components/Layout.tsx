import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg-dark)', color: 'var(--color-text-main)' }}>
      <main style={{ flex: '1 0 auto', padding: '40px 0' }}>
        <div className="layout-container">{children}</div>
      </main>

      <footer style={{
        background: 'rgba(5,6,15,0.95)', borderTop: '1px solid var(--color-border-glass)',
        padding: '40px 0', flexShrink: 0, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem'
      }}>
        <div className="layout-container">
          <p style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1.2rem', letterSpacing: '0.1em', marginBottom: '16px' }}>VEDAASTRO</p>
          <p style={{ maxWidth: '600px', margin: '0 auto 24px', fontSize: '0.85rem', lineHeight: '1.5' }}>
            Disclaimer: Astrology is a matter of belief and science of planetary influences. Calculations are based on standard mathematical systems; predictions are indicators rather than certainties.
          </p>
          <div style={{ height: '1px', background: 'var(--color-border-glass)', margin: '20px 0' }} />
          <p>© {new Date().getFullYear()} VedaAstro Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
