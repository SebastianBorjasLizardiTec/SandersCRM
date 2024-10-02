import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importamos Link de react-router-dom
import './colors.css';
import './App.css';


const ResetPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
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
    <div className="reset-password-container">
      <h2 className="reset-password-title">Reset Password</h2>
      <form onSubmit={handleSubmit} className="reset-password-form">
        <div className="form-group">
          <label htmlFor="email" className="email-label">Email</label>
          <input
            type="email"
            id="email"
            className="email-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword" className="new-password-label">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="label-dark-blue">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="reset-password-button">
          Reset Password
        </button>
      </form>
      <p className="reset-password-text">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="reset-password-link">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default ResetPassword;
