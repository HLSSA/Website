import { useEffect, useState } from 'react';
import Header from '../components/Header';
import About from '../components/AboutPage/AboutUs';
import Footer from '../components/Footer';
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
