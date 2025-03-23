import React, { useState } from 'react';
import './Contact.css';

function Contact() {
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
        // In a real application, you would send this data to your backend
        // which would then send an email to zaiku@gmail.com
        
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
    <div className="app">
      <header className="app-header">
        <h1>ZAIKU</h1>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/contact" className="active">Contact</a></li>
          </ul>
        </nav>
      </header>
      
      <main>
        <section className="contact-hero">
          <h2>Contact Us</h2>
          <p>We'd love to hear from you</p>
        </section>
        
        <section className="contact-content">
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

export default Contact;