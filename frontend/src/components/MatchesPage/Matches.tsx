import React, { useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import './MatchesPage.css';

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeAway: 'HOME' | 'AWAY';
  date: string;
  time: string;
  venue: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  result?: 'WIN' | 'LOSS';
  score?: string;
}

interface MatchCardProps {
  match: Match;
  isPast?: boolean;
}

const Matches: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcomingMatches: Match[] = [
    {
      id: 1,
      homeTeam: 'HLSSA',
      awayTeam: 'Sunrise FC',
      homeAway: 'HOME',
      date: '28 JUN 2025',
      time: '4:30 PM',
      venue: 'Gachibowli Stadium, Hyderabad',
      homeTeamLogo: '⚽',
      awayTeamLogo: '⚽'
    },
    {
      id: 2,
      homeTeam: 'HLSSA',
      awayTeam: 'Victory United',
      homeAway: 'AWAY',
      date: '05 JUL 2025',
      time: '6:00 PM',
      venue: 'Kompally Sports Complex',
      homeTeamLogo: '⚽',
      awayTeamLogo: '⚽'
    },
    {
      id: 3,
      homeTeam: 'HLSSA',
      awayTeam: 'Elite Academy',
      homeAway: 'HOME',
      date: '12 JUL 2025',
      time: '5:15 PM',
      venue: 'HLSSA Home Ground',
      homeTeamLogo: '⚽',
      awayTeamLogo: '⚽'
    },
    {
      id: 4,
      homeTeam: 'HLSSA',
      awayTeam: 'Thunder Sports',
      homeAway: 'AWAY',
      date: '19 JUL 2025',
      time: '7:00 PM',
      venue: 'Shamshabad Sports Arena',
      homeTeamLogo: '⚽',
      awayTeamLogo: '⚽'
    },
    {
      id: 5,
      homeTeam: 'HLSSA',
      awayTeam: 'Champions FC',
      homeAway: 'HOME',
      date: '26 JUL 2025',
      time: '4:45 PM',
      venue: 'HLSSA Home Ground',
      homeTeamLogo: '⚽',
      awayTeamLogo: '⚽'
    },
    {
      id: 6,
      homeTeam: 'HLSSA',
      awayTeam: 'Rising Stars',
      homeAway: 'AWAY',
      date: '02 AUG 2025',
      time: '6:30 PM',
      venue: 'Secunderabad Stadium',
      homeTeamLogo: '⚽',
      awayTeamLogo: '⚽'
    }
  ];

  const pastMatches: Match[] = [
    {
      id: 1,
      homeTeam: 'HLSSA',
      awayTeam: 'Phoenix United',
      homeAway: 'HOME',
      date: '15 MAY 2025',
      time: '5:00 PM',
      venue: 'HLSSA Home Ground',
      result: 'WIN',
      score: '3-1',
      homeTeamLogo: '⚽',
      awayTeamLogo: '⚽'
    },
    {
      id: 2,
      homeTeam: 'HLSSA',
      awayTeam: 'Metro FC',
      homeAway: 'AWAY',
      date: '22 MAY 2025',
      time: '6:15 PM',
      venue: 'Metro Sports Complex',
      result: 'LOSS',
      score: '1-2',
      homeTeamLogo: '⚽',
      awayTeamLogo: '⚽'
    },
    {
      id: 3,
      homeTeam: 'HLSSA',
      awayTeam: 'Galaxy Stars',
      homeAway: 'HOME',
      date: '29 MAY 2025',
      time: '4:30 PM',
      venue: 'HLSSA Home Ground',
      result: 'WIN',
      score: '2-0',
      homeTeamLogo: '⚽',
      awayTeamLogo: '⚽'
    },
    {
      id: 4,
      homeTeam: 'HLSSA',
      awayTeam: 'Blue Tigers',
      homeAway: 'AWAY',
      date: '05 JUN 2025',
      time: '7:00 PM',
      venue: 'Tiger Sports Arena',
      result: 'WIN',
      score: '4-2',
      homeTeamLogo: '⚽',
      awayTeamLogo: '⚽'
    },
    {
      id: 5,
      homeTeam: 'HLSSA',
      awayTeam: 'Red Eagles',
      homeAway: 'HOME',
      date: '12 JUN 2025',
      time: '5:30 PM',
      venue: 'HLSSA Home Ground',
      result: 'LOSS',
      score: '0-1',
      homeTeamLogo: '⚽',
      awayTeamLogo: '⚽'
    },
    {
      id: 6,
      homeTeam: 'HLSSA',
      awayTeam: 'Lightning FC',
      homeAway: 'AWAY',
      date: '19 JUN 2025',
      time: '6:45 PM',
      venue: 'Lightning Stadium',
      result: 'WIN',
      score: '3-2',
      homeTeamLogo: '⚽',
      awayTeamLogo: '⚽'
    }
  ];

  const MatchCard: React.FC<MatchCardProps> = ({ match, isPast = false }) => (
    <div className="match-card">
      {/* Home/Away Badge */}
      <div className="match-card-header">
        <span className={`badge ${match.homeAway === 'HOME' ? 'badge-home' : 'badge-away'}`}>
          {match.homeAway}
        </span>
        {isPast && match.result && (
          <span className={`badge ${match.result === 'WIN' ? 'badge-win' : 'badge-loss'}`}>
            {match.result}
          </span>
        )}
      </div>

      {/* Teams Section */}
      <div className="teams-section">
        {/* Home Team */}
        <div className="team">
          <div className="team-logo hlssa-logo">
            <span className="team-logo-text">HLSSA</span>
          </div>
          <span className="team-name">HLSSA</span>
        </div>

        {/* VS and Score */}
        <div className="vs-section">
          <span className="vs-text">VS</span>
          {isPast && match.score && (
            <div className="score-display">
              <span className="score-text">{match.score}</span>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="team">
          <div className="team-logo away-logo">
            <span className="team-logo-emoji">{match.awayTeamLogo}</span>
          </div>
          <span className="team-name">{match.awayTeam}</span>
        </div>
      </div>

      {/* Match Details */}
      <div className="match-details">
        <div className="match-detail">
          <Calendar className="detail-icon" />
          <span className="detail-text">{match.date}</span>
        </div>
        <div className="match-detail">
          <Clock className="detail-icon" />
          <span className="detail-text">{match.time}</span>
        </div>
        <div className="match-detail">
          <MapPin className="detail-icon" />
          <span className="detail-text">{match.venue}</span>
        </div>
      </div>
    </div>
  );

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
              {activeTab === 'upcoming' ? 'Upcoming' : 'Past'}{' '}
              <span className="title-highlight">Matches</span>
            </h1>
            
            {/* Subtitle */}
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
              Upcoming Matches
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`tab-button ${activeTab === 'past' ? 'tab-active' : ''}`}
            >
              Past Matches
            </button>
          </div>
        </div>

        {/* Matches Grid */}
        <div className="matches-grid">
          {(activeTab === 'upcoming' ? upcomingMatches : pastMatches).map((match) => (
            <MatchCard key={match.id} match={match} isPast={activeTab === 'past'} />
          ))}
        </div>

        {/* View Full Schedule Button */}
        {activeTab === 'upcoming' && (
          <div className="schedule-button-container">
            <button className="schedule-button">
              View Full Schedule
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;