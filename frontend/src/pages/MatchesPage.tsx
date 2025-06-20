import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
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