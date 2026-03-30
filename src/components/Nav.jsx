import React from 'react';

const Nav = ({ page, setPage }) => {
  const links = [
    { id: 'landing', label: 'Home' },
    { id: 'alphabets', label: 'Alphabets' },
    { id: 'ocr', label: 'OCR & Audio' },
    { id: 'about', label: 'About' },
  ];

  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setPage('landing')} style={{cursor:'pointer'}}>
        अक्षरसेतु
      </div>
      <ul className="nav-links">
        {links.map(l => (
          <li key={l.id}>
            <a
              className={page === l.id ? 'active' : ''}
              onClick={() => setPage(l.id)}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
