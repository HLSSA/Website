import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

const UpcomingMatches = () => {
  const matches = [
    {
      id: 1,
      opponent: "Sunrise FC",
      date: "28 JUN 2025",
      time: "4:30 PM",
      location: "Gachibowli Stadium, Hyderabad",
      isHome: true,
      status: "upcoming"
    },
    {
      id: 2,
      opponent: "Victory United",
      date: "05 JUL 2025",
      time: "6:00 PM",
      location: "Kompally Sports Complex",
      isHome: false,
      status: "upcoming"
    },
    {
      id: 3,
      opponent: "Elite Academy",
      date: "12 JUL 2025",
      time: "5:15 PM",
      location: "HLSSA Home Ground",
      isHome: true,
      status: "upcoming"
    },
  ];

  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredViewAllButton, setHoveredViewAllButton] = useState(false);

  // Add CSS styles and keyframe animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      .pulse-animation {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const styles = {
    // Section styles
    section: {
      padding: '5rem 0',
      backgroundColor: '#f9fafb'
    },
    
    // Container styles
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem'
    },
    
    // Header styles
    header: {
      textAlign: 'center',
      marginBottom: '4rem'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '1rem',
      lineHeight: '1.2'
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#6b7280',
      maxWidth: '32rem',
      margin: '0 auto'
    },
    
    // Grid styles
    matchesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '1.5rem',
      marginBottom: '3rem'
    },
    
    // Card styles
    matchCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    matchCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    
    // Card content styles
    cardContent: {
      padding: '1.5rem'
    },
    
    // Match header styles
    matchHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem'
    },
    badge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    homeBadge: {
      backgroundColor: '#dcfce7',
      color: '#166534'
    },
    awayBadge: {
      backgroundColor: '#dbeafe',
      color: '#1e40af'
    },
    statusDot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#4ade80',
      borderRadius: '50%'
    },
    
    // Teams section styles
    teamsContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
      padding: '0 1rem'
    },
    teamSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flex: '1'
    },
    teamLogo: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '0.5rem'
    },
    hlssaLogo: {
      background: 'linear-gradient(135deg, #2563eb, #1e40af)',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '0.75rem'
    },
    opponentLogo: {
      backgroundColor: '#e5e7eb',
      fontSize: '1.25rem'
    },
    teamName: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#111827',
      textAlign: 'center'
    },
    vsText: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#9ca3af',
      margin: '0 1rem'
    },
    
    // Details section styles
    detailsContainer: {
      borderTop: '1px solid #e5e7eb',
      paddingTop: '1rem',
      marginBottom: '1rem'
    },
    detailItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '0.75rem',
      color: '#6b7280'
    },
    detailIcon: {
      width: '16px',
      height: '16px',
      marginRight: '0.5rem',
      flexShrink: 0
    },
    detailText: {
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    
    // Button styles
    mapButton: {
      width: '100%',
      padding: '0.5rem 1rem',
      backgroundColor: '#facc15',
      color: '#1e3a8a',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      outline: 'none'
    },
    mapButtonHover: {
      backgroundColor: '#fde047'
    },
    mapButtonFocus: {
      boxShadow: '0 0 0 2px #facc15'
    },
    
    // View all button styles
    viewAllContainer: {
      textAlign: 'center'
    },
    viewAllButton: {
      padding: '0.75rem 2rem',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '9999px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      outline: 'none'
    },
    viewAllButtonHover: {
      backgroundColor: '#1d4ed8'
    },
    viewAllButtonFocus: {
      boxShadow: '0 0 0 2px #93c5fd'
    }
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Upcoming Matches</h2>
          <p style={styles.subtitle}>
            Follow our journey as we compete against the best teams in Hyderabad
          </p>
        </div>

        {/* Matches Grid */}
        <div style={styles.matchesGrid}>
          {matches.map((match) => (
            <div
              key={match.id}
              style={{
                ...styles.matchCard,
                ...(hoveredCard === match.id ? styles.matchCardHover : {})
              }}
              onMouseEnter={() => setHoveredCard(match.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.cardContent}>
                {/* Match Header */}
                <div style={styles.matchHeader}>
                  <span style={{
                    ...styles.badge,
                    ...(match.isHome ? styles.homeBadge : styles.awayBadge)
                  }}>
                    {match.isHome ? 'HOME' : 'AWAY'}
                  </span>
                  <div 
                    style={styles.statusDot}
                    className="pulse-animation"
                  />
                </div>

                {/* Teams Section */}
                <div style={styles.teamsContainer}>
                  {/* HLSSA Team */}
                  <div style={styles.teamSection}>
                    <div style={{...styles.teamLogo, ...styles.hlssaLogo}}>
                      HLSSA
                    </div>
                    <div style={styles.teamName}>HLSSA</div>
                  </div>
                  
                  {/* VS */}
                  <div style={styles.vsText}>VS</div>
                  
                  {/* Opponent Team */}
                  <div style={styles.teamSection}>
                    <div style={{...styles.teamLogo, ...styles.opponentLogo}}>
                      ⚽
                    </div>
                    <div style={styles.teamName}>{match.opponent}</div>
                  </div>
                </div>

                {/* Match Details */}
                <div style={styles.detailsContainer}>
                  <div style={styles.detailItem}>
                    <Calendar style={styles.detailIcon} />
                    <span style={styles.detailText}>{match.date}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <Clock style={styles.detailIcon} />
                    <span style={styles.detailText}>{match.time}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <MapPin style={styles.detailIcon} />
                    <span style={styles.detailText}>{match.location}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  style={{
                    ...styles.mapButton,
                    ...(hoveredButton === match.id ? styles.mapButtonHover : {})
                  }}
                  onMouseEnter={() => setHoveredButton(match.id)}
                  onMouseLeave={() => setHoveredButton(null)}
                  onFocus={(e) => e.target.style.boxShadow = styles.mapButtonFocus.boxShadow}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                >
                  View on Map
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div style={styles.viewAllContainer}>
          <button 
            style={{
              ...styles.viewAllButton,
              ...(hoveredViewAllButton ? styles.viewAllButtonHover : {})
            }}
            onMouseEnter={() => setHoveredViewAllButton(true)}
            onMouseLeave={() => setHoveredViewAllButton(false)}
            onFocus={(e) => e.target.style.boxShadow = styles.viewAllButtonFocus.boxShadow}
            onBlur={(e) => e.target.style.boxShadow = 'none'}
          >
            View Full Schedule
          </button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingMatches;