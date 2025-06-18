import React, { useState, useMemo } from 'react';
import { achievements, categories, CategoryFilter, Achievement } from './achievementsData';
import { AchievementCard } from './AchievementCard';
import { AchievementModal } from './AchievementModal';
// import '../styles/AchievementsPage.css';
import styled from 'styled-components';

export const Achievements: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('All');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAchievements = useMemo(() => {
    if (activeFilter === 'All') {
      return achievements;
    }
    return achievements.filter(achievement => achievement.category === activeFilter);
  }, [activeFilter]);

  const handleCardClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAchievement(null);
  };

  const handleFilterClick = (filter: CategoryFilter) => {
    setActiveFilter(filter);
  };

  return (
    <StyledWrapper className="achievements-page">
      <header className="achievements-header">
        <h1 className="achievements-title">Our Wall of Fame</h1>
        <p className="achievements-subtitle">
          Celebrate the milestones and championships from our journey
        </p>
      </header>

      <div className="filter-controls">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-btn ${activeFilter === category ? 'filter-btn--active' : ''}`}
            onClick={() => handleFilterClick(category)}
            aria-pressed={activeFilter === category}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="achievements-grid">
        {filteredAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            onClick={handleCardClick}
          />
        ))}
      </div>

      <AchievementModal
        achievement={selectedAchievement}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </StyledWrapper>
  );
};

// ---------- STYLES ----------

const StyledWrapper = styled.div`
    --primary-blue: #1256C4;
    --dark-text: #1A1B25;
    --accent-yellow: #FDE350;
    --success-green: #53A548;
    --collaboration-red: #FF6B6B;
    --light-gray: #F8F9FA;
    --medium-gray: #E9ECEF;
    --white: #FFFFFF;
    --overlay-dark: rgba(26, 27, 37, 0.85);
    --modal-backdrop: rgba(26, 27, 37, 0.9);
    
    --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    
    --border-radius-sm: 8px;
    --border-radius-md: 12px;
    --border-radius-lg: 16px;
    
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
    
    --transition-fast: all 0.2s ease;
    --transition-medium: all 0.3s ease;
    --transition-slow: all 0.4s ease;
  }
  
  * {
    box-sizing: border-box;
  }
  
  .achievements-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 2rem 1rem;
    font-family: var(--font-primary);
    line-height: 1.6;
    margin-top: 94px;
  }
  
  /* Header Styles */
  .achievements-header {
    text-align: center;
    margin-bottom: 3rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .achievements-title {
    font-size: 3.5rem;
    font-weight: var(--font-weight-bold);
    color: var(--dark-text);
    margin: 0 0 1rem 0;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }
  
  .achievements-subtitle {
    font-size: 1.25rem;
    color: #6c757d;
    margin: 0;
    font-weight: var(--font-weight-normal);
    opacity: 0.8;
  }
  
  /* Filter Controls */
  .filter-controls {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
  }
  
  .filter-btn {
    padding: 0.75rem 1.5rem;
    border: 1px solid var(--dark-text);
    background: transparent;
    color: var(--dark-text);
    font-family: var(--font-primary);
    font-size: 1rem;
    font-weight: var(--font-weight-medium);
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: var(--transition-medium);
    white-space: nowrap;
  }
  
  .filter-btn:hover {
    background: var(--medium-gray);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
  
  .filter-btn:focus {
    outline: 2px solid var(--primary-blue);
    outline-offset: 2px;
  }
  
  .filter-btn--active {
    background: var(--primary-blue);
    color: var(--white);
    border-color: var(--primary-blue);
    box-shadow: var(--shadow-md);
  }
  
  .filter-btn--active:hover {
    background: #0d47a1;
    border-color: #0d47a1;
  }
  
  /* Achievement Grid */
  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  /* Achievement Card */
  .achievement-card {
    aspect-ratio: 4/5;
    background-size: cover;
    background-position: center;
    border-radius: var(--border-radius-lg);
    position: relative;
    cursor: pointer;
    overflow: hidden;
    transition: var(--transition-medium);
    box-shadow: var(--shadow-md);
  }
  
  .achievement-card:hover {
    transform: scale(1.03);
    box-shadow: var(--shadow-lg);
  }
  
  .achievement-card:focus {
    outline: 3px solid var(--primary-blue);
    outline-offset: 4px;
  }
  
  .achievement-card__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, var(--overlay-dark), transparent 60%);
    transition: var(--transition-medium);
  }
  
  .achievement-card:hover .achievement-card__overlay {
    background: linear-gradient(to top, var(--overlay-dark), rgba(26, 27, 37, 0.3));
  }
  
  .achievement-card__content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 2;
  }
  
  .achievement-card__category {
    align-self: flex-start;
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius-sm);
    font-size: 0.875rem;
    font-weight: var(--font-weight-semibold);
    color: var(--dark-text);
    backdrop-filter: blur(8px);
    box-shadow: var(--shadow-sm);
  }
  
  .achievement-card__info {
    color: var(--white);
  }
  
  .achievement-card__title {
    font-size: 1.5rem;
    font-weight: var(--font-weight-bold);
    margin: 0 0 0.5rem 0;
    line-height: 1.3;
  }
  
  .achievement-card__date {
    font-size: 1rem;
    margin: 0;
    opacity: 0.9;
    font-weight: var(--font-weight-medium);
  }
  
  .achievement-card__hover-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.95);
    color: var(--dark-text);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: var(--transition-medium);
    backdrop-filter: blur(8px);
    box-shadow: var(--shadow-md);
  }
  
  .achievement-card:hover .achievement-card__hover-icon {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
  
  /* Modal Styles */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--modal-backdrop);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .modal-content {
    background: var(--white);
    border-radius: var(--border-radius-lg);
    max-width: 1000px;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    position: relative;
    animation: slideUp 0.3s ease;
    box-shadow: var(--shadow-lg);
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(30px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .modal-close {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: rgba(255, 255, 255, 0.95);
    border: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: var(--transition-fast);
    color: var(--dark-text);
    backdrop-filter: blur(8px);
    box-shadow: var(--shadow-sm);
  }
  
  .modal-close:hover {
    background: var(--white);
    transform: scale(1.1);
    box-shadow: var(--shadow-md);
  }
  
  .modal-close:focus {
    outline: 2px solid var(--primary-blue);
    outline-offset: 2px;
  }
  
  .modal-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 500px;
  }
  
  .modal-image {
    background: var(--light-gray);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  .modal-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .modal-info {
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .modal-category {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius-sm);
    font-size: 0.875rem;
    font-weight: var(--font-weight-semibold);
    color: var(--dark-text);
    margin-bottom: 1.5rem;
    align-self: flex-start;
  }
  
  .modal-title {
    font-size: 2.5rem;
    font-weight: var(--font-weight-bold);
    color: var(--dark-text);
    margin: 0 0 1rem 0;
    line-height: 1.2;
  }
  
  .modal-date {
    font-size: 1.125rem;
    color: #6c757d;
    margin: 0 0 2rem 0;
    font-weight: var(--font-weight-medium);
  }
  
  .modal-description p {
    font-size: 1.125rem;
    line-height: 1.7;
    color: var(--dark-text);
    margin: 0;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .achievements-page {
      padding: 1rem;
    }
    
    .achievements-title {
      font-size: 2.5rem;
    }
    
    .achievements-subtitle {
      font-size: 1.125rem;
    }
    
    .achievements-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .filter-controls {
      gap: 0.75rem;
    }
    
    .filter-btn {
      padding: 0.625rem 1.25rem;
      font-size: 0.875rem;
    }
    
    .achievement-card__title {
      font-size: 1.25rem;
    }
    
    .modal-backdrop {
      padding: 1rem;
    }
    
    .modal-body {
      grid-template-columns: 1fr;
      min-height: auto;
    }
    
    .modal-info {
      padding: 2rem;
    }
    
    .modal-title {
      font-size: 2rem;
    }
    
    .modal-description p {
      font-size: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .achievements-title {
      font-size: 2rem;
    }
    
    .filter-controls {
      flex-direction: column;
      align-items: center;
    }
    
    .filter-btn {
      width: 200px;
    }
    
    .modal-info {
      padding: 1.5rem;
    }
    
    .modal-title {
      font-size: 1.75rem;
    }
  }
  
  /* Accessibility improvements */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .achievement-card {
      border: 2px solid var(--dark-text);
    }
    
    .filter-btn {
      border-width: 2px;
    }
  }
  
  /* Focus visible for keyboard navigation */
  .achievement-card:focus-visible,
  .filter-btn:focus-visible,
  .modal-close:focus-visible {
    outline: 3px solid var(--primary-blue);
    outline-offset: 2px;
  }`;

