import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <>
      <style>{`
        .footer {
          background-color: rgb(0, 24, 58);
          color: white;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 20px 24px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }

        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr;
            gap: 48px;
          }
        }

        .footer-about {
          max-width: 400px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .footer-logo-icon {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .footer-logo-inner {
          width: 120px;
          height: 120px;
          background-color: #fbbf24;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .footer-logo-text h3 {
          font-size: 18px;
          font-weight: bold;
          margin: 0;
          color: white;
        }

        .footer-logo-text p {
          color: #9ca3af;
          font-size: 13px;
          margin: 0;
        }

        .footer-description {
          color: #d1d5db;
          margin-bottom: 24px;
          line-height: 1.6;
          font-size: 14px;
        }

        .footer-social {
          display: flex;
          gap: 12px;
        }

        .footer-social-link {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .footer-developers {
          margin-top: 0px;
          padding-top: 24px;
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .footer-developer-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .footer-developer-name {
          color:rgb(112, 112, 112);
          font-weight: 600;
          font-size: 14px;
        }

        .footer-linkedin-icon {
          width: 24px;
          height: 24px;
          color:rgb(112, 112, 112);
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .footer-developers {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .footer-developer-info {
            margin-bottom: 8px;
          }

          .footer-developer-name {
            font-size: 13px;
          }

          .footer-linkedin-icon {
            width: 20px;
            height: 20px;
          }
        }

        .footer-developers p {
          margin: 0 0 12px 0;
          color: #9ca3af;
          font-size: 14px;
        }

        .footer-linkedin-icon:hover {
          transform: translateY(-2px);
        }

        .footer-social-link.facebook {
          background-color: #1877f2;
        }

        .footer-social-link.facebook:hover {
          background-color: #166fe5;
          transform: translateY(-2px);
        }

        .footer-social-link.instagram {
          background: linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d);
        }

        .footer-social-link.instagram:hover {
          transform: translateY(-2px);
        }

        .footer-social-link.youtube {
          background-color: #ff0000;
        }

        .footer-social-link.youtube:hover {
          background-color: #cc0000;
          transform: translateY(-2px);
        }

        .footer-social-link.twitter {
          background-color: black;
        }

        .footer-social-link.twitter:hover {
          transform: translateY(-2px);
        }

        .footer-section h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 20px;
          margin-top: 0;
          color: white;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 10px;
        }

        .footer-links a {
          color: #d1d5db;
          text-decoration: none;
          transition: color 0.3s ease;
          font-size: 14px;
        }

        .footer-links a:hover {
          color: #3b82f6;
        }

        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .footer-contact-item.center {
          align-items: center;
        }

        .footer-contact-icon {
          color: #3b82f6;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .footer-contact-icon.no-margin {
          margin-top: 0;
        }

        .footer-contact-text {
          color: #d1d5db;
          font-size: 14px;
        }

        .footer-contact-text p {
          margin: 0;
          margin-bottom: 2px;
        }

        .footer-contact-text p:last-child {
          margin-bottom: 0;
        }

        .footer-contact-link {
          color: #d1d5db;
          text-decoration: none;
          transition: color 0.3s ease;
          font-size: 14px;
        }

        .footer-contact-link:hover {
          color: #3b82f6;
        }

        .footer-bottom {
          border-top: 1px solid #374151;
          margin-top: 20px;
          padding-top: 24px;
          text-align: center;
        }

        .footer-bottom-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        @media (min-width: 768px) {
          .footer-bottom-content {
            flex-direction: row;
            justify-content: space-between;
          }
        }

        .footer-copyright {
          color: #9ca3af;
          font-size: 13px;
          margin: 0;
        }

        .footer-legal {
          display: flex;
          align-items: center;
          gap: 20px;
          font-size: 13px;
        }

        .footer-legal a {
          color: #9ca3af;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-legal a:hover {
          color: #3b82f6;
        }

        .footer-social-text {
          text-align: center;
          margin-top: 16px;
        }

        .footer-social-text p {
          color: #6b7280;
          font-size: 12px;
          margin: 0;
          max-width: 600px;
          margin: 0 auto;
        }
      `}</style>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            {/* About HLSSA */}
            <div className="footer-about">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <div className="footer-logo-inner">
                    <img 
                      src="https://i.ibb.co/NnbJGSpD/hlssa-insta.jpg" 
                      alt="HLSSA Logo" 
                      style={{width: '120px', height: '120px', objectFit: 'contain'}}
                    />
                  </div>
                </div>
                <div className="footer-logo-text">
                  <h3>HLSSA</h3>
                  <p>Hyderabad Little Stars Soccer Academy</p>
                </div>
              </div>

              <p className="footer-description">
                Nurturing young football talents into tomorrow's champions. With professional coaching, 
                world-class facilities, and a proven track record, we're committed to developing both 
                skilled players and strong characters.
              </p>

              <div className="footer-social">
                <a
                  href="https://www.facebook.com/telanganafootballacademy"
                  className="footer-social-link facebook"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook size={18} />
                </a>

                <a
                  href="https://www.instagram.com/hydlittlestars.official/"
                  className="footer-social-link instagram"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram size={18} />
                </a>

                <a
                  href="https://www.youtube.com/@hyderabadlittlestarssoccer4733"
                  className="footer-social-link youtube"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube size={18} />
                </a>

                {/* X Logo for Twitter */}
                <a
                  href="https://twitter.com/hlssa_academy"
                  className="footer-social-link twitter"
                  aria-label="Twitter/X"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.187 3H17.28L12.824 9.117 8.682 3H2.25l7.298 10.664L2.25 21h2.907l4.796-6.468 4.298 6.468h6.541l-7.48-10.867L20.187 3z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/achievements">Achievements</a></li>
                <li><a href="/matches">Matches & News</a></li>
                <li><a href="/team">Our Team</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h4>Contact Info</h4>
              <div className="footer-contact">
                <div className="footer-contact-item">
                  <MapPin className="footer-contact-icon" size={18} />
                  <div className="footer-contact-text">
                    <p>Gachibowli Sports Complex</p>
                    <p>Hyderabad, Telangana</p>
                    <p>India - 500032</p>
                  </div>
                </div>

                <div className="footer-contact-item center">
                  <Phone className="footer-contact-icon no-margin" size={18} />
                  <a href="tel:+917993994704" className="footer-contact-link">
                    +91 79939 94704
                  </a>
                </div>

                <div className="footer-contact-item center">
                  <Mail className="footer-contact-icon no-margin" size={18} />
                  <a href="mailto:info@hlssa.academy" className="footer-contact-link">
                    info@hlssa.academy
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Developers */}
          <div className="footer-developers">
            <p>Developed By:</p>
            <div className="footer-developer-info">
              <a href="https://www.linkedin.com/in/teja-vardhan-reddy-chennuru/" target="_blank" rel="noopener noreferrer">
                <div className="footer-linkedin-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
              </a>
              <span className="footer-developer-name">Teja Vardhan Reddy</span>
            </div>
            <div className="footer-developer-info">
              <a href="https://www.linkedin.com/in/divya-theresa-mallavarapu-322378284/" target="_blank" rel="noopener noreferrer">
                <div className="footer-linkedin-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
              </a>
              <span className="footer-developer-name">Divya Theresa</span>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="footer-copyright">
                ©Hyderabad Little Stars Soccer Academy. All rights reserved.
              </p>

              <div className="footer-legal">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Sitemap</a>
              </div>
            </div>

            <div className="footer-social-text">
              <p>
                Follow Hyderabad Little Stars Soccer Academy on social media for updates and behind-the-scenes content
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
