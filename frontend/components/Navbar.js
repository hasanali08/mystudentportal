'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-xl border-b border-purple-200/60 sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-8 py-5 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="text-2xl font-semibold gradient-text hover:from-purple-700 hover:to-purple-900 transition-all duration-300 tracking-tight"
          >
            Student Command Center
          </Link>
          <div className="flex items-center space-x-8">
            {isAuthenticated() ? (
              <>
                <Link 
                  href="/" 
                  className="text-gray-700 hover:text-purple-600 font-medium text-[15px] transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-purple after:transition-all after:duration-300 hover:after:w-full"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/assignments" 
                  className="text-gray-700 hover:text-purple-600 font-medium text-[15px] transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-purple after:transition-all after:duration-300 hover:after:w-full"
                >
                  Assignments
                </Link>
                <Link 
                  href="/tasks" 
                  className="text-gray-700 hover:text-purple-600 font-medium text-[15px] transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-purple after:transition-all after:duration-300 hover:after:w-full"
                >
                  Tasks
                </Link>
                <Link 
                  href="/jobs" 
                  className="text-gray-700 hover:text-purple-600 font-medium text-[15px] transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-purple after:transition-all after:duration-300 hover:after:w-full"
                >
                  Jobs
                </Link>
                <div className="flex items-center space-x-4 pl-4 border-l border-purple-200">
                  <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-purple-600 font-medium text-[15px] transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-purple-600 font-medium text-[15px] transition-colors duration-300"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-gradient-purple text-white px-4 py-2 rounded-lg font-medium hover:shadow-purple transition-all duration-300 text-[15px]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

