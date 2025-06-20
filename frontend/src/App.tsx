// src/App.tsx
import './App.css';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import AchievementsPage from './pages/AchievementsPage';
import MatchesPage from './pages/MatchesPage';
import NewsPage from './pages/NewsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/achievements" element={<AchievementsPage />} />
      <Route path="/matches" element={<MatchesPage/>} />
      <Route path="/news" element={<NewsPage/>} />
    </Routes>
  );
}

export default App;
