import React, { useRef } from 'react';
import './Coaches.css';
import useCoaches from '../../hooks/useCoaches';
import Loader from '../Loader';
import Error from '../Error';

const CoachesOnlyPage = () => {
  const coachScrollRef = useRef(null);
  const { coaches, loading, error } = useCoaches();

  const handleImageError = (e: any) => {
    e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face';
  };

  const scroll = (ref: any, direction: any) => {
    const scrollAmount = 300;
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const CoachCard = ({ coach }: { coach: any }) => (
    <div className="coach-card">
      <div className="coach-image-container">
        <img 
          src={coach.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'} 
          alt={`${coach.name} - ${coach.role}`} 
          className="coach-image" 
          loading="lazy"
          onError={handleImageError}
        />
        <div className="coach-overlay">
          <div className="coach-details">
            <div className="coach-name">{coach.name}</div>
            <div className="coach-role">{coach.role}</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="team-page">
        <div className="hero-section">
          <div className="hero-content">
            <h1>Our Elite Coaching Staff</h1>
            <p>Shaping the Future of Football with Experience and Passion</p>
          </div>
        </div>
        <div className="main-content">
          <Loader />
          <div className="loading-message">Loading coaches...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="team-page">
        <div className="hero-section">
          <div className="hero-content">
            <h1>Our Elite Coaching Staff</h1>
            <p>Shaping the Future of Football with Experience and Passion</p>
          </div>
        </div>
        <div className="main-content">
          <Error />
          <div className="error-message">Error loading coaches: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="team-page">
      
      <div className="main-content">
        <div className="hero-section">
          <div className="hero-content">
            <h1>Our Elite Coaching Staff</h1>
            <p>Shaping the Future of Football with Experience and Passion</p>
          </div>
        </div>
        <div className="scrollable-section">
          <div className="section-header">
            <div className="scroll-controls">
              <button 
                className="scroll-btn left"
                onClick={() => scroll(coachScrollRef, 'left')}
                aria-label="Scroll left"
              >
                ←
              </button>
              <button 
                className="scroll-btn right"
                onClick={() => scroll(coachScrollRef, 'right')}
                aria-label="Scroll right"
              >
                →
              </button>
            </div>
          </div>
          <div className="scrollable-container" ref={coachScrollRef}>
            <div className="cards-row">
              {coaches.length > 0 ? (
                coaches.map((coach, index) => (
                  <CoachCard key={coach.id || index} coach={coach} />
                ))
              ) : (
                <div className="no-coaches-message">No coaches available at the moment.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachesOnlyPage;