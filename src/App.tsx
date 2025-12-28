import React, { useEffect, useState } from 'react';
import { Login, Register } from './components/Auth';
import { apiService } from './services/api';
import { User } from './type';
import { Toaster, toast } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AddExpenseUI } from './components/AddExpense';
import { Header } from './components/Header';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const u = apiService.getCurrentUser();
    if (u) {
      setUser(u);
    }
  }, []);

  const handleAuthSuccess = () => {
    const userFromApi = apiService.getCurrentUser();

  if (!userFromApi) {
    setUser({ name: 'User' } as User);
  } else {
    setUser(userFromApi);
  }
  toast.success('Logged in successfully!');
  };

  const handleRegisterSuccess = () => {
    toast.success('Registration successful! Please login.');
    setAuthView('login');
  };
  const handleLogout = () => {
    apiService.logout();
    setUser(null);
    setAuthView('login');
    toast('Logged out', { icon: '👋' });
  };

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />

      {!user ? (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-300 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 -right-32 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-30"></div>
          <div className="w-full max-w-md bg-white/90 backdrop-blur-lg 
                p-8 rounded-2xl 
                shadow-xl shadow-indigo-200/50
                border border-white/60">
            <h1 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-full 
    bg-gradient-to-br from-indigo-500 to-blue-700 
    shadow-xl shadow-indigo-500/40
    ring-4 ring-indigo-200/50">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M6 3h12M6 8h12m-12 5 8.5 8M6 13h3M9 13c6.667 0 6.667-10 0-10" />
                </svg>
              </div>
              <span>ExpensePro</span>
            </h1>

            {authView === 'login' ? (
              <Login onSuccess={handleAuthSuccess} />
            ) : (
              <Register onSuccess={handleRegisterSuccess} />
            )}

            <div className="mt-4 text-center">
              <button
                onClick={() =>
                  setAuthView(authView === 'login' ? 'register' : 'login')
                }
                className="text-sm text-indigo-600"
              >
                {authView === 'login'
                  ? "Don't have an account? Register"
                  : 'Already have an account? Login'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Header userName={user.name} onLogout={handleLogout}>
        <AddExpenseUI />
        </Header>
  
      )}
    </BrowserRouter>
  );
};


export default App;
