import React, { useState, useEffect } from 'react';
import { Play, Award, Globe, Brain, Trophy, Users, Target, Star, ChevronDown, ChevronRight } from 'lucide-react';
import styled from 'styled-components';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: string;
}

interface Opportunity {
  title: string;
  description: string;
  logos: string[];
  color: string;
}

const AboutUs: React.FC = () => {
  const [activeTimeline, setActiveTimeline] = useState<number>(0);
  const [showFounderBio, setShowFounderBio] = useState<boolean>(false);

  const timelineEvents: TimelineEvent[] = [
    {
      year: "2015",
      title: "The Dream Begins",
      description: "Mohammed Faiz Khan founded HLSSA with a vision to revolutionize youth football in Hyderabad, starting with just 15 passionate young players.",
      icon: "🌟"
    },
    {
      year: "2018",
      title: "First Major Victory",
      description: "Our U-14 team clinched their first major tournament, marking the beginning of our championship legacy and proving our training methodology.",
      icon: "🏆"
    },
    {
      year: "2020",
      title: "UEFA Standards Adopted",
      description: "Introduced UEFA-standard curriculum and AFC-certified coaching methods, elevating our training to international standards.",
      icon: "⚽"
    },
    {
      year: "2022",
      title: "Expansion & Growth",
      description: "Expanded to multiple training centers across Hyderabad, accommodating over 300 active players with state-of-the-art facilities.",
      icon: "🏟️"
    },
    {
      year: "2024",
      title: "500+ Champions Strong",
      description: "Reached a milestone of 500+ active players with 50+ alumni playing in professional clubs and state teams across India.",
      icon: "👥"
    }
  ];

  const opportunities: Opportunity[] = [
    {
      title: "Professional Club Trials",
      description: "Direct pathways to trials with Bengaluru FC, Hyderabad FC, and other ISL clubs",
      logos: ["https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop"],
      color: "blue-gradient"
    },
    {
      title: "Educational Scholarships",
      description: "Sports scholarships to premier educational institutions across India",
      logos: ["https://images.pexels.com/photos/159515/football-american-football-runner-player-159515.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop"],
      color: "green-gradient"
    },
    {
      title: "State Team Selection",
      description: "Regular selections for Telangana State teams across all age categories",
      logos: ["https://images.pexels.com/photos/262004/pexels-photo-262004.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop"],
      color: "yellow-gradient"
    }
  ];

  useEffect(() => {
    const handleScroll = (): void => {
      const timelineElements = document.querySelectorAll('.timeline-item');
      timelineElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          setActiveTimeline(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <StyledWrapper>
    <div className="about-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <img 
            src="https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
            alt="Coach inspiring young players"
          />
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            🏆 More Than an Academy
          </div>
          
          <h1 className="hero-title">
            Crafting Hyderabad's
            <span className="highlight">Football Future,</span>
            <span className="gradient-text">
              One Player at a Time.
            </span>
          </h1>
          
          <p className="hero-description">
            Since 2015, we've been the nurturing ground for aspiring athletes, transforming raw talent into 
            championship-caliber players through holistic development, world-class coaching, and unwavering dedication.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary">
              Discover Our Programs
            </button>
            <button className="btn-secondary">
              <Play className="icon" />
              <span>Watch Our Story</span>
            </button>
          </div>
        </div>

        <div className="scroll-indicator">
          <ChevronDown className="bounce-icon" />
        </div>
      </section>

      {/* Interactive Timeline */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Journey</h2>
            <p>From humble beginnings to becoming Hyderabad's premier football academy</p>
          </div>

          <div className="timeline-container">
            <div className="timeline-line"></div>
            
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              >
                <div className={`timeline-dot ${activeTimeline === index ? 'active' : ''}`}>
                  {event.icon}
                </div>

                <div className="timeline-content">
                  <div className={`timeline-card ${activeTimeline === index ? 'active' : ''}`}>
                    <div className="timeline-year">{event.year}</div>
                    <h3 className="timeline-title">{event.title}</h3>
                    <p className="timeline-description">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy & Vision */}
      <section className="philosophy-section">
        <div className="container">
          <div className="vision-mission-grid">
            <div className="vision-card">
              <h2>Our Vision</h2>
              <div className="card">
                <p className="vision-text">
                  "To be a beacon of excellence, transcending boundaries and redefining grassroots football in the region."
                </p>
              </div>
            </div>

            <div className="mission-card">
              <h2>Our Mission</h2>
              <div className="card">
                <p className="mission-text">
                  "To provide a holistic football experience, fostering skill development with international standards and instilling strong sportsmanship values."
                </p>
              </div>
            </div>
          </div>

          <div className="method-section">
            <h3>The HLSSA Method</h3>
            <p className="method-description">
              Our proven approach to developing complete footballers
            </p>
          </div>

          <div className="method-grid">
            <div className="method-card">
              <div className="method-icon blue-gradient">
                <Brain className="icon" />
              </div>
              <h4>Holistic Development</h4>
              <p>
                We focus on technical skill, tactical intelligence, physical fitness, and mental strength to create well-rounded players.
              </p>
            </div>

            <div className="method-card">
              <div className="method-icon green-gradient">
                <Globe className="icon" />
              </div>
              <h4>Global Standards</h4>
              <p>
                Our curriculum is inspired by top European methodologies and AFC guidelines, ensuring world-class training.
              </p>
            </div>

            <div className="method-card">
              <div className="method-icon yellow-gradient">
                <Trophy className="icon" />
              </div>
              <h4>Competitive Exposure</h4>
              <p>
                We ensure our players compete in prestigious local, national, and international tournaments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section">
        <div className="container">
          <div className="section-header light">
            <h2>Meet the Driving Force</h2>
            <p>The visionary behind HLSSA's success</p>
          </div>

          <div className="founder-grid">
            <div className="founder-image">
              <img
                src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
                alt="Mohammed Faiz Khan"
              />
            </div>

            <div className="founder-content">
              <h3>Mohammed Faiz Khan</h3>
              <p className="founder-title">Founder & Head Coach</p>
              
              <blockquote className="founder-quote">
                "Every child has the potential to be extraordinary. My mission is to unlock that potential, 
                not just in football, but in life. We don't just train players; we shape champions and build character."
              </blockquote>

              <button
                onClick={() => setShowFounderBio(!showFounderBio)}
                className="bio-toggle"
              >
                <span>{showFounderBio ? 'Hide' : 'Read'} Full Biography</span>
                <ChevronRight className={`chevron ${showFounderBio ? 'rotated' : ''}`} />
              </button>

              {showFounderBio && (
                <div className="founder-bio">
                  <p>
                    With over 15 years of experience in nurturing young talent, Mohammed Faiz Khan has been instrumental 
                    in creating a training ground that combines professional coaching with the values of respect, 
                    discipline, and teamwork.
                  </p>
                  <p>
                    His passion for the beautiful game and commitment to youth development has been the driving force 
                    behind the academy's success. Under his leadership, HLSSA has produced numerous players who have 
                    gone on to represent state and national teams.
                  </p>
                  <p>
                    Faiz's philosophy emphasizes respect, self-belief, and sportsmanship, guiding the academy's 
                    mission to develop not just skilled players, but outstanding individuals.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Player Pathways */}
      <section className="pathways-section">
        <div className="container">
          <div className="section-header">
            <h2>Player Pathways & Opportunities</h2>
            <p>Opening doors to professional football and educational excellence</p>
          </div>

          <div className="opportunities-grid">
            {opportunities.map((opportunity, index) => (
              <div key={index} className="opportunity-card">
                <div className={`opportunity-header ${opportunity.color}`}>
                  <img
                    src={opportunity.logos[0]}
                    alt={opportunity.title}
                  />
                </div>
                <div className="opportunity-content">
                  <h3>{opportunity.title}</h3>
                  <p>{opportunity.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="stats-container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number blue">50+</div>
                <div className="stat-label">Professional Club Trials</div>
              </div>
              <div className="stat-item">
                <div className="stat-number green">25+</div>
                <div className="stat-label">Educational Scholarships</div>
              </div>
              <div className="stat-item">
                <div className="stat-number yellow">15+</div>
                <div className="stat-label">State Team Selections</div>
              </div>
              <div className="stat-item">
                <div className="stat-number purple">100+</div>
                <div className="stat-label">Tournament Victories</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
/* Reset and Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
}

.about-container {
  min-height: 100vh;
  background-color: #f9fafb;
}

.container {
  max-width: 90vw;
  margin: 0 auto;
  padding: 0 20px;
}

/* Gradients */
.blue-gradient {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.green-gradient {
  background: linear-gradient(135deg, #10b981, #059669);
}

.yellow-gradient {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.gradient-text {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 1000px;
  text-align: center;
  color: white;
  padding: 0 20px;
}

.hero-badge {
  display: inline-block;
  padding: 12px 24px;
  background: #fbbf24;
  color: #1e3a8a;
  border-radius: 50px;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 32px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 32px;
  line-height: 1.1;
}

.hero-title .highlight {
  color: #fbbf24;
  display: block;
}

.hero-description {
  font-size: 1.25rem;
  color: #bfdbfe;
  margin-bottom: 48px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.btn-primary {
  background: #fbbf24;
  color: #1e3a8a;
  padding: 16px 32px;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1.125rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: scale(1);
}

.btn-primary:hover {
  background: #f59e0b;
  transform: scale(1.05);
}

.btn-secondary {
  border: 2px solid white;
  color: white;
  background: transparent;
  padding: 16px 32px;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary:hover {
  background: white;
  color: #1e3a8a;
}

.icon {
  width: 20px;
  height: 20px;
}

.scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
}

.bounce-icon {
  width: 32px;
  height: 32px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Timeline Section */
.timeline-section {
  padding: 80px 0;
  background: white;
}

.section-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 16px;
}

.section-header p {
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.section-header.light h2 {
  color: white;
}

.section-header.light p {
  color: #d1d5db;
}

.timeline-container {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
}

.timeline-line {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 100%;
  background: #bfdbfe;
}

.timeline-item {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 64px;
}

.timeline-item.left {
  flex-direction: row;
}

.timeline-item.right {
  flex-direction: row-reverse;
}

.timeline-dot {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  z-index: 2;
}

.timeline-dot.active {
  background: #2563eb;
  transform: translateX(-50%) scale(1.25);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
}

.timeline-content {
  width: 41.67%;
}

.timeline-item.left .timeline-content {
  padding-right: 32px;
  text-align: right;
}

.timeline-item.right .timeline-content {
  padding-left: 32px;
  text-align: left;
}

.timeline-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  transform: scale(1);
}

.timeline-card:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.timeline-card.active {
  transform: scale(1.05);
  border: 2px solid #2563eb;
}

.timeline-year {
  font-size: 1.875rem;
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 8px;
}

.timeline-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 12px;
}

.timeline-description {
  color: #6b7280;
  line-height: 1.6;
}

/* Philosophy Section */
.philosophy-section {
  padding: 80px 0;
  background: #f9fafb;
}

.vision-mission-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  margin-bottom: 80px;
}

.vision-card, .mission-card {
  text-align: center;
}

.vision-card h2, .mission-card h2 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 32px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.vision-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2563eb;
  line-height: 1.6;
}

.mission-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #059669;
  line-height: 1.6;
}

.method-section {
  text-align: center;
  margin-bottom: 48px;
}

.method-section h3 {
  font-size: 1.875rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 16px;
}

.method-description {
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.method-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.method-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  transform: translateY(0);
}

.method-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.method-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.method-icon .icon {
  width: 32px;
  height: 32px;
  color: white;
}

.method-card h4 {
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 16px;
}

.method-card p {
  color: #6b7280;
  line-height: 1.6;
}

/* Founder Section */
.founder-section {
  padding: 80px 0;
  background: #111827;
  color: white;
}

.founder-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.founder-image {
  text-align: center;
}

.founder-image img {
  width: 320px;
  height: 320px;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.founder-content h3 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.founder-title {
  font-size: 1.5rem;
  color: #fbbf24;
  margin-bottom: 32px;
}

.founder-quote {
  font-size: 1.25rem;
  font-style: italic;
  color: #d1d5db;
  margin-bottom: 32px;
  border-left: 4px solid #fbbf24;
  padding-left: 24px;
  line-height: 1.6;
}

.bio-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fbbf24;
  color: #111827;
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.bio-toggle:hover {
  background: #f59e0b;
}

.chevron {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.chevron.rotated {
  transform: rotate(90deg);
}

.founder-bio {
  margin-top: 32px;
  background: #1f2937;
  border-radius: 16px;
  padding: 24px;
  animation: fadeIn 0.3s ease;
}

.founder-bio p {
  color: #d1d5db;
  line-height: 1.6;
  margin-bottom: 16px;
}

.founder-bio p:last-child {
  margin-bottom: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pathways Section */
.pathways-section {
  padding: 80px 0;
  background: white;
}

.opportunities-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 64px;
}

.opportunity-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  transform: translateY(0);
}

.opportunity-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

.opportunity-header {
  height: 192px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.opportunity-header img {
  width: 128px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.opportunity-card:hover .opportunity-header img {
  opacity: 1;
}

.opportunity-content {
  padding: 32px;
}

.opportunity-content h3 {
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 16px;
}

.opportunity-content p {
  color: #6b7280;
  line-height: 1.6;
}

.stats-container {
  background: #f9fafb;
  border-radius: 16px;
  padding: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-number.blue {
  color: #2563eb;
}

.stat-number.green {
  color: #059669;
}

.stat-number.yellow {
  color: #d97706;
}

.stat-number.purple {
  color: #7c3aed;
}
  `

export default AboutUs;