import React from 'react';
import { Achievement } from './achievementsData';

interface AchievementCardProps {
  achievement: Achievement;
  onClick: (achievement: Achievement) => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, onClick }) => {
  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case 'Tournament Win':
        return '#FDE350';
      case 'Player Accolade':
        return '#53A548';
      case 'Collaboration':
        return '#FF6B6B';
      default:
        return '#FDE350';
    }
  };

  return (
    <div 
      className="achievement-card" 
      onClick={() => onClick(achievement)}
      style={{ backgroundImage: `url(${achievement.image})` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(achievement);
        }
      }}
      aria-label={`View details for ${achievement.title}`}
    >
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