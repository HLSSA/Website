import React, { useState } from 'react';

const SoccerAcademyProducts: React.FC = () => {
  const [currentView, setCurrentView] = useState<'products' | 'details'>('products');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const ProductDetailsPage: React.FC<{ product: any; onBack: () => void }> = ({ product, onBack }) => {
    const [selectedThumbnail, setSelectedThumbnail] = useState(0);
    const [selectedSize, setSelectedSize] = useState('XS');
    
    const getThumbnails = (jerseyType: string) => {
      return [
        { type: jerseyType, view: 'front', label: 'Front View' },
        { type: jerseyType, view: 'back', label: 'Back View' },
        { type: 'white', view: 'front', label: 'White Variant' },
        { type: 'navy', view: 'front', label: 'Navy Variant' },
        { type: 'yellow', view: 'front', label: 'Yellow Variant' }
      ];
    };

    const handleBuyNow = () => {
      // Use the product's specific buy now link
      const buyNowUrl = product.buyNowLink;
      console.log('Redirecting to:', buyNowUrl);
      console.log('Product:', product.name, 'Size:', selectedSize);
      
      // Uncomment the line below to redirect to actual purchase page
      // window.open(buyNowUrl, '_blank');
      
      alert(`Redirecting to: ${buyNowUrl}\nProduct: ${product.name}\nSize: ${selectedSize}`);
    };

    return (
      <div className="details-container">
        <div className="details-header">
          <button className="back-btn" onClick={onBack}>
            ← Back to Products
          </button>
        </div>
        
        <div className="details-content">
          <div className="details-left">
            <div className="main-image-container">
              <JerseyImage 
                type={getThumbnails(product.jerseyType)[selectedThumbnail].type as any} 
                view={getThumbnails(product.jerseyType)[selectedThumbnail].view as any}
                product={product}
                useRealImage={true}
              />
            </div>
            
            <div className="thumbnails-container">
              {getThumbnails(product.jerseyType).map((thumb, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${selectedThumbnail === index ? 'active' : ''}`}
                  onClick={() => setSelectedThumbnail(index)}
                >
                  <JerseyImage type={thumb.type as any} view={thumb.view as any} />
                  <div className="thumbnail-label">{thumb.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="details-right">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-description">
              {product.modalDescription}
            </div>
            
            <div className="product-price">
              {product.price}
            </div>
            
            <div className="product-features">
              <h3>Product Features:</h3>
              
              <div className="feature-item">
                <strong>Breathability:</strong> Jerseys feature mesh for better airflow.
              </div>
              
              <div className="feature-item">
                <strong>Lightweight and Stretchable:</strong> Jerseys must be lightweight and stretchable for a snug fit and mobility.
              </div>
              
              <div className="feature-item">
                <strong>Fit:</strong> Regular Fit
              </div>
              
              <div className="feature-item">
                <strong>Collar:</strong> {product.jerseyType === 'white' ? 'Polo Collar' : 'Round Neck'}
              </div>
              
              <div className="feature-item">
                <strong>Care Instructions:</strong> Machine Wash
              </div>
            </div>
            
            <div className="size-selection">
              <span className="size-label">Select Size:</span>
              <select 
                className="size-dropdown" 
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
            
            <button className="buy-now-button" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  const JerseyImage: React.FC<{ 
    type: 'white' | 'navy' | 'yellow'; 
    view?: 'front' | 'back';
    product?: any;
    useRealImage?: boolean;
  }> = ({ type, view = 'front', product, useRealImage = false }) => {
    const colors = {
      white: { primary: '#FFFFFF', secondary: '#E5E7EB', accent: '#6B7280' },
      navy: { primary: '#1E3A8A', secondary: '#3B82F6', accent: '#FFFFFF' },
      yellow: { primary: '#EAB308', secondary: '#FDE047', accent: '#1F2937' }
    };

    const color = colors[type];

    // If real images are available and product is provided, use them
    if (useRealImage && product && product.images) {
      const imageUrl = view === 'back' ? product.images.back : product.images.front;
      return (
        <img 
          src={imageUrl} 
          alt={`${product.name} - ${view} view`}
          className="jersey-image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '4px'
          }}
        />
      );
    }

    if (view === 'back') {
      return (
        <svg className="jersey-svg" viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M25 35 C25 30, 30 25, 35 25 L50 25 C50 20, 55 15, 65 15 C75 15, 80 20, 80 25 L95 25 C100 25, 105 30, 105 35 L105 130 C105 135, 100 140, 95 140 L35 140 C30 140, 25 135, 25 130 Z"
            fill={color.primary}
            stroke={color.secondary}
            strokeWidth="1"
          />
          <ellipse cx="20" cy="45" rx="12" ry="20" fill={color.primary} stroke={color.secondary} strokeWidth="1"/>
          <ellipse cx="110" cy="45" rx="12" ry="20" fill={color.primary} stroke={color.secondary} strokeWidth="1"/>
          <path
            d="M50 25 C50 20, 55 15, 65 15 C75 15, 80 20, 80 25 L75 30 C70 25, 60 25, 55 30 Z"
            fill={color.secondary}
            stroke={color.accent}
            strokeWidth="0.5"
          />
          <line x1="65" y1="35" x2="65" y2="130" stroke={color.secondary} strokeWidth="1" opacity="0.5"/>
          <rect x="40" y="45" width="40" height="8" fill="none" stroke={color.accent} strokeWidth="1" opacity="0.7" rx="2"/>
          <text x="60" y="51" textAnchor="middle" fontSize="4" fill={color.accent} opacity="0.7">PLAYER NAME</text>
          <rect x="52" y="65" width="16" height="20" fill="none" stroke={color.accent} strokeWidth="1" opacity="0.7" rx="2"/>
          <text x="60" y="78" textAnchor="middle" fontSize="12" fill={color.accent} opacity="0.7" fontWeight="bold">10</text>
          {type === 'navy' && (
            <>
              <line x1="30" y1="95" x2="100" y2="95" stroke={color.secondary} strokeWidth="2" opacity="0.6"/>
              <line x1="30" y1="105" x2="100" y2="105" stroke={color.secondary} strokeWidth="2" opacity="0.6"/>
              <line x1="30" y1="115" x2="100" y2="115" stroke={color.secondary} strokeWidth="2" opacity="0.6"/>
            </>
          )}
          {type === 'yellow' && (
            <>
              <rect x="30" y="95" width="70" height="6" fill={color.secondary} opacity="0.8"/>
              <rect x="30" y="105" width="70" height="6" fill={color.secondary} opacity="0.8"/>
              <rect x="30" y="115" width="70" height="6" fill={color.secondary} opacity="0.8"/>
              <rect x="30" y="125" width="70" height="6" fill={color.secondary} opacity="0.8"/>
            </>
          )}
        </svg>
      );
    }

    return (
      <svg className="jersey-svg" viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M25 35 C25 30, 30 25, 35 25 L50 25 C50 20, 55 15, 65 15 C75 15, 80 20, 80 25 L95 25 C100 25, 105 30, 105 35 L105 130 C105 135, 100 140, 95 140 L35 140 C30 140, 25 135, 25 130 Z"
          fill={color.primary}
          stroke={color.secondary}
          strokeWidth="1"
        />
        <ellipse cx="20" cy="45" rx="12" ry="20" fill={color.primary} stroke={color.secondary} strokeWidth="1"/>
        <ellipse cx="110" cy="45" rx="12" ry="20" fill={color.primary} stroke={color.secondary} strokeWidth="1"/>
        <path
          d="M50 25 C50 20, 55 15, 65 15 C75 15, 80 20, 80 25 L75 30 C70 25, 60 25, 55 30 Z"
          fill={color.secondary}
          stroke={color.accent}
          strokeWidth="0.5"
        />
        <line x1="65" y1="35" x2="65" y2="130" stroke={color.secondary} strokeWidth="1" opacity="0.5"/>
        <circle cx="50" cy="55" r="8" fill="none" stroke={color.accent} strokeWidth="1" opacity="0.7"/>
        <text x="50" y="60" textAnchor="middle" fontSize="6" fill={color.accent} opacity="0.7">LSA</text>
        {type === 'navy' && (
          <>
            <line x1="30" y1="50" x2="100" y2="50" stroke={color.secondary} strokeWidth="2" opacity="0.6"/>
            <line x1="30" y1="70" x2="100" y2="70" stroke={color.secondary} strokeWidth="2" opacity="0.6"/>
            <line x1="30" y1="90" x2="100" y2="90" stroke={color.secondary} strokeWidth="2" opacity="0.6"/>
          </>
        )}
        {type === 'yellow' && (
          <>
            <rect x="30" y="40" width="70" height="8" fill={color.secondary} opacity="0.8"/>
            <rect x="30" y="60" width="70" height="8" fill={color.secondary} opacity="0.8"/>
            <rect x="30" y="80" width="70" height="8" fill={color.secondary} opacity="0.8"/>
            <rect x="30" y="100" width="70" height="8" fill={color.secondary} opacity="0.8"/>
            <rect x="30" y="120" width="70" height="8" fill={color.secondary} opacity="0.8"/>
          </>
        )}
      </svg>
    );
  };

  const products = [
    {
      id: 1,
      name: "Little Stars Soccer Academy Official Travel Kit",
      description: "Team colours || Lightweight || Comfortable || Premium With it You collar || Sports Premium || Stretchable",
      modalDescription: "Half Sleeve || Lightweight || Comfortable || Machine Wash || Polo collar || Sports Premium || Stretchable",
      price: "₹899",
      jerseyType: 'white' as const,
      buyNowLink: "https://hyvesports.com/product/little-stars-soccer-academy-official-travel-kit/", // Replace with actual purchase link
      images: {
        front: "https://hyvesports.com/wp-content/uploads/2021/08/5-1-1.png", // Replace with actual front image
        back: "https://hyvesports.com/wp-content/uploads/2021/08/6-2.png", // Replace with actual back image
        thumbnail: "assets/store/track_front.jpg" // Replace with actual thumbnail
      }
    },
    {
      id: 2,
      name: "Little Stars Soccer Academy Official Kit",
      description: "Team colours || Breathable || Lightweight || Premium Stretchable || Comfortable || KIT",
      modalDescription: "Half Sleeve || Lightweight || Comfortable || Machine Wash || Round Neck || Sports Premium || Stretchable",
      price: "₹899",
      jerseyType: 'navy' as const,
      buyNowLink: "https://hyvesports.com/product/little-stars-soccer-academy-official-kit-highball/", // Replace with actual purchase link
      images: {
        front: "https://hyvesports.com/wp-content/uploads/2025/04/Layer-3.jpg", // Replace with actual front image
        back: "https://hyvesports.com/wp-content/uploads/2025/04/Layer-4.jpg", // Replace with actual back image
        thumbnail: "https://hyvesports.com/wp-content/uploads/2025/04/Shorts-FootballG.jpg" // Replace with actual thumbnail
      }
    },
    {
      id: 3,
      name: "Little Stars Soccer Academy Official Goalkeeper",
      description: "Team colours || Breathable || Lightweight || Premium Sports Premium || Breathable || Lightweight || Stretchable || Comfortable || KIT",
      modalDescription: "Half Sleeve || Lightweight || Comfortable || Machine Wash || Round Neck || Goalkeeper Premium || Stretchable",
      price: "₹899",
      jerseyType: 'yellow' as const,
      buyNowLink: "https://hyvesports.com/product/little-stars-soccer-academy-official-goalkeeper-kit-highball/", // Replace with actual purchase link
      images: {
        front: "https://hyvesports.com/wp-content/uploads/2025/04/Layer-43.jpg", // Replace with actual front image
        back: "https://hyvesports.com/wp-content/uploads/2025/04/Layer-44.jpg", // Replace with actual back image
        thumbnail: "https://hyvesports.com/product/little-stars-soccer-academy-official-goalkeeper-kit-one-more-game/" // Replace with actual thumbnail
      }
    }
  ];

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setCurrentView('details');
  };

  const handleBackToProducts = () => {
    setCurrentView('products');
    setSelectedProduct(null);
  };

  return (
    <div className="academy-container">
      <style>{`
        .academy-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f5f5;
          min-height: 100vh;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .header h1 {
          font-size: 28px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .header p {
          font-size: 14px;
          color: #7f8c8d;
          margin: 0;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          justify-items: center;
        }

        .product-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          width: 100%;
          max-width: 350px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .product-image-container {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
        }

        .product-image-container.white-bg {
          background-color: #f8f9fa;
        }

        .product-image-container.navy-bg {
          background-color: #2c3e50;
        }

        .product-image-container.yellow-bg {
          background-color: #f1c40f;
        }

        .jersey-svg {
          width: 120px;
          height: 140px;
        }

        .product-info {
          padding: 20px;
        }

        .product-title {
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 10px;
          line-height: 1.4;
        }

        .product-description {
          font-size: 12px;
          color: #7f8c8d;
          line-height: 1.5;
          margin-bottom: 15px;
          min-height: 40px;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .product-price {
          font-size: 18px;
          font-weight: bold;
          color: #2c3e50;
        }

        .view-details-btn {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: background-color 0.3s ease;
        }

        .view-details-btn:hover {
          background-color: #2980b9;
        }

        /* Product Details Page Styles */
        .details-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .details-header {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          background-color: #f8f9fa;
        }

        .back-btn {
          background: none;
          border: none;
          color: #3498db;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 0;
          transition: color 0.2s;
        }

        .back-btn:hover {
          color: #2980b9;
        }

        .details-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 600px;
        }

        .details-left {
          background-color: #f8f9fa;
          padding: 40px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .main-image-container {
          width: 300px;
          height: 350px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .main-image-container .jersey-svg {
          width: 200px;
          height: 250px;
        }

        .thumbnails-container {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .thumbnail {
          width: 50px;
          height: 60px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color 0.2s;
          position: relative;
        }

        .thumbnail:hover {
          border-color: #3b82f6;
        }

        .thumbnail.active {
          border-color: #3b82f6;
          border-width: 3px;
        }

        .thumbnail .jersey-svg {
          width: 30px;
          height: 35px;
        }

        .thumbnail-label {
          position: absolute;
          bottom: -18px;
          font-size: 8px;
          color: #666;
          text-align: center;
          white-space: nowrap;
          background: white;
          padding: 1px 3px;
          border-radius: 2px;
          border: 1px solid #e5e7eb;
        }

        .details-right {
          padding: 40px 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .details-right .product-title {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          line-height: 1.3;
          margin: 0;
        }

        .details-right .product-description {
          color: #666;
          font-size: 14px;
          line-height: 1.5;
        }

        .details-right .product-price {
          font-size: 32px;
          font-weight: bold;
          color: #333;
        }

        .product-features h3 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 15px;
        }

        .feature-item {
          margin-bottom: 12px;
          color: #555;
          font-size: 14px;
          line-height: 1.4;
        }

        .feature-item strong {
          color: #333;
        }

        .size-selection {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: 10px;
        }

        .size-label {
          font-weight: 500;
          color: #333;
        }

        .size-dropdown {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          min-width: 80px;
          cursor: pointer;
        }

        .size-dropdown:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .buy-now-button {
          background-color: #22c55e;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
          transition: background-color 0.2s;
        }

        .buy-now-button:hover {
          background-color: #16a34a;
        }

        @media (max-width: 768px) {
          .academy-container {
            padding: 15px;
          }

          .products-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .product-card {
            max-width: 100%;
          }

          .header h1 {
            font-size: 24px;
          }

          .details-content {
            grid-template-columns: 1fr;
          }

          .details-left {
            padding: 20px;
          }

          .main-image-container {
            width: 250px;
            height: 280px;
          }

          .main-image-container .jersey-svg {
            width: 160px;
            height: 200px;
          }

          .details-right {
            padding: 20px;
          }

          .details-right .product-title {
            font-size: 20px;
          }

          .details-right .product-price {
            font-size: 28px;
          }

          .thumbnails-container {
            gap: 6px;
          }

          .thumbnail {
            width: 45px;
            height: 55px;
          }

          .thumbnail .jersey-svg {
            width: 25px;
            height: 30px;
          }

          .thumbnail-label {
            font-size: 7px;
            bottom: -16px;
          }
        }
      `}</style>

      {currentView === 'products' ? (
        <>
          <div className="header">
            <h1>Little Stars Soccer Academy</h1>
            <p>Explore and purchase official football kits and merchandise</p>
          </div>

          <div className="products-grid">
            {products.map((product, index) => (
              <div key={product.id} className="product-card">
                <div className={`product-image-container ${
                  index === 0 ? 'white-bg' : 
                  index === 1 ? 'navy-bg' : 'yellow-bg'
                }`}>
                  <JerseyImage 
                    type={product.jerseyType} 
                    product={product}
                    useRealImage={true}
                  />
                </div>
                
                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  
                  <div className="product-footer">
                    <span className="product-price">{product.price}</span>
                    <button 
                      className="view-details-btn"
                      onClick={() => handleViewDetails(product)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        selectedProduct && (
          <ProductDetailsPage 
            product={selectedProduct} 
            onBack={handleBackToProducts} 
          />
        )
      )}
    </div>
  );
};

export default SoccerAcademyProducts;