import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import useMatches from '../../hooks/useMatches';
import { Match } from '../../types/matches.type';
import './styles/UpcomingMatches.css';
import { useNavigate } from 'react-router-dom';

interface MatchCardProps {
  match: Match;
}

const UpcomingMatches: React.FC = () => {
  const navigate = useNavigate();
  const { upcomingMatches, loading, error } = useMatches();

  const formatDate = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).toUpperCase();
  };

  const formatTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
    return (
      <div className="match-card">
        {/* Teams Section */}
        <div className="teams-section">
          {/* HLSSA Team */}
          <div className="team">
            <div className="team-logo hlssa-logo">
              <img 
                src="https://i.ibb.co/JWPpTbt9/hlssa-optimized-1000.png" 
                alt="HLSSA Logo"
                className="team-logo-img"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'block';
                  }
                }}
              />
              <span className="team-logo-text" style={{ display: 'none' }}>HLSSA</span>
            </div>
            <span className="team-name">HLSSA</span>
          </div>

          {/* VS Section */}
          <div className="vs-section">
            <span className="vs-text">VS</span>
          </div>

          {/* Opponent Team */}
          <div className="team">
            <div className="team-logo away-logo">
              {match.opponent_image ? (
                <img 
                  src={match.opponent_image} 
                  alt={`${match.opponent_name} Logo`}
                  className="team-logo-img"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'block';
                    }
                  }}
                />
              ) : null}
              <span 
                className="team-logo-emoji" 
                style={{ display: match.opponent_image ? 'none' : 'block' }}
              >
                ⚽
              </span>
            </div>
            <span className="team-name">{match.opponent_name}</span>
          </div>
        </div>

        {/* Match Details */}
        <div className="match-details">
          <div className="match-detail">
            <Calendar className="detail-icon" />
            <span className="detail-text">{formatDate(match.datetime)}</span>
          </div>
          <div className="match-detail">
            <Clock className="detail-icon" />
            <span className="detail-text">{formatTime(match.datetime)}</span>
          </div>
          <div className="match-detail">
            <MapPin className="detail-icon" />
            <span className="detail-text">{match.location}</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="upcoming-matches-section">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="upcoming-matches-section">
        <div className="error-container">
          <p className="error-message">Error loading matches: {error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="upcoming-matches-section">
      <h1 className="section-title">Upcoming Matches</h1>
      
      {/* Matches Grid */}
      <div className="matches-grid">
        {upcomingMatches.length === 0 ? (
          <div className="no-matches-container">
            <div className="no-matches-content">
              <span className="no-matches-icon">📅</span>
              <h3>No upcoming matches</h3>
              <p>Check back soon for upcoming fixtures!</p>
            </div>
          </div>
        ) : (
          upcomingMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))
        )}
      </div>

      {/* View Full Schedule Button */}
      {upcomingMatches.length > 0 && (
        <div className="schedule-button-container">
          <button className="schedule-button" onClick={() => navigate('/matches')}>
            View Full Schedule
          </button>
        </div>
      )}
    </div>
  );
};

export default UpcomingMatches;