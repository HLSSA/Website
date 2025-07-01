import React, { useState, useEffect, useCallback } from 'react';
import { Globe, Home, Search, Calendar, Clock, User, ChevronRight, Loader2, X } from 'lucide-react';
import useNews from '../../hooks/useNews';
import './News.css';

// News article type for the application
interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;  
  date: string;
  time: string;
  author: string;
  category: string;
  story: string;
  article_url?: string;
  image: string;
  featured?: boolean;
}

const NewsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hlssa');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [apiNews, setApiNews] = useState<NewsArticle[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal state
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use the custom hook for database news
  const { 
    news: dbNews, 
    featuredNews, 
    loading: dbLoading, 
    error: dbError, 
    fetchNews 
  } = useNews();

  const newsPerPage = 20;

  const fetchApiNews = useCallback(async (page = 1): Promise<void> => {
    setApiLoading(true);
    setApiError(null);

    try {
      // Calculate date 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const fromDate = thirtyDaysAgo.toISOString().split('T')[0];

      // Multiple API calls for comprehensive coverage
      const queries = [
        'football india national team',
        'indian super league',
        'premier league',
        'champions league',
        'fifa world cup',
        'european football',
        'la liga',
        'serie a',
        'bundesliga',
        'english premier league',
        'Ronaldo',
        'Messi',
      ];

      const allNews: NewsArticle[] = [];

      // Try NewsAPI first (most reliable)
      for (const query of queries.slice(0, 3)) { // Limit to avoid rate limits
        try {
          const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${fromDate}&sortBy=popularity&language=en&pageSize=${Math.ceil(newsPerPage/3)}`;

          const response = await fetch(newsApiUrl, {
            headers: {
              'X-API-Key': 'your-api-key' // In real app, this should be from env
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.articles && data.articles.length > 0) {
              const formattedNews = data.articles
                .filter((article: any) => article.title && article.title !== '[Removed]')
                .map((article: any, index: number) => {
                  const pubDate = new Date(article.publishedAt);
                  return {
                    id: `newsapi-${query}-${index}`,
                    title: article.title,
                    excerpt: article.description || article.title.substring(0, 150) + '...',
                    date: pubDate.toISOString().split('T')[0],
                    time: pubDate.toTimeString().substring(0, 5),
                    author: article.source.name || 'Unknown',
                    category: query.includes('india') ? 'Indian Football' : 'International',
                    url: article.url,
                    story: '', // API news doesn't have story content
                    image: article.urlToImage || 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop',
                    featured: false
                  };
                });
              allNews.push(...formattedNews);
            }
          }
        } catch (err) {
          console.log(`Failed to fetch from NewsAPI for query: ${query}`);
        }
      }

      // If NewsAPI fails, try Guardian API
      if (allNews.length === 0) {
        try {
          const guardianUrl = `https://content.guardianapis.com/search?q=football&from-date=${fromDate}&order-by=relevance&show-fields=thumbnail,trailText&page-size=${newsPerPage}&api-key=test`;

          const response = await fetch(guardianUrl);
          if (response.ok) {
            const data = await response.json();
            if (data.response && data.response.results) {
              const formattedNews = data.response.results.map((article: any, index: number) => {
                const pubDate = new Date(article.webPublicationDate);
                return {
                  id: `guardian-${index}`,
                  title: article.webTitle,
                  excerpt: article.fields?.trailText || article.webTitle.substring(0, 150) + '...',
                  date: pubDate.toISOString().split('T')[0],
                  time: pubDate.toTimeString().substring(0, 5),
                  author: 'The Guardian',
                  category: 'Football',
                  url: article.webUrl,
                  story: '', // API news doesn't have story content
                  image: article.fields?.thumbnail || 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop',
                  featured: false
                };
              });
              allNews.push(...formattedNews);
            }
          }
        } catch (err) {
          console.log('Guardian API also failed');
        }
      }

      // If both APIs fail, we'll handle it in the error state

      if (allNews.length > 0) {
        // Remove duplicates and sort by date
        const uniqueNews = allNews.filter((article, index, self) =>
          index === self.findIndex(a => a.title === article.title)
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setApiNews(uniqueNews);
        setTotalPages(Math.ceil(uniqueNews.length / newsPerPage));
        console.log(`Loaded ${uniqueNews.length} articles`);
      } else {
        throw new Error('No news articles could be loaded from any source');
      }
    } catch (err) {
      console.error('All APIs failed:', err);
      setApiError('Unable to load news at the moment. Please try again later.');
      setApiNews([]);
    } finally {
      setApiLoading(false);
    }
  }, [newsPerPage]);

  useEffect(() => {
    if (activeSection === 'news') {
      fetchApiNews(currentPage);
    }
  }, [activeSection, currentPage, fetchApiNews]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Format database news to match the NewsArticle interface
  const formatDbNews = (dbNewsItem: any): NewsArticle => {
    const createdAt = new Date(dbNewsItem.createdAt || dbNewsItem.created_at);
    return {
      id: dbNewsItem._id || dbNewsItem.id,
      title: dbNewsItem.title,
      excerpt: dbNewsItem.content ? dbNewsItem.content.substring(0, 200) + '...' : dbNewsItem.excerpt || '',
      date: createdAt.toISOString().split('T')[0],
      time: createdAt.toTimeString().substring(0, 5),
      author: dbNewsItem.author || 'HLSSA Admin',
      category: dbNewsItem.category || 'Academy',
      article_url: dbNewsItem.article_url || '',
      story: dbNewsItem.story || dbNewsItem.content || '',
      image: dbNewsItem.image || 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop',
      featured: dbNewsItem.featured || false
    };
  };

  const getCurrentNews = useCallback((): NewsArticle[] => {
    let newsList: NewsArticle[] = [];
    
    if (activeSection === 'hlssa') {
      // Use database news for HLSSA section
      newsList = dbNews.map(formatDbNews);
    } else {
      // Use API news for international section
      newsList = apiNews;
    }

    if (!searchTerm.trim()) return newsList;

    const term = searchTerm.toLowerCase();
    return newsList.filter(article =>
      article.title.toLowerCase().includes(term) ||
      article.excerpt.toLowerCase().includes(term)
    );
  }, [activeSection, dbNews, apiNews, searchTerm]);

  // Handle read more button click
  const handleReadMore = (article: NewsArticle, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If article has a URL from the database, redirect to it
    if (article.article_url && article.article_url.trim() !== '' && article.article_url !== '#') {
      // If URL doesn't have protocol, add https://
      let url = article.article_url.trim();
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      // Open in the same tab for external URLs
      window.location.href = url;
      return;
    }
    
    // If article has story content, show modal
    if (article.story && article.story.trim() !== '') {
      setSelectedArticle(article);
      setIsModalOpen(true);
      return;
    }
    
    // If no URL or story, fallback to ID-based URL if available
    if (article.id) {
      window.location.href = `/news/${article.id}`;
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  // Handle modal backdrop click
  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Handle escape key for modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const currentNews = getCurrentNews();
  const featuredArticle = activeSection === 'hlssa' 
    ? (featuredNews.length > 0 ? formatDbNews(featuredNews[0]) : null)
    : currentNews.find(article => article.featured) || null;

  // Determine loading state
  const isLoading = activeSection === 'hlssa' ? dbLoading : apiLoading;
  const currentError = activeSection === 'hlssa' ? dbError : apiError;

  if (isLoading) {
    return (
      <div className="page">
        <header className="header">
          <div className="header-content">
            <h1 className="title">HLSSA Football Academy</h1>
            <p className="subtitle">
              Stay updated with the latest football news and academy updates
            </p>
          </div>
        </header>

        <div className="loading">
          <Loader2 size={32} className="animate-spin" />
          <p>Loading {activeSection === 'hlssa' ? 'HLSSA' : 'international'} news...</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
            {activeSection === 'hlssa' 
              ? 'Fetching latest academy updates from database'
              : 'Fetching trending stories from the past 30 days'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="title">HLSSA Football Academy</h1>
          <p className="subtitle">
            Stay updated with the latest football news and academy updates
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="navigation">
        <div className="nav-content">
          <button
            className={`nav-button ${activeSection === 'news' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('news');
              setCurrentPage(1);
              setSearchTerm('');
            }}
          >
            <Globe size={20} />
            International News
          </button>
          <button
            className={`nav-button ${activeSection === 'hlssa' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('hlssa');
              setSearchTerm('');
            }}
          >
            <Home size={20} />
            HLSSA News
          </button>
        </div>
      </nav>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-content">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder={`Search ${activeSection === 'hlssa' ? 'HLSSA' : 'international'} news...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </section>

      {/* Featured Article (HLSSA only) */}
      {featuredArticle && activeSection === 'hlssa' && (
        <section className="featured-section">
          <div className="featured-content">
            <h2 className="section-title">Featured News</h2>
            <div className="featured-card">
              <div>
                <div className="featured-badge">
                  <span className="featured-label">Featured</span>
                  <span className="category-tag">
                    {featuredArticle.category}
                  </span>
                </div>
                <h3 className="featured-title">
                  {featuredArticle.title}
                </h3>
                <p className="featured-excerpt">
                  {featuredArticle.excerpt}
                </p>
                <div className="meta">
                  <span className="meta-item">
                    <Calendar size={16} /> {featuredArticle.date}
                  </span>
                  <span className="meta-item">
                    <Clock size={16} /> {featuredArticle.time}
                  </span>
                  <span className="meta-item">
                    <User size={16} /> {featuredArticle.author}
                  </span>
                </div>
                <button 
                  onClick={(e) => handleReadMore(featuredArticle, e)}
                  className="read-more-button"
                >
                  Read Full Story <ChevronRight size={18} />
                </button>
              </div>
              <div>
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="featured-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop';
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="news-section">
        <div className="news-content">
          <div className="section-header">
            <h2 className="section-title">
              {activeSection === 'hlssa' ? 'HLSSA Academy News' : 'International Football News'}
            </h2>
            <div>
              <div className="results-count">
                {currentNews.length} {currentNews.length === 1 ? 'article' : 'articles'} found
              </div>
              {activeSection === 'news' && (
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                  From the past 30 days • Sorted by relevance
                </div>
              )}
              {activeSection === 'hlssa' && (
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                  Latest academy updates • Sorted by date
                </div>
              )}
            </div>
          </div>

          {currentError && (
            <div className="error">
              <h3 style={{ marginTop: 0, color: '#FF6B6B' }}>Failed to Load News</h3>
              <p>{currentError}</p>
              <button
                onClick={() => {
                  if (activeSection === 'hlssa') {
                    fetchNews();
                  } else {
                    fetchApiNews(currentPage);
                  }
                }}
                className="retry-button"
              >
                Retry Loading News
              </button>
            </div>
          )}

          {!currentError && (
            <>
              {currentNews.length === 0 ? (
                <div className="no-results">
                  <p>
                    {activeSection === 'hlssa' 
                      ? 'No HLSSA news articles found. Check back later for academy updates!'
                      : 'No articles found matching your search criteria.'
                    }
                  </p>
                </div>
              ) : (
                <div className="news-grid">
                  {currentNews
                    .filter(article => !article.featured || activeSection === 'news')
                    .slice((currentPage - 1) * newsPerPage, currentPage * newsPerPage)
                    .map(article => (
                    <article
                      key={article.id}
                      className="news-card"
                      onClick={() => {
                        if (article.article_url && article.article_url !== '#' && article.article_url !== '') {
                          window.open(article.article_url, '_blank');
                        } else if (article.story && article.story.trim() !== '') {
                          setSelectedArticle(article);
                          setIsModalOpen(true);
                        }
                      }}
                    >
                      <img
                        src={article.image}
                        alt={article.title}
                        className="news-image"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop';
                        }}
                      />
                      <div className="news-content-div">
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span className="category-tag">{article.category}</span>
                        </div>
                        <h3 className="news-title">{article.title}</h3>
                        <p className="news-excerpt">{article.excerpt}</p>
                        <div className="news-meta">
                          <span className="news-meta-item">
                            <Calendar size={16} /> {article.date}
                          </span>
                          <span className="news-meta-item">
                            <Clock size={16} /> {article.time}
                          </span>
                          <span className="news-meta-item">
                            <User size={16} /> {article.author}
                          </span>
                        </div>
                        <a href={article.article_url} target="_blank">
                        <button 
                          onClick={(e) => handleReadMore(article, e)}
                          className="read-more-button"
                        >
                          Read Full Story <ChevronRight size={18} />
                        </button>
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {activeSection === 'news' && totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="page-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Modal for story content */}
      {isModalOpen && selectedArticle && (
        <div className="modal-overlay" onClick={handleModalBackdropClick}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{selectedArticle.title}</h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-meta">
              <span className="modal-meta-item">
                <Calendar size={16} /> {selectedArticle.date}
              </span>
              <span className="modal-meta-item">
                <Clock size={16} /> {selectedArticle.time}
              </span>
              <span className="modal-meta-item">
                <User size={16} /> {selectedArticle.author}
              </span>
              <span className="modal-category-tag">{selectedArticle.category}</span>
            </div>

            {selectedArticle.image && (
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="modal-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop';
                }}
              />
            )}

            <div className="modal-story">
              {selectedArticle.story.split('\n').map((paragraph, index) => (
                <p key={index} className="modal-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          background: white;
          border-radius: 12px 12px 0 0;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          padding-right: 1rem;
          line-height: 1.3;
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          color: #6b7280;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .modal-close:hover {
          background-color: #f3f4f6;
          color: #374151;
        }

        .modal-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          padding: 0 1.5rem 1rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .modal-meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .modal-category-tag {
          background-color: #dbeafe;
          color: #1e40af;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .modal-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
          margin-bottom: 1.5rem;
        }

        .modal-story {
          padding: 0 1.5rem 1.5rem;
        }

        .modal-paragraph {
          margin-bottom: 1rem;
          line-height: 1.7;
          color: #374151;
          font-size: 1rem;
        }

        .modal-paragraph:last-child {
          margin-bottom: 0;
        }

        /* Responsive modal */
        @media (max-width: 768px) {
          .modal-overlay {
            padding: 0.5rem;
          }

          .modal-content {
            max-height: 95vh;
          }

          .modal-header {
            padding: 1rem;
          }

          .modal-title {
            font-size: 1.25rem;
          }

          .modal-meta {
            padding: 0 1rem 1rem;
            gap: 0.5rem;
          }

          .modal-story {
            padding: 0 1rem 1rem;
          }

          .modal-image {
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default NewsPage;