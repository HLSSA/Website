import React, { useState } from 'react';

const OurTeamPage = () => {
  const [activeTab, setActiveTab] = useState('coaches');

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
    }
  ];

  const players = [
    {
      name: "Arjun Sharma",
      position: "Midfielder",
      age: 22,
      phone: "+91-9876543220",
      description: "Creative midfielder with excellent passing ability and vision. Team captain with natural leadership qualities and exceptional work ethic.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Vikash Kumar",
      position: "Striker",
      age: 24,
      phone: "+91-9876543221",
      description: "Clinical striker with great finishing ability. Known for positioning and aerial strength, consistently among top scorers.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Rahul Verma",
      position: "Defender",
      age: 26,
      phone: "+91-9876543222",
      description: "Solid center-back with excellent defensive skills and leadership on the field. Strong in air and reliable in crucial moments.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Amit Singh",
      position: "Goalkeeper",
      age: 25,
      phone: "+91-9876543223",
      description: "Agile goalkeeper with quick reflexes and excellent shot-stopping ability. Known for distribution and commanding presence.",
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Rohan Patel",
      position: "Winger",
      age: 21,
      phone: "+91-9876543224",
      description: "Pacey winger with excellent dribbling skills and crossing ability. Creates numerous chances and scores spectacular goals.",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Suresh Reddy",
      position: "Midfielder",
      age: 23,
      phone: "+91-9876543225",
      description: "Box-to-box midfielder with incredible stamina and versatility. Contributes both defensively and offensively with consistency.",
      image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face"
    }
  ];

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face';
  };

  const CoachCard = ({ coach }) => (
    <div className="team-card">
      <div className="card-image">
        <img 
          src={coach.image} 
          alt={`${coach.name} - ${coach.role}`} 
          className="card-img" 
          loading="lazy"
          onError={handleImageError}
        />
      </div>
      <div className="card-content">
        <div className="card-name">{coach.name}</div>
        <div className="card-role">{coach.role}</div>
        <div className="card-info">
          {coach.phone && (
            <div className="info-item">
              <span className="info-icon">📞</span>
              <a href={`tel:${coach.phone}`} className="phone-link">{coach.phone}</a>
            </div>
          )}
          {coach.experience && (
            <div className="info-item">
              <span className="info-icon">🏆</span>
              {coach.experience} Experience
            </div>
          )}
        </div>
        {coach.description && <div className="card-description">{coach.description}</div>}
      </div>
    </div>
  );

  const PlayerCard = ({ player }) => (
    <div className="team-card">
      <div className="card-image">
        <img 
          src={player.image} 
          alt={`${player.name} - ${player.position}`} 
          className="card-img" 
          loading="lazy"
          onError={handleImageError}
        />
      </div>
      <div className="card-content">
        <div className="card-name">{player.name}</div>
        <div className="card-role">{player.position}</div>
        <div className="card-info">
          {player.age && (
            <div className="info-item">
              <span className="info-icon">👤</span>
              Age: {player.age}
            </div>
          )}
          {player.phone && (
            <div className="info-item">
              <span className="info-icon">📞</span>
              <a href={`tel:${player.phone}`} className="phone-link">{player.phone}</a>
            </div>
          )}
        </div>
        {player.description && <div className="card-description">{player.description}</div>}
      </div>
    </div>
  );

  return (
    <div className="fullscreen-container">
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow-x: hidden;
        }

        .fullscreen-container {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background-color: #f8fafc;
          color: #334155;
          line-height: 1.6;
          min-height: 100vh;
          width: 100vw;
          position: relative;
          overflow-x: hidden;
        }

        .hero-section {
          background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), 
                           url("https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          color: white;
          padding: 8rem 0 6rem 0;
          text-align: center;
          position: relative;
          overflow: hidden;
          width: 100vw;
          margin: 0;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          width: 100%;
          padding: 0 20px;
        }

        .hero-badge {
          display: inline-block;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #1f2937;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.9rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
        }

        .hero-title {
          font-size: clamp(3rem, 7vw, 5rem);
          font-weight: 800;
          margin-bottom: 1.5rem;
          text-shadow: 3px 3px 6px rgba(0,0,0,0.5);
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 3vw, 1.5rem);
          opacity: 0.95;
          font-weight: 400;
          max-width: 600px;
          margin: 0 auto 3rem auto;
          line-height: 1.4;
        }

        .main-content {
          width: 100%;
          max-width: 100vw;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .nav-tabs {
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 8px;
          margin: -50px auto 4rem auto;
          width: fit-content;
          min-width: 300px;
          max-width: 400px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
          position: relative;
          z-index: 10;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .nav-tab {
          flex: 1;
          padding: 15px 25px;
          text-align: center;
          background: transparent;
          border: none;
          cursor: pointer;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          color: #64748b;
        }

        .nav-tab:hover {
          background-color: rgba(241, 245, 249, 0.8);
        }

        .nav-tab.active {
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
        }

        .content-section {
          display: block;
          width: 100%;
          max-width: 100vw;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 2.5rem);
          font-weight: 700;
          text-align: center;
          margin-bottom: 3rem;
          color: #1e293b;
          width: 100%;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 400px));
          gap: 2rem;
          margin-bottom: 4rem;
          width: 100%;
          max-width: 1400px;
          padding: 0 20px;
          justify-content: center;
          place-items: center;
        }

        .team-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          border: 1px solid rgba(0,0,0,0.05);
          width: 100%;
        }

        .team-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }

        .card-image {
          width: 100%;
          height: 250px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .team-card:hover .card-img {
          transform: scale(1.05);
        }

        .card-content {
          padding: 1.5rem;
        }

        .card-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #1e293b;
        }

        .card-role {
          color: #3b82f6;
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .card-info {
          margin-bottom: 1rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.6rem;
          font-size: 0.9rem;
          color: #64748b;
        }

        .info-icon {
          width: 18px;
          height: 18px;
          margin-right: 10px;
          color: #3b82f6;
          font-size: 1rem;
          display: inline-block;
          text-align: center;
        }

        .phone-link {
          color: #64748b;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .phone-link:hover {
          color: #3b82f6;
        }

        .card-description {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-section {
            padding: 6rem 0 4rem 0;
            background-attachment: scroll;
          }

          .team-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            padding: 0 15px;
            max-width: 500px;
          }
          
          .nav-tabs {
            min-width: 280px;
            max-width: 320px;
            margin: -30px auto 2rem auto;
          }
          
          .nav-tab {
            padding: 12px 20px;
            font-size: 0.9rem;
          }
          
          .content-section {
            padding: 0;
          }
          
          .card-content {
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            padding: 5rem 0 3rem 0;
          }
          
          .hero-content {
            padding: 0 15px;
          }

          .nav-tabs {
            margin: -20px auto 1.5rem auto;
            min-width: 260px;
            max-width: 280px;
          }

          .team-grid {
            gap: 1rem;
            padding: 0 10px;
            max-width: 400px;
          }

          .card-image {
            height: 200px;
          }
        }

        /* Large screens - better centering and spacing */
        @media (min-width: 1200px) {
          .team-grid {
            grid-template-columns: repeat(auto-fit, minmax(350px, 400px));
            gap: 2.5rem;
            padding: 0 40px;
            max-width: 1600px;
          }
        }

        @media (min-width: 1600px) {
          .team-grid {
            grid-template-columns: repeat(auto-fit, minmax(380px, 420px));
            gap: 3rem;
            padding: 0 60px;
            max-width: 1800px;
          }
        }
      `}</style>

      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">🏆 Championship Hardworkers</div>
          <h1 className="hero-title">Our Elite Team</h1>
          <p className="hero-subtitle">Shaping the Future of Football with Experience and Passion</p>
        </div>
      </div>

      <div className="main-content">
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'coaches' ? 'active' : ''}`}
            onClick={() => setActiveTab('coaches')}
            aria-pressed={activeTab === 'coaches'}
          >
            Coaching Staff
          </button>
          <button 
            className={`nav-tab ${activeTab === 'players' ? 'active' : ''}`}
            onClick={() => setActiveTab('players')}
            aria-pressed={activeTab === 'players'}
          >
            Players
          </button>
        </div>

        {activeTab === 'coaches' && (
          <div className="content-section">
            <h2 className="section-title">Coaching Staff</h2>
            <div className="team-grid">
              {coaches.map((coach, index) => (
                <CoachCard key={`coach-${index}`} coach={coach} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'players' && (
          <div className="content-section">
            <h2 className="section-title">Players</h2>
            <div className="team-grid">
              {players.map((player, index) => (
                <PlayerCard key={`player-${index}`} player={player} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OurTeamPage;