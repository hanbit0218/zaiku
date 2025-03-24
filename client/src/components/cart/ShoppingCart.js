// src/components/cart/ShoppingCart.js - modified version
import React, { useState, useEffect } from 'react';
import './ShoppingCart.css';

function ShoppingCart({ isOpen, onClose, updateCartCount }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Control visibility with a slight delay
  useEffect(() => {
    if (isOpen) {
      // Mount component immediately, then add the 'open' class
      setIsVisible(true);
      // Use a tiny timeout to ensure the transition works
      setTimeout(() => {
        document.querySelector('.cart-overlay').classList.add('open');
        document.querySelector('.cart-backdrop').classList.add('open');
      }, 10);
    } else {
      // Remove 'open' class first
      const overlay = document.querySelector('.cart-overlay');
      const backdrop = document.querySelector('.cart-backdrop');
      
      if (overlay && backdrop) {
        overlay.classList.remove('open');
        backdrop.classList.remove('open');
      }
      
      // Wait for transition to finish before unmounting
      setTimeout(() => {
        setIsVisible(false);
      }, 300); // Match this to your CSS transition duration
    }
  }, [isOpen]);

  useEffect(() => {
    // Load cart items from localStorage
    const loadCartItems = () => {
      setIsLoading(true);
      
      // Load cart from localStorage
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      setIsLoading(false);
    };
    
    if (isOpen) {
      loadCartItems();
      
      // Prevent body scrolling when cart is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Update cart count
    if (updateCartCount) {
      updateCartCount();
    }
  };
  
  // New function to update quantity
  const updateQuantity = (itemId, newQuantity) => {
    // Don't allow quantities less than 1
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updatedCart);
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Update cart count
    if (updateCartCount) {
      updateCartCount();
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // Don't render anything if component is not visible
  if (!isVisible) return null;

  return (
    <>
      <div className="cart-backdrop"></div>
      <div className="cart-overlay">
        <div className="cart-container">
          <div className="cart-header">
            <h2>Your Shopping Cart</h2>
            <button className="close-button" onClick={onClose}>&times;</button>
          </div>
          
          <div className="cart-content">
            {isLoading ? (
              <div className="cart-loading">Loading your cart...</div>
            ) : cartItems.length === 0 ? (
              <div className="cart-empty">
                <p>Your cart is empty</p>
                <button className="cart-button" onClick={onClose}>Continue Shopping</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map(item => (
                    <div className="cart-item" key={item.id}>
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p className="item-price">${item.price.toFixed(2)}</p>
                        <div className="item-quantity-control">
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="quantity-display">{item.quantity}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button 
                        className="remove-item" 
                        onClick={() => removeItem(item.id)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="cart-summary">
                  <div className="cart-total">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <button className="checkout-button">Proceed to Checkout</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ShoppingCart;