// src/components/cart/CartIcon.js
import React from 'react';
import './CartIcon.css';

function CartIcon({ itemCount, onClick }) {
  return (
    <div className="cart-icon-container" onClick={onClick}>
      <div className="cart-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {itemCount > 0 && (
          <span className="cart-count">{itemCount}</span>
        )}
      </div>
    </div>
  );
}

export default CartIcon;