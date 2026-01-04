
// export interface User {
//   id: string;
//   name: string;
//   email: string;
// }

export interface Category {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  categoryId: string;
  name: string;
}

export interface ExpenseEntry {
  id: number; // Temp ID for local grid
  categoryId: number;
  categoryName: string;
  itemId: number;
  itemName: string;
  amount: number;
  notes: string;
  expenseDate: string; 
   totalAmount: number; 
}

// export interface PersistedExpense extends ExpenseEntry {
//   userId: string;
//   userName: string;
//   createdAt: string;
// }

export interface AuthResponse {
  user: User;
  token: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

// ===== User =====
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface PersistedExpense extends ExpenseEntry {
  userId: string;
  userName: string;
  createdAt: string;
}
export type TimeFilter = 'day' | 'week' | 'month' | 'year' | 'all';
