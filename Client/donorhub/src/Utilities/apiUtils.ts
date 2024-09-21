const API_URL = 'https://localhost:5000';

export interface User {
  id: string;
  nombre: string;
  email: string;
  role: 'admin' | 'user';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SignupResponse {
  token: string;
  user: User;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  console.log('loginUser called', { email, password });
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('Fetch response:', response);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Login error:', errorData);
      throw new Error(errorData.message || 'An error occurred during login');
    }

    const data = await response.json();
    console.log('Server response:', data);

    localStorage.setItem('token', data.token);

    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const signupUser = async (nombre: string, email: string, password: string, role: 'admin' | 'user'): Promise<SignupResponse> => {
  console.log('signupUser called', { nombre, email, password, role });
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, email, password, role }),
    });

    console.log('Fetch response:', response);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Signup error:', errorData);
      throw new Error(errorData.message || 'An error occurred during signup');
    }

    const data = await response.json();
    console.log('Server response:', data);

    // Store the token in localStorage
    localStorage.setItem('token', data.token);

    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};