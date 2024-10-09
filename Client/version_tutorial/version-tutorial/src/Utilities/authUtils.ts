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

  try {
    const response = await fetch(`${API_URL}/api/login`, {
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
  } catch (error) {
    throw error;
  }
};

export const signupUser = async (nombre: string, email: string, password: string, role: 'admin' | 'user'): Promise<SignupResponse> => {
  console.log('signupUser called', { nombre, email, password, role });
  try {
    const response = await fetch(`${API_URL}/api/signup`, {
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
  } catch (error) {
    throw error;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};
