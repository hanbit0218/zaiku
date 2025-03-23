import React, { useState, useEffect } from 'react';
import './styles/App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Set initial page based on URL when component mounts
    const path = window.location.pathname;
    if (path === '/products') {
      setCurrentPage('products');
    } else if (path === '/contact') {
      setCurrentPage('contact');
    } else {
      setCurrentPage('home');
    }

    // Add event listener for back/forward browser navigation
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handlePopState = () => {
    const path = window.location.pathname;
    if (path === '/products') {
      setCurrentPage('products');
    } else if (path === '/contact') {
      setCurrentPage('contact');
    } else {
      setCurrentPage('home');
    }
  };

  const navigate = (page) => {
    setCurrentPage(page);
    const url = page === 'home' ? '/' : `/${page}`;
    window.history.pushState({}, '', url);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>ZAIKU</h1>
        <nav>
          <ul>
            <li>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); navigate('home'); }}
                className={currentPage === 'home' ? 'active' : ''}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); navigate('products'); }}
                className={currentPage === 'products' ? 'active' : ''}
              >
                Products
              </a>
            </li>
            <li>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); navigate('contact'); }}
                className={currentPage === 'contact' ? 'active' : ''}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>
      
      <main>
        {currentPage === 'home' && (
          <>
            <section className="hero">
              <h2>Where East Meets Modern Fashion</h2>
              <p>Explore our collection of Asian-inspired clothing featuring dragons, tigers, and koi fish</p>
              <button className="cta-button" onClick={() => navigate('products')}>Shop Now</button>
            </section>
            
            <section className="featured">
              <h2>Featured Products</h2>
              <div className="product-grid">
                <div className="product-card">
                  <div className="product-image"></div>
                  <h3>Dragon Silk Jacket</h3>
                  <p>$129.99</p>
                </div>
                <div className="product-card">
                  <div className="product-image"></div>
                  <h3>Koi Pattern Shirt</h3>
                  <p>$69.99</p>
                </div>
                <div className="product-card">
                  <div className="product-image"></div>
                  <h3>Tiger Embroidered Cap</h3>
                  <p>$34.99</p>
                </div>
              </div>
            </section>
          </>
        )}
        
        {currentPage === 'products' && (
          <ProductsPage />
        )}
        
        {currentPage === 'contact' && (
          <ContactPage />
        )}
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
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('home'); }}>Home</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('products'); }}>Products</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('contact'); }}>Contact</a></li>
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

// Products Page Component (included in the same file to avoid import issues)
function ProductsPage() {
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
    }
  ];

  // Categories
  const categories = ['All', 'Outerwear', 'Shirts', 'Accessories'];

  // Filter products by category
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <div className="products-page">
      <div className="products-hero">
        <h2>Our Collection</h2>
        <p>Discover the perfect blend of traditional Asian aesthetics and modern fashion</p>
      </div>
      
      <div className="products-content">
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
      </div>
    </div>
  );
}

// Contact Page Component (included in the same file to avoid import issues)
function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validate();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      
      // Simulate sending an email
      setTimeout(() => {
        console.log('Form data submitted:', formData);
        
        setIsSubmitting(false);
        setSubmitSuccess(true);
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      }, 1500);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you</p>
      </div>
      
      <div className="contact-content">
        <div className="contact-form-container">
          <h3>Send Us a Message</h3>
          <p>Have questions about our products or need assistance? Reach out to us!</p>
          
          {submitSuccess ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Thank You!</h3>
              <p>Your message has been sent successfully. We'll get back to you soon.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={formErrors.name ? 'error' : ''}
                />
                {formErrors.name && <span className="error-message">{formErrors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={formErrors.email ? 'error' : ''}
                />
                {formErrors.email && <span className="error-message">{formErrors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className={formErrors.message ? 'error' : ''}
                ></textarea>
                {formErrors.message && <span className="error-message">{formErrors.message}</span>}
              </div>
              
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
        
        <div className="contact-info">
          <div className="info-card">
            <h3>Contact Information</h3>
            <div className="info-item">
              <strong>Email:</strong>
              <p>zaiku@gmail.com</p>
            </div>
            <div className="info-item">
              <strong>Location:</strong>
              <p>Tokyo, Japan</p>
            </div>
            <div className="info-item">
              <strong>Hours:</strong>
              <p>Monday - Friday: 9AM - 5PM</p>
            </div>
          </div>
          
          <div className="faq-card">
            <h3>Frequently Asked Questions</h3>
            <div className="faq-item">
              <h4>How long does shipping take?</h4>
              <p>Standard shipping takes 3-5 business days within the country and 7-14 days for international orders.</p>
            </div>
            <div className="faq-item">
              <h4>What is your return policy?</h4>
              <p>We offer a 30-day return policy for unused items in original packaging. Please contact us for details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;