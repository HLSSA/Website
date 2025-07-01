import React, { useEffect } from 'react';
import { Achievement } from '../../types/achievement.type';

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

  if (!isOpen || !achievement) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px',
        overflowY: 'auto'
      }}
    >
      <div 
        className="modal-content"
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        <button 
          className="modal-close" 
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="modal-body" style={{ padding: '0' }}>
          <div className="modal-media" style={{ marginBottom: '0', width: '100%' }}>
            {achievement.video ? (
              <div style={{
                position: 'relative',
                width: '100%',
                height: '400px',
                overflow: 'hidden'
              }}>
                <video
                  controls
                  src={achievement.video}
                  poster={achievement.image}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    border: 'none',
                    display: 'block'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : achievement.image ? (
              <div style={{
                width: '100%',
                height: '400px',
                overflow: 'hidden'
              }}>
                <img 
                  src={achievement.image} 
                  alt={achievement.title} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ) : null}
          </div>
          
          <div style={{ padding: '24px' }}>
          
          <div className="modal-info">
            <div 
              className="modal-category" 
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '20px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '16px',
                backgroundColor: getCategoryColor(achievement.category)
              }}
            >
              {achievement.category}
            </div>
            
            <h2 className="modal-title" style={{ fontSize: '24px', margin: '0 0 8px 0', color: '#1A1B25' }}>
              {achievement.title}
            </h2>
            
            <div 
              className="modal-description" 
              style={{ 
                color: '#4A4A4A',
                lineHeight: 1.6,
                fontSize: '16px'
              }}
            >
              <p style={{ margin: 0 }}>{achievement.description}</p>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};