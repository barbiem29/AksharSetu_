import React from 'react';

const RIPPLES = Array.from({ length: 12 }, (_, i) => ({
  top: `${8 + i * 8}%`,
  delay: `${i * 0.6}s`,
  duration: `${4 + (i % 4)}s`,
  opacity: 0.3 + (i % 3) * 0.15,
}));

const STARS = Array.from({ length: 30 }, (_, i) => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 40}%`,
  size: 1 + Math.random() * 2,
  delay: `${Math.random() * 3}s`,
}));

const AboutPage = ({ setPage }) => (
  <div className="river-section">
    {/* Background layers */}
    <div className="river-bg" />
    <div className="river-sky" />

    {/* Stars */}
    {STARS.map((s, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: s.left,
          top: s.top,
          width: `${s.size}px`,
          height: `${s.size}px`,
          background: 'rgba(255,255,200,0.8)',
          borderRadius: '50%',
          animation: `dotPulse ${2 + (i % 3)}s ${s.delay} ease-in-out infinite`,
          zIndex: 1,
        }}
      />
    ))}

    {/* Sun */}
    <div className="river-sun" />

    {/* Water */}
    <div className="river-water">
      {RIPPLES.map((r, i) => (
        <div
          key={i}
          className="water-ripple"
          style={{
            top: r.top,
            animationDelay: r.delay,
            animationDuration: r.duration,
            opacity: r.opacity,
          }}
        />
      ))}
    </div>

    {/* Content */}
    <div className="river-content" style={{ position: 'relative', zIndex: 5 }}>
      {/* Glass card */}
      <div className="glass-card" style={{ padding: '3rem 2.5rem', marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--gold)', marginBottom: '1rem' }}>
          ॥ ABOUT AKSHARSETU ॥
        </div>

        <div className="river-quote">
          अक्षरं ब्रह्म परमम्
        </div>
        <div className="river-quote-en">
          "The syllable is the supreme Brahman" — Bhagavad Gita 8.3
        </div>

        <div style={{ color: 'var(--text-dim)', lineHeight: '1.85', fontSize: '1.05rem', fontFamily: 'Cormorant Garamond', fontStyle: 'italic', maxWidth: '520px', margin: '0 auto' }}>
          AksharSetu — <em>अक्षरसेतु</em> — is a bridge between the timeless wisdom of
          the Gurukul tradition and the possibilities of modern technology. Every letter
          carries the breath of its speaker; every sound, a lineage of learning.
        </div>

        <div style={{ margin: '1.5rem 0', height: '1px', background: 'var(--glass-border)' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.2rem', textAlign: 'center' }}>
          {[
            { n: '49', l: 'Alphabets', d: 'Vowels & Consonants' },
            { n: '∞', l: 'Scripts', d: 'Infinite possibilities' },
            { n: '5000+', l: 'Years', d: 'Of Sanskrit tradition' },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: '2rem', color: 'var(--gold)', fontFamily: 'Yatra One' }}>{s.n}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--sand)', letterSpacing: '0.06em' }}>{s.l}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature pills */}
      <div className="feature-row">
        {[
          { icon: '🔤', label: 'Learn Alphabets', page: 'alphabets' },
          { icon: '📸', label: 'OCR & Audio', page: 'ocr' },
          { icon: '🔊', label: 'Text to Speech', page: 'ocr' },
          { icon: '🌐', label: 'Translation', page: 'ocr' },
        ].map(f => (
          <div key={f.label} className="feature-pill" onClick={() => setPage(f.page)}>
            <span className="feature-pill-icon">{f.icon}</span>
            <span className="feature-pill-label">{f.label}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', color: 'var(--text-dim)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
        Made with 🙏 for the love of Hindi
      </div>
    </div>
  </div>
);

export default AboutPage;
