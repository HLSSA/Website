import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const LandingPage = () => {
  const [text, setText] = useState("Welcome to the site!");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    setImage("http://localhost:5000/uploads/sample.jpg"); // Example static path
  }, []);

  return (
    <div>
      <Navbar />
      <h1>{text}</h1>
      {image && <img src={image} alt="Landing" style={{ maxWidth: '400px' }} />}
      <Footer />
    </div>
  );
};

export default LandingPage;
