import React, { useState } from 'react';
import './styles/global.css';
import Nav from './components/Nav';
import Landing from './pages/Landing';
import AlphabetPage from './pages/AlphabetPage';
import OCRPage from './pages/OCRPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const [page, setPage] = useState('landing');

  const renderPage = () => {
    switch (page) {
      case 'landing':
        return <Landing onStart={() => setPage('alphabets')} />;
      case 'alphabets':
        return <AlphabetPage />;
      case 'ocr':
        return <OCRPage />;
      case 'about':
        return <AboutPage setPage={setPage} />;
      default:
        return <Landing onStart={() => setPage('alphabets')} />;
    }
  };

  return (
    <>
      {page !== 'landing' && <Nav page={page} setPage={setPage} />}
      {renderPage()}
    </>
  );
}
