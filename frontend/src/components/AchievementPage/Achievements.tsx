import React, { useState, useMemo } from 'react';
import useAchievements from '../../hooks/useAchievements';
import { AchievementCard } from './AchievementCard';
import { AchievementModal } from './AchievementModal';
import './Achievements.css';

// Updated category options
const categories = ['All', 'Team', 'Individual', 'Community', 'Academic'] as const;
type CategoryFilter = typeof categories[number];

export const Achievements: React.FC = () => {
  const { achievements, loading, error } = useAchievements();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('All');
  const [selectedAchievement, setSelectedAchievement] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAchievements = useMemo(() => {
    if (activeFilter === 'All') {
      return achievements;
    }
    return achievements.filter(achievement => achievement.category === activeFilter);
  }, [activeFilter, achievements]);

  const handleCardClick = (achievement: any) => {
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

  if (loading) {
    return <div className="achievements-page">Loading achievements...</div>;
  }

  if (error) {
    return <div className="achievements-page">Error: {error}</div>;
  }

  return (
    <div className="achievements-page">
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
    </div>
  );
};