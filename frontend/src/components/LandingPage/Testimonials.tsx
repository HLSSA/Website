import React from 'react';
import './styles/Testimonials.css';

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Parent",
    feedback: "HLSSA transformed my son's confidence and skills. The coaches are professional, and the environment is inspiring.",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Ananya Rao",
    role: "Player - U14",
    feedback: "Thanks to HLSSA, I got the opportunity to play in state-level tournaments. The training is top-notch!",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Mohammed Faizan",
    role: "Alumni",
    feedback: "Joining HLSSA was the best decision of my football journey. I owe my current success to their excellent coaching.",
    image: "https://randomuser.me/api/portraits/men/41.jpg"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonial-header">
          <h2 className="testimonial-title">What Our Community Says</h2>
          <p className="testimonial-subtitle">Parents, players, and alumni share their HLSSA experience</p>
        </div>
        <div className="testimonial-cards">
          {testimonials.map((t, index) => (
            <div key={index} className="testimonial-card">
              <img src={t.image} alt={t.name} className="testimonial-image" />
              <p className="testimonial-feedback">“{t.feedback}”</p>
              <h4 className="testimonial-name">{t.name}</h4>
              <span className="testimonial-role">{t.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
