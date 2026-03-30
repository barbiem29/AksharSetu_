import React, { useState, useRef } from 'react';
import { vowels, consonants } from '../assets/hindiData';

const speakHindi = (letter, onStart, onEnd) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(letter);
  utt.lang = 'hi-IN';
  utt.rate = 0.75;
  utt.pitch = 1.1;
  utt.onstart = onStart;
  utt.onend = onEnd;
  utt.onerror = onEnd;
  window.speechSynthesis.speak(utt);
};

const AlphaCard = ({ item }) => {
  const [playing, setPlaying] = useState(false);

  const handleSpeak = (e) => {
    e.stopPropagation();
    speakHindi(
      item.letter,
      () => setPlaying(true),
      () => setPlaying(false)
    );
  };

  return (
    <div className="alpha-card" onClick={handleSpeak} title={`Pronounce ${item.letter}`}>
      <span className="alpha-card-letter">{item.letter}</span>
      <span className="alpha-card-roman">{item.roman}</span>
      <button
        className={`speak-btn ${playing ? 'playing' : ''}`}
        onClick={handleSpeak}
        title="Play pronunciation"
      >
        {playing ? '▶' : '🔊'}
      </button>
    </div>
  );
};

const AlphabetPage = () => {
  const [tab, setTab] = useState('vowels');

  const speakAll = () => {
    const list = tab === 'vowels' ? vowels : consonants;
    let i = 0;
    const next = () => {
      if (i >= list.length) return;
      speakHindi(list[i].letter, () => {}, () => {
        i++;
        setTimeout(next, 300);
      });
    };
    next();
  };

  const items = tab === 'vowels' ? vowels : consonants;

  return (
    <div className="page-section">
      <div className="page-inner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="section-title">हिंदी वर्णमाला</h2>
            <p className="section-subtitle">Hindi Alphabet — Letters & Pronunciation</p>
          </div>
          <button className="btn-secondary" onClick={speakAll} style={{ marginTop: '0.5rem' }}>
            🔊 &nbsp; Play All
          </button>
        </div>

        <div className="tab-row">
          <button className={`tab-btn ${tab === 'vowels' ? 'active' : ''}`} onClick={() => setTab('vowels')}>
            स्वर · Vowels
          </button>
          <button className={`tab-btn ${tab === 'consonants' ? 'active' : ''}`} onClick={() => setTab('consonants')}>
            व्यंजन · Consonants
          </button>
        </div>

        <div className="alphabet-grid">
          {items.map((item, i) => (
            <AlphaCard key={item.letter} item={item} />
          ))}
        </div>

        {/* Info banner */}
        <div style={{ marginTop: '2.5rem', padding: '1.2rem 1.5rem', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '4px' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: '1.7', fontStyle: 'italic' }}>
            💡 Click any card or press 🔊 to hear the pronunciation spoken in Hindi. Use "Play All" to listen to the complete sequence — an ancient practice called <em>varna-paatha</em>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlphabetPage;
