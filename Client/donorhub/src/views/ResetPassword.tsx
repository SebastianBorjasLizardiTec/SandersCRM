import React from 'react';
import { useResetPassword } from '../hooks/useResetPassword'; // Asume que el hook está en esta ruta
import '../styles/credentials.css'; // Asegúrate de que la ruta es correcta

const ResetPassword: React.FC = () => {
  const {
    email,
    newPassword,
    confirmPassword,
    isLoading,
    error,
    setEmail,
    setNewPassword,
    setConfirmPassword,
    handleResetPassword,
  } = useResetPassword();

  return (
    <div className="container">
      <div className="content">
        <h1 className="logo">DONNOR HUB</h1>
        <h1 className="title">Reset Your Password</h1>
        <div className="greyText">Please enter your email and new password...</div>
        <input 
          type="email" 
          className="email-input" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
        {error && <div className="error">{error}</div>}
        <button 
          className='pinkButton' 
          onClick={handleResetPassword} 
          disabled={isLoading}
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
