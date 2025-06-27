import React, { useState, useRef } from 'react';

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
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .team-page {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
          color: #333;
        }

        .hero-section {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9)), 
                      url('https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
          background-size: cover;
          background-position: center;
          color: white;
          padding: 120px 20px 80px 20px;
          text-align: center;
        }

        .hero-content h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .hero-content p {
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          opacity: 0.95;
          max-width: 600px;
          margin: 0 auto;
        }

        .main-content {
          background: #f8fafc;
          padding: 40px 0;
        }

        .navigation-tabs {
          display: flex;
          justify-content: center;
          gap: 0;
          background: white;
          border-radius: 12px;
          padding: 4px;
          margin: -40px auto 60px auto;
          width: fit-content;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          position: relative;
          z-index: 10;
        }

        .nav-button {
          padding: 16px 32px;
          background: none;
          border: none;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.3s ease;
          color: #64748b;
        }

        .nav-button.active {
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          color: white;
        }

        .nav-button:hover:not(.active) {
          background: #f1f5f9;
          color: #334155;
        }

        .scrollable-section {
          margin-bottom: 60px;
          padding: 0 20px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }

        .section-title {
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .scroll-controls {
          display: flex;
          gap: 8px;
        }

        .scroll-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid #e2e8f0;
          background: white;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: bold;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .scroll-btn:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
          transform: translateY(-2px);
        }

        .scrollable-container {
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 10px;
        }

        .scrollable-container::-webkit-scrollbar {
          display: none;
        }

        .cards-row {
          display: flex;
          gap: 24px;
          padding: 0 20px;
          width: fit-content;
        }

        .player-card, .coach-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          width: 280px;
          height: 360px;
          flex-shrink: 0;
        }

        .player-card:hover, .coach-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .player-image-container, .coach-image-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .player-image, .coach-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .player-card:hover .player-image,
        .coach-card:hover .coach-image {
          transform: scale(1.05);
        }

        .player-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(59, 130, 246, 0.9));
          padding: 30px 20px 20px 20px;
          color: white;
        }

        .coach-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(30, 41, 59, 0.9));
          padding: 30px 20px 20px 20px;
          color: white;
        }

        .player-number-large {
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 8px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        .player-name, .coach-name {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 4px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .player-position, .coach-role {
          font-size: 1rem;
          font-weight: 500;
          opacity: 0.9;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .coach-experience {
          font-size: 0.9rem;
          opacity: 0.8;
          margin-top: 4px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-section {
            padding: 80px 15px 60px 15px;
          }

          .scrollable-section {
            padding: 0 15px;
          }

          .section-header {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }

          .scroll-controls {
            align-self: center;
          }

          .cards-row {
            padding: 0 10px;
            gap: 16px;
          }

          .player-card, .coach-card {
            width: 240px;
            height: 320px;
          }

          .player-number-large {
            font-size: 2.8rem;
          }

          .navigation-tabs {
            margin: -30px 15px 40px 15px;
            width: calc(100% - 30px);
          }

          .nav-button {
            padding: 12px 20px;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .cards-row {
            gap: 12px;
          }

          .player-card, .coach-card {
            width: 220px;
            height: 300px;
          }

          .scroll-btn {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }
        }
      `}</style>

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