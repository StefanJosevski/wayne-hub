import React, { useState, useEffect } from 'react';

// Fallback quotes with a Wayne/Batman philosophical edge
const FALLBACK_QUOTES = [
  { q: "Why do we fall? So that we can learn to pick ourselves up.", a: "Alfred Pennyworth" },
  { q: "It's not who I am underneath, but what I do that defines me.", a: "Bruce Wayne" },
  { q: "The night is darkest just before the dawn.", a: "Harvey Dent" },
  { q: "Endure, Master Wayne. Take it. They'll hate you for it, but that's the point.", a: "Alfred Pennyworth" },
  { q: "A hero can be anyone, even a man doing something as simple and reassuring as putting a coat around a young boy's shoulders.", a: "Bruce Wayne" },
  { q: "You either die a hero or you live long enough to see yourself become the villain.", a: "Harvey Dent" },
  { q: "I wear a mask, and that mask is not to hide who I am, but to create what I am.", a: "Bruce Wayne" },
  { q: "Fortune favors the prepared mind.", a: "Louis Pasteur" },
];

function QuoteWidget() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      // ZenQuotes proxied through allorigins to avoid CORS
      const res = await fetch(
        'https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random')
      );
      if (!res.ok) throw new Error('FAILED');
      const wrapper = await res.json();
      const data = JSON.parse(wrapper.contents);
      if (data && data[0]) {
        setQuote({ q: data[0].q, a: data[0].a });
      } else {
        throw new Error('NO DATA');
      }
    } catch {
      // Fallback to local curated quotes
      const idx = (fallbackIndex + 1) % FALLBACK_QUOTES.length;
      setFallbackIndex(idx);
      setQuote(FALLBACK_QUOTES[idx]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">✦ PHILOSOPHICAL BRIEFING</span>
        <span className="panel-badge">DAILY INTEL</span>
      </div>
      <div className="panel-body">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <span className="loading-text">RETRIEVING TRANSMISSION...</span>
          </div>
        ) : quote ? (
          <div className="quote-content">
            <p className="quote-text">"{quote.q}"</p>
            <p className="quote-author">— {quote.a.toUpperCase()}</p>
          </div>
        ) : null}
        <button className="fetch-btn quote-refresh" onClick={fetchQuote} disabled={loading}>
          {loading ? 'DECRYPTING...' : '↻ NEW TRANSMISSION'}
        </button>
      </div>
    </div>
  );
}

export default QuoteWidget;
