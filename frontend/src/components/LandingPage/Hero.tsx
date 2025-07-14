import { Play, Star, Award, Users } from 'lucide-react';
import styled from 'styled-components';

const Hero = () => {
  return (
    <StyledWrapper>
      <section id="home" className="hero-section">
        {/* Background Pattern */}
        <div className="background-pattern">
          <div className="pattern-overlay" />
        </div>

        {/* Hero Background Image */}
        <div className="hero-background">
          <img 
            src="https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
            alt="Soccer training"
            className="hero-bg-image"
          />
        </div>

        <div className="hero-container">
          <div className="hero-grid">
            {/* Hero Content */}
            <div className="hero-content">
              <div className="hero-badge-container">
                <span className="hero-badge">
                  Hyderabad's Premier Soccer Academy
                </span>
              </div>
              
              <h1 className="hero-title">
                <span className="title-gradient-title">Forge Your </span>
                <span className="title-accent">Legacy.</span>
                <span className="title-gradient">
                  Join the Champions.
                </span>
              </h1>
              
              <p className="hero-description">
                Professional UEFA & AFC Certified Coaching for Aspiring Players Ages 5-18. 
                Transform passion into excellence with Hyderabad's most trusted soccer academy.
              </p>

              <div className="hero-buttons">
                <button className="btn-primary">
                  Join a Free Trial Class
                </button>
                <button className="btn-secondary">
                  <Play className="play-icon" />
                  <span>Watch Our Story</span>
                </button>
              </div>

              {/* Stats */}
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Students Trained</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">15+</div>
                  <div className="stat-label">Expert Coaches</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">10+</div>
                  <div className="stat-label">Years Experience</div>
                </div>
              </div>
            </div>

            {/* Hero Visual Elements */}
            <div className="hero-visual">
              <div className="visual-container">
                {/* Floating Cards */}
                <div className="floating-card card-1">
                  <div className="card-content">
                    <div className="card-icon card-icon-green">
                      <Award className="icon" />
                    </div>
                    <div className="card-text">
                      <div className="card-title">Championship</div>
                      <div className="card-subtitle">U-16 Winners 2024</div>
                    </div>
                  </div>
                </div>

                <div className="floating-star">
                  <Star className="star-icon" />
                </div>

                <div className="floating-card card-2">
                  <div className="card-content">
                    <div className="card-icon card-icon-blue">
                      <Users className="icon" />
                    </div>
                    <div className="card-text">
                      <div className="card-title">Community</div>
                      <div className="card-subtitle">Growing Strong</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-content">
            <div className="scroll-mouse">
              <div className="scroll-dot"></div>
            </div>
            <span className="scroll-text">Scroll to explore</span>
          </div>
        </div>
      </section>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* ===========================================
     KEYFRAMES & ANIMATIONS
  =========================================== */
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes float-delayed {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-15px);
    }
  }

  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
      transform: translate(-50%, 0);
    }
    40%, 43% {
      transform: translate(-50%, -10px);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  /* ===========================================
     HERO SECTION BASE
  =========================================== */
  .hero-section {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(to bottom right, #1e3a8a, #1e40af, #1d4ed8);
    overflow: hidden;
  }

  /* ===========================================
     BACKGROUND ELEMENTS
  =========================================== */
  .background-pattern {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.1;
    z-index: 1;
  }

  .pattern-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 2;
  }

  .hero-bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(3px);
    transform: scale(1.1);
  }

  /* ===========================================
     MAIN CONTAINER & GRID
  =========================================== */
  .hero-container {
    position: relative;
    z-index: 10;
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem 1rem;
    width: 100%;
  }

  .hero-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    align-items: center;
    min-height: 80vh;
  }

  /* ===========================================
     HERO CONTENT
  =========================================== */
  .hero-content {
    color: white;
    text-align: center;
    max-width: 100%;
  }

  .hero-badge-container {
    margin-bottom: 1.5rem;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: #facc15;
    color: #1e3a8a;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    white-space: nowrap;
  }

  /* ===========================================
     TITLE STYLING
  =========================================== */
  .hero-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    line-height: 1.1;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  }

  .title-gradient-title {
    background: linear-gradient(to right, rgb(255, 255, 255), rgb(255, 255, 255));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: none;
  }

  .title-accent {
    color: #facc15;
    display: block;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }

  .title-gradient {
    background: linear-gradient(to right, #facc15, #fde047);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: none;
  }

  /* ===========================================
     DESCRIPTION & BUTTONS
  =========================================== */
  .hero-description {
    font-size: 1.125rem;
    color: #f1f5f9;
    margin-bottom: 2rem;
    max-width: 32rem;
    line-height: 1.75;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
    margin-left: auto;
    margin-right: auto;
  }

  .hero-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 3rem;
    align-items: center;
  }

  .btn-primary,
  .btn-secondary {
    padding: 1rem 2rem;
    border-radius: 9999px;
    font-weight: bold;
    font-size: 1.125rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    width: 100%;
    max-width: 280px;
  }

  .btn-primary {
    background-color: #facc15;
    color: #1e3a8a;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  }

  .btn-primary:hover {
    background-color: #fde047;
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  }

  .btn-secondary {
    border: 2px solid rgba(255, 255, 255, 0.9);
    color: white;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  }

  .btn-secondary:hover {
    background-color: white;
    color: #1e3a8a;
    border-color: white;
    transform: translateY(-2px);
  }

  .play-icon {
    width: 20px;
    height: 20px;
  }

  /* ===========================================
     STATS SECTION
  =========================================== */
  .hero-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .stat-item {
    text-align: center;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    padding: 1.25rem 1rem;
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
  }

  .stat-item:hover {
    transform: translateY(-5px);
  }

  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #facc15;
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }

  .stat-label {
    color: #f1f5f9;
    font-size: 0.875rem;
    font-weight: 500;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  }

  /* ===========================================
     VISUAL ELEMENTS
  =========================================== */
  .hero-visual {
    position: relative;
    display: none;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }

  .visual-container {
    position: relative;
    width: 300px;
    height: 300px;
  }

  .floating-card {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    padding: 1.25rem;
    border-radius: 1.25rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.3);
    z-index: 5;
  }

  .card-1 {
    top: 0;
    left: -2rem;
    animation: float 3s ease-in-out infinite;
  }

  .card-2 {
    bottom: 0;
    right: -2rem;
    animation: float-delayed 3s ease-in-out infinite;
    animation-delay: 0.5s;
  }

  .card-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
  }

  .card-icon-green {
    background-color: #10b981;
  }

  .card-icon-blue {
    background-color: #3b82f6;
  }

  .icon {
    width: 24px;
    height: 24px;
    color: white;
  }

  .card-text {
    min-width: 0;
  }

  .card-title {
    font-weight: bold;
    color: #111827;
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .card-subtitle {
    color: #6b7280;
    font-size: 0.875rem;
  }

  .floating-star {
    position: absolute;
    top: 50%;
    right: -2rem;
    transform: translateY(-50%);
    background-color: #facc15;
    padding: 1.25rem;
    border-radius: 1.25rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    animation: pulse 2s ease-in-out infinite;
    border: 2px solid rgba(255, 255, 255, 0.3);
    z-index: 5;
  }

  .star-icon {
    width: 32px;
    height: 32px;
    color: #1e3a8a;
  }

  /* ===========================================
     SCROLL INDICATOR
  =========================================== */
  .scroll-indicator {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    animation: bounce 2s infinite;
    z-index: 10;
  }

  .scroll-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .scroll-mouse {
    width: 24px;
    height: 40px;
    border: 2px solid rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    display: flex;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
  }

  .scroll-dot {
    width: 4px;
    height: 12px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 2px;
    margin-top: 8px;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .scroll-text {
    font-size: 0.875rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  }

  /* ===========================================
     RESPONSIVE DESIGN
  =========================================== */
  
  /* Small screens (sm) */
  @media (min-width: 640px) {
    .hero-container {
      padding: 3rem 1.5rem;
    }
    
    .hero-buttons {
      flex-direction: row;
      justify-content: center;
    }
    
    .btn-primary,
    .btn-secondary {
      width: auto;
      min-width: 200px;
    }
    
    .hero-description {
      font-size: 1.25rem;
    }
    
    .hero-title {
      font-size: 3rem;
    }
    
    .hero-stats {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
  }

  /* Medium screens (md) */
  @media (min-width: 768px) {
    .hero-title {
      font-size: 3.5rem;
    }
    
    .hero-content {
      text-align: left;
    }
    
    .hero-description {
      margin-left: 0;
      margin-right: 0;
    }
    
    .hero-buttons {
      justify-content: flex-start;
    }
    
    .hero-stats {
      margin: 0;
    }
  }

  /* Large screens (lg) */
  @media (min-width: 1024px) {
    .hero-container {
      padding: 0rem 2rem;
    }
    
    .hero-grid {
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
    }
    
    .hero-title {
      font-size: 4rem;
    }
    
    .hero-visual {
      display: flex;
    }
    
    .hero-content {
      text-align: left;
    }
    
    .visual-container {
      width: 400px;
      height: 400px;
    }
  }

  /* Extra large screens (xl) */
  @media (min-width: 1280px) {
    .hero-title {
      font-size: 4.5rem;
    }
    
    .hero-description {
      font-size: 1.375rem;
    }
    
    .visual-container {
      width: 500px;
      height: 500px;
    }
  }

  /* ===========================================
     ACCESSIBILITY & INTERACTIONS
  =========================================== */
  @media (prefers-reduced-motion: reduce) {
    .floating-card,
    .floating-star,
    .scroll-indicator,
    .scroll-dot {
      animation: none;
    }
    
    .btn-primary:hover,
    .btn-secondary:hover,
    .stat-item:hover {
      transform: none;
    }
  }

  /* Focus states */
  .btn-primary:focus,
  .btn-secondary:focus {
    outline: 2px solid #facc15;
    outline-offset: 2px;
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .hero-badge {
      border: 2px solid #1e3a8a;
    }
    
    .floating-card {
      border: 2px solid #333;
    }
    
    .btn-primary,
    .btn-secondary {
      border: 2px solid currentColor;
    }
  }
`;

export default Hero;