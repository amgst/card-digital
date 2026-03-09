
import React from 'react';
import { signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">TC</span>
            </div>
            <span className="text-xl font-bold font-outfit bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              TheCard
            </span>
          </Link>
          <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
            {!loading && user ? (
              <>
                <span className="hidden sm:block text-xs font-semibold text-gray-400">
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-full border border-gray-200 px-4 py-2 text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-indigo-600 px-5 py-2 text-white transition hover:bg-indigo-700 shadow-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export const Footer: React.FC = () => (
  <footer className="bg-gray-50 border-t border-gray-200 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">TC</span>
          </div>
          <span className="text-xl font-bold font-outfit">TheCard</span>
        </div>
        <p className="max-w-md text-sm text-gray-500">
          Build one Instagram-ready bio link page for your profile, contacts, and social destinations.
        </p>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} TheCard. All rights reserved.
      </div>
    </div>
  </footer>
);
