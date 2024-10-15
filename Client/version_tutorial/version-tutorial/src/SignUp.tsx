
import './styles/credentials.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiLock, CiUnlock } from "react-icons/ci";
import { useSignUp} from "./hooks/useSignUpHook";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const {
    nombre,
    email,
    password,
    confirmPassword,
    showPassword,
    isLoading,
    setEmail,
    setNombre,
    setPassword,
    setConfirmPassword,
    togglePasswordVisibility,
    handleSignUp,
  } = useSignUp();

  const onSignUpClick = async () => {
    const result = await handleSignUp();
    if (result) { 
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
          <h1 className="title">Crear cuenta</h1>
          <div className="greyText">Por favor, ingresa tus detalles para crear una cuenta...</div>
          <input 
            type="text" 
            className="email-input" 
            placeholder="Nombre" 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
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
              placeholder="Contraseña" 
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
          <div className="password-container">  
            <input 
              type={showPassword ? "text" : "password"} 
              className="password-input"
              placeholder="Confirmar contraseña" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
             <button 
              className="toggle-password"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <CiUnlock/> : <CiLock/> }
            </button>
            </div>
           
          </div>
          <button className='pinkButton' onClick={onSignUpClick} disabled={isLoading}>
            {isLoading ? 'Registrando' : 'Registrarse'}
          </button>
          <div className='separator'>
            <div className='line'></div>
            <span className='or-text'>o</span>
            <div className='line'></div>
          </div>
          <button className='blueTextButton' onClick={onLogInClick}>
            Log In
          </button>
        </div>
      </div>
  );
};

export default SignUp;
