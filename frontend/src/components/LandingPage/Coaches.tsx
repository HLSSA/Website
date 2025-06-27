import React, { useRef } from 'react';

const CoachesOnlyPage = () => {
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
          background: transparent;
          min-height: 100vh;
          color: #333;
        }

        .hero-section {
          background: transparent;
          color: #333;
          padding: 80px 20px 40px 20px;
          text-align: center;
        }

        .hero-content h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          margin-bottom: 1rem;
          color: #1e293b;
        }

        .hero-content p {
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        .main-content {
          background: transparent;
          padding: 40px 0;
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

        .coach-card {
          background: transparent;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          width: 280px;
          height: 360px;
          flex-shrink: 0;
          border: none;
          box-shadow: none;
        }

        .coach-card:hover {
          transform: translateY(-8px);
        }

        .coach-image-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 16px;
          background: transparent;
        }

        .coach-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
          background: transparent;
          border-radius: 16px;
        }

        .coach-card:hover .coach-image {
          transform: scale(1.05);
        }

        .coach-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(30, 41, 59, 0.85));
          padding: 30px 20px 20px 20px;
          color: white;
          border-radius: 0 0 16px 16px;
        }

        .coach-name {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 4px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .coach-role {
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
            padding: 60px 15px 40px 15px;
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

          .coach-card {
            width: 240px;
            height: 320px;
          }
        }

        @media (max-width: 480px) {
          .cards-row {
            gap: 12px;
          }

          .coach-card {
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
          <h1>Our Elite Coaching Staff</h1>
          <p>Shaping the Future of Football with Experience and Passion</p>
        </div>
      </div>

      <div className="main-content">
        <div className="scrollable-section">
          <div className="section-header">
            <h2 className="section-title">Coaching Staff</h2>
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
              {coaches.map((coach, index) => (
                <CoachCard key={index} coach={coach} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachesOnlyPage;