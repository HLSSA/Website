import React, { useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import useMatches from '../../hooks/useMatches';
import { Match } from '../../types/matches.type';
import './MatchesPage.css';

interface MatchCardProps {
  match: Match;
  isPast?: boolean;
}

const Matches: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  
  const { upcomingMatches, pastMatches, loading, error } = useMatches();

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

  // Simplified result formatting - just display the text result as is
  const formatMatchResult = (result: string) => {
    if (!result) return null;
    return result;
  };

  // Determine match status from result text
  const getMatchStatus = (result: string) => {
    if (!result) return null;
    
    const resultLower = result.toLowerCase();
    if (resultLower.includes('won') || resultLower.includes('win')) {
      return 'WIN';
    } else if (resultLower.includes('lost') || resultLower.includes('loss')) {
      return 'LOSS';
    } else if (resultLower.includes('draw') || resultLower.includes('tie')) {
      return 'DRAW';
    }
    
    return null;
  };

  const MatchCard: React.FC<MatchCardProps> = ({ match, isPast = false }) => {
    const matchStatus = isPast ? getMatchStatus(match.result || '') : null;
    const resultText = isPast ? formatMatchResult(match.result || '') : null;

    return (
      <div className="match-card">
        {/* Match Status Badge */}
        {isPast && matchStatus && (
          <div className="match-card-header">
            <span className={`badge ${
              matchStatus === 'WIN' ? 'badge-win' : 
              matchStatus === 'LOSS' ? 'badge-loss' : 
              'badge-draw'
            }`}>
              {matchStatus}
            </span>
          </div>
        )}

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

        {/* Match Result Text for Past Matches */}
        {isPast && resultText && (
          <div className="match-result">
            <p className="result-text">{resultText}</p>
          </div>
        )}

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
      <div className="matches-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="matches-container">
        <div className="error-container">
          <p className="error-message">Error loading matches: {error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentMatches = activeTab === 'upcoming' ? upcomingMatches : pastMatches;

  return (
    <div className="matches-container">
      {/* Header Section with Background Image */}
      <div className="header-section">
        <div className="header-overlay">
          <div className="header-content">
            {/* Badge */}
            <div className="championship-badge">
              <span className="badge-text">
                🏆 Championship Journey
              </span>
            </div>
            
            {/* Main Title */}
            <h1 className="main-title">
              {activeTab === 'upcoming' ? 'Upcoming' : 'Past'} Matches
            </h1>
            <p className="subtitle">
              {activeTab === 'upcoming' 
                ? 'Follow our journey as we compete against the best teams in Hyderabad. Every match is a step towards excellence.'
                : 'Relive our victories and learn from our challenges. Each game tells a story of growth and determination.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Navigation Tabs */}
        <div className="tabs-container">
          <div className="tabs-wrapper">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`tab-button ${activeTab === 'upcoming' ? 'tab-active' : ''}`}
            >
              Upcoming Matches ({upcomingMatches.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`tab-button ${activeTab === 'past' ? 'tab-active' : ''}`}
            >
              Past Matches ({pastMatches.length})
            </button>
          </div>
        </div>

        {/* Matches Grid */}
        <div className="matches-grid">
          {currentMatches.length === 0 ? (
            <div className="no-matches-container">
              <div className="no-matches-content">
                <span className="no-matches-icon">📅</span>
                <h3>No {activeTab} matches</h3>
                <p>
                  {activeTab === 'upcoming' 
                    ? 'Check back soon for upcoming fixtures!'
                    : 'No past matches to display yet.'
                  }
                </p>
              </div>
            </div>
          ) : (
            currentMatches.map((match) => (
              <MatchCard key={match.id} match={match} isPast={activeTab === 'past'} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Matches;