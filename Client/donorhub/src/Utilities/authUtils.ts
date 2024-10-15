import { User, LoginResponse, SignupResponse } from './apiUtils';
import { API_URL } from '../constants/constants';

// Check if user is authenticated with local storage token value.
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Removes token from local storage
export const logout = (): void => {
  localStorage.removeItem('token');
};

// Logs user in
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred during login');
  }

  const data = await response.json();

  localStorage.setItem('token', data.token);

  return data;
};

export const signupUser = async (nombre: string, email: string, password: string, role: 'admin' | 'user'): Promise<SignupResponse> => {
  console.log('signupUser called', { nombre, email, password, role });
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nombre, email, password, role }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Signup error:', errorData);
    throw new Error(errorData.message || 'An error occurred during signup');
  }

  const data = await response.json();

  localStorage.setItem('token', data.token);

  return data;
};



// Simulación de una función para enviar el código de verificación al correo
export const sendVerificationCodeEmail = async (email: string, code: string): Promise<void> => {
  console.log(`Sending verification code: ${code} to email: ${email}`);

  // Lógica para enviar el correo electrónico con el código.
  // Aquí puedes usar un servicio como SendGrid, Nodemailer, etc.

  return Promise.resolve();
};

// Simulación de la función para restablecer la contraseña
export const resetPassword = async (email: string, newPassword: string): Promise<void> => {
  console.log(`Resetting password for ${email} with new password: ${newPassword}`);

  // Lógica para restablecer la contraseña.
  // Podría ser una llamada a un API:
  // const response = await fetch('https://api.tu-backend.com/reset-password', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ email, newPassword }),
  // });

  return Promise.resolve();
};



export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const registerUser = async (userData) => {
    // registration logic
};

