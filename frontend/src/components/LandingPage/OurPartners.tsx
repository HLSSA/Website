import React from 'react';
import usePartners from '../../hooks/usePartners';
import './styles/OurPartners.css';

const OurPartners = () => {
  const { partners, loading, error } = usePartners(null);

  // Create multiple copies of partners for seamless infinite scroll
  const createInfinitePartners = (items: typeof partners, copies = 4) => {
    if (items.length === 0) return [];
    return Array(copies).fill(0).flatMap(() => [...items]);
  };
  
  const infinitePartners = createInfinitePartners(partners);

  // Loading state
  if (loading) {
    return (
      <div>
        <section className="partners-section">
          <div className="container">
            <div className="header">
              <h2 className="main-title">Our Partners</h2>
              <p className="subtitle">Loading our valued partners...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <section className="partners-section">
          <div className="container">
            <div className="header">
              <h2 className="main-title">Our Partners</h2>
              <p className="subtitle">
                Unable to load partners at the moment. Please try again later.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="partners-section">
        <div className="container">
          <div className="header">
            <h2 className="main-title">Our Partners</h2>
            <p className="subtitle">
              Collaborating with industry leaders to provide the best football experience
            </p>
          </div>

          <div className="slideshow-container">
            <div className="partners-slideshow">
              {infinitePartners.map((partner, index) => (
                <div 
                  key={`${partner.id}-${index}`} 
                  className="partner-card"
                  style={{
                    flex: '0 0 auto',
                    width: '300px',
                    marginRight: '32px',
                    scrollSnapAlign: 'start' as const
                  }}
                >
                  <div className="logo-container">
                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="partner-logo"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="partner-info">
                    <h3 className="partner-name">{partner.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partnership Benefits */}
          <div className="benefits-section">
            <div className="benefits-header">
              <h3 className="benefits-title">Partnership Benefits</h3>
              <p className="benefits-subtitle">
                Our partnerships enable us to provide world-class facilities and opportunities
              </p>
            </div>
            
            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-icon facilities">
                  <span>🏟️</span>
                </div>
                <h4 className="benefit-title">Premium Facilities</h4>
                <p className="benefit-description">Access to state-of-the-art training grounds and equipment</p>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon opportunities">
                  <span>🎯</span>
                </div>
                <h4 className="benefit-title">Professional Opportunities</h4>
                <p className="benefit-description">Direct pathways to professional clubs and trials</p>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon tournaments">
                  <span>🏆</span>
                </div>
                <h4 className="benefit-title">Tournament Access</h4>
                <p className="benefit-description">Participation in high-level competitions and leagues</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default OurPartners;