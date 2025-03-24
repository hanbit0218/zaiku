// src/components/auth/Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      
      // Get token from storage
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to view this page');
        setIsLoading(false);
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      try {
        const response = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Handle unauthorized or other errors
          if (response.status === 401) {
            // Clear invalid token
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            localStorage.removeItem('user');
            
            setError('Session expired. Please log in again.');
            setTimeout(() => navigate('/login'), 2000);
          } else {
            setError('Failed to load profile data');
          }
        }
      } catch (error) {
        setError('An error occurred while loading your profile');
        console.error('Profile loading error:', error);
      }
      
      setIsLoading(false);
    };
    
    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    // Clear token and user data
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to home page
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="auth-form-container">
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-form-container">
          <h2>Error</h2>
          <div className="message error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container profile-container">
        <h2>My Profile</h2>
        
        <div className="profile-info">
          <div className="profile-field">
            <span className="profile-label">Username:</span>
            <span className="profile-value">{user.username}</span>
          </div>
          
          <div className="profile-field">
            <span className="profile-label">Email:</span>
            <span className="profile-value">{user.email}</span>
          </div>
          
          <div className="profile-field">
            <span className="profile-label">Member since:</span>
            <span className="profile-value">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="profile-actions">
          <button className="auth-button secondary">Edit Profile</button>
          <button className="auth-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;