import { useState } from 'react';
import { resetPassword } from '../Utilities/authUtils'; // Asume que tienes una función para restablecer la contraseña

interface UseResetPasswordReturn {
  email: string;
  newPassword: string;
  confirmPassword: string;
  isLoading: boolean;
  error: string | null;
  isPasswordError: boolean;
  setEmail: (email: string) => void;
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  handleResetPassword: () => Promise<void>;
}

export const useResetPassword = (): UseResetPasswordReturn => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordError, setIsPasswordError] = useState(false);

  const handleResetPassword = async () => {
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
    isLoading,
    error,
    isPasswordError,
    setEmail,
    setNewPassword,
    setConfirmPassword,
    handleResetPassword,
  };
};
