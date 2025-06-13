import React, { useState } from 'react';
import { X, Trophy, Medal, Star, Award } from 'lucide-react';

const AchievementsShowcase = () => {
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const achievements = [
    {
      id: 1,
      title: "U-16 League Champions 2024",
      description: "Our U-16 boys clinched the title after a thrilling final against Sunrise FC. The team showed exceptional teamwork and determination throughout the tournament, winning 8 out of 9 matches and scoring 32 goals while conceding only 6. This victory marked our third consecutive championship in this age group.",
      image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      category: "Championship",
      year: "2024"
    },
    {
      id: 2,
      title: "Best Youth Academy Award",
      description: "Recognized by the Telangana Football Association as the Best Youth Development Academy for our outstanding contribution to nurturing young talent. This award acknowledges our innovative training methods, world-class facilities, and the success of our alumni in professional football.",
      image: "https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      category: "Recognition",
      year: "2024"
    },
    {
      id: 3,
      title: "Inter-Academy Tournament Victory",
      description: "Dominated the prestigious Inter-Academy Tournament with wins across multiple age groups. Our U-12, U-14, and U-16 teams all reached the finals, with two teams emerging as champions. This tournament featured the top 32 academies from across South India.",
      image: "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      category: "Tournament",
      year: "2024"
    },
    {
      id: 4,
      title: "Alumni Success Stories",
      description: "Proud to see our former students excel at state and national levels. Three of our alumni have been selected for the Telangana State Team, while two others have secured scholarships to premier football academies in Bangalore and Chennai.",
      image: "https://images.pexels.com/photos/262004/pexels-photo-262004.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      category: "Alumni",
      year: "2024"
    },
    {
      id: 5,
      title: "Community Impact Award",
      description: "Honored for our grassroots football development program that has reached over 2,000 children in underserved communities. Our mobile coaching units visit schools and conduct free training sessions, making football accessible to all children regardless of their economic background.",
      image: "https://images.pexels.com/photos/159515/football-american-football-runner-player-159515.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      category: "Community",
      year: "2024"
    },
    {
      id: 6,
      title: "State Championship Runners-Up",
      description: "Our senior team reached the finals of the Telangana State Championship, showcasing months of dedication and training. Though we finished as runners-up, the team's performance was exceptional, defeating several established clubs on the way to the final.",
      image: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      category: "Championship",
      year: "2023"
    }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Championship': return <Trophy size={16} />;
      case 'Recognition': return <Award size={16} />;
      case 'Tournament': return <Medal size={16} />;
      case 'Alumni': return <Star size={16} />;
      case 'Community': return <Trophy size={16} />;
      default: return <Trophy size={16} />;
    }
  };

  const getCategoryClass = (category) => {
    return `category-${category.toLowerCase()}`;
  };

  const closeModal = () => {
    setSelectedAchievement(null);
  };

  // Handle keyboard events
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedAchievement) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedAchievement]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (selectedAchievement) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedAchievement]);

  return (
    <>
      <style>{`
        .achievements-section {
          padding: 80px 0;
          background: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .section-description {
          font-size: 1.2rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }

        .achievement-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          aspect-ratio: 1;
          background: #f8f9fa;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .achievement-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .achievement-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .achievement-card:hover .achievement-image {
          transform: scale(1.1);
        }

        .achievement-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
          padding: 24px;
        }

        .achievement-card:hover .achievement-overlay {
          opacity: 1;
        }

        .achievement-content {
          color: white;
          width: 100%;
        }

        .achievement-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .category-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .category-championship {
          background: #fef3c7;
          color: #92400e;
        }

        .category-recognition {
          background: #dbeafe;
          color: #1e40af;
        }

        .category-tournament {
          background: #d1fae5;
          color: #065f46;
        }

        .category-alumni {
          background: #e9d5ff;
          color: #7c2d12;
        }

        .category-community {
          background: #fee2e2;
          color: #991b1b;
        }

        .achievement-year {
          color: #fbbf24;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .achievement-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .achievement-preview {
          font-size: 0.85rem;
          color: #d1d5db;
          line-height: 1.4;
          margin-bottom: 12px;
        }

        .read-more {
          color: #fbbf24;
          font-size: 0.85rem;
          font-weight: 600;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .modal-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          transform: scale(0.9);
          transition: transform 0.3s ease;
        }

        .modal-overlay.active .modal-content {
          transform: scale(1);
        }

        .modal-image-container {
          position: relative;
        }

        .modal-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          min-height: 300px;
        }

        .close-button {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: background 0.3s ease;
        }

        .close-button:hover {
          background: rgba(0, 0, 0, 0.7);
        }

        .modal-text {
          padding: 40px;
          overflow-y: auto;
        }

        .modal-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .modal-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 24px;
          line-height: 1.3;
        }

        .modal-description {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .modal-footer {
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .close-modal-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .close-modal-btn:hover {
          background: #1d4ed8;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .achievements-section {
            padding: 60px 0;
          }

          .section-title {
            font-size: 2rem;
          }

          .section-description {
            font-size: 1rem;
          }

          .achievements-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .modal-content {
            grid-template-columns: 1fr;
            max-height: 95vh;
          }

          .modal-text {
            padding: 24px;
          }

          .modal-title {
            font-size: 1.5rem;
          }

          .modal-description {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 16px;
          }

          .achievement-overlay {
            padding: 16px;
          }

          .modal-text {
            padding: 20px;
          }

          .achievements-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="achievements-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Achievements</h2>
            <p className="section-description">
              Celebrating our journey of excellence and the milestones that define our success
            </p>
          </div>

          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="achievement-card"
                onClick={() => setSelectedAchievement(achievement)}
              >
                <img
                  src={achievement.image}
                  alt={achievement.title}
                  className="achievement-image"
                />
                
                <div className="achievement-overlay">
                  <div className="achievement-content">
                    <div className="achievement-meta">
                      <span className={`category-badge ${getCategoryClass(achievement.category)}`}>
                        {getCategoryIcon(achievement.category)}
                        <span>{achievement.category}</span>
                      </span>
                      <span className="achievement-year">{achievement.year}</span>
                    </div>
                    <h3 className="achievement-title">{achievement.title}</h3>
                    <p className="achievement-preview">
                      {achievement.description.substring(0, 100)}...
                    </p>
                    <div className="read-more">Click to read more →</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {selectedAchievement && (
          <div 
            className={`modal-overlay ${selectedAchievement ? 'active' : ''}`}
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <div className="modal-content">
              <div className="modal-image-container">
                <img
                  src={selectedAchievement.image}
                  alt={selectedAchievement.title}
                  className="modal-image"
                />
                <button
                  onClick={closeModal}
                  className="close-button"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="modal-text">
                <div className="modal-meta">
                  <span className={`category-badge ${getCategoryClass(selectedAchievement.category)}`}>
                    {getCategoryIcon(selectedAchievement.category)}
                    <span>{selectedAchievement.category}</span>
                  </span>
                  <span className="achievement-year">{selectedAchievement.year}</span>
                </div>
                
                <h3 className="modal-title">{selectedAchievement.title}</h3>
                <p className="modal-description">{selectedAchievement.description}</p>
                
                <div className="modal-footer">
                  <button
                    onClick={closeModal}
                    className="close-modal-btn"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default AchievementsShowcase;