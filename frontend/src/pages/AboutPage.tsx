import { useEffect, useState } from 'react';
import Header from '../components/LandingPage/Header';
import About from '../components/AboutPage/AboutUs';
import Footer from '../components/LandingPage/Footer';
import axios from 'axios';

const LandingPage = () => {
  return (
    <div>
      <Header />
      <About />
      <Footer />
    </div>
  );
};

export default LandingPage;
