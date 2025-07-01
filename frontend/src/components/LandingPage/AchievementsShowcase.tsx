import React, { useState } from 'react';
import { X, Trophy, Medal, Star, Award } from 'lucide-react';
import useAchievements from '../../hooks/useAchievements';
import { Achievement } from '../../types/achievement.type';
import './AchievementsShowcase.css';

const AchievementsShowcase = () => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const { achievements, loading, error } = useAchievements();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Championship': return <Trophy size={16} />;
      case 'Recognition': return <Award size={16} />;
      case 'Tournament': return <Medal size={16} />;
      case 'Alumni': return <Star size={16} />;
      case 'Community': return <Trophy size={16} />;
      default: return <Trophy size={16} />;
    }
  };

  const getCategoryClass = (category: string) => {
    return `category-${category.toLowerCase()}`;
  };

  const closeModal = () => {
    setSelectedAchievement(null);
  };

  // Handle keyboard events
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  // Loading state
  if (loading) {
    return (
      <section className="achievements-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Achievements</h2>
            <p className="section-description">Loading achievements...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="achievements-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Achievements</h2>
            <p className="section-description">
              Unable to load achievements at the moment. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="achievements-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Achievements</h2>
            <p className="section-description">
              Celebrating our journey of excellence and the milestones that define our success
            </p>
          </div>

          <div className="achievements-grid">
            {achievements.slice(0, 3).map((achievement) => (
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
                  src={selectedAchievement?.image}
                  alt={selectedAchievement?.title}
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