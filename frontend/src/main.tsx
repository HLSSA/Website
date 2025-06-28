import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Header from './components/Header';
import Footer from './components/Footer';

const AppWithToolbar = () => {

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Header />
        <App />
        <Footer />
      </BrowserRouter>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<AppWithToolbar />);
