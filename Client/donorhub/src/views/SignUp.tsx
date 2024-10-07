import '../styles/credentials.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiLock, CiUnlock } from "react-icons/ci";
import { useSignUp } from '../hooks/useSignUpHook';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const {
    username,
    email,
    password,
    confirmPassword,
    showPassword,
    isLoading,
    setEmail,
    setUsername,
    setPassword,
    setConfirmPassword,
    togglePasswordVisibility,
    handleSignUp,
  } = useSignUp();

 

  const onSignUpClick = async () => {
    const result = await handleSignUp();
    if (result && result.success) { 
      navigate('/login'); 
    }
  };

  const onLogInClick = () => {
    navigate('/login'); 
  };

  return (
    <div className="container">
      <div className="content">
        <h1 className="logo">DONNOR HUB</h1>
        <div className="data-container">
          <h1 className="title">Create Account</h1>
          <div className="greyText">Please enter your details to sign up...</div>
          <input 
            type="text" 
            className="email-input" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="text" 
            className="email-input" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-container">
            <input 
              type={showPassword ? "text" : "password"} 
              className="password-input"
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className='password-container'>
            <input 
              type={showPassword ? "text" : "password"} 
              className="password-input"
              placeholder="Confirm Password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            </div>
            <button 
              className="toggle-password"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <CiUnlock/> : <CiLock/> }
            </button>
          </div>
          <button className='pinkButton' onClick={onSignUpClick} disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
          <div className='separator'>
            <div className='line'></div>
            <span className='or-text'>or</span>
            <div className='line'></div>
          </div>
          <button className='blueTextButton' onClick={onLogInClick}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
