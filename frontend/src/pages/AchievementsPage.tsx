import { useEffect, useState } from 'react';
import Header from '../components/LandingPage/Header';
import {Achievements} from '../components/AchievementPage/Achievements';
import Footer from '../components/LandingPage/Footer';
// import '../styles/AchievementsPage.css';

const LandingPage = () => {
  return (
    <div>
      <Header />
      <Achievements />
      <Footer />
    </div>
  );
};

export default LandingPage;
