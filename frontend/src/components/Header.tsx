import React, { useState } from 'react';

// Menu Icon Component
const MenuIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

// X Icon Component
const XIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Phone Icon Component
const PhoneIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const headerStyles: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 50,
  };

  const containerStyles: React.CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 16px',
  };

  const headerContentStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
  };

  const logoSectionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const logoCircleStyles: React.CSSProperties = {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const logoInnerStyles: React.CSSProperties = {
    width: '32px',
    height: '32px',
    backgroundColor: '#fbbf24',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const logoTextStyles: React.CSSProperties = {
    color: '#1d4ed8',
    fontWeight: 'bold',
    fontSize: '14px',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#111827',
    lineHeight: '1.2',
    margin: 0,
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
    display: window.innerWidth >= 640 ? 'block' : 'none',
  };

  const desktopNavStyles: React.CSSProperties = {
    display: window.innerWidth >= 768 ? 'flex' : 'none',
    alignItems: 'center',
    gap: '32px',
  };

  const navLinkStyles: React.CSSProperties = {
    color: '#374151',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s ease',
    fontSize: '18px',
  };

  const headerActionsStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const ctaButtonStyles: React.CSSProperties = {
    display: window.innerWidth >= 640 ? 'flex' : 'none',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '8px 24px',
    borderRadius: '9999px',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
    border: 'none',
    cursor: 'pointer',
  };

  const mobileMenuButtonStyles: React.CSSProperties = {
    display: window.innerWidth >= 768 ? 'none' : 'block',
    padding: '8px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  const mobileMenuStyles: React.CSSProperties = {
    display: window.innerWidth >= 768 ? 'none' : isMenuOpen ? 'block' : 'none',
    padding: '16px 0',
    borderTop: '1px solid #e5e7eb',
  };

  const mobileNavStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const mobileNavLinkStyles: React.CSSProperties = {
    color: '#374151',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '8px 0',
    transition: 'color 0.2s ease',
  };

  const mobileCtaButtonStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '9999px',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
    width: 'fit-content',
  };

  const handleLinkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = '#2563eb';
  };

  const handleLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = '#374151';
  };

  const handleButtonHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = '#1d4ed8';
  };

  const handleButtonLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = '#2563eb';
  };

  const handleMenuButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#f3f4f6';
  };

  const handleMenuButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  return (
    <header style={headerStyles}>
      <div style={containerStyles}>
        <div style={headerContentStyles}>
          {/* Logo */}
          <div style={logoSectionStyles}>
            <img 
              src="https://i.ibb.co/JWPpTbt9/hlssa-optimized-1000.png" 
              alt="HLSSA Logo" 
              style={{width: '110px', height: '90px', objectFit: 'contain'}}
            />
            <div>
              <h1 style={titleStyles}>HLSSA</h1>
              <p style={subtitleStyles}>Hyderabad Little Stars Soccer Academy</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav style={desktopNavStyles}>
            <a 
              href="/" 
              style={navLinkStyles}
              onMouseEnter={handleLinkHover}
              onMouseLeave={handleLinkLeave}
            >
              Home
            </a>
            <a 
              href="about" 
              style={navLinkStyles}
              onMouseEnter={handleLinkHover}
              onMouseLeave={handleLinkLeave}
            >
              About
            </a>
            <a 
              href="achievements" 
              style={navLinkStyles}
              onMouseEnter={handleLinkHover}
              onMouseLeave={handleLinkLeave}
            >
              Achievements
            </a>
            <a 
              href="matches" 
              style={navLinkStyles}
              onMouseEnter={handleLinkHover}
              onMouseLeave={handleLinkLeave}
            >
              Matches
            </a>
            <a 
              href="team" 
              style={navLinkStyles}
              onMouseEnter={handleLinkHover}
              onMouseLeave={handleLinkLeave}
            >
              Our Team
            </a>
            <a 
              href="news" 
              style={navLinkStyles}
              onMouseEnter={handleLinkHover}
              onMouseLeave={handleLinkLeave}
            >
              News
            </a>
          </nav>

          {/* CTA Button & Mobile Menu */}
          <div style={headerActionsStyles}>
            <a
              href="tel:+917993994704"
              style={ctaButtonStyles}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >
              <PhoneIcon />
              <span>Call Now</span>
            </a>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={mobileMenuButtonStyles}
              onMouseEnter={handleMenuButtonHover}
              onMouseLeave={handleMenuButtonLeave}
            >
              {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div style={mobileMenuStyles}>
            <nav style={mobileNavStyles}>
              <a 
                href="home" 
                style={mobileNavLinkStyles}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                Home
              </a>
              <a 
                href="about" 
                style={mobileNavLinkStyles}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                About
              </a>
              <a 
                href="achievements" 
                style={mobileNavLinkStyles}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                Achievements
              </a>
              <a 
                href="matches" 
                style={mobileNavLinkStyles}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                Matches
              </a>
              <a 
                href="team" 
                style={mobileNavLinkStyles}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                Our Team
              </a>
              <a 
                href="news" 
                style={mobileNavLinkStyles}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                News
              </a>
              <a
                href="tel:+917993994704"
                style={mobileCtaButtonStyles}
                onMouseEnter={handleButtonHover}





                onMouseLeave={handleButtonLeave}
              >
                <PhoneIcon />
                <span>Call Now</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;