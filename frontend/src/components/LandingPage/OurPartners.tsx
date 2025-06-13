import React from 'react';
import styled from 'styled-components';

const OurPartners = () => {
  const partners = [
    {
      name: "Telangana State Football Association",
      logo: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop",
      category: "Official Partner"
    },
    {
      name: "Indian Football Academy",
      logo: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop",
      category: "Training Partner"
    },
    {
      name: "Decathlon Sports",
      logo: "https://images.pexels.com/photos/262004/pexels-photo-262004.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop",
      category: "Equipment Partner"
    },
    {
      name: "SportZ Academy",
      logo: "https://images.pexels.com/photos/159515/football-american-football-runner-player-159515.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop",
      category: "Media Partner"
    },
    {
      name: "HYVE Sports",
      logo: "https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop",
      category: "Facility Partner"
    },
    {
      name: "United Football Academy",
      logo: "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop",
      category: "Development Partner"
    }
  ];

  // Duplicate partners array for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners];

  return (
    <StyledWrapper>
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
              {duplicatedPartners.map((partner, index) => (
                <div key={index} className="partner-card">
                  <div className="logo-container">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="partner-logo"
                    />
                  </div>
                  <div className="partner-info">
                    <h3 className="partner-name">{partner.name}</h3>
                    <p className="partner-category">{partner.category}</p>
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
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .partners-section {
    padding: 80px 0;
    background-color: #f9fafb;
  }

  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 16px;
  }

  @media (min-width: 640px) {
    .container {
      padding: 0 24px;
    }
  }

  @media (min-width: 1024px) {
    .container {
      padding: 0 32px;
    }
  }

  /* Header Styles */
  .header {
    text-align: center;
    margin-bottom: 64px;
  }

  .main-title {
    font-size: 2.25rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 16px;
    line-height: 1.2;
  }

  .subtitle {
    font-size: 1.25rem;
    color: #4b5563;
    max-width: 672px;
    margin: 0 auto;
    line-height: 1.6;
  }

  /* Slideshow Container */
  .slideshow-container {
    width: 100%;
    overflow: hidden;
    margin-bottom: 64px;
  }

  /* Partners Slideshow */
  .partners-slideshow {
    display: flex;
    gap: 32px;
    animation: slideLeft 20s linear infinite;
    width: calc((300px + 32px) * 12); /* Width for 12 cards (6 original + 6 duplicated) */
  }

  @keyframes slideLeft {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-50%)); /* Move by half the width to create seamless loop */
    }
  }

  /* Pause animation on hover */
  .slideshow-container:hover .partners-slideshow {
    animation-play-state: paused;
  }

  /* Partner Card - Keeping exact same dimensions */
  .partner-card {
    background-color: white;
    border-radius: 12px;
    padding: 5px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    cursor: pointer;
    width: 300px; /* Keeping exact same width */
    height: 300px; /* Keeping exact same height */
    flex-shrink: 0; /* Prevent cards from shrinking */
  }

  .partner-card:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: translateY(-4px);
  }

  .logo-container {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .partner-logo {
    width: 100%;
    height: 220px;
    object-fit: cover;
    filter: grayscale(100%);
    transition: all 0.3s ease;
  }

  .partner-card:hover .partner-logo {
    filter: grayscale(0%);
  }

  .partner-info {
    text-align: center;
  }

  .partner-name {
    font-weight: 600;
    color: #111827;
    font-size: 0.875rem;
    margin-bottom: 4px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .partner-category {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
  }

  /* Benefits Section */
  .benefits-section {
    background-color: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .benefits-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .benefits-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 16px;
  }

  .benefits-subtitle {
    color: #4b5563;
    margin: 0;
    line-height: 1.6;
  }

  .benefits-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
  }

  @media (min-width: 768px) {
    .benefits-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .benefit-item {
    text-align: center;
  }

  .benefit-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }

  .benefit-icon.facilities {
    background-color: #dbeafe;
  }

  .benefit-icon.opportunities {
    background-color: #dcfce7;
  }

  .benefit-icon.tournaments {
    background-color: #fef3c7;
  }

  .benefit-icon span {
    font-size: 1.5rem;
  }

  .benefit-title {
    font-weight: 600;
    color: #111827;
    margin-bottom: 8px;
    font-size: 1rem;
  }

  .benefit-description {
    color: #4b5563;
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.5;
  }

  /* Responsive adjustments */
  @media (max-width: 767px) {
    .partners-section {
      padding: 60px 0;
    }
    
    .main-title {
      font-size: 1.875rem;
    }
    
    .subtitle {
      font-size: 1.125rem;
    }
    
    .header {
      margin-bottom: 48px;
    }
    
    .slideshow-container {
      margin-bottom: 48px;
    }
    
    .benefits-section {
      padding: 24px;
    }
  }
`;

export default OurPartners;