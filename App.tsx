
import React, { useState } from 'react';
import { ViewState } from './types';
import Navigation from './components/Navigation';
import Landing from './components/Landing';
import DealsFinder from './components/DealsFinder';
import BudgetPlanner from './components/BudgetPlanner';
import PlacementAssistant from './components/PlacementAssistant';

// Standard functional component definition to avoid strict React.FC children requirements in some environments
const App = () => {
  const [view, setView] = useState<ViewState>('HOME');

  const renderContent = () => {
    switch (view) {
      case 'HOME': 
        return <Landing 
          onBrowse={() => setView('DEALS')} 
          onPlacement={() => setView('PLACEMENT')} 
          onBudget={() => setView('BUDGET')} 
        />;
      case 'DEALS': return <DealsFinder />;
      case 'BUDGET': return <BudgetPlanner />;
      case 'PLACEMENT': return <PlacementAssistant onBack={() => setView('HOME')} />;
      default: return <Landing onBrowse={() => setView('DEALS')} onPlacement={() => setView('PLACEMENT')} onBudget={() => setView('BUDGET')} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-accent/30 font-sans">
      <main className="w-full">
        {renderContent()}
      </main>
      <Navigation currentView={view} onNavigate={setView} />
      
      {/* Intelligence Status Tag */}
      <div className="fixed top-8 right-8 hidden md:block z-[100]">
        <div className="bg-[#0f0f11]/80 backdrop-blur-2xl border border-zinc-800 px-5 py-3 rounded-2xl flex items-center space-x-3 shadow-3xl">
           <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Intelligence Unit v4.0 Active</span>
        </div>
      </div>
    </div>
  );
};

export default App;
