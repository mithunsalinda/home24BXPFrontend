export interface LoginRequest {
  email: string;
  password: string;
  remember: boolean;
}

export interface LoginResponse {
  userId: string;
  email: string;
  token: string;
}
export interface User {
  email: string;
  role?: string /**TODO: ADD LATER */;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
