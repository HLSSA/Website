import React, { useState } from 'react';
import { Calendar, Clock, User, ChevronRight, Search, Filter } from 'lucide-react';

const NewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const newsArticles = [
    {
      id: 1,
      title: "Championship Final Set for Next Weekend",
      excerpt: "After months of intense competition, the final two teams have emerged to battle for the championship title.",
      category: "match",
      date: "2025-06-17",
      time: "14:30",
      author: "John Smith",
      image: "/api/placeholder/400/250",
      featured: true
    },
    {
      id: 2,
      title: "New Star Player Joins the Elite Squad",
      excerpt: "The team announces the signing of a promising young talent from the youth academy.",
      category: "transfers",
      date: "2025-06-16",
      time: "10:15",
      author: "Sarah Johnson",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 3,
      title: "Training Camp Updates: Intensive Preparation",
      excerpt: "Players are pushing their limits in preparation for the upcoming season with new training techniques.",
      category: "training",
      date: "2025-06-15",
      time: "16:45",
      author: "Mike Wilson",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 4,
      title: "Victory Against Rivals Secures Top Position",
      excerpt: "A thrilling 3-2 victory in the derby match puts the team at the top of the league table.",
      category: "match",
      date: "2025-06-14",
      time: "20:00",
      author: "Emma Davis",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 5,
      title: "Youth Academy Produces Another Prospect",
      excerpt: "The academy continues its excellent work with another player making it to the senior team.",
      category: "academy",
      date: "2025-06-13",
      time: "11:30",
      author: "Alex Rodriguez",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 6,
      title: "Stadium Renovation Plans Unveiled",
      excerpt: "The club announces major renovation plans to enhance fan experience and modernize facilities.",
      category: "club",
      date: "2025-06-12",
      time: "09:00",
      author: "Lisa Chen",
      image: "/api/placeholder/400/250",
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All News', count: newsArticles.length },
    { id: 'match', name: 'Matches', count: newsArticles.filter(n => n.category === 'match').length },
    { id: 'transfers', name: 'Transfers', count: newsArticles.filter(n => n.category === 'transfers').length },
    { id: 'training', name: 'Training', count: newsArticles.filter(n => n.category === 'training').length },
    { id: 'academy', name: 'Academy', count: newsArticles.filter(n => n.category === 'academy').length },
    { id: 'club', name: 'Club News', count: newsArticles.filter(n => n.category === 'club').length }
  ];

  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = newsArticles.find(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
      {/* Header */}
      <header style={{ 
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', 
        color: 'white', 
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>BELLA</h1>
            <nav style={{ display: 'flex', gap: '2rem', marginLeft: '2rem' }}>
              <a href="#" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>Home</a>
              <a href="#" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold', borderBottom: '2px solid #ffd700' }}>News</a>
              <a href="#" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>Matches</a>
              <a href="#" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>Team</a>
              <a href="#" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>Training</a>
            </nav>
          </div>
          <button style={{ 
            background: '#ffd700', 
            color: '#1e3c72', 
            border: 'none', 
            padding: '0.5rem 1.5rem', 
            borderRadius: '25px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Join Now
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            Latest News & Updates
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
            Stay updated with the latest news, match results, and team updates from the world of champions
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section style={{ padding: '2rem 0', background: '#f8f9fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              <div style={{ position: 'relative', maxWidth: '300px', flex: 1 }}>
                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    border: '1px solid #ddd',
                    borderRadius: '25px',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={20} style={{ color: '#666' }} />
              <span style={{ fontSize: '0.9rem', color: '#666' }}>Filter by category</span>
            </div>
          </div>

          {/* Category Filters */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: '0.5rem 1.5rem',
                  border: '2px solid #2a5298',
                  borderRadius: '25px',
                  background: selectedCategory === category.id ? '#2a5298' : 'white',
                  color: selectedCategory === category.id ? 'white' : '#2a5298',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && selectedCategory === 'all' && (
        <section style={{ padding: '2rem 0', background: 'white' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#2a5298' }}>Featured News</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '3rem', 
              alignItems: 'center',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderRadius: '15px',
              padding: '2rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <span style={{ 
                    background: '#ffd700', 
                    color: '#1e3c72', 
                    padding: '0.3rem 1rem', 
                    borderRadius: '15px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    Featured
                  </span>
                  <span style={{ 
                    background: '#2a5298', 
                    color: 'white', 
                    padding: '0.3rem 1rem', 
                    borderRadius: '15px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {featuredArticle.category}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1e3c72' }}>
                  {featuredArticle.title}
                </h3>
                <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1.5rem', lineHeight: '1.8' }}>
                  {featuredArticle.excerpt}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} />
                    <span>{featuredArticle.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} />
                    <span>{featuredArticle.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={16} />
                    <span>{featuredArticle.author}</span>
                  </div>
                </div>
                <button style={{
                  background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '25px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem'
                }}>
                  Read Full Story
                  <ChevronRight size={18} />
                </button>
              </div>
              <div style={{ 
                background: '#2a5298', 
                borderRadius: '15px', 
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}>
                Featured Image
              </div>
            </div>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section style={{ padding: '3rem 0', background: '#f8f9fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2a5298' }}>
              {selectedCategory === 'all' ? 'All News' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <span style={{ color: '#666', fontSize: '1rem' }}>
              {filteredArticles.length} articles found
            </span>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '2rem' 
          }}>
            {regularArticles.map(article => (
              <article key={article.id} style={{
                background: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
              }}>
                <div style={{ 
                  background: '#2a5298', 
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}>
                  News Image
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <span style={{ 
                      background: '#e9ecef', 
                      color: '#2a5298', 
                      padding: '0.3rem 1rem', 
                      borderRadius: '15px', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {article.category}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1e3c72', lineHeight: '1.4' }}>
                    {article.title}
                  </h3>
                  <p style={{ fontSize: '1rem', color: '#666', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    {article.excerpt}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#666' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={14} />
                        <span>{article.date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <User size={14} />
                        <span>{article.author}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: '#2a5298' }} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No articles found matching your criteria.</p>
              <p>Try adjusting your search or filter settings.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section style={{ padding: '3rem 0', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Stay Updated</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
            Subscribe to our newsletter and never miss the latest news and updates
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: 'none',
                borderRadius: '25px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <button style={{
              background: '#ffd700',
              color: '#1e3c72',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '25px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a1a1a', color: 'white', padding: '3rem 0 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>BELLA</h3>
              <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
                Join the champions and forge your legacy on the field. Excellence in training, passion in play.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>About Us</a>
                <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Training Programs</a>
                <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Match Schedule</a>
                <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Contact</a>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Contact Info</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: 0.8 }}>
                <p>123 Champions Lane</p>
                <p>Sports City, SC 12345</p>
                <p>Phone: (555) 123-4567</p>
                <p>Email: info@bella-sports.com</p>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #333', paddingTop: '1rem', textAlign: 'center', opacity: 0.8 }}>
            <p>&copy; 2025 BELLA Sports Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewsPage;