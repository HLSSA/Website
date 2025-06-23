import React, { useState, useEffect, useCallback } from 'react';
import { Globe, Home, Search, Calendar, Clock, User, ChevronRight, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// News article type for the application
interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  time: string;
  author: string;
  category: string;
  url?: string;
  image: string;
  featured?: boolean;
}

const NewsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hlssa');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [apiNews, setApiNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const newsPerPage = 20;

  const adminNews: NewsArticle[] = [
    {
      id: '1',
      title: "HLSSA Academy Champions League Victory",
      excerpt: "Our U-18 team secured a magnificent 3-1 victory in the regional championship final, showcasing exceptional teamwork and skill.",
      date: "2025-06-20",
      time: "18:30",
      author: "Coach Martinez",
      category: "Academy",
      featured: true,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop"
    },
    {
      id: '2',
      title: "New Training Facilities Inaugurated",
      excerpt: "State-of-the-art training facilities have been officially opened, featuring modern equipment and enhanced safety measures.",
      date: "2025-06-18",
      time: "14:00",
      author: "Director Johnson",
      category: "Facilities",
      featured: false,
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop"
    },
    {
      id: '3',
      title: "Summer Camp Registration Now Open",
      excerpt: "Registration for our intensive summer football camp is now open for ages 8-16. Limited spots available.",
      date: "2025-06-15",
      time: "10:00",
      author: "Admin Team",
      category: "Programs",
      featured: false,
      image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=250&fit=crop"
    },
    {
      id: '4',
      title: "Alumni Success Story: Pro Contract",
      excerpt: "Former HLSSA student Ahmed Hassan signs professional contract with Premier League club.",
      date: "2025-06-12",
      time: "16:45",
      author: "Media Team",
      category: "Alumni",
      featured: false,
      image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&h=250&fit=crop"
    },
    {
      id: '5',
      title: "Community Outreach Program Launch",
      excerpt: "HLSSA Academy launches community football program to support underprivileged youth in local neighborhoods.",
      date: "2025-06-10",
      time: "11:20",
      author: "Community Team",
      category: "Community",
      featured: false,
      image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&h=250&fit=crop"
    }
  ];

  const fetchApiNews = useCallback(async (page = 1): Promise<void> => {
    setLoading(true);
    setError(null);

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
        'bundesliga'
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

      // If both APIs fail, use mock data
      if (allNews.length === 0) {
        const mockNews: NewsArticle[] = [
          {
            id: 'mock-1',
            title: "Indian National Football Team Prepares for Asian Cup Qualifiers",
            excerpt: "The Blue Tigers are intensifying their training sessions ahead of the crucial Asian Cup qualifying matches scheduled for next month.",
            date: "2025-06-22",
            time: "14:30",
            author: "Sports Desk",
            category: "Indian Football",
            url: "#",
            image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop",
            featured: false
          },
          {
            id: 'mock-2',
            title: "ISL 2025 Season Set to Begin with Record Number of Teams",
            excerpt: "The Indian Super League is expanding with 12 teams competing in the upcoming season, promising more exciting football action.",
            date: "2025-06-21",
            time: "12:15",
            author: "ISL Media",
            category: "Indian Football",
            url: "#",
            image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop",
            featured: false
          },
          {
            id: 'mock-3',
            title: "Premier League Transfer Window: Major Signings Expected",
            excerpt: "Several top clubs are preparing substantial offers for world-class players as the summer transfer window approaches.",
            date: "2025-06-20",
            time: "16:45",
            author: "Transfer News",
            category: "International",
            url: "#",
            image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&h=250&fit=crop",
            featured: false
          },
          {
            id: 'mock-4',
            title: "Champions League Final Preparations Underway",
            excerpt: "Both teams are making final preparations for what promises to be an epic Champions League final showdown.",
            date: "2025-06-19",
            time: "18:00",
            author: "UEFA Media",
            category: "International",
            url: "#",
            image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=250&fit=crop",
            featured: false
          },
          {
            id: 'mock-5',
            title: "Women's Football in India Gains Momentum",
            excerpt: "The Indian women's football team continues to make strides with improved infrastructure and growing support base.",
            date: "2025-06-18",
            time: "11:30",
            author: "Women's Football Desk",
            category: "Indian Football",
            url: "#",
            image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&h=250&fit=crop",
            featured: false
          }
        ];
        allNews.push(...mockNews);
      }

      // Remove duplicates and sort by date
      const uniqueNews = allNews.filter((article, index, self) =>
        index === self.findIndex(a => a.title === article.title)
      ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setApiNews(uniqueNews);
      setTotalPages(Math.ceil(uniqueNews.length / newsPerPage));

      console.log(`Loaded ${uniqueNews.length} articles`);
    } catch (err) {
      console.error('All APIs failed:', err);
      setError('Unable to load news at the moment. Please try again later.');
      setApiNews([]);
    } finally {
      setLoading(false);
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

  const getCurrentNews = useCallback((): NewsArticle[] => {
    const newsList = activeSection === 'hlssa' ? adminNews : apiNews;
    if (!searchTerm.trim()) return newsList;

    const term = searchTerm.toLowerCase();
    return newsList.filter(article =>
      article.title.toLowerCase().includes(term) ||
      article.excerpt.toLowerCase().includes(term)
    );
  }, [activeSection, adminNews, apiNews, searchTerm]);

  const currentNews = getCurrentNews();
  const featuredArticle = currentNews.find(article => article.featured) || null;

  if (loading) {
    return (
      <div className="page">
        <style>{`
          .page {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            min-height: 100vh;
            margin: 0;
            padding: 0;
          }
          .header {
            background: linear-gradient(135deg, #1256C4 0%, #53A548 100%);
            color: white;
            padding: 2rem 0;
            text-align: center;
          }
          .header-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
          }
          .title {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }
          .subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
          }
          .loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 50vh;
            gap: 1rem;
            font-size: 1.2rem;
            color: #1256C4;
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

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
          <p>Loading latest football news...</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
            Fetching trending stories from the past 30 days
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <style>{`
        .page {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
          min-height: 100vh;
          margin: 0;
          padding: 0;
        }
        .header {
          background: linear-gradient(135deg, #1256C4 0%, #53A548 100%);
          color: white;
          padding: 2rem 0;
          text-align: center;
          margin-top: 93px;
        }
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        .subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
        }
        .navigation {
          background: white;
          padding: 1rem 0;
          border-bottom: 2px solid #FDE350;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: center;
          gap: 2rem;
        }
        .nav-button {
          padding: 0.75rem 2rem;
          border: 2px solid #1256C4;
          border-radius: 25px;
          background: white;
          color: #1256C4;
          cursor: pointer;
          font-weight: bold;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }
        .nav-button:hover {
          background: #f0f0f0;
        }
        .nav-button.active {
          background: #1256C4;
          color: white;
        }
        .search-section {
          padding: 2rem 0;
          background: white;
        }
        .search-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .search-container {
          position: relative;
          max-width: 400px;
          margin: 0 auto;
        }
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid #1256C4;
          border-radius: 25px;
          font-size: 1rem;
          outline: none;
          box-sizing: border-box;
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #1256C4;
        }
        .featured-section {
          padding: 2rem 0;
          background: #f9f9f9;
        }
        .featured-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .section-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 2rem;
          color: #1256C4;
        }
        .featured-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        .featured-image {
          width: 100%;
          height: 300px;
          border-radius: 10px;
          object-fit: cover;
        }
        .featured-badge {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .featured-label {
          background: #FF6B6B;
          color: white;
          padding: 0.3rem 1rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        .category-tag {
          background: #FDE350;
          color: #333;
          padding: 0.3rem 1rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        .featured-title {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #333;
        }
        .featured-excerpt {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          color: #666;
        }
        .meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
          font-size: 0.9rem;
        }
        .read-more-button {
          background: #1256C4;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: bold;
        }
        .news-section {
          padding: 3rem 0;
          background: #f5f5f5;
        }
        .news-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .results-count {
          color: #666;
          font-size: 1rem;
        }
        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }
        .news-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        .news-card:hover {
          transform: translateY(-5px);
        }
        .news-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .news-content-div {
          padding: 1.5rem;
        }
        .news-title {
          font-size: 1.3rem;
          font-weight: bold;
          margin-bottom: 0.75rem;
          color: #333;
        }
        .news-excerpt {
          color: #666;
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        .news-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.85rem;
          color: #666;
        }
        .news-meta-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .read-more-link {
          color: #1256C4;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }
        .page-button {
          padding: 0.5rem 1rem;
          border: 2px solid #1256C4;
          border-radius: 5px;
          background: white;
          color: #1256C4;
          cursor: pointer;
          font-weight: bold;
        }
        .page-button:hover {
          background: #1256C4;
          color: white;
        }
        .page-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .page-info {
          color: #666;
          font-size: 0.9rem;
        }
        .error {
          text-align: center;
          padding: 3rem;
          font-size: 1.2rem;
          color: #FF6B6B;
          background: #FFE5E5;
          border-radius: 10px;
          margin: 2rem 0;
        }
        .retry-button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background-color: #1256C4;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .no-results {
          text-align: center;
          padding: 3rem;
          color: #666;
        }
        @media (max-width: 768px) {
          .featured-card {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .nav-content {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>

      <Header />

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
                <button className="read-more-button">
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
            </div>
          </div>

          {error && (
            <div className="error">
              <h3 style={{ marginTop: 0, color: '#FF6B6B' }}>Failed to Load News</h3>
              <p>{error}</p>
              <button
                onClick={() => fetchApiNews(currentPage)}
                className="retry-button"
              >
                Retry Loading News
              </button>
            </div>
          )}

          {!error && (
            <>
              {currentNews.length === 0 ? (
                <div className="no-results">
                  <p>No articles found matching your search criteria.</p>
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
                        if (article.url && article.url !== '#') {
                          window.open(article.url, '_blank');
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
                        <button className="read-more-button">
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
      <Footer />
    </div>
  );
};

export default NewsPage;
