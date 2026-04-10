import React, { useState, useEffect } from 'react';
import './App.css';
import Clock from './components/Clock';
import WeatherWidget from './components/WeatherWidget';
import NewsWidget from './components/NewsWidget';
import TodoWidget from './components/TodoWidget';
import SearchBar from './components/SearchBar';
import QuoteWidget from './components/QuoteWidget';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('wayne-darkmode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [bgUrl, setBgUrl] = useState(() => {
    return localStorage.getItem('wayne-bg') || '';
  });

  const [bgInput, setBgInput] = useState('');
  const [coords, setCoords] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('all');

  // Persist dark mode
  useEffect(() => {
    localStorage.setItem('wayne-darkmode', JSON.stringify(darkMode));
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Persist bg
  useEffect(() => {
    localStorage.setItem('wayne-bg', bgUrl);
  }, [bgUrl]);

  // Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => setCoords(null)
      );
    }
  }, []);

  const handleBgApply = () => {
    setBgUrl(bgInput);
    setBgInput('');
  };

  const navItems = [
    { id: 'all', label: 'ALL SYSTEMS' },
    { id: 'intel', label: 'INTEL FEED' },
    { id: 'ops', label: 'OPERATIONS' },
  ];

  return (
    <div
      className={`app ${darkMode ? 'dark' : 'light'}`}
      style={bgUrl ? { backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      <div className="app-overlay">
        {/* TOP NAV */}
        <header className="top-bar">
          <div className="logo-section">
            <div className="bat-logo">
              <svg viewBox="0 0 60 30" fill="currentColor">
                <path d="M30 5 C20 5 10 10 5 18 C10 15 15 14 18 16 C16 12 20 9 24 10 L30 8 L36 10 C40 9 44 12 42 16 C45 14 50 15 55 18 C50 10 40 5 30 5Z"/>
                <path d="M18 16 C14 18 12 22 14 26 C17 24 20 22 22 20Z"/>
                <path d="M42 16 C46 18 48 22 46 26 C43 24 40 22 38 20Z"/>
                <ellipse cx="30" cy="20" rx="8" ry="6"/>
              </svg>
            </div>
            <div className="brand">
              <span className="brand-main">WAYNE INDUSTRIES</span>
              <span className="brand-sub">EXECUTIVE COMMAND HUB — SECURE CHANNEL</span>
            </div>
          </div>

          <nav className="top-nav">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-btn ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="top-controls">
            <Clock />
            <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? '☀ DAY' : '◐ NIGHT'}
            </button>
          </div>
        </header>

        {/* SEARCH BAR */}
        <div className="search-row">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <div className="bg-control">
            <input
              className="bg-input"
              type="text"
              placeholder="OVERRIDE BACKGROUND URL..."
              value={bgInput}
              onChange={e => setBgInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleBgApply()}
            />
            <button className="bg-btn" onClick={handleBgApply}>APPLY</button>
            {bgUrl && <button className="bg-btn danger" onClick={() => { setBgUrl(''); setBgInput(''); }}>RESET</button>}
          </div>
        </div>

        {/* MAIN GRID */}
        <main className="dashboard-grid">
          {(activeSection === 'all' || activeSection === 'intel') && (
            <>
              <WeatherWidget coords={coords} searchQuery={searchQuery} />
              <NewsWidget searchQuery={searchQuery} />
            </>
          )}
          {(activeSection === 'all' || activeSection === 'ops') && (
            <>
              <TodoWidget searchQuery={searchQuery} />
              <QuoteWidget />
            </>
          )}
        </main>

        <footer className="footer-bar">
          <span>WAYNE INDUSTRIES © {new Date().getFullYear()} — ALL CHANNELS ENCRYPTED</span>
          <span className="status-dot">● SYSTEM NOMINAL</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
