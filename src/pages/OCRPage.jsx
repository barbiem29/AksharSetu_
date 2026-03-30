import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { sampleTexts } from '../assets/hindiData';

const WAVE_HEIGHTS = [8,16,28,22,35,18,30,12,25,38,20,14,32,26,18,34,22,16,30,24];

const WORD_MAP = {
  'ज्ञान': 'knowledge', 'शक्ति': 'power', 'है': 'is',
  'सत्य': 'truth', 'जयते': 'wins', 'विद्या': 'education',
  'विनय': 'humility', 'अहिंसा': 'non-violence', 'परमो': 'supreme',
  'धर्म': 'duty', 'धर्मः': 'duty', 'नमस्ते': 'hello', 'भारत': 'India',
  'प्रेम': 'love', 'जल': 'water', 'अग्नि': 'fire', 'वायु': 'air',
  'पृथ्वी': 'earth', 'आकाश': 'sky', 'सूर्य': 'sun', 'चंद्र': 'moon',
  'तारे': 'stars', 'गुरु': 'teacher', 'शिष्य': 'student', 'विद्यालय': 'school',
  'पुस्तक': 'book', 'लेखन': 'writing', 'पठन': 'reading', 'माता': 'mother',
  'पिता': 'father', 'सेवा': 'service', 'मेरा': 'my', 'देश': 'country',
  'नदी': 'river', 'पर्वत': 'mountain', 'वन': 'forest', 'आज': 'today',
  'मौसम': 'weather', 'बहुत': 'very', 'अच्छा': 'good', 'है': 'is',
  'हिंदी': 'Hindi', 'पढ़ना': 'read', 'लिखना': 'write', 'पसंद': 'like',
  'हैं': 'are', 'हम': 'we', 'सुबह': 'morning', 'पार्क': 'park',
  'जाते': 'go', 'रसोई': 'kitchen', 'स्वादिष्ट': 'delicious',
  'भोजन': 'meal', 'बन': 'is being made', 'रहा': 'staying', 'है।': 'is.'
};

function normalizeHindiText(text) {
  return text
    .replace(/\u200B/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\s+$/g, '')
    .trim();
}

function translateHindiText(text) {
  const cleaned = normalizeHindiText(text);
  if (!cleaned) return '';
  const segments = cleaned.split(/([।,\n])/g).filter(Boolean);
  return segments.map(segment => {
    if (/^[।,\n]$/.test(segment)) return segment;
    return segment
      .split(/\s+/)
      .map(word => WORD_MAP[word] || word)
      .join(' ');
  }).join('');
}

const AudioWave = ({ active }) => (
  <div className="audio-wave">
    {WAVE_HEIGHTS.map((h, i) => (
      <div
        key={i}
        className="wave-dot"
        style={{
          '--h': `${h}px`,
          animationDelay: active ? `${i * 0.06}s` : '0s',
          animationPlayState: active ? 'running' : 'paused',
          height: active ? undefined : '4px',
          opacity: active ? undefined : '0.2',
        }}
      />
    ))}
  </div>
);

