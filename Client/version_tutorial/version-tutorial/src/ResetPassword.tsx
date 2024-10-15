import React, { useState } from 'react';
import { useResetPassword } from '../hooks/useResetPassword';
import '../styles/credentials.css';

const ResetPassword: React.FC = () => {
  const {
    email,
    newPassword,
    confirmPassword,
    verificationCode,
    isVerified,
    isLoading,
    error,
    isPasswordError,
    setEmail,
    setNewPassword,
    setConfirmPassword,
    setVerificationCode,
    handleSendVerificationCode,
    handleVerifyCode,
    handleResetPassword,
  } = useResetPassword();

  // Estado local para manejar el código de verificación ingresado por el usuario
  const [enteredCode, setEnteredCode] = useState('');

  return (
    <div className="container">
      <div className="content">
        <h1 className="logo">DONNOR HUB</h1>
        <h1 className="title">Reset Your Password</h1>
        <div className="greyText">Please enter your email to receive a verification code...</div>

        {/* Input de correo electrónico */}
        <input 
          type="email" 
          className="email-input" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Botón para enviar el código de verificación */}
        <button 
          className="pinkButton" 
          onClick={handleSendVerificationCode} 
          disabled={isLoading || isVerified}
        >
          {isLoading ? 'Sending Code...' : 'Send Verification Code'}
        </button>

        {/* Mostrar el campo para ingresar el código si el correo ya fue enviado */}
        {!isVerified && (
          <>
            <input 
              type="text" 
              className="code-input" 
              placeholder="Enter Verification Code" 
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
            />
            <button 
              className="pinkButton" 
              onClick={() => handleVerifyCode(enteredCode)} 
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </>
        )}

        {/* Mostrar los campos para la nueva contraseña solo si el código fue verificado */}
        {isVerified && (
          <>
            <input 
              type="password" 
              className="password-input" 
              placeholder="New Password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input 
              type="password" 
              className="password-input" 
              placeholder="Confirm New Password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button 
              className="pinkButton" 
              onClick={handleResetPassword} 
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
        )}

        {/* Mostrar mensajes de error */}
        {error && <div className="error">{error}</div>}

        {/* Mostrar mensaje de error específico para contraseñas */}
        {isPasswordError && <div className="error">Passwords do not match</div>}
      </div>
    </div>
  );
};

export default ResetPassword;
