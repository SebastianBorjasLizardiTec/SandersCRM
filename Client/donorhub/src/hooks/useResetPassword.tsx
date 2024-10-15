import { useState } from 'react';
import { resetPassword, sendVerificationCodeEmail } from '../Utilities/authUtils'; // Importamos las funciones de authUtils

interface UseResetPasswordReturn {
  email: string;
  newPassword: string;
  confirmPassword: string;
  verificationCode: string;
  isLoading: boolean;
  error: string | null;
  isPasswordError: boolean;
  isVerified: boolean;
  setEmail: (email: string) => void;
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  setVerificationCode: (code: string) => void;
  handleSendVerificationCode: () => Promise<void>;
  handleVerifyCode: (code: string) => void;
  handleResetPassword: () => Promise<void>;
}

export const useResetPassword = (): UseResetPasswordReturn => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordError, setIsPasswordError] = useState(false);

  // Función para enviar el código de verificación al correo
  const handleSendVerificationCode = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString(); // Genera un código de 6 dígitos
      setGeneratedCode(code);

      // Enviar el código al correo del usuario
      await sendVerificationCodeEmail(email, code);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending verification code');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para verificar el código ingresado
  const handleVerifyCode = (code: string) => {
    if (code === generatedCode) {
      setIsVerified(true);
      setError(null);
    } else {
      setError('Invalid verification code');
      setIsVerified(false);
    }
  };

  // Función para manejar el restablecimiento de contraseña
  const handleResetPassword = async () => {
    if (!isVerified) {
      setError('You must verify the code first.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsPasswordError(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsPasswordError(false);
    try {
      await resetPassword(email, newPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsPasswordError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    newPassword,
    confirmPassword,
    verificationCode,
    isLoading,
    error,
    isPasswordError,
    isVerified,
    setEmail,
    setNewPassword,
    setConfirmPassword,
    setVerificationCode,
    handleSendVerificationCode,
    handleVerifyCode,
    handleResetPassword,
  };
};
