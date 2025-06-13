// src/pages/AdminPage.tsx
import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import Coaches from '../components/AdminPage/Coaches';
import Achievements from '../components/AdminPage/Achievements';
import Partners from '../components/AdminPage/Partners';
import Testinomials from '../components/AdminPage/Testinomials';
import Touranments from '../components/AdminPage/Touranments';
import AdminsForm from '../components/AdminPage/AdminsForm';
import AboutForm from '../components/AdminPage/AboutForm';
import Matches from '../components/AdminPage/Matches';

import styled from 'styled-components';

const sections = {
  About: <AboutForm />,
  Coaches: <Coaches />,
  Achievements: <Achievements />,
  Partners: <Partners />,
  Testimonials: <Testinomials />,
  Tournaments: <Touranments />,
  Admins: <AdminsForm />,
  Matches: <Matches />,
};

const AdminPage = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('adminToken') || null
  );
  const [activeSection, setActiveSection] = useState<keyof typeof sections>('About');

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('adminToken', token);
    setToken(token);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  if (!token) return <LoginForm onLoginSuccess={handleLoginSuccess} />;

  return (
    <Container>
      <Header>
        <h2>⚙️ Admin Panel</h2>
        <StyledWrapper>
          <button onClick={handleLogout} className="Btn">
            <div className="sign">
              <svg viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
              </svg>
            </div>
            <div className="text">Logout</div>
          </button>
        </StyledWrapper>
      </Header>

      <Nav>
        {Object.keys(sections).map((key) => (
          <NavItem
            key={key}
            onClick={() => setActiveSection(key as keyof typeof sections)}
            active={activeSection === key}
          >
            {key}
          </NavItem>
        ))}
      </Nav>

      <Section>{sections[activeSection]}</Section>
    </Container>
  );
};

export default AdminPage;

// ---------- STYLES ----------

const Container = styled.div`
  padding: 2rem;
  font-family: sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 2rem 0 1rem 0;
`;

const NavItem = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  background: ${({ active }) => (active ? 'black' : '#eee')};
  color: ${({ active }) => (active ? 'white' : 'black')};
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${({ active }) => (active ? '#111' : '#ccc')};
  }
`;

const Section = styled.div`
  margin-top: 2rem;
`;

// Reuse your existing StyledWrapper for logout
const StyledWrapper = styled.div`
  .Btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 45px;
    height: 45px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-duration: 0.3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
    background-color: white;
  }

  .sign {
    width: 100%;
    transition-duration: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sign svg {
    width: 17px;
  }

  .sign svg path {
    fill: black;
  }

  .text {
    position: absolute;
    right: 0%;
    width: 0%;
    opacity: 0;
    color: white;
    font-size: 1.2em;
    font-weight: 600;
    transition-duration: 0.3s;
  }

  .Btn:hover {
    background-color: black;
    width: 125px;
    border-radius: 40px;
    transition-duration: 0.3s;
  }

  .Btn:hover .sign {
    width: 30%;
    transition-duration: 0.3s;
    padding-left: 5px;
  }

  .Btn:hover .sign svg path {
    fill: white;
  }

  .Btn:hover .text {
    opacity: 1;
    width: 70%;
    transition-duration: 0.3s;
    padding-right: 10px;
  }

  .Btn:active {
    transform: translate(2px, 2px);
  }
`;
