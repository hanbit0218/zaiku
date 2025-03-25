import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

function GoogleCallback({ navigate }) {
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    // Get token from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userId = params.get('userId');
    const email = params.get('email');
    const username = params.get('username');
    
    if (token && userId) {
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set user in context
      setCurrentUser({
        _id: userId,
        email: email || '',
        username: username || '',
      });
      
      // Redirect to home page
      navigate('home');
    } else {
      // Handle error
      console.error('No token received from Google auth');
      navigate('login');
    }
  }, [navigate, setCurrentUser]);

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Processing Google Login</h2>
        <p>Please wait while we complete your authentication...</p>
      </div>
    </div>
  );
}

export default GoogleCallback;