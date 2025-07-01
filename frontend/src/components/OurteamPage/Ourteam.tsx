import React, { useState, useRef, useEffect, useMemo } from 'react';
import useCoaches from '../../hooks/useCoaches';
import { Person } from '../../types/coaches.type';
import './Ourteam.css';

const OurTeamPage = () => {
  const [activeTab, setActiveTab] = useState('players');
  const scrollRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement | null> }>({});
  
  const { coaches, players, loading, error, fetchAll } = useCoaches();

  // Define age categories
  const ageCategories = ['under 10', 'under 12', 'under 14', 'under 16', 'under 18', 'under 21'];

  // Group players by age category
  const playersByAge = useMemo(() => {
    console.log('Players data:', players); // Debug log
    const grouped: { [key: string]: Person[] } = {};
    
    ageCategories.forEach(age => {
      const playersInAge = players.filter(player => 
        player.category === 'Player' && 
        player.age === age && 
        player.is_active
      );
      if (playersInAge.length > 0) {
        grouped[age] = playersInAge;
      }
    });
    
    console.log('Grouped players by age:', grouped); // Debug log
    return grouped;
  }, [players]);

  // Filter active coaches
  const activeCoaches = useMemo(() => {
    console.log('All coaches:', coaches); // Debug log
    const active = coaches.filter(coach => 
      coach.category === 'Coach' && 
      coach.is_active
    );
    console.log('Active coaches:', active); // Debug log
    return active;
  }, [coaches]);

  // Create scroll refs for each age category and coaches
  useEffect(() => {
    const refs: { [key: string]: React.RefObject<HTMLDivElement | null> } = {};
    
    // Create refs for each age category that has players
    Object.keys(playersByAge).forEach(age => {
      refs[age] = React.createRef<HTMLDivElement>();
    });
    
    // Create ref for coaches
    refs['coaches'] = React.createRef<HTMLDivElement>();
    
    scrollRefs.current = refs;
  }, [playersByAge]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face';
  };

  const scroll = (refKey: string, direction: 'left' | 'right') => {
    const scrollAmount = 300;
    const ref = scrollRefs.current[refKey];
    if (ref?.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const PlayerCard: React.FC<{ player: Person }> = ({ player }) => (
    <div className="player-card">
      <div className="player-image-container">
        <img 
          src={player.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'} 
          alt={`${player.name} - ${player.role}`} 
          className="player-image" 
          loading="lazy"
          onError={handleImageError}
        />
        <div className="player-overlay">
          <div className="player-number-large">{player.jersey_no || '0'}</div>
          <div className="player-details">
            <div className="player-name">{player.name}</div>
            <div className="player-position">{player.role}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const CoachCard: React.FC<{ coach: Person }> = ({ coach }) => (
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
            <div className="coach-experience">{coach.age}</div>
          </div>
        </div>
      </div>
    </div>
  );

  interface CardComponentProps {
    [key: string]: Person | undefined;
    player?: Person;
    coach?: Person;
  }

  const ScrollableRow: React.FC<{ 
    title: string; 
    items: Person[]; 
    scrollRefKey: string; 
    CardComponent: React.FC<CardComponentProps>;
    isCoach?: boolean;
  }> = ({ title, items, scrollRefKey, CardComponent, isCoach = false }) => (
    <div className="scrollable-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <div className="scroll-controls">
          <button 
            className="scroll-btn left"
            onClick={() => scroll(scrollRefKey, 'left')}
            aria-label="Scroll left"
          >
            ←
          </button>
          <button 
            className="scroll-btn right"
            onClick={() => scroll(scrollRefKey, 'right')}
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>
      <div className="scrollable-container" ref={scrollRefs.current[scrollRefKey]}>
        <div className="cards-row">
          {items.map((item, index) => (
            <div key={`${scrollRefKey}-${index}`}>
              {isCoach ? (
                <CardComponent coach={item} />
              ) : (
                <CardComponent player={item} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Helper function to format age category title
  const formatAgeTitle = (age: string) => {
    return age.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('-') + ' Team';
  };

  if (loading) {
    console.log('Loading...');
    return (
      <div className="team-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading team data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading data:', error);
    return (
      <div className="team-page">
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
          <button className="retry-button" onClick={fetchAll}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="team-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Our Elite Team</h1>
          <p className="hero-description">Meet the dedicated professionals shaping the future of football</p>
        </div>
      </div>

      <div className="main-content">
        <div className="navigation-tabs">
          <button 
            className={`nav-button ${activeTab === 'coaches' ? 'active' : ''}`}
            onClick={() => setActiveTab('coaches')}
          >
            Coaching Staff
          </button>
          <button 
            className={`nav-button ${activeTab === 'players' ? 'active' : ''}`}
            onClick={() => setActiveTab('players')}
          >
            Players
          </button>
        </div>

        {activeTab === 'coaches' && (
          <>
            {activeCoaches.length > 0 ? (
              <ScrollableRow 
                title="Coaching Staff"
                items={activeCoaches}
                scrollRefKey="coaches"
                CardComponent={CoachCard}
                isCoach={true}
              />
            ) : (
              <div className="no-data-message">
                <p>No active coaches found.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'players' && (
          <>
            {Object.keys(playersByAge).length > 0 ? (
              Object.entries(playersByAge).map(([age, playersInAge]) => (
                <ScrollableRow 
                  key={age}
                  title={formatAgeTitle(age)}
                  items={playersInAge}
                  scrollRefKey={age}
                  CardComponent={PlayerCard}
                  isCoach={false}
                />
              ))
            ) : (
              <div className="no-data-message">
                <p>No active players found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OurTeamPage;