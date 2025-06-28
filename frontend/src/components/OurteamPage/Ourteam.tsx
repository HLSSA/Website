import React, { useState, useRef } from 'react';
import './Ourteam.css';

const OurTeamPage = () => {
  const [activeTab, setActiveTab] = useState('players');
  const u16ScrollRef = useRef(null);
  const u18ScrollRef = useRef(null);
  const coachScrollRef = useRef(null);

  const coaches = [
    {
      name: "Mohammed Rashid",
      role: "Head Coach",
      phone: "+91-9876543210",
      experience: "15+ Years",
      description: "Experienced head coach with over 15 years in professional football. Specializes in youth development and tactical training with a proven track record of developing young talent.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Ahmed Ali Khan",
      role: "Technical Director",
      phone: "+91-9876543211",
      experience: "12+ Years",
      description: "Technical director with extensive experience in skill development and ball mastery techniques. Former professional player with deep understanding of modern football.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Syed Salman",
      role: "Youth Coach",
      phone: "+91-9876543212",
      experience: "8+ Years",
      description: "Passionate youth coach dedicated to character building and grassroots development. Specializes in working with young players aged 8-16.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Ahmed Muhammad",
      role: "Fitness Coach",
      phone: "+91-9876543213",
      experience: "10+ Years",
      description: "Certified fitness coach with expertise in sports science and injury prevention. Focuses on physical conditioning and performance optimization.",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Sarah Wilson",
      role: "Assistant Coach",
      phone: "+91-9876543214",
      experience: "6+ Years",
      description: "Assistant coach specializing in mental conditioning and player psychology.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=400&h=400&fit=crop&crop=face"
    }
  ];

  const playersU16 = [
    {
      name: "Arjun Sharma",
      position: "Midfielder",
      number: 10,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Vikash Kumar",
      position: "Striker",
      number: 9,
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Rahul Verma",
      position: "Defender",
      number: 4,
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Amit Singh",
      position: "Goalkeeper",
      number: 1,
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Rohit Patel",
      position: "Midfielder",
      number: 6,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Karan Singh",
      position: "Winger",
      number: 11,
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face"
    }
  ];

  const playersU18 = [
    {
      name: "Rohan Patel",
      position: "Winger",
      number: 7,
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Suresh Reddy",
      position: "Midfielder",
      number: 8,
      image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Kiran Joshi",
      position: "Defender",
      number: 3,
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Deepak Gupta",
      position: "Striker",
      number: 11,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Aryan Khan",
      position: "Defender",
      number: 5,
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Rajesh Kumar",
      position: "Goalkeeper",
      number: 12,
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face"
    }
  ];

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face';
  };

  const scroll = (ref, direction) => {
    const scrollAmount = 300;
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const PlayerCard = ({ player }) => (
    <div className="player-card">
      <div className="player-image-container">
        <img 
          src={player.image} 
          alt={`${player.name} - ${player.position}`} 
          className="player-image" 
          loading="lazy"
          onError={handleImageError}
        />
        <div className="player-overlay">
          <div className="player-number-large">{player.number}</div>
          <div className="player-details">
            <div className="player-name">{player.name}</div>
            <div className="player-position">{player.position}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const CoachCard = ({ coach }) => (
    <div className="coach-card">
      <div className="coach-image-container">
        <img 
          src={coach.image} 
          alt={`${coach.name} - ${coach.role}`} 
          className="coach-image" 
          loading="lazy"
          onError={handleImageError}
        />
        <div className="coach-overlay">
          <div className="coach-details">
            <div className="coach-name">{coach.name}</div>
            <div className="coach-role">{coach.role}</div>
            <div className="coach-experience">{coach.experience}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const ScrollableRow = ({ title, items, scrollRef, CardComponent }) => (
    <div className="scrollable-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <div className="scroll-controls">
          <button 
            className="scroll-btn left"
            onClick={() => scroll(scrollRef, 'left')}
            aria-label="Scroll left"
          >
            ←
          </button>
          <button 
            className="scroll-btn right"
            onClick={() => scroll(scrollRef, 'right')}
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>
      <div className="scrollable-container" ref={scrollRef}>
        <div className="cards-row">
          {items.map((item, index) => (
            <CardComponent key={index} {...{[CardComponent === PlayerCard ? 'player' : 'coach']: item}} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="team-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Our Elite Team</h1>
          <p>Meet the dedicated professionals shaping the future of football</p>
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
          <ScrollableRow 
            title="Coaching Staff"
            items={coaches}
            scrollRef={coachScrollRef}
            CardComponent={CoachCard}
          />
        )}

        {activeTab === 'players' && (
          <>
            <ScrollableRow 
              title="Under-16 Team"
              items={playersU16}
              scrollRef={u16ScrollRef}
              CardComponent={PlayerCard}
            />
            <ScrollableRow 
              title="Under-18 Team"
              items={playersU18}
              scrollRef={u18ScrollRef}
              CardComponent={PlayerCard}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default OurTeamPage;