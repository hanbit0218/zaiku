import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const heroRef = useRef(null);
  const featuredRef = useRef(null);
  const storyRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    const heroElement = heroRef.current;
    const featuredElement = featuredRef.current;
    const storyElement = storyRef.current;

    if (heroElement) observer.observe(heroElement);
    if (featuredElement) observer.observe(featuredElement);
    if (storyElement) observer.observe(storyElement);

    return () => {
      if (heroElement) observer.unobserve(heroElement);
      if (featuredElement) observer.unobserve(featuredElement);
      if (storyElement) observer.unobserve(storyElement);
    };
  }, []);

  // Featured products data
  const featuredProducts = [
    {
      id: 1,
      name: 'Dragon Silk Jacket',
      price: 129.99,
      image: 'https://source.unsplash.com/random/300x400/?asian,jacket',
      category: 'Outerwear'
    },
    {
      id: 2,
      name: 'Koi Pattern Shirt',
      price: 69.99,
      image: 'https://source.unsplash.com/random/300x400/?asian,shirt',
      category: 'Shirts'
    },
    {
      id: 3,
      name: 'Tiger Embroidered Cap',
      price: 34.99,
      image: 'https://source.unsplash.com/random/300x400/?asian,cap',
      category: 'Accessories'
    }
  ];

  return (
    <div className="home">
      <section ref={heroRef} className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">ZAIKU</h1>
          <p className="hero-subtitle">Where East Meets Modern Fashion</p>
          <Link to="/products" className="hero-button">
            Explore Collection
          </Link>
        </div>
        <div className="hero-dragon"></div>
      </section>

      <section ref={featuredRef} className="featured-section">
        <h2 className="section-title">Featured Collections</h2>
        <div className="featured-products">
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
              </div>
              <div className="product-info">
                <p className="product-category">{product.category}</p>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price}</p>
                <button className="product-button">View Details</button>
              </div>
            </div>
          ))}
        </div>
        <Link to="/products" className="see-more-button">
          See Full Collection
        </Link>
      </section>

      <section ref={storyRef} className="story-section">
        <div className="story-content">
          <h2 className="section-title">Our Story</h2>
          <p>
            Zaiku was born from a deep appreciation of Asian cultural aesthetics and a desire to blend traditional 
            symbolism with contemporary fashion. Our designs feature iconic elements like dragons, tigers, and koi fish, 
            reimagined for the modern wardrobe.
          </p>
          <p>
            Each piece in our collection tells a story, connecting the wearer to the rich heritage of Asian art 
            while making a bold, personal statement. We believe in the power of fashion to bridge cultures and 
            celebrate diversity.
          </p>
        </div>
        <div className="story-image">
          <div className="image-overlay"></div>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="newsletter-container">
          <h2>Join Our Journey</h2>
          <p>Subscribe to receive updates on new collections and exclusive offers.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;