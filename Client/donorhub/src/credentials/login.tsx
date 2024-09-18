import './credentials.css';
import React from 'react';
import { CiLock } from "react-icons/ci";
import { CiUnlock } from "react-icons/ci";
import { useLogin } from './useLogInHook'; 

const Login: React.FC = () => {
  const {
    email,
    password,
    showPassword,
    isLoading,
    error,
    setEmail,
    setPassword,
    togglePasswordVisibility,
    handleLogin,
  } = useLogin();

  const onLoginClick = async () => {
    const result = await handleLogin();
    if (result) {
      console.log('Login successful', result);
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
              className="password-input" 
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
          {error && <div className="error-message">{error}</div>}
          <div className='separator'>
            <div className='line'></div>
            <span className='or-text'>or</span>
            <div className='line'></div>
          </div>
          <button className='signUpButton'>Sign Up</button>
        </div>
      </div>
      <div className="image-container">
        <div className="image-text">"12 Millones de personas no cuentan con acceso a agua potable"</div>
      </div>
    </div>
  );
};

export default Login;