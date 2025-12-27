
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  User
} from '../type';
const API_BASE = 'https://localhost:7296/api';
const TOKEN_KEY = 'expense_token';
const USER_KEY = 'expense_user';
export const apiService = {
  async login(email: string, password: string): Promise<void> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password } satisfies LoginRequest)
    });

    if (!res.ok) {
      throw new Error('Invalid email or password');
    }

    const data: LoginResponse = await res.json();
    localStorage.setItem(TOKEN_KEY, data.token);
  },

  async register(name: string, email: string, password: string): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password } satisfies RegisterRequest)
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg);
    }

    const user: User = await res.json();
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
};