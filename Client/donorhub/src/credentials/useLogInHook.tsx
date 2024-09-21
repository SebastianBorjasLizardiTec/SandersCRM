import { useState } from 'react';
import { loginUser, LoginResponse } from '../Utilities/apiUtils';

interface UseLoginReturn {
  email: string;
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  error: string | null;
  isPasswordError: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  togglePasswordVisibility: () => void;
  handleLogin: () => Promise<LoginResponse | void>;
}

export const useLogin = (): UseLoginReturn => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordError, setIsPasswordError] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    setIsPasswordError(false);
    try {
      const response = await loginUser(email, password);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsPasswordError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};