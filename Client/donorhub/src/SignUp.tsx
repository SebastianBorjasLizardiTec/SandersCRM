import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importamos Link de react-router-dom
import './colors.css';
import './App.css';


const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(formData);
  };

  return (
    <div className="signup-container">
      <h2 className="signup-heading">Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="username" className="label-dark-blue">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="email-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="email-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="password-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="password-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="confirm-password-label">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="confirm-password-input"
          />
        </div>

        <button type="submit" className="sign-up-button">
          Sign Up
        </button>
      </form>
      <p className="forgot-password-text">
        Forgot your password?{' '}
        <Link to="/reset-password" className="forgot-password-link">
          Reset Password
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
