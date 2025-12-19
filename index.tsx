
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * PROVISIONING GUARD
 * Prevents "Blank Screen" failures on Vercel by catching missing API_KEY
 * before the main application logic executes.
 */
// Use React.PropsWithChildren to ensure standard TypeScript compatibility for children props
const ProvisioningGuard = ({ children }: React.PropsWithChildren<{}>) => {
  if (!process.env.API_KEY) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-8 text-center text-white font-sans">
        <div className="max-w-md space-y-8 reveal">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">System Provisioning<br /><span className="text-red-500">Halted.</span></h1>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
              The <span className="text-zinc-300 font-bold">Intelligence Node (API_KEY)</span> is missing from your deployment environment. 
              Vercel requires this variable to activate the Strategic AI and Market Scanner.
            </p>
          </div>
          <div className="pt-6 border-t border-zinc-900">
             <a href="https://ai.google.dev/" target="_blank" className="text-[#CCFF00] font-black text-[10px] uppercase tracking-[0.3em] underline decoration-2 underline-offset-8 hover:brightness-110 transition-all">
               Initialize Free Key ↗
             </a>
          </div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ProvisioningGuard>
      <App />
    </ProvisioningGuard>
  </React.StrictMode>
);
