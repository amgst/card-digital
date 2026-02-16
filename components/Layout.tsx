
import React from 'react';

export const Navbar: React.FC = () => (
  <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">TC</span>
          </div>
          <span className="text-xl font-bold font-outfit bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            TheCard
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-indigo-600 transition">Solutions</a>
          <a href="#" className="hover:text-indigo-600 transition">Pricing</a>
          <a href="#" className="hover:text-indigo-600 transition">How it works</a>
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition shadow-sm">
            Create Free Card
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export const Footer: React.FC = () => (
  <footer className="bg-gray-50 border-t border-gray-200 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">TC</span>
            </div>
            <span className="text-xl font-bold font-outfit">TheCard</span>
          </div>
          <p className="text-gray-500 max-w-sm mb-6">
            The ultimate professional networking platform. Bridge the gap between physical and digital networking with our NFC-enabled smart business cards.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Product</h4>
          <ul className="space-y-2 text-gray-500 text-sm">
            <li><a href="#" className="hover:text-indigo-600">Digital Cards</a></li>
            <li><a href="#" className="hover:text-indigo-600">NFC Cards</a></li>
            <li><a href="#" className="hover:text-indigo-600">Analytics</a></li>
            <li><a href="#" className="hover:text-indigo-600">Integrations</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-500 text-sm">
            <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-indigo-600">Terms of Service</a></li>
            <li><a href="#" className="hover:text-indigo-600">Cookies Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} TheCard. All rights reserved.
      </div>
    </div>
  </footer>
);
