import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Ourteampage from '../components/OurteamPage/Ourteam';

const Ourteam = () => {
  return (
    <div>
      <Header />
      <Ourteampage />
      <Footer />
    </div>
  );
};

export default Ourteam;