import React, { PropsWithChildren } from 'react';

interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

export const Header: React.FC<PropsWithChildren<HeaderProps>> = ({
  userName,
  onLogout,
  children,
}) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER BAR */}
      <header className="w-full bg-indigo-600 text-white px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

          {/* LEFT */}
          <div className="flex items-center gap-2 text-xl font-bold">
            <span className="text-2xl">₹</span>
            <span>ExpensePro</span>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
            {userName && (
              <div className="bg-white text-indigo-700 px-4 py-1.5 rounded-full font-semibold shadow-sm text-sm flex items-center gap-2">
                <span>Hello, {userName}</span>
                <svg
                  className="w-4 h-4 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-5 0-9 2.5-9 5v1h18v-1c0-2.5-4-5-9-5z" />
                </svg>
              </div>
            )}

            {userName ? (
              <button
                onClick={onLogout}
                className="bg-white text-indigo-600 px-3 py-1.5 rounded-lg font-semibold text-sm hover:bg-gray-100"
              >
                LOGOUT
              </button>
            ) : (
              <button
                onClick={() => console.log('Redirect to login')}
                className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-semibold text-sm hover:bg-indigo-700"
              >
                LOGIN
              </button>
            )}
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">{children}</main>
    </div>
  );
};

export default Header;
