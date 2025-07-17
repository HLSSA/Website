import React, { useState, useEffect } from 'react';
import useAbout from '../hooks/useAbout';

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

interface HeaderProps {
  token?: string | null;
}

const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth >= 768);
  const [isTablet, setIsTablet] = useState<boolean>(window.innerWidth >= 640);
  const { aboutData, loading } = useAbout();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      setIsTablet(window.innerWidth >= 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (isDesktop) {
      setIsMenuOpen(false);
    }
  }, [isDesktop]);

  const headerStyles: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 2, 0, 0.06)',
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
    padding: '24px 0',
    gap: '20px',
    height: '100px',
  };

  const logoLinkStyles: React.CSSProperties = {
    textDecoration: 'none',
    transition: 'transform 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  };

  const logoImageStyles: React.CSSProperties = {
    width: isDesktop ? '100px' : '70px',
    height: isDesktop ? '80px' : '50px',
    objectFit: 'contain',
  };

  const desktopNavStyles: React.CSSProperties = {
    display: isDesktop ? 'flex' : 'none',
    alignItems: 'center',
    gap: '24px',
  };

  const navLinkStyles: React.CSSProperties = {
    color: '#374151',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s ease',
    fontSize: '16px',
  };

  const headerActionsStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const ctaButtonStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '9999px',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  };

  const mobileMenuButtonStyles: React.CSSProperties = {
    display: isDesktop ? 'none' : 'block',
    padding: '8px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  const mobileMenuStyles: React.CSSProperties = {
    display: isDesktop ? 'none' : isMenuOpen ? 'block' : 'none',
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

  const handleLogoHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'scale(1.05)';
  };

  const handleLogoLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'scale(1)';
  };

  // Get logo URL from about data or use fallback
  const logoUrl = aboutData?.logo || "https://i.ibb.co/JWPpTbt9/hlssa-optimized-1000.png";
  
  // Get contact from about data or use fallback
  const contactNumber = aboutData?.contact || "+917993994704";

  // Show loading state while fetching data
  if (loading) {
    return (
      <header style={headerStyles}>
        <div style={containerStyles}>
          <div style={headerContentStyles}>
            <div style={logoLinkStyles}>
              <div style={{
                ...logoImageStyles,
                backgroundColor: '#f3f4f6',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#6b7280'
              }}>
                Loading...
              </div>
            </div>
            <div style={headerActionsStyles}>
              <button style={mobileMenuButtonStyles}>
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header style={headerStyles}>
      <div style={containerStyles}>
        <div style={headerContentStyles}>
          {/* Logo */}
          <a 
            href="/"
            style={logoLinkStyles}
            onMouseEnter={handleLogoHover}
            onMouseLeave={handleLogoLeave}
          >
            <img 
              src={logoUrl} 
              alt="HLSSA Logo" 
              style={logoImageStyles}
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.src = "https://i.ibb.co/JWPpTbt9/hlssa-optimized-1000.png";
              }}
            />
          </a>

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
              href="/about" 
              style={navLinkStyles}
              onMouseEnter={handleLinkHover}
              onMouseLeave={handleLinkLeave}
            >
              About
            </a>
            <a 
              href="/achievements" 
              style={navLinkStyles}
              onMouseEnter={handleLinkHover}
              onMouseLeave={handleLinkLeave}
            >
              Achievements
            </a>
            <a 
              href="/matches" 
              style={navLinkStyles}
              onMouseEnter={handleLinkHover}
              onMouseLeave={handleLinkLeave}
            >
              Matches
            </a>
            <a 
              href="/team" 
              style={navLinkStyles}
              onMouseEnter={handleLinkHover}
              onMouseLeave={handleLinkLeave}
            >
              Our Team
            </a>
            <a 
              href="/news" 
              style={navLinkStyles}
              onMouseEnter={handleLinkHover}
              onMouseLeave={handleLinkLeave}
            >
              News
            </a>
          </nav>

          {/* CTA Button & Mobile Menu */}
          <div style={headerActionsStyles}>
            {/* Shop Button - Show on tablet and up */}
            {isTablet && (
              <a 
                href="/shop" 
                style={ctaButtonStyles}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                Shop Now
              </a>
            )}
            
            {/* Call Button - Show on tablet and up */}
            {isTablet && (
              <a
                href={`tel:${contactNumber}`}
                style={ctaButtonStyles}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                <PhoneIcon />
                <span>Call Now</span>
              </a>
            )}

            {/* Mobile Menu Button */}
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
                href="/" 
                style={mobileNavLinkStyles}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="/about" 
                style={mobileNavLinkStyles}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="/achievements" 
                style={mobileNavLinkStyles}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
                onClick={() => setIsMenuOpen(false)}
              >
                Achievements
              </a>
              <a 
                href="/matches" 
                style={mobileNavLinkStyles}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
                onClick={() => setIsMenuOpen(false)}
              >
                Matches
              </a>
              <a 
                href="/team" 
                style={mobileNavLinkStyles}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
                onClick={() => setIsMenuOpen(false)}
              >
                Our Team
              </a>
              <a 
                href="/news" 
                style={mobileNavLinkStyles}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
                onClick={() => setIsMenuOpen(false)}
              >
                News
              </a>
              <a 
                href="/shop" 
                style={mobileNavLinkStyles}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </a>
              <a
                href={`tel:${contactNumber}`}
                style={mobileCtaButtonStyles}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                onClick={() => setIsMenuOpen(false)}
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