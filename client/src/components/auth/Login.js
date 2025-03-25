// client/src/components/auth/Login.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import GoogleLoginButton from './GoogleLoginButton';
import './Auth.css';

function Login({ navigate }) {
  const { loginUser, loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validate = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setLoginError('');
      
      try {
        console.log('Attempting login...');
        const result = await loginUser(
          formData.email, 
          formData.password, 
          formData.rememberMe
        );
        
        if (result.success) {
          console.log('Login successful, redirecting to home');
          navigate('home');
        } else {
          setLoginError(result.message || 'Invalid email or password');
        }
      } catch (error) {
        console.error('Login submission error:', error);
        setLoginError('An unexpected error occurred. Please try again later.');
      }
      
      setIsSubmitting(false);
    }
  };

  // Handle Google login success
  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setIsSubmitting(true);
      setLoginError('');
      
      const result = await loginWithGoogle(tokenResponse);
      
      if (result.success) {
        console.log('Google login successful, redirecting to home');
        navigate('home');
      } else {
        setLoginError(result.message || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setLoginError('An unexpected error occurred with Google login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Welcome Back</h2>
        <p>Login to access your account</p>
        
        {loginError && (
          <div className="message error">
            {loginError}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          
          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-separator">or</div>
        
        <GoogleLoginButton 
          onSuccess={handleGoogleSuccess} 
          buttonText="Sign in with Google"
        />
        
        <div className="auth-footer">
          Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('register'); }}>Register</a>
        </div>
      </div>
    </div>
  );
}

export default Login;