
import React from 'react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { 
      id: 'HOME', 
      label: 'HOME', 
      icon: (isActive: boolean) => (
        <svg className={`w-5 h-5 transition-all duration-500 ${isActive ? 'scale-110' : 'opacity-60'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
        </svg>
      )
    },
    { 
      id: 'DEALS', 
      label: 'SCANNER', 
      icon: (isActive: boolean) => (
        <svg className={`w-5 h-5 transition-all duration-500 ${isActive ? 'scale-110' : 'opacity-60'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    { 
      id: 'PLACEMENT', 
      label: 'STRATEGY', 
      icon: (isActive: boolean) => (
        <div className={`w-6 h-6 rounded-[6px] bg-[#CCFF00] flex items-center justify-center text-black font-[900] text-[10px] transition-all duration-500 ${isActive ? 'scale-110 shadow-[0_0_15px_#CCFF00]' : 'opacity-40 grayscale'}`}>
          S
        </div>
      )
    },
    { 
      id: 'BUDGET', 
      label: 'COMMANDER', 
      icon: (isActive: boolean) => (
        <svg className={`w-5 h-5 transition-all duration-500 ${isActive ? 'scale-110' : 'opacity-60'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1" />
        </svg>
      )
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-[200] pb-[env(safe-area-inset-bottom)]">
      {/* Glow shadow for the entire capsule */}
      <div className="absolute inset-0 bg-[#CCFF00]/5 blur-3xl rounded-full"></div>
      
      <nav className="relative bg-[#0A0A0B]/80 backdrop-blur-[60px] rounded-full px-3 py-2 flex justify-between items-center shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/10">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => onNavigate(item.id as ViewState)}
              className={`flex-1 flex flex-col items-center py-2.5 transition-all duration-500 relative group ${isActive ? 'text-[#CCFF00]' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              <div className="relative mb-1">
                {item.icon(isActive)}
                {isActive && (
                  <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#CCFF00] rounded-full shadow-[0_0_12px_#CCFF00] animate-pulse"></div>
                )}
              </div>
              <span className={`text-[7px] font-[900] uppercase tracking-[0.3em] transition-all duration-500 mt-1 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Navigation;
