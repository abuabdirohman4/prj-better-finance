"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
      {/* Background with blur effect */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl">
        <div className="flex h-16 justify-around items-center px-4">
          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center w-20 h-12 rounded-xl transition-all duration-200 ${
              isActive('/') 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <svg
              className={`w-5 h-5 mb-1 ${
                isActive('/') ? 'text-white' : 'text-gray-500'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className={`text-xs font-medium ${
              isActive('/') ? 'text-white' : 'text-gray-600'
            }`}>
              Home
            </span>
          </Link>

          {/* Transactions */}
          <Link
            href="/transactions"
            className={`flex flex-col items-center justify-center w-20 h-12 rounded-xl transition-all duration-200 ${
              isActive('/transactions') 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <svg
              className={`w-5 h-5 mb-1 ${
                isActive('/transactions') ? 'text-white' : 'text-gray-500'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className={`text-xs font-medium ${
              isActive('/transactions') ? 'text-white' : 'text-gray-600'
            }`}>
              Trans
            </span>
          </Link>

          {/* Budgets */}
          <Link
            href="/budgets"
            className={`flex flex-col items-center justify-center w-20 h-12 rounded-xl transition-all duration-200 ${
              isActive('/budgets') 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <svg
              className={`w-5 h-5 mb-1 ${
                isActive('/budgets') ? 'text-white' : 'text-gray-500'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className={`text-xs font-medium ${
              isActive('/budgets') ? 'text-white' : 'text-gray-600'
            }`}>
              Budgets
            </span>
          </Link>

          {/* Goals */}
          <Link
            href="/goals"
            className={`flex flex-col items-center justify-center w-20 h-12 rounded-xl transition-all duration-200 ${
              isActive('/goals') 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <svg
              className={`w-5 h-5 mb-1 ${
                isActive('/goals') ? 'text-white' : 'text-gray-500'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`text-xs font-medium ${
              isActive('/goals') ? 'text-white' : 'text-gray-600'
            }`}>
              Goals
            </span>
          </Link>

          {/* Accounts */}
          <Link
            href="/accounts"
            className={`flex flex-col items-center justify-center w-20 h-12 rounded-xl transition-all duration-200 ${
              isActive('/accounts') 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <svg
              className={`w-5 h-5 mb-1 ${
                isActive('/accounts') ? 'text-white' : 'text-gray-500'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className={`text-xs font-medium ${
              isActive('/accounts') ? 'text-white' : 'text-gray-600'
            }`}>
              Accounts
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
