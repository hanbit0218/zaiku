// client/src/components/auth/Profile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../../api';
import './Auth.css';

function Profile({ navigate }) {
  const { currentUser, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        console.log('Fetching user profile data...');
        const result = await getUserProfile();
        
        if (result.success) {
          console.log('Profile data fetched:', result.data);
          setProfileData(result.data);
        } else {
          setError('Failed to load profile data. Please try refreshing the page.');
        }
      } catch (error) {
        console.error('Profile loading error:', error);
        setError('An error occurred while loading your profile');
      }
      
      setIsLoading(false);
    };
    
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('home');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          <button className="auth-button" onClick={handleLogout}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container profile-container">
        <h2>My Profile</h2>
        
        {updateSuccess && (
          <div className="message success">Profile updated successfully!</div>
        )}
        
        <div className="profile-info">
          <div className="profile-field">
            <span className="profile-label">Username:</span>
            <span className="profile-value">{profileData?.username || currentUser?.username}</span>
          </div>
          
          <div className="profile-field">
            <span className="profile-label">Email:</span>
            <span className="profile-value">{profileData?.email || currentUser?.email}</span>
          </div>
          
          <div className="profile-field">
            <span className="profile-label">Member since:</span>
            <span className="profile-value">
              {profileData?.createdAt ? formatDate(profileData.createdAt) : 'N/A'}
            </span>
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