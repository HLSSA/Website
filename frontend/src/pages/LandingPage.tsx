import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/LandingPage/Hero';
import UpcomingMatches from '../components/LandingPage/UpcomingMatches';
import OurPartners from '../components/LandingPage/OurPartners';
import AchievementsShowcase from '../components/LandingPage/AchievementsShowcase';
import Programs from '../components/LandingPage/Programs';
import Coaches from '../components/LandingPage/Coaches';
import Footer from '../components/Footer';
import axios from 'axios';

const LandingPage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <UpcomingMatches />
      <Coaches />
      <Programs />
      <AchievementsShowcase />
      <OurPartners />
      <Footer />
    </div>
  );
};

export default LandingPage;
