import { useEffect, useState } from 'react';
import Header from '../components/LandingPage/Header';
import Footer from '../components/LandingPage/Footer';
import Matches from '../components/MatchesPage/Matches';

const MatchesPage = () => {
  return (
    <div>
      <Header />
      <Matches />
      <Footer />
    </div>
  );
};

export default MatchesPage;