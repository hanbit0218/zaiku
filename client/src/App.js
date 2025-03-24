// src/App.js with Search Bar added
import React, { useState, useEffect } from 'react';
import './styles/App.css';
import './components/auth/Auth.css';
import CartIcon from './components/cart/CartIcon';
import ShoppingCart from './components/cart/ShoppingCart';
import SearchBar from './components/search/SearchBar'; // Import the new SearchBar component

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchParams, setSearchParams] = useState({ search: '' });
  
  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Product data (moved to App.js from ProductsPage to be accessible to SearchBar)
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
  
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/products') {
      setCurrentPage('products');
    } else if (path === '/contact') {
      setCurrentPage('contact');
    } else if (path === '/login') {
      setCurrentPage('login');
    } else if (path === '/register') {
      setCurrentPage('register');
    } else if (path === '/profile') {
      setCurrentPage('profile');
    } else {
      setCurrentPage('home');
    }

    window.addEventListener('popstate', handlePopState);
    
    // Update cart count when component mounts
    updateCartCount();
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handlePopState = () => {
    const path = window.location.pathname;
    if (path === '/products') {
      setCurrentPage('products');
    } else if (path === '/contact') {
      setCurrentPage('contact');
    } else if (path === '/login') {
      setCurrentPage('login');
    } else if (path === '/register') {
      setCurrentPage('register');
    } else if (path === '/profile') {
      setCurrentPage('profile');
    } else {
      setCurrentPage('home');
    }
  };

  const navigate = (page, params = {}) => {
    setCurrentPage(page);
    if (params) {
      setSearchParams(params);
    }
    const url = page === 'home' ? '/' : `/${page}`;
    window.history.pushState({}, '', url);
  };

  // Update cart count
  const updateCartCount = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      // Count total quantity of all items
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(totalItems);
    } else {
      setCartCount(0);
    }
  };

  // Get cart item count for display
  const getCartItemCount = () => {
    return cartCount;
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };
  
  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('home');
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('home');
  };
  
  // Password toggle functions
  const toggleLoginPasswordVisibility = () => {
    setShowLoginPassword(!showLoginPassword);
  };

  const toggleRegisterPasswordVisibility = () => {
    setShowRegisterPassword(!showRegisterPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo-container">
          <img src='logo.png' alt="ZAIKU Logo" className="logo" />
          <h1>Z A I K U</h1>
        </div>
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
            <li className="auth-nav-item">
              {isLoggedIn ? (
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); navigate('profile'); }}
                  className={currentPage === 'profile' ? 'active' : ''}
                >
                  Profile
                </a>
              ) : (
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); navigate('login'); }}
                  className={currentPage === 'login' || currentPage === 'register' ? 'active' : ''}
                >
                  Login
                </a>
              )}
              <div className="auth-dropdown">
                {isLoggedIn ? (
                  <>
                    <a href="#" onClick={(e) => {e.preventDefault(); navigate('profile')}}>My Profile</a>
                    <a href="#" onClick={(e) => {e.preventDefault(); handleLogout()}}>Logout</a>
                  </>
                ) : (
                  <>
                    <a href="#" onClick={(e) => {e.preventDefault(); navigate('login')}}>Login</a>
                    <a href="#" onClick={(e) => {e.preventDefault(); navigate('register')}}>Register</a>
                  </>
                )}
              </div>
            </li>
            {/* Add Search Bar */}
            <li className="search-nav-item">
              <SearchBar products={products} navigate={navigate} />
            </li>
            <li className="cart-nav-item">
              <CartIcon itemCount={getCartItemCount()} onClick={toggleCart} />
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
        
        {currentPage === 'products' && <ProductsPage updateCartCount={updateCartCount} products={products} searchParams={searchParams} />}
        {currentPage === 'contact' && <ContactPage />}
        
        {currentPage === 'login' && (
          <div className="auth-container">
            <div className="auth-form-container">
              <h2>Welcome Back</h2>
              <p>Login to access your account and explore our exclusive collections</p>
              
              <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" placeholder="your@email.com" />
                </div>
                
                <div className="form-group password-field">
                  <label htmlFor="password">Password</label>
                  <div className="password-input-container">
                    <input 
                      type={showLoginPassword ? "text" : "password"} 
                      id="password" 
                      name="password" 
                      placeholder="Enter your password"
                    />
                    <button 
                      type="button" 
                      className="password-toggle" 
                      onClick={toggleLoginPasswordVisibility}
                      aria-label={showLoginPassword ? "Hide password" : "Show password"}
                    >
                      {showLoginPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eye-icon">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eye-icon">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="form-group checkbox">
                  <input type="checkbox" id="rememberMe" name="rememberMe" />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
                
                <button type="submit" className="auth-button">Login</button>
              </form>
              
              <div className="auth-footer">
                Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('register'); }}>Register</a>
              </div>
            </div>
          </div>
        )}
        
        {currentPage === 'register' && (
          <div className="auth-container">
            <div className="auth-form-container">
              <h2>Create an Account</h2>
              <p>Join ZAIKU and explore our unique collection of Asian-inspired fashion</p>
              
              <form className="auth-form" onSubmit={(e) => { e.preventDefault(); navigate('login'); }}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input type="text" id="username" name="username" placeholder="Choose a username" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" placeholder="your@email.com" />
                </div>
                
                <div className="form-group password-field">
                  <label htmlFor="password">Password</label>
                  <div className="password-input-container">
                    <input 
                      type={showRegisterPassword ? "text" : "password"} 
                      id="password" 
                      name="password" 
                      placeholder="Create a strong password"
                    />
                    <button 
                      type="button" 
                      className="password-toggle" 
                      onClick={toggleRegisterPasswordVisibility}
                      aria-label={showRegisterPassword ? "Hide password" : "Show password"}
                    >
                      {showRegisterPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eye-icon">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eye-icon">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="form-group password-field">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="password-input-container">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      placeholder="Confirm your password"
                    />
                    <button 
                      type="button" 
                      className="password-toggle" 
                      onClick={toggleConfirmPasswordVisibility}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eye-icon">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eye-icon">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <button type="submit" className="auth-button">Create Account</button>
              </form>
              
              <div className="auth-footer">
                Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('login'); }}>Log In</a>
              </div>
            </div>
          </div>
        )}
        
        {currentPage === 'profile' && (
          <div className="auth-container">
            <div className="auth-form-container profile-container">
              <h2>My Profile</h2>
              
              <div className="profile-info">
                <div className="profile-field">
                  <span className="profile-label">Username:</span>
                  <span className="profile-value">JohnDoe</span>
                </div>
                
                <div className="profile-field">
                  <span className="profile-label">Email:</span>
                  <span className="profile-value">john.doe@example.com</span>
                </div>
                
                <div className="profile-field">
                  <span className="profile-label">Member since:</span>
                  <span className="profile-value">March 23, 2025</span>
                </div>
              </div>
              
              <div className="profile-actions">
                <button className="auth-button secondary">Edit Profile</button>
                <button className="auth-button" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <ShoppingCart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        updateCartCount={updateCartCount}
      />
      
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
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('login'); }}>Login</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('register'); }}>Register</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: zaiku.info@gmail.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Zaiku. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// ProductsPage Component (modified to include search functionality)
function ProductsPage({ updateCartCount, products, searchParams }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchResults, setSearchResults] = useState(products);
  
  // Apply search filter when searchParams change
  useEffect(() => {
    if (searchParams && searchParams.search) {
      const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchParams.search.toLowerCase()) ||
        product.description.toLowerCase().includes(searchParams.search.toLowerCase()) ||
        product.category.toLowerCase().includes(searchParams.search.toLowerCase())
      );
      setSearchResults(filteredProducts);
    } else {
      setSearchResults(products);
    }
  }, [searchParams, products]);

  // Categories
  const categories = ['All', 'Outerwear', 'Shirts', 'Accessories'];

  // Filter products by category and search
  const filteredProducts = activeCategory === 'All' 
    ? searchResults 
    : searchResults.filter(product => product.category === activeCategory);

  // Add item to cart
  const addToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    };
    
    // Get existing cart or create empty one
    const savedCart = localStorage.getItem('cart');
    let cart = savedCart ? JSON.parse(savedCart) : [];
    
    // Check if item already in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Update quantity if item already exists
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new item
      cart.push(cartItem);
    }
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count in the navbar
    if (updateCartCount) {
      updateCartCount();
    }
    
    // Show confirmation message
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="products-page">
      <div className="products-hero">
        <h2>Our Collection</h2>
        <p>Discover the perfect blend of traditional Asian aesthetics and modern fashion</p>
      </div>
      
      <div className="products-content">
        {/* Display search results message if searching */}
        {searchParams && searchParams.search && (
          <div className="search-results-info">
            <p>
              Showing results for: <strong>{searchParams.search}</strong> 
              ({filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found)
            </p>
          </div>
        )}
        
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
        
        {filteredProducts.length === 0 ? (
          <div className="no-products-found">
            <p>No products found matching your criteria.</p>
          </div>
        ) : (
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
                  <button 
                    className="product-button"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ContactPage Component (included in the same file)
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
              <p>zaiku.info@gmail.com</p>
            </div>
            <div className="info-item">
              <strong>Location:</strong>
              <p>San Jose, California, US</p>
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