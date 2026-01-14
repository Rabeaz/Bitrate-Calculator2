
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
            <i className="fa-solid fa-bolt-lightning text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            StreamBit Optimizer
          </h1>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
          <span className="hover:text-white transition-colors cursor-pointer">Calculators</span>
          <span className="hover:text-white transition-colors cursor-pointer">WebM Guide</span>
          <span className="hover:text-white transition-colors cursor-pointer">Settings</span>
        </nav>
      </div>
    </header>
  );
};

export default Header;
