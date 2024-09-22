// User interface
export interface User {
  id: string;
  nombre: string;
  email: string;
  role: 'admin' | 'user';
}

// Response interfaces
export interface LoginResponse {
  token: string;
  user: User;
}

export interface SignupResponse {
  token: string;
  user: User;
}
