import { useState } from 'react';


import { RegisterResponse, signupUser } from '../Utilities/authUtils'; 

interface UseSignUpReturn {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  isLoading: boolean;
  error: string | null;
  isPasswordError: boolean;
  setNombre: (username: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  togglePasswordVisibility: () => void;
  handleSignUp: () => Promise<RegisterResponse | void>;
}

export const useSignUp = (): UseSignUpReturn => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordError, setIsPasswordError] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsPasswordError(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsPasswordError(false);
    try {
      const response = await signupUser( nombre, email, password );
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsPasswordError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    nombre,
    email,
    password,
    confirmPassword,
    showPassword,
    isLoading,
    error,
    isPasswordError,
    setNombre,
    setEmail,
    setPassword,
    setConfirmPassword,
    togglePasswordVisibility,
    handleSignUp,
  };
};