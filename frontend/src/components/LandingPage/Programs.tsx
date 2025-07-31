import React, { useState, useEffect } from 'react';
import { Zap, Trophy, Users, Dumbbell, Clock, Award } from 'lucide-react';

const Programs: React.FC = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    const cardElements = document.querySelectorAll('.program-card');
    
    cardElements.forEach((card, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleCards(prev => [...prev, index]);
            }
          });
        },
        { threshold: 0.1 }
      );
      
      observer.observe(card);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const programs = [
    {
      title: "Beginner",
      ageGroup: "Ages 4-8",
      description: "Introduction to football fundamentals in a fun, engaging environment.",
      icon: <Zap size={24} />,
      features: [
        "Focus on motor skills development",
        "Introduction to basic football techniques", 
        "Fun games and activities",
        "Small-sided matches",
        "2 sessions per week, 60 minutes each"
      ],
      color: "primary",
      delay: 0
    },
    {
      title: "Advance",
      ageGroup: "Ages 9-12", 
      description: "Building technical foundations and introducing tactical concepts.",
      icon: <Trophy size={24} />,
      features: [
        "Technical skills development",
        "Introduction to positional play",
        "Small-sided games and drills", 
        "Physical conditioning appropriate for age",
        "3 sessions per week, 90 minutes each"
      ],
      color: "secondary",
      delay: 0.2
    },
    {
      title: "Elite",
      ageGroup: "Ages 13-16",
      description: "Advanced training focusing on technical excellence and tactical understanding.",
      icon: <Award size={24} />,
      features: [
        "Advanced technical training",
        "Tactical awareness and game intelligence",
        "Position-specific training",
        "Strength and conditioning", 
        "4 sessions per week, 120 minutes each"
      ],
      color: "accent",
      delay: 0.4
    }
  ];

  const specializedFeatures = [
    {
      icon: <Dumbbell size={20} />,
      title: "Strength & Conditioning",
      description: "Age-appropriate fitness training"
    },
    {
      icon: <Users size={20} />,
      title: "Position-Specific", 
      description: "Focus on specialized roles"
    },
    {
      icon: <Zap size={20} />,
      title: "Goalkeeper Training",
      description: "Specialized for goalkeepers"
    },
    {
      icon: <Clock size={20} />,
      title: "1-on-1 Sessions",
      description: "Personalized coaching"
    }
  ];

  return (
    <>
      <style>{`
        .programs-section {
          padding: 60px 60px;
          background-color: #f9fafb;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .section-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1e3a8a;
          margin-bottom: 16px;
          margin-top: 0;
          text-align: center;
        }
        
        .section-subtitle {
          font-size: 1.125rem;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
          text-align: center;
        }
        
        .programs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 4rem;
        }
        
        @media (min-width: 768px) {
          .programs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (min-width: 1024px) {
          .programs-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        .program-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(20px);
        }
        
        .program-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .program-card:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
          transform: translateY(-5px);
        }
        
        .card-header {
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          color: white;
        }
        
        .card-header.primary {
          background: #3b82f6;
        }
        
        .card-header.secondary {
          background: #10b981;
        }
        
        .card-header.accent {
          background: #f59e0b;
        }
        
        .card-title {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0 0 4px 0;
        }
        
        .card-age {
          opacity: 0.8;
          font-size: 0.875rem;
          margin: 0;
        }
        
        .card-icon {
          background: white;
          padding: 12px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .card-icon.primary {
          color: #3b82f6;
        }
        
        .card-icon.secondary {
          color: #10b981;
        }
        
        .card-icon.accent {
          color: #f59e0b;
        }
        
        .card-body {
          padding: 24px;
        }
        
        .card-description {
          color: #374151;
          margin-bottom: 16px;
          line-height: 1.6;
        }
        
        .features-list {
          list-style: none;
          margin: 0 0 24px 0;
          padding: 0;
        }
        
        .features-list li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 8px;
          font-size: 0.9rem;
          color: #374151;
        }
        
        .checkmark {
          width: 20px;
          height: 20px;
          margin-right: 8px;
          margin-top: 2px;
          flex-shrink: 0;
        }
        
        .checkmark.primary {
          color: #3b82f6;
        }
        
        .checkmark.secondary {
          color: #10b981;
        }
        
        .checkmark.accent {
          color: #f59e0b;
        }
        
        .enroll-btn {
          display: block;
          width: 100%;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          text-align: center;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        
        .enroll-btn.primary {
          background: #3b82f6;
          color: white;
        }
        
        .enroll-btn.primary:hover {
          background: #2563eb;
        }
        
        .enroll-btn.secondary {
          background: #10b981;
          color: white;
        }
        
        .enroll-btn.secondary:hover {
          background: #059669;
        }
        
        .enroll-btn.accent {
          background: #f59e0b;
          color: white;
        }
        
        .enroll-btn.accent:hover {
          background: #d97706;
        }
        
        .specialized-section {
          background: #3b82f6;
          border-radius: 16px;
          padding: 48px;
          color: white;
        }
        
        .specialized-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
        }
        
        @media (min-width: 1024px) {
          .specialized-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        
        .specialized-title {
          font-size: 2rem;
          font-weight: bold;
          margin: 0 0 16px 0;
        }
        
        .specialized-description {
          opacity: 0.9;
          margin-bottom: 24px;
          line-height: 1.6;
        }
        
        .specialized-features {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 32px;
        }
        
        @media (min-width: 640px) {
          .specialized-features {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        .feature-card {
          background: rgba(59, 130, 246, 0.3);
          padding: 16px;
          border-radius: 12px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        
        .feature-icon {
          background: white;
          color: #3b82f6;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .feature-title {
          font-weight: bold;
          margin: 0 0 4px 0;
          font-size: 0.95rem;
        }
        
        .feature-description {
          opacity: 0.8;
          font-size: 0.875rem;
          margin: 0;
          line-height: 1.4;
        }
        
        .specialized-image {
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
          width: 100%;
          height: 400px;
          object-fit: cover;
        }
        
        .request-btn {
          background: white;
          color: #1e3a8a;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }
        
        .request-btn:hover {
          background: #f9fafb;
        }
        
        @media (max-width: 1023px) {
          .specialized-image {
            display: none;
          }
        }
        
        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
          }
          
          .specialized-section {
            padding: 32px 24px;
          }
          
          .specialized-title {
            font-size: 1.75rem;
          }
          
          .programs-section {
            padding: 60px 0;
          }
        }
      `}</style>
      
      <section className="programs-section" id="programs">
        <div className="">
          <div className="section-header">
            <h2 className="section-title">Our Training Programs</h2>
            <p className="section-subtitle">
              We offer age-appropriate training programs designed to develop technical skills, tactical awareness, physical fitness, and mental conditioning.
            </p>
          </div>

          <div className="programs-grid">
            {programs.map((program, index) => (
              <div 
                key={index}
                className={`program-card ${visibleCards.includes(index) ? 'visible' : ''}`}
                style={{ 
                  transitionDelay: `${program.delay}s` 
                }}
              >
                <div className={`card-header ${program.color}`}>
                  <div>
                    <h3 className="card-title">{program.title}</h3>
                    <p className="card-age">{program.ageGroup}</p>
                  </div>
                  <div className={`card-icon ${program.color}`}>
                    {program.icon}
                  </div>
                </div>
                <div className="card-body">
                  <p className="card-description">{program.description}</p>
                  <ul className="features-list">
                    {program.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>
                        <svg className={`checkmark ${program.color}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="/contact" className={`enroll-btn ${program.color}`}>
                    Enroll Now
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="specialized-section">
            <div className="specialized-grid">
              <div>
                <h3 className="specialized-title">
                  Specialized Training Options
                </h3>
                <p className="specialized-description">
                  Beyond our core programs, we offer specialized training sessions to help players excel in specific areas of the game.
                </p>
                <div className="specialized-features">
                  {specializedFeatures.map((feature, index) => (
                    <div key={index} className="feature-card">
                      <div className="feature-icon">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="feature-title">{feature.title}</h4>
                        <p className="feature-description">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="/contact" className="request-btn">
                  Request Special Training
                </a>
              </div>
              <div>
                <img 
                  src="https://res.cloudinary.com/dwlccnvfh/image/upload/v1753937979/iy147kee5hdfkohjt4ig_w1vysp.webp" 
                  alt="Specialized soccer training" 
                  className="specialized-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Programs;