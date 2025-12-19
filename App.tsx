
import React, { useState } from 'react';
import { ViewState } from './types';
import Navigation from './components/Navigation';
import Landing from './components/Landing';
import DealsFinder from './components/DealsFinder';
import BudgetPlanner from './components/BudgetPlanner';
import PlacementAssistant from './components/PlacementAssistant';

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
    </div>
  );
};

export default App;
