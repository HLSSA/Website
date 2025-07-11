import React, { useState, useEffect, useCallback } from 'react';
import { Globe, Home, Search, Calendar, Clock, User, ChevronRight, Loader2 } from 'lucide-react';
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

// News Modal Component
interface NewsModalProps {
  article: NewsArticle | null;
  isOpen: boolean;
  onClose: () => void;
}

const NewsModal: React.FC<NewsModalProps> = ({ article, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'academy':
        return '#FDE350';
      case 'tournament':
        return '#53A548';
      case 'player':
        return '#FF6B6B';
      case 'team':
        return '#4A90E2';
      case 'community':
        return '#9B59B6';
      case 'training':
        return '#E74C3C';
      case 'football':
        return '#2ECC71';
      default:
        return '#FDE350';
    }
  };

  if (!isOpen || !article) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px',
        overflowY: 'auto'
      }}
    >
      <div 
        className="modal-content"
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        <button 
          className="modal-close" 
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            zIndex: 10,
            color: '#666',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="modal-body" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-info">
              <div 
                className="modal-category" 
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  marginBottom: '16px',
                  backgroundColor: getCategoryColor(article.category)
                }}
              >
                {article.category}
              </div>
              
              <h2 className="modal-title" style={{ fontSize: '24px', margin: '0 0 16px 0', color: '#1A1B25' }}>
                {article.title}
              </h2>
              
              <div 
                className="modal-meta"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginBottom: '24px',
                  fontSize: '14px',
                  color: '#666'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={16} /> {article.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={16} /> {article.time}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={16} /> {article.author}
                </span>
              </div>
              
              <div 
                className="modal-description" 
                style={{ 
                  color: '#4A4A4A',
                  lineHeight: 1.6,
                  fontSize: '16px'
                }}
              >
                {article.story.split('\n').map((paragraph, index) => (
                  <p key={index} style={{ margin: '0 0 16px 0' }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

      // Use Guardian API only
      const guardianUrl = `https://content.guardianapis.com/search?q=football&from-date=${fromDate}&order-by=relevance&show-fields=thumbnail,trailText&page-size=${newsPerPage}&api-key=test`;

      const response = await fetch(guardianUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news from Guardian API');
      }

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
            article_url: article.webUrl, // Direct Guardian URL
            story: '', // API news doesn't have story content
            image: article.fields?.thumbnail || 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop',
            featured: false
          };
        });

        setApiNews(formattedNews);
        setTotalPages(Math.ceil(formattedNews.length / newsPerPage));
        console.log(`Loaded ${formattedNews.length} articles from Guardian`);
      } else {
        throw new Error('No articles found in Guardian API response');
      }
    } catch (err) {
      console.error('Guardian API failed:', err);
      setApiError('Unable to load international news at the moment. Please try again later.');
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
    
    console.log('Read more clicked for:', article.title);
    console.log('Article URL:', article.article_url);
    console.log('Article story:', article.story);
    
    // For international news: always redirect to article URL
    if (activeSection === 'news' && article.article_url) {
      window.open(article.article_url, '_blank');
      return;
    }
    
    // For HLSSA news: check if URL exists, if yes redirect, otherwise show modal
    if (activeSection === 'hlssa') {
      // If article has a URL from the database, redirect to it
      if (article.article_url && article.article_url.trim() !== '' && article.article_url !== '#') {
        // If URL doesn't have protocol, add https://
        let url = article.article_url.trim();
        if (!/^https?:\/\//i.test(url)) {
          url = 'https://' + url;
        }
        // Open in new tab for external URLs
        window.open(url, '_blank');
        return;
      }
      
      // If article has story content, show modal
      if (article.story && article.story.trim() !== '') {
        console.log('Opening modal for article:', article.title);
        setSelectedArticle(article);
        setIsModalOpen(true);
        return;
      }
    }
    
    // Fallback: if no URL or story, try ID-based URL
    if (article.id) {
      window.location.href = `/news/${article.id}`;
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

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
            <div className="header-badge">
              🏆 Champions Updates
            </div>
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
              : 'Fetching trending stories from The Guardian'
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
          <div className="header-badge">
            🏆 Champions Updates
          </div>
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
                  From The Guardian • Past 30 days • Sorted by relevance
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
                        // For international news, always redirect to URL
                        if (activeSection === 'news' && article.article_url) {
                          window.open(article.article_url, '_blank');
                        }
                        // For HLSSA news, check URL first, then story
                        else if (activeSection === 'hlssa') {
                          if (article.article_url && article.article_url !== '#' && article.article_url !== '') {
                            let url = article.article_url.trim();
                            if (!/^https?:\/\//i.test(url)) {
                              url = 'https://' + url;
                            }
                            window.open(url, '_blank');
                          } else if (article.story && article.story.trim() !== '') {
                            setSelectedArticle(article);
                            setIsModalOpen(true);
                          }
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
                        <button 
                          onClick={(e) => handleReadMore(article, e)}
                          className="read-more-button"
                        >
                          Read Full Story <ChevronRight size={18} />
                        </button>
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

      {/* News Modal */}
      <NewsModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

    </div>
  );
};

export default NewsPage;