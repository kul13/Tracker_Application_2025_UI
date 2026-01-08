import React, { PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

export const Header: React.FC<PropsWithChildren<HeaderProps>> = ({
  userName,
  onLogout,
  children,
}) => {
    const location = useLocation();
  const navigate = useNavigate();

  const isAuditPage = location.pathname.includes('audit');

  const switchPage = () => {
    navigate(isAuditPage ? '/expenses/add' : '/expenses/audit');
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER BAR */}
      <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">


            {/* LEFT */}
            <div className="flex items-center gap-2 text-lg font-bold">
              <span className="text-xl">₹</span>
              <span>ExpensePro</span>
            </div>

            {userName && (
              <>
              <button
                  onClick={switchPage}
                  className="
                    bg-indigo-500 hover:bg-indigo-400
                    px-4 py-2 rounded-md
                    text-sm font-semibold
                    transition-all
                    flex items-center gap-2
                    shadow-sm
                  "
                >
                  {isAuditPage ? '➕ Add Expense' : '📊 View Audit'}
                </button>
                {/* DESKTOP */}
                <div className="hidden md:flex items-center gap-4">
                  <span className="text-sm font-medium">
                    Hello, {userName}
                  </span>
                  <button
                    onClick={onLogout}
                    className="bg-indigo-500 hover:bg-indigo-400 px-3 py-1.5 rounded-md text-xs font-semibold uppercase"
                  >
                    Logout
                  </button>
                </div>
                {/* MOBILE */}
                <div className="flex md:hidden items-center gap-3">
                  {/* User Icon */}
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-5 0-9 2.5-9 5v1h18v-1c0-2.5-4-5-9-5z" />
                  </svg>

                  {/* Logout Icon */}
                  <button onClick={onLogout} aria-label="Logout">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">{children}</main>

      <footer className="bg-white border-t py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm space-y-1">
          <div>
            &copy; {new Date().getFullYear()} ExpensePro. All rights reserved.
          </div>
          <div className="text-xs">
            Built by <span className="font-medium text-gray-700">Kuldeep</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Header;
