import { useEffect, useState } from 'react';
import Header from '../components/LandingPage/Header';
import Hero from '../components/LandingPage/Hero';
import axios from 'axios';

const LandingPage = () => {
  const [text, setText] = useState("Welcome to the site!");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    setImage("http://localhost:5000/uploads/sample.jpg"); // Example static path
  }, []);

  return (
    <div>
      <Header />
      <Hero />
    </div>
  );
};

export default LandingPage;
