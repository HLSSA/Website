// src/App.tsx
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './components/AboutPage/AboutUs';
import {Achievements} from './components/AchievementPage/Achievements';
import MatchesPage from './components/MatchesPage/Matches';
import News from './components/NewsPage/News';
import OurTeam from './components/OurteamPage/Ourteam';
import SoccerAcademyProducts from './components/SoccerAcademyProducts/SoccerAcademyProducts';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/achievements" element={<Achievements />} />
      <Route path="/matches" element={<MatchesPage/>} />
      <Route path="/team" element={<OurTeam/>} />
      <Route path="/news" element={<News/>} />
      <Route path="/shop" element={<SoccerAcademyProducts />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
