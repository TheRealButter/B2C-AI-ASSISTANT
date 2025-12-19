
import React, { useState } from 'react';
import { ViewState } from './types';
import Navigation from './components/Navigation';
import Landing from './components/Landing';
import DealsFinder from './components/DealsFinder';
import BudgetPlanner from './components/BudgetPlanner';
import PlacementAssistant from './components/PlacementAssistant';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');

  const renderContent = () => {
    switch (view) {
      case 'HOME': return <Landing onBrowse={() => setView('DEALS')} onPlacement={() => setView('PLACEMENT')} onBudget={() => setView('BUDGET')} />;
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
      
      {/* Privacy Tag */}
      <div className="fixed top-6 right-6 hidden md:block">
        <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex items-center space-x-2">
           <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 .3l7.834 4.6a1 1 0 01.5.865v1.301C18.334 12.332 14.834 16.5 10 16.5s-8.334-4.168-8.334-9.434V5.765a1 1 0 01.5-.865z" clipRule="evenodd" /></svg>
           <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Stateless & POPIA Secure</span>
        </div>
      </div>
    </div>
  );
};

export default App;
