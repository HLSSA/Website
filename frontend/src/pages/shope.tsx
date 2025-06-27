import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SoccerAcademyProducts from '../components/SoccerAcademyProducts/SoccerAcademyProducts';

const Ourteam = () => {
  return (
    <div>
      <Header />
      <SoccerAcademyProducts/>
      <Footer />
    </div>
  );
};

export default Ourteam;