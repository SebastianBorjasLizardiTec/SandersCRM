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
    console.log('Login response:', data); // Add this line

    // Store the token
    localStorage.setItem('token', data.token);

    // Store additional user information
    localStorage.setItem('userRole', data.user.role);
    localStorage.setItem('userName', data.user.nombre);
    localStorage.setItem('userEmail', data.user.email);
    localStorage.setItem('userId', data.user.id);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const signupUser = async (nombre: string, email: string, password: string): Promise<SignupResponse> => {
  console.log('signupUser called', { nombre, email, password });
  try {
    const response = await fetch(`${API_URL}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Signup error:', errorData);
      throw new Error(errorData.message || 'An error occurred during signup');
    }

    const data = await response.json();
    console.log('Signup response data:', data); // Log the received data

    // Store the token and user information
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', data.user.role);
    localStorage.setItem('userName', data.user.nombre);
    localStorage.setItem('userEmail', data.user.email);

    console.log('Stored user data:', {
      role: localStorage.getItem('userRole'),
      name: localStorage.getItem('userName'),
      email: localStorage.getItem('userEmail')
    });

    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};


export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

interface RegisterUserData {
  nombre: string;
  email: string;
  password: string;
  // Add other fields if necessary
}

export interface RegisterResponse {
  token: string;
  user: {
    role: string;
    nombre: string;
    email: string;
    id: string;
  };
}



    

export const resetPassword = async (email: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/api/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred during password reset');
        }

        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Password reset error:', error);
        throw error;
    }
};