import React from 'react';
import { Achievement } from '../../types/achievement.type';

interface AchievementCardProps {
  achievement: Achievement;
  onClick: (achievement: Achievement) => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, onClick }) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tournament':
      case 'tournament win':
        return '#FDE350';
      case 'player':
      case 'player accolade':
        return '#53A548';
      case 'collaboration':
        return '#FF6B6B';
      case 'team':
        return '#4A90E2';
      case 'individual':
        return '#9B59B6';
      case 'community':
        return '#E74C3C';
      case 'academic':
        return '#2ECC71';
      default:
        return '#FDE350';
    }
  };

  const backgroundImage = achievement.video ? 
    (achievement.image || '') : 
    (achievement.image || '');

  return (
    <div 
      className="achievement-card" 
      onClick={() => onClick(achievement)}
      style={{ 
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(achievement);
        }
      }}
      aria-label={`View details for ${achievement.title}`}
    >
      {achievement.video && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          width: '48px',
          height: '48px',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5V19L19 12L8 5Z" fill="white" />
          </svg>
        </div>
      )}
      <div className="achievement-card__overlay"></div>
      <div className="achievement-card__content">
        <div 
          className="achievement-card__category" 
          style={{ backgroundColor: getCategoryColor(achievement.category) }}
        >
          {achievement.category}
        </div>
        <div className="achievement-card__info">
          <h3 className="achievement-card__title">{achievement.title}</h3>
          <p className="achievement-card__date">{achievement.date}</p>
        </div>
      </div>
      <div className="achievement-card__hover-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>
    </div>
  );
};