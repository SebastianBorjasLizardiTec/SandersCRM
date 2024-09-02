import './credentials.css';
import React, { useState } from 'react';
import { CiLock } from "react-icons/ci";
import { CiUnlock } from "react-icons/ci";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <div className="content">
        <h1 className="logo">DONNOR HUB</h1>
        <div className="data-container">
          <h1 className="title">Welcome back!</h1>
          <div className="greyText">Please your details...</div>
          <input type="text" className="email-input" placeholder="Email" />
          <div className="password-container">
            <input 
              type={showPassword ? "text" : "password"} 
              className="password-input" 
              placeholder="Password" 
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
          <button className='pinkButton'>Log In</button>
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