const OCRPage = () => {
  const [tab, setTab] = useState('type'); // 'type' | 'upload'
  const [inputText, setInputText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [translation, setTranslation] = useState('');
  const [audioActive, setAudioActive] = useState(false);
  const [voice, setVoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [status, setStatus] = useState('');
  const fileRef = useRef();
  const utterRef = useRef(null);

  React.useEffect(() => {
    const loadVoices = () => {
      if (!window.speechSynthesis) return;
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.toLowerCase().startsWith('hi')) || voices[0];
      if (hindiVoice) setVoice(hindiVoice);
    };

    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setExtractedText('');
    setTranslation('');
    setStatus('Image loaded. Press "Extract Text" to process.');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setStatus('Image dropped. Press "Extract Text".');
    }
  };

  const handleExtract = async () => {
    setLoading(true);
    setStatus('Processing...');
    setTranslation('');

    await new Promise(r => setTimeout(r, 1600));

    let result;
    if (tab === 'type') {
      const normalized = normalizeHindiText(inputText);
      result = normalized || 'कोई पाठ नहीं मिला।';
    } else {
      if (!imageFile) {
        setStatus('Please upload an image first.');
        setLoading(false);
        return;
      }

      const worker = createWorker({
        logger: m => {
          if (m.status === 'recognizing text') {
            setStatus(`Recognizing… ${Math.round(m.progress * 100)}%`);
          }
        }
      });

      try {
        await worker.load();
        await worker.loadLanguage('hin');
        await worker.initialize('hin');
        const { data } = await worker.recognize(imageFile);
        const rawText = data.text || '';
        const normalized = normalizeHindiText(rawText);
        result = normalized || 'चित्र से कोई पठनीय पाठ नहीं मिला।';
      } catch (err) {
        console.error(err);
        result = 'Unable to read the image. कृपया पुनः प्रयास करें।';
      } finally {
        await worker.terminate();
      }
    }

    setExtractedText(result);
    setStatus('Text extracted successfully ✓');
    setLoading(false);
  };

  const handleSpeak = () => {
    const text = extractedText || inputText;
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    if (voice) utt.voice = voice;
    utt.lang = 'hi-IN';
    utt.rate = 0.85;
    utt.pitch = 1.05;
    utt.onstart = () => setAudioActive(true);
    utt.onend = () => setAudioActive(false);
    utt.onerror = () => setAudioActive(false);
    utterRef.current = utt;
    window.speechSynthesis.speak(utt);
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setAudioActive(false);
  };

  const handleTranslate = async () => {
    const text = extractedText || inputText;
    if (!text) return;
    setTranslating(true);
    await new Promise(r => setTimeout(r, 800));
    setTranslation(translateHindiText(text));
    setTranslating(false);
  };

  const loadSample = () => {
    const t = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setInputText(t);
    setExtractedText('');
    setTranslation('');
    setStatus('');
  };

  const activeText = extractedText || (tab === 'type' ? inputText : '');

  return (
    <div className="page-section">
      <div className="page-inner">
        <h2 className="section-title">पाठ → ध्वनि</h2>
        <p className="section-subtitle">Text to Audio — Extract, Read & Translate Hindi</p>

        <div className="tab-row">
          <button className={`tab-btn ${tab === 'type' ? 'active' : ''}`} onClick={() => { setTab('type'); setExtractedText(''); setTranslation(''); }}>
            ✍️ &nbsp; Type Hindi
          </button>
          <button className={`tab-btn ${tab === 'upload' ? 'active' : ''}`} onClick={() => { setTab('upload'); setExtractedText(''); setTranslation(''); }}>
            📸 &nbsp; Upload Image
          </button>
        </div>

        <div className="ocr-layout">
          {/* Left: Input */}
          <div>
            <span className="deva-label">
              {tab === 'type' ? 'हिंदी पाठ लिखें · Enter Hindi Text' : 'चित्र अपलोड करें · Upload Image'}
            </span>

            {tab === 'type' ? (
              <>
                <textarea
                  className="text-input-area"
                  placeholder="यहाँ हिंदी लिखें... (Type or paste Hindi text here)"
                  value={inputText}
                  onChange={e => { setInputText(e.target.value); setExtractedText(''); setTranslation(''); }}
                  rows={6}
                />
                <div style={{ marginTop: '0.6rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button className="btn-secondary" onClick={loadSample}>
                    📖 Sample Text
                  </button>
                  <button className="btn-secondary" onClick={() => { setInputText(''); setExtractedText(''); setTranslation(''); setStatus(''); }}>
                    🗑️ Clear
                  </button>
                  <button className="btn-secondary" onClick={handleSpeak} disabled={!inputText}>
                    🔊 Listen
                  </button>
                  <AudioWave active={audioActive} />
                </div>
              </>
            ) : (
              <div
                className="upload-zone"
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileRef.current.click()}
              >
                <span className="upload-icon">📸</span>
                <span className="upload-text">
                  {imageFile ? imageFile.name : 'Drop image here or click to browse'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Supports JPG, PNG, GIF</span>
                {imagePreview && (
                  <img src={imagePreview} className="img-preview" alt="Preview" />
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>
            )}

            <div className="action-row" style={{ marginTop: '1.2rem' }}>
              <button
                className="btn-primary"
                onClick={handleExtract}
                disabled={loading || (tab === 'type' ? !inputText : !imageFile)}
              >
                {loading && <span className="loading-spinner" />}
                {loading ? 'Processing...' : tab === 'type' ? 'Process Text' : 'Extract Text'}
              </button>
            </div>

            {status && (
              <div className="status-badge" style={{ marginTop: '0.8rem' }}>
                <div className="dot-pulse" />
                {status}
              </div>
            )}
          </div>

          {/* Right: Output */}
          <div className="glass-card result-panel">
            <span className="deva-label">निष्कर्ष · Output</span>

            {activeText ? (
              <>
                <div className="result-text">{activeText}</div>

                <div className="divider">·</div>

                {/* Audio controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    className="btn-secondary"
                    onClick={audioActive ? stopAudio : handleSpeak}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    {audioActive ? '⏹ Stop' : '▶ Generate Audio'}
                  </button>
                  <AudioWave active={audioActive} />
                </div>

                <div className="action-row">
                  <button className="btn-secondary" onClick={handleTranslate} disabled={translating}>
                    {translating && <span className="loading-spinner" />}
                    🌐 &nbsp; Translate to English
                  </button>
                </div>

                {translation && (
                  <div className="translation-box">
                    <div style={{ fontSize: '0.72rem', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '0.4rem' }}>
                      ENGLISH TRANSLATION
                    </div>
                    {translation}
                  </div>
                )}
              </>
            ) : (
              <div style={{ color: 'var(--text-dim)', fontSize: '1rem', fontStyle: 'italic', marginTop: '1rem', lineHeight: '1.7' }}>
                Your processed text will appear here.<br />
                Press "Process Text" to begin.
              </div>
            )}
          </div>
        </div>

        {/* Help */}
        <div style={{ marginTop: '2rem', padding: '1rem 1.4rem', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '4px' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.7' }}>
            💡 <strong style={{ color: 'var(--sand)' }}>How it works:</strong> Type Hindi text or upload an image of handwritten / printed Hindi. The text is processed and read aloud using your browser's built-in Hindi voice synthesis. Use "Translate" for a word-by-word English meaning.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OCRPage;
