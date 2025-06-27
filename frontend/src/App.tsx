// src/App.tsx
import './App.css';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import AchievementsPage from './pages/AchievementsPage';
import MatchesPage from './pages/MatchesPage';
import NewsPage from './pages/NewsPage';
import OurTeam from './pages/Ourteam';
import SoccerAcademyProducts from './pages/shope';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/achievements" element={<AchievementsPage />} />
      <Route path="/matches" element={<MatchesPage/>} />
      <Route path="/team" element={<OurTeam/>} />
      <Route path="/news" element={<NewsPage/>} />
      <Route path="/shope" element={<SoccerAcademyProducts />} />
    </Routes>
  );
}

export default App;
