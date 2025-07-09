import React, { useState, useEffect } from 'react';
import { Play, Award, Globe, Brain, Trophy, Users, Target, Star, ChevronDown, ChevronRight } from 'lucide-react';

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
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      title: "Educational Scholarships",
      description: "Sports scholarships to premier educational institutions across India",
      logos: ["https://images.pexels.com/photos/159515/football-american-football-runner-player-159515.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop"],
      color: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      title: "State Team Selection",
      description: "Regular selections for Telangana State teams across all age categories",
      logos: ["https://images.pexels.com/photos/262004/pexels-photo-262004.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop"],
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600"
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
    <div className="about-us-container">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Background Image with Blur */}
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <img 
            src="https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
            alt="Coach inspiring young players"
            className="hero-image"
          />
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            🏆 More Than an Academy
          </div>
          
          <h1 className="hero-title">
            Crafting Hyderabad's
            <span className="hero-title-highlight">Football Future,</span>
            <span className="hero-title-highlight">One Player at a Time.</span>
          </h1>
          
          <p className="hero-description">
            Since 2015, we've been the nurturing ground for aspiring athletes, transforming raw talent into 
            championship-caliber players through holistic development, world-class coaching, and unwavering dedication.
          </p>

          <div className="hero-buttons">
            <button className="hero-button-primary">
              Discover Our Programs
            </button>
            <button className="hero-button-secondary">
              <Play className="w-5 h-5" />
              <span>Watch Our Story</span>
            </button>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <ChevronDown className="w-8 h-8 animate-bounce" />
        </div>
      </section>

      {/* Interactive Timeline */}
      <section className="timeline-section">
        <div className="timeline-container">
          <div className="timeline-header">
            <h2 className="timeline-title">Our Journey</h2>
            <p className="timeline-subtitle">
              From humble beginnings to becoming Hyderabad's premier football academy
            </p>
          </div>

          <div className="timeline-wrapper">
            {/* Timeline Line - Hidden on mobile */}
            <div className="timeline-line"></div>
            
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                className={`timeline-item ${index % 2 === 0 ? 'timeline-item-left' : 'timeline-item-right'}`}
              >
                {/* Timeline Dot */}
                <div className={`timeline-dot ${activeTimeline === index ? 'timeline-dot-active' : ''}`}>
                  {event.icon}
                </div>

                {/* Timeline Content */}
                <div className="timeline-content">
                  <div className={`timeline-card ${activeTimeline === index ? 'timeline-card-active' : ''}`}>
                    <div className="timeline-year">{event.year}</div>
                    <h3 className="timeline-event-title">{event.title}</h3>
                    <p className="timeline-event-description">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy & Vision */}
      <section className="philosophy-section">
        <div className="philosophy-container">
          <div className="philosophy-grid">
            <div className="vision-section">
              <h2 className="philosophy-title">Our Vision</h2>
              <div className="philosophy-card">
                <p className="philosophy-text vision-text">
                  "To be a beacon of excellence, transcending boundaries and redefining grassroots football in the region."
                </p>
              </div>
            </div>

            <div className="mission-section">
              <h2 className="philosophy-title">Our Mission</h2>
              <div className="philosophy-card">
                <p className="philosophy-text mission-text">
                  "To provide a holistic football experience, fostering skill development with international standards and instilling strong sportsmanship values."
                </p>
              </div>
            </div>
          </div>

          <div className="method-section">
            <h3 className="method-title">The HLSSA Method</h3>
            <p className="method-subtitle">
              Our proven approach to developing complete footballers
            </p>
          </div>

          <div className="method-grid">
            <div className="method-card">
              <div className="method-icon method-icon-blue">
                <Brain style={{ width: '32px', height: '32px', color: 'white' }} />
              </div>
              <h4 className="method-card-title">Holistic Development</h4>
              <p className="method-card-description">
                We focus on technical skill, tactical intelligence, physical fitness, and mental strength to create well-rounded players.
              </p>
            </div>

            <div className="method-card">
              <div className="method-icon method-icon-green">
                <Globe style={{ width: '32px', height: '32px', color: 'white' }} />
              </div>
              <h4 className="method-card-title">Global Standards</h4>
              <p className="method-card-description">
                Our curriculum is inspired by top European methodologies and AFC guidelines, ensuring world-class training.
              </p>
            </div>

            <div className="method-card">
              <div className="method-icon method-icon-yellow">
                <Trophy style={{ width: '32px', height: '32px', color: 'white' }} />
              </div>
              <h4 className="method-card-title">Competitive Exposure</h4>
              <p className="method-card-description">
                We ensure our players compete in prestigious local, national, and international tournaments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section">
        <div className="founder-container">
          <div className="founder-header">
            <h2 className="founder-title">Meet the Driving Force</h2>
            <p className="founder-subtitle">
              The visionary behind HLSSA's success
            </p>
          </div>

          <div className="founder-content">
            <div className="founder-image-container">
              <img
                src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
                alt="Mohammed Faiz Khan"
                className="founder-image"
              />
            </div>

            <div className="founder-info">
              <h3 className="founder-name">Mohammed Faiz Khan</h3>
              <p className="founder-role">Founder & Head Coach</p>
              
              <blockquote className="founder-quote">
                "Every child has the potential to be extraordinary. My mission is to unlock that potential, 
                not just in football, but in life. We don't just train players; we shape champions and build character."
              </blockquote>

              <button
                onClick={() => setShowFounderBio(!showFounderBio)}
                className="founder-bio-button"
              >
                <span>{showFounderBio ? 'Hide' : 'Read'} Full Biography</span>
                <ChevronRight className={`founder-chevron ${showFounderBio ? 'founder-chevron-open' : ''}`} />
              </button>

              {showFounderBio && (
                <div className="founder-bio">
                  <p className="founder-bio-text">
                    With over 15 years of experience in nurturing young talent, Mohammed Faiz Khan has been instrumental 
                    in creating a training ground that combines professional coaching with the values of respect, 
                    discipline, and teamwork.
                  </p>
                  <p className="founder-bio-text">
                    His passion for the beautiful game and commitment to youth development has been the driving force 
                    behind the academy's success. Under his leadership, HLSSA has produced numerous players who have 
                    gone on to represent state and national teams.
                  </p>
                  <p className="founder-bio-text">
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
        <div className="pathways-container">
          <div className="pathways-header">
            <h2 className="pathways-title">Player Pathways & Opportunities</h2>
            <p className="pathways-subtitle">
              Opening doors to professional football and educational excellence
            </p>
          </div>

          <div className="pathways-grid">
            {opportunities.map((opportunity, index) => (
              <div key={index} className="pathway-card">
                <div className={`pathway-card-header pathway-${index + 1}`}>
                  <img
                    src={opportunity.logos[0]}
                    alt={opportunity.title}
                    className="pathway-logo"
                  />
                </div>
                <div className="pathway-card-content">
                  <h3 className="pathway-card-title">{opportunity.title}</h3>
                  <p className="pathway-card-description">{opportunity.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number stat-blue">50+</div>
                <div className="stat-label">Professional Club Trials</div>
              </div>
              <div className="stat-item">
                <div className="stat-number stat-green">25+</div>
                <div className="stat-label">Educational Scholarships</div>
              </div>
              <div className="stat-item">
                <div className="stat-number stat-yellow">15+</div>
                <div className="stat-label">State Team Selections</div>
              </div>
              <div className="stat-item">
                <div className="stat-number stat-purple">100+</div>
                <div className="stat-label">Tournament Victories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* Reset and Base Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          
        }

        /* Main Container */
        .about-us-container {
          min-height: 100vh;
          background-color: #f9fafb;
          margin-top: 2.5rem;
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

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          z-index: 10;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: blur(2px);
        }

        .hero-content {
          position: relative;
          z-index: 20;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          text-align: center;
          color: white;
        }

        .hero-badge {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background-color: #fbbf24;
          color: #1e3a8a;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 700;
          margin-bottom: 2rem;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 2rem;
          line-height: 1.1;
        }

        .hero-title-highlight {
          display: block;
          color: #fbbf24;
        }

        .hero-description {
          font-size: 1.25rem;
          color: #dbeafe;
          margin-bottom: 3rem;
          max-width: 64rem;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.5;
        }

        .hero-buttons {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          justify-content: center;
          align-items: center;
        }

        .hero-button-primary {
          background-color: #fbbf24;
          color: #1e3a8a;
          padding: 1rem 2rem;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 1.125rem;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .hero-button-primary:hover {
          background-color: #f59e0b;
          transform: scale(1.05);
        }

        .hero-button-secondary {
          border: 2px solid white;
          color: white;
          background-color: transparent;
          padding: 1rem 2rem;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 1.125rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .hero-button-secondary:hover {
          background-color: white;
          color: #1e3a8a;
        }

        .hero-scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          color: white;
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translateY(0);
          }
          40%, 43% {
            transform: translateY(-10px);
          }
          70% {
            transform: translateY(-5px);
          }
        }

        /* Timeline Section */
        .timeline-section {
          padding: 4rem 0;
          background-color: white;
        }

        .timeline-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .timeline-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .timeline-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1rem;
        }

        .timeline-subtitle {
          font-size: 1.25rem;
          color: #6b7280;
          max-width: 48rem;
          margin: 0 auto;
        }

        .timeline-wrapper {
          position: relative;
          max-width: 64rem;
          margin: 0 auto;
        }

        .timeline-line {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 100%;
          background-color: #dbeafe;
          display: none;
        }

        .timeline-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 4rem;
        }

        .timeline-dot {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background-color: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          z-index: 10;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .timeline-dot-active {
          background-color: #2563eb;
          transform: scale(1.25);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.5);
        }

        .timeline-content {
          width: 100%;
          text-align: center;
        }

        .timeline-card {
          background-color: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .timeline-card:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .timeline-card-active {
          transform: scale(1.05);
          border: 2px solid #3b82f6;
        }

        .timeline-year {
          font-size: 1.875rem;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 0.5rem;
        }

        .timeline-event-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.75rem;
        }

        .timeline-event-description {
          color: #6b7280;
          line-height: 1.6;
        }

        /* Philosophy Section */
        .philosophy-section {
          padding: 4rem 0;
          background-color: #f9fafb;
        }

        .philosophy-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .philosophy-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .philosophy-title {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 2rem;
          text-align: center;
        }

        .philosophy-card {
          background-color: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .philosophy-text {
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.6;
          text-align: center;
        }

        .vision-text {
          color: #2563eb;
        }

        .mission-text {
          color: #059669;
        }

        .method-section {
          text-align: center;
          margin-bottom: 3rem;
        }

        .method-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1rem;
        }

        .method-subtitle {
          font-size: 1.25rem;
          color: #6b7280;
          max-width: 48rem;
          margin: 0 auto;
        }

        .method-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .method-card {
          background-color: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: all 0.3s ease;
        }

        .method-card:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          transform: translateY(-8px);
        }

        .method-icon {
          width: 4rem;
          height: 4rem;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .method-icon-blue {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        .method-icon-green {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .method-icon-yellow {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .method-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1rem;
        }

        .method-card-description {
          color: #6b7280;
          line-height: 1.6;
        }

        /* Founder Section */
        .founder-section {
          padding: 4rem 0;
          background-color: #111827;
          color: white;
        }

        .founder-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .founder-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .founder-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .founder-subtitle {
          font-size: 1.25rem;
          color: #d1d5db;
          max-width: 48rem;
          margin: 0 auto;
        }

        .founder-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
        }

        .founder-image-container {
          text-align: center;
        }

        .founder-image {
          width: 16rem;
          height: 16rem;
          border-radius: 1rem;
          object-fit: cover;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        }

        .founder-name {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .founder-role {
          font-size: 1.25rem;
          color: #fbbf24;
          margin-bottom: 2rem;
        }

        .founder-quote {
          font-size: 1.125rem;
          color: #d1d5db;
          margin-bottom: 2rem;
          border-left: 4px solid #fbbf24;
          padding-left: 1.5rem;
          font-style: italic;
          line-height: 1.6;
        }

        .founder-bio-button {
          background-color: #fbbf24;
          color: #111827;
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          font-weight: 600;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: none;
          cursor: pointer;
        }

        .founder-bio-button:hover {
          background-color: #f59e0b;
        }

        .founder-chevron {
          width: 1.25rem;
          height: 1.25rem;
          transition: transform 0.3s ease;
        }

        .founder-chevron-open {
          transform: rotate(90deg);
        }

        .founder-bio {
          margin-top: 2rem;
          background-color: #1f2937;
          border-radius: 1rem;
          padding: 1.5rem;
          animation: fadeIn 0.3s ease-in-out;
        }

        .founder-bio-text {
          color: #d1d5db;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .founder-bio-text:last-child {
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
          padding: 4rem 0;
          background-color: white;
        }

        .pathways-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .pathways-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .pathways-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1rem;
        }

        .pathways-subtitle {
          font-size: 1.25rem;
          color: #6b7280;
          max-width: 48rem;
          margin: 0 auto;
        }

        .pathways-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .pathway-card {
          background-color: white;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .pathway-card:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          transform: translateY(-8px);
        }

        .pathway-card-header {
          height: 12rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pathway-1 {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        .pathway-2 {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .pathway-3 {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .pathway-logo {
          width: 8rem;
          height: 4rem;
          object-fit: cover;
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .pathway-card-content {
          padding: 2rem;
        }

        .pathway-card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1rem;
        }

        .pathway-card-description {
          color: #6b7280;
          line-height: 1.6;
        }

        /* Stats Section */
        .stats-section {
          background-color: #f9fafb;
          border-radius: 1rem;
          padding: 3rem 1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          max-width: 48rem;
          margin: 0 auto;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .stat-blue {
          color: #3b82f6;
        }

        .stat-green {
          color: #10b981;
        }

        .stat-yellow {
          color: #f59e0b;
        }

        .stat-purple {
          color: #8b5cf6;
        }

        .stat-label {
          font-size: 1rem;
          color: #6b7280;
          font-weight: 600;
        }

        /* Responsive Design */
        @media (min-width: 640px) {
          .hero-buttons {
            flex-direction: row;
          }

          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (min-width: 768px) {
          .hero-title {
            font-size: 3.5rem;
          }

          .timeline-line {
            display: block;
          }

          .timeline-item {
            flex-direction: row;
            align-items: flex-start;
          }

          .timeline-item-left {
            justify-content: flex-end;
          }

          .timeline-item-right {
            justify-content: flex-start;
          }

          .timeline-item-left .timeline-content {
            padding-right: 3rem;
            text-align: right;
          }

          .timeline-item-right .timeline-content {
            padding-left: 3rem;
            text-align: left;
          }

          .timeline-dot {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 0;
          }

          .timeline-content {
            width: 50%;
          }

          .philosophy-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .method-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .founder-content {
            grid-template-columns: 1fr 2fr;
          }

          .pathways-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .hero-title {
            font-size: 4rem;
          }

          .timeline-title {
            font-size: 3rem;
          }

          .pathways-title {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;