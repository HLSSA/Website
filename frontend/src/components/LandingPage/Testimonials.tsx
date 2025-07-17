import React, { useState, useEffect } from 'react';
import useTestimonials from '../../hooks/useTestimonials';
import './styles/Testimonials.css';
import Loader from '../Loader';
import Error from '../Error';


const Testimonials: React.FC = () => {
  const { testimonials, loading, error, fetchTestimonials } = useTestimonials();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (loading) {
    return (
      <section className="testimonials-section">
        <div className="">
          <div className="testimonial-header">
            <h2 className="section-title">What Our Community Says</h2>
            <p className="testimonial-subtitle">Parents, players, and alumni share their HLSSA experience</p>
          </div>
          <div className="testimonial-loading">
            <Loader />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="testimonials-section">
        <div className="">
          <div className="testimonial-header">
            <h2 className="section-title">What Our Community Says</h2>
            <p className="testimonial-subtitle">Parents, players, and alumni share their HLSSA experience</p>
          </div>
          <div className="testimonial-error">
            <Error />
            <button 
              onClick={fetchTestimonials}
              className="retry-button"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="testimonials-section">
        <div className="">
          <div className="testimonial-header">
            <h2 className="section-title">What Our Community Says</h2>
            <p className="testimonial-subtitle">Parents, players, and alumni share their HLSSA experience</p>
          </div>
          <div className="testimonial-empty">
            <p>No testimonials available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonials-section">
      <div className="">
        <div className="testimonial-header">
          <h2 className="section-title">What Our Community Says</h2>
          <p className="testimonial-subtitle">Parents, players, and alumni share their HLSSA experience</p>
        </div>
        
        <div className="testimonial-carousel">
          <div className="carousel-container">
            <div 
              className="carousel-track"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-slide">
                  <div className="testimonial-card">
                    <div className="testimonial-content">
                      <div className="quote-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" fill="currentColor"/>
                        </svg>
                      </div>
                      <p className="testimonial-feedback">"{testimonial.feedback}"</p>
                      <div className="testimonial-author">
                        <div className="author-image">
                          {testimonial.image ? (
                            <img 
                              src={testimonial.image} 
                              alt={testimonial.name} 
                              className="testimonial-image"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/default-avatar.png';
                              }}
                            />
                          ) : (
                            <div className="testimonial-image-placeholder">
                              <span className="testimonial-initials">
                                {testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="author-info">
                          <h4 className="testimonial-name">{testimonial.name}</h4>
                          <span className="testimonial-role">{testimonial.role}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button 
            className="carousel-nav carousel-nav-prev"
            onClick={goToPrevious}
            aria-label="Previous testimonial"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            className="carousel-nav carousel-nav-next"
            onClick={goToNext}
            aria-label="Next testimonial"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Dots indicators */}
          <div className="carousel-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;