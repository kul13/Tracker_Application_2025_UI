
import React from 'react';
import { apiService } from '../services/api';

interface LayoutProps {
  children: React.ReactNode;
  user: { name: string } | null;
  onLogout: () => void;
  activeTab: 'add' | 'audit';
  onTabChange: (tab: 'add' | 'audit') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 3h12M6 8h12m-12 5 8.5 8M6 13h3M9 13c6.667 0 6.667-10 0-10" />
              </svg>
              <span className="text-xl font-bold tracking-tight">ExpensePro</span>
            </div>

            {user && (
              <div className="hidden md:flex items-center space-x-8">
                <nav className="flex space-x-4">
                  <button 
                    onClick={() => onTabChange('add')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'add' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:text-white hover:bg-indigo-500'}`}
                  >
                    Add Expense
                  </button>
                  <button 
                    onClick={() => onTabChange('audit')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'audit' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:text-white hover:bg-indigo-500'}`}
                  >
                    Audit Trail
                  </button>
                </nav>
                <div className="flex items-center space-x-4 border-l border-indigo-400 pl-8">
                  <span className="text-sm font-medium">Hello, {user.name}</span>
                  <button 
                    onClick={onLogout}
                    className="bg-indigo-500 hover:bg-indigo-400 text-white px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} ExpensePro. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
