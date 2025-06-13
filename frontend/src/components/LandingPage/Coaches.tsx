import { useState } from 'react';
import { Star, Award, Users, Calendar } from 'lucide-react';

const CoachingStaff = () => {
  const [hoveredCoach, setHoveredCoach] = useState(null);

  const coaches = [
    {
      id: 1,
      name: "Mohammed Faz Khan",
      role: "Head Coach",
      experience: "15+ Years",
      certifications: ["UEFA 'A' License", "AFC Pro License"],
      specialization: "Youth Development & Tactical Training",
      achievements: ["Led team to 3 State Championships", "Developed 20+ professional players"],
      image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      philosophy: "Every player has the potential to be great. My role is to unlock that potential through structured training and mentorship."
    },
    {
      id: 2,
      name: "Mohammed Aman Alam",
      role: "Technical Director",
      experience: "12+ Years",
      certifications: ["UEFA 'B' License", "AFC Youth Coaching"],
      specialization: "Technical Skills & Ball Mastery",
      achievements: ["Former professional player", "Technical development expert"],
      image: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      philosophy: "Technical excellence is the foundation of great football. We focus on building skills that last a lifetime."
    },
    {
      id: 3,
      name: "Syed Sahaan",
      role: "Youth Coach",
      experience: "8+ Years",
      certifications: ["AFC 'C' License", "Grassroots Coaching"],
      specialization: "Youth Development & Character Building",
      achievements: ["U-16 League Champions coach", "Community development leader"],
      image: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      philosophy: "Football teaches life lessons. Discipline, teamwork, and perseverance on the field translate to success in life."
    },
    {
      id: 4,
      name: "Mohammed Muhibullah",
      role: "Fitness Coach",
      experience: "10+ Years",
      certifications: ["Sports Science Degree", "Strength & Conditioning"],
      specialization: "Physical Conditioning & Injury Prevention",
      achievements: ["Reduced injury rates by 60%", "Fitness protocol designer"],
      image: "https://images.pexels.com/photos/1040882/pexels-photo-1040882.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      philosophy: "A strong body supports a sharp mind. Physical fitness is the platform for technical and tactical excellence."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        /* Main section styles */
        .coaching-staff-section {
          padding: 80px 0;
          background-color: white;
          min-height: 100vh;
        }

        .coaching-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 16px;
        }

        @media (min-width: 640px) {
          .coaching-container {
            padding: 0 24px;
          }
        }

        @media (min-width: 1024px) {
          .coaching-container {
            padding: 0 32px;
          }
        }

        /* Header section */
        .coaching-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .coaching-main-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .coaching-main-subtitle {
          font-size: 1.25rem;
          color: #4b5563;
          max-width: 512px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Coaches grid */
        .coaches-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }

        @media (min-width: 768px) {
          .coaches-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .coaches-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        /* Coach card - Fixed hover animation */
        .coach-card {
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          height: 450px;
          position: relative;
          cursor: pointer;
        }

        .coach-card:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          transform: translateY(-8px);
        }

        /* Card content containers - Fixed positioning */
        .card-content {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-front {
          opacity: 1;
          transform: rotateY(0deg);
          backface-visibility: hidden;
        }

        .card-back {
          opacity: 0;
          transform: rotateY(180deg);
          backface-visibility: hidden;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
        }

        .coach-card:hover .card-front {
          opacity: 0;
          transform: rotateY(-180deg);
        }

        .coach-card:hover .card-back {
          opacity: 1;
          transform: rotateY(0deg);
        }

        /* Coach image */
        .coach-image-container {
          position: relative;
          height: 256px;
          overflow: hidden;
        }

        .coach-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .coach-card:hover .coach-image {
          transform: scale(1.05);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
        }

        .coach-name-overlay {
          position: absolute;
          bottom: 16px;
          left: 16px;
          color: white;
          z-index: 2;
        }

        .coach-name {
          font-size: 1.125rem;
          font-weight: 700;
          margin: 0 0 4px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .coach-role-overlay {
          font-size: 0.875rem;
          color: #e5e7eb;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        /* Coach info section */
        .coach-info {
          padding: 24px;
          background-color: white;
        }

        .experience-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .experience-icon {
          width: 16px;
          height: 16px;
          color: #2563eb;
          flex-shrink: 0;
        }

        .experience-text {
          font-size: 0.875rem;
          font-weight: 500;
          color: #4b5563;
        }

        .specialization-info {
          margin-bottom: 16px;
        }

        .specialization-label {
          font-size: 0.875rem;
          color: #4b5563;
          font-weight: 500;
          margin: 0 0 8px 0;
        }

        .specialization-text {
          font-size: 0.875rem;
          color: #111827;
          margin: 0;
          line-height: 1.4;
        }

        /* Certifications */
        .certifications {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .certification-badge {
          display: inline-block;
          background-color: #dbeafe;
          color: #1e40af;
          font-size: 0.75rem;
          padding: 4px 8px;
          border-radius: 50px;
          font-weight: 500;
          border: 1px solid #bfdbfe;
        }

        /* Card back content - Fixed styling */
        .card-back-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 24px;
          background: transparent;
        }

        .achievements-section {
          background: transparent;
        }

        .coach-name-back {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: white;
        }

        .coach-role-back {
          color: #bfdbfe;
          margin: 0 0 20px 0;
          font-size: 0.875rem;
        }

        .achievements {
          margin-bottom: 20px;
        }

        .achievements-title {
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0 0 12px 0;
          display: flex;
          align-items: center;
          color: white;
        }

        .achievement-icon {
          width: 16px;
          height: 16px;
          margin-right: 8px;
          color: #fbbf24;
        }

        .achievements-list {
          font-size: 0.875rem;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .achievement-item {
          color: #dbeafe;
          margin-bottom: 6px;
          line-height: 1.4;
          padding-left: 8px;
        }

        .philosophy-section {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .philosophy-title {
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: white;
        }

        .philosophy-text {
          font-size: 0.875rem;
          color: #dbeafe;
          font-style: italic;
          margin: 0;
          line-height: 1.5;
        }

        /* Stats section */
        .stats-section {
          margin-top: 80px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 20px;
          padding: 40px 32px;
          border: 1px solid #e2e8f0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          text-align: center;
        }

        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          border-radius: 12px;
          background-color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease;
        }

        .stat-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }


        .stat-number {
          font-size: 1.875rem;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 8px;
          line-height: 1;
        }

        .stat-label {
          color: #4b5563;
          font-size: 0.875rem;
          line-height: 1.4;
          font-weight: 500;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .coaching-main-title {
            font-size: 1.875rem;
          }
          
          .coach-card {
            height: 400px;
          }
          
          .card-back-content {
            padding: 20px;
          }
          
          .achievement-item {
            font-size: 0.8rem;
          }
        }
      `}</style>

      <section id="team" className="coaching-staff-section">
        <div className="coaching-container">
          <div className="coaching-header">
            <h2 className="coaching-main-title">Our Elite Coaching Staff</h2>
            <p className="coaching-main-subtitle">
              Shaping the Future of Football with Experience and Passion
            </p>
          </div>

          <div className="coaches-grid">
            {coaches.map((coach) => (
              <div
                key={coach.id}
                className="coach-card"
                onMouseEnter={() => setHoveredCoach(coach.id)}
                onMouseLeave={() => setHoveredCoach(null)}
              >
                {/* Card Front */}
                <div className="card-content card-front">
                  <div className="coach-image-container">
                    <img
                      src={coach.image}
                      alt={coach.name}
                      className="coach-image"
                    />
                    <div className="image-overlay"></div>
                    <div className="coach-name-overlay">
                      <h3 className="coach-name">{coach.name}</h3>
                      <p className="coach-role-overlay">{coach.role}</p>
                    </div>
                  </div>
                  
                  <div className="coach-info">
                    <div className="experience-info">
                      <Calendar className="experience-icon" />
                      <span className="experience-text">{coach.experience}</span>
                    </div>
                    
                    <div className="specialization-info">
                      <p className="specialization-label">Specialization:</p>
                      <p className="specialization-text">{coach.specialization}</p>
                    </div>

                    <div className="certifications">
                      {coach.certifications.map((cert, index) => (
                        <span key={index} className="certification-badge">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Back (Hover State) */}
                <div className="card-content card-back">
                  <div className="card-back-content">
                    <div className="achievements-section">
                      <div className='achievements-section-content'>
                      <h3 className="coach-name-back">{coach.name}</h3>
                      <p className="coach-role-back">{coach.role}</p>
                      
                      <div className="achievements">
                        <p className="achievements-title">
                          <Award className="achievement-icon" />
                          Key Achievements
                        </p>
                        <ul className="achievements-list">
                          {coach.achievements.map((achievement, index) => (
                            <li key={index} className="achievement-item">• {achievement}</li>
                          ))}
                        </ul>
                      </div>
                      </div>
                    </div>
                    
                    <div className="philosophy-section">
                      <p className="philosophy-title">Philosophy</p>
                      <p className="philosophy-text">"{coach.philosophy}"</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Years Combined Experience</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">15+</div>
                <div className="stat-label">Professional Certifications</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Players Developed</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">25+</div>
                <div className="stat-label">Trophies Won</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoachingStaff;