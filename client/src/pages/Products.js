import React, { useState } from 'react';
import './Products.css';

function Products() {
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Product data
  const products = [
    {
      id: 1,
      name: 'Dragon Silk Jacket',
      price: 129.99,
      image: 'https://via.placeholder.com/300x400?text=Dragon+Silk+Jacket',
      category: 'Outerwear',
      description: 'Luxurious silk jacket featuring an intricate dragon embroidery design.'
    },
    {
      id: 2,
      name: 'Koi Pattern Shirt',
      price: 69.99,
      image: 'https://via.placeholder.com/300x400?text=Koi+Pattern+Shirt',
      category: 'Shirts',
      description: 'Breathable cotton shirt with a subtle koi fish pattern throughout.'
    },
    {
      id: 3,
      name: 'Tiger Embroidered Cap',
      price: 34.99,
      image: 'https://via.placeholder.com/300x400?text=Tiger+Cap',
      category: 'Accessories',
      description: 'Stylish cap featuring a beautifully embroidered tiger design.'
    },
    {
      id: 4,
      name: 'Cherry Blossom Tee',
      price: 49.99,
      image: 'https://via.placeholder.com/300x400?text=Cherry+Blossom+Tee',
      category: 'Shirts',
      description: 'Soft cotton t-shirt with delicate cherry blossom print.'
    },
    {
      id: 5,
      name: 'Dragon Scale Hoodie',
      price: 89.99,
      image: 'https://via.placeholder.com/300x400?text=Dragon+Hoodie',
      category: 'Outerwear',
      description: 'Comfortable hoodie with a unique dragon scale pattern and embroidery.'
    },
    {
      id: 6,
      name: 'Lotus Silk Scarf',
      price: 45.99,
      image: 'https://via.placeholder.com/300x400?text=Lotus+Scarf',
      category: 'Accessories',
      description: 'Elegant silk scarf with lotus flower motifs in vibrant colors.'
    },
    {
      id: 7,
      name: 'Bamboo Pattern Pants',
      price: 69.99,
      image: 'https://via.placeholder.com/300x400?text=Bamboo+Pants',
      category: 'Bottoms',
      description: 'Comfortable pants with a subtle bamboo leaf pattern throughout.'
    },
    {
      id: 8,
      name: 'Koi Fish Beanie',
      price: 29.99,
      image: 'https://via.placeholder.com/300x400?text=Koi+Beanie',
      category: 'Accessories',
      description: 'Warm knitted beanie with embroidered koi fish details.'
    }
  ];

  // Categories
  const categories = ['All', 'Outerwear', 'Shirts', 'Bottoms', 'Accessories'];

  // Filter products by category
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <div className="app">
      <header className="app-header">
        <h1>ZAIKU</h1>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products" className="active">Products</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      
      <main>
        <section className="products-hero">
          <h2>Our Collection</h2>
          <p>Discover the perfect blend of traditional Asian aesthetics and modern fashion</p>
        </section>
        
        <section className="products-content">
          <div className="category-filter">
            {categories.map(category => (
              <button 
                key={category}
                className={activeCategory === category ? 'active' : ''}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div className="product-card" key={product.id}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="product-image" 
                />
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">${product.price}</p>
                  <button className="product-button">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>ZAIKU</h3>
            <p>Embracing Asian heritage through modern fashion.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: zaiku@gmail.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Zaiku. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Products;