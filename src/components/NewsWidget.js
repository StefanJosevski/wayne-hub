import React, { useState, useEffect } from 'react';

const NEWS_API_KEY = '47ffce3fc005499bb18b0a7cef7f61d0';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function NewsWidget({ searchQuery }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('technology');

  const categories = [
    { id: 'technology', label: 'TECH' },
    { id: 'business', label: 'FINANCE' },
    { id: 'science', label: 'SCIENCE' },
    { id: 'general', label: 'GENERAL' },
  ];

  const fetchNews = async (cat) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines?category=${cat}&language=en&pageSize=20&apiKey=${NEWS_API_KEY}`
      );
      if (!res.ok) {
        if (res.status === 401) throw new Error('NEWS API KEY INVALID — CHECK CONFIGURATION');
        throw new Error(`NEWS FEED UNAVAILABLE [${res.status}]`);
      }
      const data = await res.json();
      if (data.status === 'error') throw new Error(data.message?.toUpperCase() || 'NEWS API ERROR');
      setArticles(data.articles || []);
    } catch (err) {
      setError(err.message || 'NEWS CURRENTLY UNAVAILABLE. PLEASE TRY AGAIN LATER.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(category);
  }, [category]);

  // Real-time filtering by search query
  const filtered = articles.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.title?.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q) ||
      a.source?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">◈ INTEL FEED</span>
        <span className="panel-badge news-count">{filtered.length} SIGNALS</span>
      </div>
      <div className="panel-body">
        <div className="todo-filters" style={{ marginBottom: '14px' }}>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`filter-btn ${category === c.id ? 'active' : ''}`}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
          <button className="filter-btn" onClick={() => fetchNews(category)} title="Refresh">
            ↻
          </button>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <span className="loading-text">INTERCEPTING TRANSMISSIONS...</span>
          </div>
        )}

        {error && !loading && (
          <div className="error-state">
            ⚠ {error}
            <button className="retry-btn" onClick={() => fetchNews(category)}>
              RETRY
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="empty-state">
                {searchQuery ? `NO SIGNALS MATCH "${searchQuery.toUpperCase()}"` : 'NO TRANSMISSIONS RECEIVED'}
              </div>
            ) : (
              <div className="news-list">
                {filtered.map((article, i) => (
                  <a
                    key={i}
                    className="news-item"
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="news-item-title">{article.title}</div>
                    <div className="news-item-meta">
                      <span className="news-source">{article.source?.name?.toUpperCase()}</span>
                      <span className="news-time">
                        {article.publishedAt ? timeAgo(article.publishedAt) : ''}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default NewsWidget;
