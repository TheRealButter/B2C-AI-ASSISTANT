
import React from 'react';

interface MessagesProps {
  onBack: () => void;
}

const Messages: React.FC<MessagesProps> = ({ onBack }) => {
  const conversations = [
    { name: 'Sarah M.', text: 'Yes, the textbook is still available!', time: '2m ago', unread: 2, color: 'bg-[#10b981]', initial: 'S' },
    { name: 'John D.', text: 'Can we meet at the mall tomorrow?', time: '1h ago', unread: 0, color: 'bg-skool-orange', initial: 'J' },
    { name: 'Thandi K.', text: 'Thank you for the quick response!', time: '3h ago', unread: 0, color: 'bg-skool-yellow', initial: 'T' },
    { name: 'Michael P.', text: 'Looking forward to the swap', time: '1d ago', unread: 0, color: 'bg-skool-blue', initial: 'M' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 pb-32 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-7xl md:text-8xl font-black text-[#0a0f2c] leading-[0.85] tracking-tighter">Messages</h1>
          <button onClick={onBack} className="text-skool-orange font-black text-lg flex items-center mt-6 group">
            <svg className="w-6 h-6 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Dashboard
          </button>
        </div>
        <button className="w-14 h-14 rounded-2xl bg-white shadow-lg border border-gray-50 flex items-center justify-center text-gray-400 hover:text-skool-orange transition">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        </button>
      </div>

      <div className="bg-white rounded-[60px] p-8 md:p-12 shadow-sm border border-gray-50">
        <div className="bg-gray-50 h-16 rounded-3xl border border-gray-100 flex items-center px-8 mb-12">
          <svg className="w-6 h-6 text-gray-300 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search your conversations..." className="bg-transparent w-full text-base font-bold text-[#0a0f2c] focus:outline-none placeholder:text-gray-300" />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {conversations.map((chat, idx) => (
            <div key={idx} className="flex items-center p-8 rounded-[44px] hover:bg-gray-50 transition-all duration-300 cursor-pointer group border border-transparent hover:border-gray-100 relative">
              <div className="relative shrink-0">
                 <div className={`${chat.color} w-20 h-20 rounded-[28px] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-black/5 transform group-hover:scale-105 transition-transform`}>{chat.initial}</div>
                 <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
              </div>
              <div className="ml-8 flex-1 min-w-0">
                 <div className="flex justify-between items-center mb-1">
                    <h4 className="text-2xl font-black text-[#0a0f2c]">{chat.name}</h4>
                    <span className="text-[12px] font-black text-gray-300 uppercase tracking-widest">{chat.time}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <p className="text-lg font-medium text-gray-400 truncate pr-6">{chat.text}</p>
                    {chat.unread > 0 && (
                      <span className="w-8 h-8 bg-skool-orange text-white text-[12px] font-black flex items-center justify-center rounded-full shadow-xl shadow-skool-orange/30 animate-pulse">{chat.unread}</span>
                    )}
                 </div>
              </div>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
