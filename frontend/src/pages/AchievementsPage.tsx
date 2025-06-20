import { useEffect, useState } from 'react';
import Header from '../components/Header';
import {Achievements} from '../components/AchievementPage/Achievements';
import Footer from '../components/Footer';
// import '../styles/AchievementsPage.css';

const AchievementsPage = () => {
  return (
    <div>
      <Header />
      <Achievements />
      <Footer />
    </div>
  );
};

export default AchievementsPage;
