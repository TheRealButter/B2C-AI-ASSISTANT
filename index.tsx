
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * ENVIRONMENT SAFETY UTILITY
 * Safely probes the environment for the API key without triggering ReferenceErrors
 */
const getSafeApiKey = (): string | undefined => {
  try {
    // @ts-ignore - process might not be defined in raw browser environments
    return typeof process !== 'undefined' ? process.env?.API_KEY : undefined;
  } catch (e) {
    return undefined;
  }
};

const ProvisioningGuard = ({ children }: React.PropsWithChildren<{}>) => {
  const apiKey = getSafeApiKey();

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-8 text-center text-white font-sans">
        <div className="max-w-md space-y-8 reveal">
          <div className="w-24 h-24 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(204,255,0,0.1)] relative group">
            <div className="absolute inset-0 bg-[#CCFF00]/5 animate-pulse rounded-[40px]"></div>
            <svg className="w-12 h-12 text-[#CCFF00] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none italic">
              NEXUS LINK<br /><span className="text-zinc-600">INACTIVE.</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed px-4">
              The intelligence link to Gemini is not yet established. 
              Please verify your <span className="text-zinc-200 font-bold tracking-widest">API_KEY</span> in the Vercel project settings.
            </p>
          </div>

          <div className="pt-10 flex flex-col items-center gap-6">
             <div className="h-[1px] w-20 bg-zinc-900"></div>
             <a 
               href="https://ai.google.dev/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="bg-zinc-900 border border-zinc-800 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-all"
             >
               Initialize Protocol ↗
             </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ProvisioningGuard>
        <App />
      </ProvisioningGuard>
    </React.StrictMode>
  );
} else {
  console.error("CRITICAL: Root mount point missing from DOM.");
}
