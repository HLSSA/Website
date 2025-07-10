import React from 'react';
import './SoccerAcademyProducts.css';

const products = [
  {
    name: 'Little Stars Soccer Academy Official Kit',
    description: 'Sports Premium || Breathable || Lightweight || Stretchable || Comfortable || KIT',
    price: '₹899',
    image: 'https://hyvesports.com/wp-content/uploads/2025/04/Layer-13.jpg', // Blue shirt
    link: 'https://hyvesports.com/product/little-stars-soccer-academy-official-kit-highball/',
  },
  {
    name: 'Little Stars Soccer Academy Official Goalkeeper Kit',
    description: 'Sports Premium || Breathable || Lightweight || Stretchable || Comfortable || KIT',
    price: '₹899',
    image: 'https://hyvesports.com/wp-content/uploads/2025/04/Layer-31.jpg', // Yellow shirt
    link: 'https://hyvesports.com/product/little-stars-soccer-academy-official-goalkeeper-kit-highball/',
  },
];

const SoccerAcademyProducts: React.FC = () => {
  return (
    <div className="products-container">
      <h2>Little Stars Soccer Academy</h2>
      <p>Explore and purchase official football kits and merchandise</p>

      <div className="card-grid">
        {products.map((product, index) => (
          <div className="product-card" key={index}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="description">{product.description}</p>
            <p className="price">{product.price}</p>
            <a
              className="view-details-button"
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoccerAcademyProducts;
