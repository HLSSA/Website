import React, { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-blue-800 font-bold text-sm">⚽</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">HLSSA</h1>
              <p className="text-xs text-gray-600 hidden sm:block">Little Stars Soccer Academy</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
            <a href="#achievements" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Achievements</a>
            <a href="#matches" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Matches</a>
            <a href="#team" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Our Team</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
          </nav>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <a
              href="tel:+917993994704"
              className="hidden sm:flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
            >
              <Phone className="w-4 h-4" />
              <span>Call Now</span>
            </a>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium py-2">Home</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium py-2">About</a>
              <a href="#achievements" className="text-gray-700 hover:text-blue-600 font-medium py-2">Achievements</a>
              <a href="#matches" className="text-gray-700 hover:text-blue-600 font-medium py-2">Matches</a>
              <a href="#team" className="text-gray-700 hover:text-blue-600 font-medium py-2">Our Team</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium py-2">Contact</a>
              <a
                href="tel:+917993994704"
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-medium w-fit"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;