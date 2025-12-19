
import React from 'react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'HOME', label: 'HOME', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3' },
    { id: 'DEALS', label: 'SCANNER', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { id: 'PLACEMENT', label: 'STRATEGY', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'BUDGET', label: 'COMMANDER', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[100]">
      <nav className="glass-nav rounded-[28px] px-8 py-4.5 flex justify-between items-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] border border-white/5">
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => onNavigate(item.id as ViewState)}
            className={`flex flex-col items-center group transition-all duration-300 relative ${currentView === item.id ? 'accent-text' : 'text-zinc-600'}`}
          >
            <svg className={`w-5 h-5 mb-1.5 transition-transform duration-300 group-active:scale-90 ${currentView === item.id ? 'glow' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
            </svg>
            <span className={`text-[8px] font-black uppercase tracking-widest transition-opacity duration-300 ${currentView === item.id ? 'opacity-100' : 'opacity-80'}`}>
              {item.label}
            </span>
            {currentView === item.id && (
              <div className="absolute -bottom-1 w-1 h-1 rounded-full accent-bg blur-[1px]"></div>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Navigation;
