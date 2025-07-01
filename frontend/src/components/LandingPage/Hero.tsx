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
                🏆 Hyderabad's Premier Soccer Academy
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

/* Hero.css */

/* Keyframes for animations */
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

/* Main hero section */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(to bottom right, #1e3a8a, #1e40af, #1d4ed8);
  overflow: hidden;
}

/* Background pattern */
.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
}

.pattern-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

/* Hero background image */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
}

.hero-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(3px);
  transform: scale(1.1);
}

/* Main container */
.hero-container {
  position: relative;
  z-index: 10;
  max-width: 1280px;
  margin: 0;
  padding: 64px 16px;
}

/* Grid layout */
.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  align-items: center;
}

@media (min-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .hero-container {
    padding: 64px 16px;
  }
}

@media (min-width: 640px) {
  .hero-container {
    padding: 64px 24px;
  }
}

/* Hero content */
.hero-content {
  color: white;
}

.title-gradient-title{
background: linear-gradient(to right,rgb(255, 255, 255),rgb(255, 255, 255));
-webkit-background-clip: text;
background-clip: text;
color: transparent;
text-shadow: none;
}

.hero-badge-container {
  margin-bottom: 24px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #facc15;
  color: #1e3a8a;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}

/* Title styling */
.hero-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 24px;
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 72px;
  }
}

.title-accent {
  color: #facc15;
  display: block;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.title-gradient {
  background: linear-gradient(to right,#facc15,#fde047);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: none;
}

/* Description */
.hero-description {
  font-size: 20px;
  color: #f1f5f9;
  margin-bottom: 32px;
  max-width: 512px;
  line-height: 1.75;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

/* Buttons */
.hero-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 48px;
}

@media (min-width: 640px) {
  .hero-buttons {
    flex-direction: row;
  }
}

.btn-primary {
  background-color: #facc15;
  color: #1e3a8a;
  padding: 16px 32px;
  border-radius: 9999px;
  font-weight: bold;
  font-size: 18px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
}

.btn-primary:hover {
  background-color: #fde047;
  transform: scale(1.05);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  border: 2px solid rgba(255, 255, 255, 0.9);
  color: white;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 16px 32px;
  border-radius: 9999px;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}

.btn-secondary:hover {
  background-color: white;
  color: #1e3a8a;
  border-color: white;
}

.play-icon {
  width: 20px;
  height: 20px;
}

/* Stats */
.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.stat-item {
  text-align: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 20px 16px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #facc15;
  margin-bottom: 8px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.stat-label {
  color: #f1f5f9;
  font-size: 14px;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

/* Hero visual elements */
.hero-visual {
  position: relative;
  display: none;
}

@media (min-width: 1024px) {
  .hero-visual {
    display: block;
  }
}

.visual-container {
  position: relative;
}

/* Floating cards */
.floating-card {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.card-1 {
  top: -16px;
  left: -16px;
  animation: float 3s ease-in-out infinite;
}

.card-2 {
  bottom: -16px;
  right: -16px;
  animation: float-delayed 3s ease-in-out infinite;
  animation-delay: 0.5s;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

.card-title {
  font-weight: bold;
  color: #111827;
  font-size: 16px;
}

.card-subtitle {
  color: #6b7280;
  font-size: 14px;
}

/* Floating star */
.floating-star {
  position: absolute;
  top: 50%;
  right: -32px;
  margin-top: 64px;
  background-color: #facc15;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  animation: pulse 2s ease-in-out infinite;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.star-icon {
  width: 32px;
  height: 32px;
  color: #1e3a8a;
}

/* Scroll indicator */
.scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  animation: bounce 2s infinite;
}

.scroll-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
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
  font-size: 14px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

`;

export default Hero;