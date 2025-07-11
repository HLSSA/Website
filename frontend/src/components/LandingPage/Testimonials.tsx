import React from 'react';
import useTestimonials from '../../hooks/useTestimonials';
import './styles/Testimonials.css';

interface TestimonialsProps {
  token: string | null;
}

const Testimonials: React.FC<TestimonialsProps> = ({ token }) => {
  const { testimonials, loading, error, fetchTestimonials } = useTestimonials(token);

  if (loading) {
    return (
      <section className="testimonials-section">
        <div className="container">
          <div className="testimonial-header">
            <h2 className="section-title">What Our Community Says</h2>
            <p className="testimonial-subtitle">Parents, players, and alumni share their HLSSA experience</p>
          </div>
          <div className="testimonial-loading">
            <div className="loading-spinner"></div>
            <p>Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="testimonials-section">
        <div className="container">
          <div className="testimonial-header">
            <h2 className="section-title">What Our Community Says</h2>
            <p className="testimonial-subtitle">Parents, players, and alumni share their HLSSA experience</p>
          </div>
          <div className="testimonial-error">
            <p className="error-message">Failed to load testimonials: {error}</p>
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
        <div className="container">
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
      <div className="container">
        <div className="testimonial-header">
          <h2 className="section-title">What Our Community Says</h2>
          <p className="testimonial-subtitle">Parents, players, and alumni share their HLSSA experience</p>
        </div>
        <div className="testimonial-cards">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              {testimonial.image && (
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="testimonial-image"
                  onError={(e) => {
                    // Fallback to a default image if the image fails to load
                    (e.target as HTMLImageElement).src = '/default-avatar.png';
                  }}
                />
              )}
              {!testimonial.image && (
                <div className="testimonial-image-placeholder">
                  <span className="testimonial-initials">
                    {testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
              )}
              <p className="testimonial-feedback">"{testimonial.feedback}"</p>
              <h4 className="testimonial-name">{testimonial.name}</h4>
              <span className="testimonial-role">{testimonial.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;