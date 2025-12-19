
import React, { useState, useEffect } from 'react';
import { Category, Listing } from '../types';
import { getBookSuggestions, checkListingSafety } from '../services/geminiService';

interface CreateListingProps {
  onCancel: () => void;
  onComplete: (data: Partial<Listing>) => void;
}

const CreateListing: React.FC<CreateListingProps> = ({ onCancel, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSafetyChecking, setIsSafetyChecking] = useState(false);
  const [safetyError, setSafetyError] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (selectedCategory === Category.TEXTBOOKS && title.length >= 3) {
        const results = await getBookSuggestions(title);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [title, selectedCategory]);

  const handleContinue = async () => {
    if (step === 1) {
      if (!selectedCategory || !title) return;
      
      setIsSafetyChecking(true);
      const safety = await checkListingSafety(title, selectedCategory);
      setIsSafetyChecking(false);

      if (!safety.safe) {
        setSafetyError(safety.reason || "Please use a more descriptive, appropriate title.");
        return;
      }
      setSafetyError('');
      setStep(2);
    } else if (step === 2) {
      if (!price || !description) return;
      onComplete({
        title,
        category: selectedCategory!,
        price: parseFloat(price),
        imageUrl: selectedCategory === Category.TEXTBOOKS 
          ? 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800' 
          : selectedCategory === Category.UNIFORMS 
          ? 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800'
          : 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=800'
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-white md:pt-10 pb-32 px-6 w-full">
      <div className="flex justify-between items-center py-6">
        <button onClick={onCancel} className="text-[#3b82f6] font-bold flex items-center text-sm">
           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
           Cancel
        </button>
        <div className="text-gray-400 text-[11px] font-black uppercase tracking-widest">Step {step} of 2</div>
        <div className="w-10"></div>
      </div>

      <div className="flex items-center space-x-3 mb-16 mt-4">
        {[1, 2].map(s => (
          <React.Fragment key={s}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all ${step >= s ? 'bg-skool-orange text-white shadow-lg shadow-skool-orange/20 scale-110' : 'bg-gray-100 text-gray-400'}`}>
              {s}
            </div>
            {s < 2 && <div className={`flex-1 h-2 rounded-full transition-all ${step > s ? 'bg-skool-orange' : 'bg-gray-100'}`}></div>}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <div className="animate-in slide-in-from-right duration-500">
          <h1 className="text-5xl md:text-7xl font-black text-[#0a0f2c] mb-4 leading-[0.9] tracking-tighter">What are you listing?</h1>
          <p className="text-gray-400 font-medium mb-12">Select a category and title for your school item.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              { id: Category.TEXTBOOKS, label: 'Books', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', color: 'bg-skool-orange' },
              { id: Category.UNIFORMS, label: 'Uniforms', icon: 'M21 8l-2-2m2 2l-2 2m2-2H7.833a2 2 0 01-1.658-.88l-2.175-3.262a2 2 0 010-2.217L6.175.38a2 2 0 011.658-.88H21a2 2 0 012 2v6z', color: 'bg-skool-teal' },
              { id: Category.STATIONERY, label: 'Stationery', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'bg-skool-yellow' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-8 rounded-[32px] flex flex-col items-center justify-center transition-all border-2 ${selectedCategory === cat.id ? 'border-skool-orange bg-skool-orange/5 scale-105' : 'border-gray-50 bg-white shadow-sm hover:border-gray-200'}`}
              >
                <div className={`${cat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-3 shadow-lg`}>
                   <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={cat.icon} /></svg>
                </div>
                <span className="font-black text-[#0a0f2c] text-lg">{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="relative mb-20">
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Item Title</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Grade 10 Math Literacy Textbook"
              className="w-full bg-white border border-gray-100 rounded-[24px] p-6 text-lg font-bold shadow-sm focus:ring-4 focus:ring-skool-orange/10 focus:border-skool-orange transition outline-none"
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[24px] shadow-2xl border border-gray-50 z-50 overflow-hidden">
                {suggestions.map((s, idx) => (
                  <button 
                    key={idx}
                    onClick={() => { setTitle(s); setSuggestions([]); }}
                    className="w-full text-left px-6 py-4 hover:bg-gray-50 text-sm font-bold text-[#0a0f2c] border-b border-gray-50 last:border-0"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {safetyError && (
              <p className="mt-4 text-skool-orange text-sm font-bold flex items-center px-2">
                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 {safetyError}
              </p>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in slide-in-from-right duration-500">
          <h1 className="text-5xl md:text-7xl font-black text-[#0a0f2c] mb-4 leading-[0.9] tracking-tighter">Final Details</h1>
          <p className="text-gray-400 font-medium mb-12">Set your price and tell parents about the condition.</p>
          
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm mb-12 space-y-8">
             <div>
               <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Price (ZAR)</label>
               <div className="relative">
                 <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-[#0a0f2c]">R</span>
                 <input 
                   type="number" 
                   value={price}
                   onChange={(e) => setPrice(e.target.value)}
                   placeholder="0.00" 
                   className="w-full bg-gray-50 rounded-[20px] p-6 pl-12 text-2xl font-black focus:outline-none focus:ring-4 focus:ring-skool-orange/10" 
                 />
               </div>
             </div>
             <div>
               <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Description</label>
               <textarea 
                 rows={4} 
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 placeholder="Is it like new? Any pages missing? Which school used it?" 
                 className="w-full bg-gray-50 rounded-[20px] p-6 font-bold focus:outline-none focus:ring-4 focus:ring-skool-orange/10 resize-none" 
               />
             </div>
          </div>
        </div>
      )}

      <button 
        onClick={handleContinue}
        disabled={isSafetyChecking || (step === 1 && (!selectedCategory || !title)) || (step === 2 && (!price || !description))}
        className="w-full py-6 bg-skool-orange text-white font-black rounded-[28px] text-xl flex items-center justify-center space-x-3 transition-all disabled:bg-gray-100 disabled:text-gray-300 shadow-2xl shadow-skool-orange/20 active:scale-95"
      >
        {isSafetyChecking ? (
          <span className="flex items-center">
            <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Safety...
          </span>
        ) : (
          <>
            <span>{step === 2 ? 'Post Listing' : 'Continue'}</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </>
        )}
      </button>
    </div>
  );
};

export default CreateListing;
