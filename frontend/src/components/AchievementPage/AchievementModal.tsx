import React, { useEffect } from 'react';
import { Achievement } from './achievementsData';

interface AchievementModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({ 
  achievement, 
  isOpen, 
  onClose 
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !achievement) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button 
          className="modal-close" 
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="modal-body">
          <div className="modal-image">
            <img src={achievement.image} alt={achievement.title} />
          </div>
          
          <div className="modal-info">
            <div className="modal-category" style={{
              backgroundColor: achievement.category === 'Tournament Win' ? '#FDE350' :
                             achievement.category === 'Player Accolade' ? '#53A548' : '#FF6B6B'
            }}>
              {achievement.category}
            </div>
            
            <h2 className="modal-title">{achievement.title}</h2>
            <p className="modal-date">{achievement.date}</p>
            <div className="modal-description">
              <p>{achievement.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};