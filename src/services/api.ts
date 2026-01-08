
import { get } from 'http';
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  User
} from '../type';
import axios from 'axios';



const API_BASE = 'https://localhost:7296/api';
const TOKEN_KEY = 'expense_token';
const USER_KEY = 'expense_user';

export const axiosInstance = axios.create({
  baseURL: API_BASE,
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('expense_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const apiService = {
  async login(email: string, password: string): Promise<void> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password } satisfies LoginRequest)
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg);
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


export const categoryService = {
  getCategories: async () => {
    const res = await axiosInstance.get('/Expense/categories');
    return res.data;
  },

  getItemsByCategory: async (categoryId: Number) => {
    const res = await axiosInstance.get(`/Expense/items/${categoryId}`);
    return res.data;
  }
};

export interface ExpenseCreateDto {
  amount: number;
  date: string;            // matches backend
  categoryId: number;
  itemId: number;
  notes?: string;
  totalamount?: number;
}

export const expenseService = {
  addBulkExpenses: async (expenses: ExpenseCreateDto[]) => {
    const res = await axiosInstance.post(`/Expense/bulk`, expenses);
    return res.data;
  },

  getAuditTrailbyUser: async () => {
    const res = await axiosInstance.get(`/Expense/userexpenses`);
    return res.data;
  },

  getAuditTrailbyUserPage: async (page: number, sizeParam: number) => {
    const res = await axiosInstance.get('/Expense/userexpenses', {
      params: { page, pageSize: sizeParam }
    });
    return res.data;
  }


};