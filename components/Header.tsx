import React from 'react';
import { Languages, GraduationCap } from 'lucide-react';

interface HeaderProps {
  onMainClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMainClick }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div 
        className={`flex items-center gap-2 ${onMainClick ? 'cursor-pointer hover:opacity-75 transition-opacity' : ''}`}
        onClick={onMainClick}
        role={onMainClick ? "button" : undefined}
      >
        <div className="bg-emerald-100 p-2 rounded-lg">
          <Languages className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Neonn's Game</h1>
          <p className="text-xs text-slate-500 font-medium">Dual Language Learning</p>
        </div>
      </div>
      <a 
        href="https://ai.google.dev" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hidden md:flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors"
      >
        <GraduationCap className="w-4 h-4" />
        <span>Powered by Gemini</span>
      </a>
    </header>
  );
};

export default Header;