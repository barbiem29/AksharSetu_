import React, { useEffect, useRef } from 'react';
import { floatingAlphas } from '../assets/hindiData';
import gurukul from '../assets/gurukul.jpg';

const WAVE_HEIGHTS = [12, 22, 35, 28, 18, 38, 30, 20, 14, 26, 32, 16, 38, 24, 18, 36, 28, 20, 14, 30];
const LEAVES = ['🍃', '🌿', '☘️'];

const Landing = ({ onStart }) => {
  const leafRef = useRef(null);

  // Generate floating alphas with staggered animation delays
  const alphaItems = floatingAlphas.map((ch, i) => ({
    ch,
    delay: (i * 1.4) % 22,
    duration: 14 + (i % 5) * 2,
    left: `${20 + (i % 3) * 25}%`,
    size: 1.6 + (i % 4) * 0.25,
  }));

  const waveItems = WAVE_HEIGHTS.map((h, i) => ({
    h, delay: i * 0.1
  }));

  const leafItems = Array.from({ length: 8 }, (_, i) => ({
    emoji: LEAVES[i % LEAVES.length],
    delay: i * 2.1,
    duration: 10 + (i % 4) * 2.5,
    left: `${10 + i * 11}%`,
    dx: `${-30 + (i % 3) * 30}px`,
    rot: `${-45 + (i % 4) * 30}deg`,
    top: `-${5 + (i % 3) * 3}%`,
  }));

  return (
    <div className="landing">
      {/* Background */}
      <div className="landing-bg">
        <img src={gurukul} alt="Gurukul" />
      </div>
      <div className="landing-overlay" />

      {/* Fire Glow */}
      <div className="fire-glow" />

      {/* Floating Alphabets — Left panel */}
      <div className="alpha-panel">
        {alphaItems.map((a, i) => (
          <span
            key={i}
            className="floating-alpha"
            style={{
              left: a.left,
              fontSize: `${a.size}rem`,
              animationDuration: `${a.duration}s`,
              animationDelay: `${a.delay}s`,
            }}
          >
            {a.ch}
          </span>
        ))}
      </div>

      {/* Digital Flow — Right panel */}
      <div className="digital-panel">
        <div style={{ fontSize: '0.65rem', color: 'rgba(212,175,55,0.5)', letterSpacing: '0.1em', marginBottom: '0.8rem', writingMode:'vertical-rl', textOrientation:'mixed' }}>
          DIGITAL VOICE
        </div>
        {waveItems.map((w, i) => (
          <div
            key={i}
            className="wave-bar"
            style={{
              animationDelay: `${w.delay}s`,
              animationDuration: `${1.4 + (i % 4) * 0.3}s`,
              height: `${2 + (i % 3)}px`,
              width: `${50 + (i % 5) * 10}%`,
            }}
          />
        ))}
        {/* audio icon */}
        <div style={{ fontSize: '1.5rem', color: 'rgba(212,175,55,0.4)', marginTop: '1rem' }}>🔊</div>
      </div>

      {/* Drifting Leaves */}
      {leafItems.map((l, i) => (
        <span
          key={i}
          className="leaf"
          style={{
            left: l.left,
            top: l.top,
            '--dx': l.dx,
            '--rot': l.rot,
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.duration}s`,
          }}
        >
          {l.emoji}
        </span>
      ))}

      {/* Center Content */}
      <div className="landing-center">
        <div className="landing-devanagari">॥ ज्ञानं परमं बलम् ॥</div>

        <h1 className="landing-title">AksharSetu</h1>
        <div className="landing-sub-hindi">अक्षरसेतु</div>

        <p className="landing-subtitle">
          Bridging traditional knowledge with digital voice —<br/>
          from ancient scripts to living sound
        </p>

        <div className="landing-btn-wrap">
          <button className="btn-primary" onClick={onStart}>
            आरम्भ करें &nbsp;·&nbsp; Get Started
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="scroll-hint">
        <span style={{ letterSpacing: '0.15em', fontSize: '0.7rem' }}>SCROLL</span>
        <div className="scroll-hint-line" />
      </div>
    </div>
  );
};

export default Landing;
