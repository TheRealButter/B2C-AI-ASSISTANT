
import React, { useState, useEffect } from 'react';
import { fetchNexusPulse, executeNexusDeepScan } from '../services/nexusIntelligence';
import { AIResponse, TrendingItem } from '../types';

const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div className="markdown-output space-y-4">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2"></div>;
        
        if (trimmed.startsWith('|')) {
          return <pre key={i} className="bg-zinc-900/40 p-3 rounded-lg text-[10px] font-mono overflow-x-auto border border-zinc-800 text-zinc-400">{line}</pre>;
        }
        
        if (trimmed.startsWith('#')) {
          return <h3 key={i} className="text-xl font-black accent-text mt-8 mb-4 uppercase tracking-tight">{trimmed.replace(/^#+\s/, '')}</h3>;
        }

        if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\./.test(trimmed)) {
          return (
            <div key={i} className="flex gap-3 ml-2 group">
              <span className="text-accent font-black mt-1.5 shrink-0">•</span>
              <p className="text-zinc-300 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: trimmed.replace(/^[*-]\s|\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<b class="text-white font-black">$1</b>') }} />
            </div>
          );
        }

        return (
          <p key={i} className="leading-relaxed text-zinc-300 font-medium" 
             dangerouslySetInnerHTML={{ __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<b class="text-white font-black">$1</b>') }} 
          />
        );
      })}
    </div>
  );
};

const DealsFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPulseLoading, setIsPulseLoading] = useState(true);
  const [pulseError, setPulseError] = useState<string | null>(null);

  const quickCommands = [
    "CHEAPEST SCHOOL SHOES",
    "STATIONERY BUNDLES",
    "CASIO CALCULATORS",
    "UNIFORM SPECIALS",
    "DATA DEALS FOR STUDENTS"
  ];

  const initPulse = async () => {
    setPulseError(null);
    setIsPulseLoading(true);
    try {
      const deals = await fetchNexusPulse();
      setTrending(deals);
    } catch (error: any) {
      setPulseError("Market intelligence feed interrupted. Use the search bar for specific items.");
    } finally {
      setIsPulseLoading(false);
    }
  };

  useEffect(() => {
    initPulse();
  }, []);

  const handleScan = async (override?: string) => {
    const q = override || query;
    if (!q) return;
    setQuery(q);
    setIsLoading(true);
    const res = await executeNexusDeepScan(q);
    setResult(res);
    setIsLoading(false);
    document.getElementById('scan-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 pb-44 reveal bg-black min-h-screen">
      {/* Header Section */}
      <header className="mb-14">
        <h1 className="text-6xl md:text-[84px] font-black tracking-tighter leading-[0.85] uppercase mb-4">
          PRICE<br />
          <span className="accent-text">INTELLIGENCE.</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] opacity-80">
          REAL-TIME RETAIL SCANS ACROSS SOUTH AFRICA
        </p>
      </header>

      {/* Search Bar Section */}
      <div className="relative mb-14">
        <div className="bg-[#0f0f11] border border-[#1e1e21] p-1.5 flex items-center shadow-2xl rounded-full">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            placeholder="ENTER PRODUCT NAME..."
            className="bg-transparent flex-grow px-8 py-4 text-xs font-bold text-white focus:outline-none placeholder:text-zinc-700 uppercase tracking-widest"
          />
          <button 
            onClick={() => handleScan()} 
            disabled={isLoading}
            className="bg-[#CCFF00] text-black px-8 py-4 uppercase text-[10px] font-black tracking-widest rounded-full transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'SCANNING...' : 'SCAN MARKET'}
          </button>
        </div>
      </div>

      {/* Quick Commands Section */}
      <div className="mb-20">
        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-5">QUICK COMMANDS</p>
        <div className="flex flex-wrap gap-2.5">
          {quickCommands.map((cmd) => (
            <button 
              key={cmd} 
              onClick={() => handleScan(cmd)}
              className="bg-[#1a1a1c] border border-transparent hover:border-zinc-700 hover:text-white px-5 py-3 rounded-xl text-[9px] font-black text-zinc-500 transition-all uppercase tracking-widest"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Market Pulse Section */}
      <section className="mb-16 relative">
        <div className="bg-[#0a0a0b] border border-[#1a1a1c] rounded-[40px] p-10 md:p-14 relative overflow-hidden">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">MARKET PULSE</h2>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">TRENDING SCHOOL DEALS IN SA</p>
            </div>
            <div className="flex items-center gap-2.5">
               <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">LIVE</span>
               <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#CCFF00]"></div>
            </div>
          </div>

          <div className="mb-12">
            {isPulseLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-zinc-900/50 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-900/50 rounded w-1/2"></div>
              </div>
            ) : pulseError ? (
              <p className="text-zinc-500 text-sm font-medium leading-relaxed">{pulseError}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trending.map(item => (
                  <div key={item.id} className="flex gap-5 p-5 rounded-3xl bg-zinc-900/20 border border-zinc-800/40 hover:border-zinc-700 transition-colors">
                    <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-zinc-800/50">
                      <img src={item.imageUrl} className="w-full h-full object-cover grayscale opacity-60" alt="" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[8px] font-black accent-text uppercase tracking-widest mb-1.5">{item.retailer}</p>
                      <h4 className="text-xs font-black uppercase text-white mb-1.5 line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] font-black text-white">R{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pro Tip Box */}
          <div className="border border-[#1a1a1c] bg-black p-8 rounded-3xl mt-6">
            <p className="text-[10px] font-black accent-text uppercase tracking-widest mb-3">PRO TIP</p>
            <p className="text-zinc-400 text-sm font-medium italic opacity-80 leading-relaxed">
              "Prices usually drop on Tuesday mornings after weekly circulars are released."
            </p>
          </div>
          
          {/* Subtle background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[120px] rounded-full -mr-32 -mt-32"></div>
        </div>
      </section>

      {/* Results Container */}
      <div id="scan-results" className="scroll-mt-24">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center text-center space-y-8">
            <div className="relative">
              <div className="w-14 h-14 border-4 border-zinc-900 border-t-accent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-6 h-6 bg-accent/10 rounded-full animate-ping"></div>
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">SYNCHRONIZING INTELLIGENCE NODES...</p>
          </div>
        ) : result && (
          <div className={`cyber-card bg-black border-accent/10 p-12 reveal shadow-2xl ${result.status === 'ERROR' ? 'border-red-900/30' : ''}`}>
            <div className="flex items-center justify-between mb-12 border-b border-zinc-900 pb-8">
               <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${result.status === 'ERROR' ? 'bg-red-500' : 'accent-bg animate-pulse'} shadow-[0_0_15px_#CCFF00]`}></div>
                  <span className={`text-[11px] font-black uppercase tracking-[0.3em] ${result.status === 'ERROR' ? 'text-red-500' : 'accent-text'}`}>
                    {result.status === 'ERROR' ? 'SCAN INTERRUPTED' : 'DIRECT INTELLIGENCE REPORT'}
                  </span>
               </div>
               <span className="text-[9px] font-bold text-zinc-600 uppercase">NODE: {result.verifiedBy || 'NEXUS-4'}</span>
            </div>

            <MarkdownRenderer text={result.text} />

            {result.sources.length > 0 && (
              <div className="pt-10 mt-10 border-t border-zinc-900">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6 px-1">PROOF NODE SOURCES</p>
                <div className="flex flex-wrap gap-2">
                  {result.sources.map((s, i) => (
                    <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-[10px] font-black hover:accent-text hover:accent-border transition-all uppercase flex items-center gap-2">
                       {s.title} <span className="text-[8px] opacity-40">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {result.status === 'ERROR' && (
              <div className="mt-8">
                <button onClick={() => handleScan()} className="text-[10px] font-black uppercase tracking-[0.2em] accent-text border-b border-accent hover:border-transparent transition-all">Retry Scan Sequence</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsFinder;
