const API_URL = 'http://localhost:5000'; // Adjust this to match your server URL

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    nombre: string;
    email: string;
  };
}

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

  return response.json();
};