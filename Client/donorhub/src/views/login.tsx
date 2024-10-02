import '../styles/credentials.css';
import React from 'react';
import { CiLock, CiUnlock } from "react-icons/ci";
import { useLogin } from '../hooks/useLogInHook';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const {
    email,
    password,
    showPassword,
    isLoading,
    error,
    isPasswordError,
    setEmail,
    setPassword,
    togglePasswordVisibility,
    handleLogin,
  } = useLogin();

  const onLoginClick = async () => {
    const result = await handleLogin();
    if (result && result.token) {
      navigate('/Donors');
    }
  };

  return (
    <div className="container">
      <div className="content">
        <h1 className="logo">DONNOR HUB</h1>
        <div className="data-container">
          <h1 className="title">Welcome back!</h1>
          <div className="greyText">Please enter your details...</div>
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
              className={`password-input ${isPasswordError ? 'password-error' : ''}`}
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              className="toggle-password"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <CiUnlock/> : <CiLock/> }
            </button>
          </div>
          <button className='blueTextButton'>Forgot Password?</button>
          <button className='pinkButton' onClick={onLoginClick} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
          <div className='separator'>
            <div className='line'></div>
            <span className='or-text'>or</span>
            <div className='line'></div>
          </div>
          <button className='signUpButton'>Sign Up</button>
        </div>
      </div>
      <div 
        className="image-container"
        aria-label="Background image illustrating lack of access to clean water for 12 million people"
      >
        <div className="image-text">"12 Millones de personas no cuentan con acceso a agua potable"</div>
      </div>
    </div>
  );
};

export default Login;