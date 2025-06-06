import React from 'react';
import { Play, Star, Award, Users } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Hero Background Image */}
      <div className="absolute inset-0 bg-black/40">
        <img 
          src="https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Soccer training"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-white">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-yellow-400 text-blue-900 rounded-full text-sm font-semibold mb-4">
                🏆 Hyderabad's Premier Soccer Academy
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Forge Your 
              <span className="text-yellow-400 block">Legacy.</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">
                Join the Champions.
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-lg leading-relaxed">
              Professional UEFA & AFC Certified Coaching for Aspiring Players Ages 5-18. 
              Transform passion into excellence with Hyderabad's most trusted soccer academy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Join a Free Trial Class
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-900 transition-all duration-300 flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Watch Our Story</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">500+</div>
                <div className="text-blue-200 text-sm">Students Trained</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">15+</div>
                <div className="text-blue-200 text-sm">Expert Coaches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">10+</div>
                <div className="text-blue-200 text-sm">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Elements */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Championship</div>
                    <div className="text-gray-600 text-sm">U-16 Winners 2024</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl animate-float-delayed">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Community</div>
                    <div className="text-gray-600 text-sm">Growing Strong</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-1/2 -right-8 bg-yellow-400 p-4 rounded-2xl shadow-xl animate-pulse">
                <Star className="w-8 h-8 text-blue-900" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
          <span className="text-sm">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;