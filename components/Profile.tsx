
import React from 'react';
import { UserStats } from '../types';

interface ProfileProps {
  stats: UserStats;
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ stats, onBack }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 pb-32 w-full min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-7xl font-black text-[#0a0f2c] leading-[0.85] tracking-tighter">Profile &<br />Safety</h1>
          <button onClick={onBack} className="text-skool-orange font-black text-lg flex items-center mt-6 group">
            <svg className="w-6 h-6 mr-2 transform group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Dashboard
          </button>
        </div>
        
        {/* Verification Status Banner */}
        <div className="bg-skool-teal/10 border border-skool-teal/20 px-6 py-4 rounded-[28px] flex items-center space-x-4">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-skool-teal shadow-sm">
             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 .3l7.834 4.6a1 1 0 01.5.865v1.301C18.334 12.332 14.834 16.5 10 16.5s-8.334-4.168-8.334-9.434V5.765a1 1 0 01.5-.865z" clipRule="evenodd" /></svg>
           </div>
           <div>
              <p className="text-[10px] font-black text-skool-teal uppercase tracking-widest">Trust Level</p>
              <h4 className="text-lg font-black text-[#0a0f2c]">Verified High-Trust</h4>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[50px] p-10 shadow-sm border border-gray-50">
             <div className="flex flex-col items-center text-center mb-8">
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-skool-teal rounded-[40px] flex items-center justify-center text-white text-5xl font-black shadow-xl">S</div>
                  <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full">
                    <div className="bg-skool-teal p-1.5 rounded-full text-white">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                  </div>
                </div>
                <h2 className="text-3xl font-black text-[#0a0f2c]">Sarah Mabena</h2>
                <p className="text-gray-400 font-bold text-sm mt-1">Sandton, JHB</p>
             </div>
             
             <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
                   <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Email Verified</span>
                   <svg className="w-5 h-5 text-skool-teal" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
                   <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Phone Verified</span>
                   <svg className="w-5 h-5 text-skool-teal" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
                   <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">ID Verified</span>
                   <button className="text-[10px] font-black text-skool-orange uppercase tracking-widest hover:underline">Verify Now</button>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
           {/* Enhanced POPIA Protection Card */}
           <div className="bg-blue-600 rounded-[50px] p-10 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 .3l7.834 4.6a1 1 0 01.5.865v1.301C18.334 12.332 14.834 16.5 10 16.5s-8.334-4.168-8.334-9.434V5.765a1 1 0 01.5-.865z" clipRule="evenodd" /></svg>
              </div>
              <div className="relative z-10">
                 <div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center mb-6 backdrop-blur">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                 </div>
                 <h2 className="text-4xl font-black mb-4 tracking-tighter">Your Data is Bulletproof.</h2>
                 <p className="text-xl font-medium text-blue-50 leading-relaxed mb-8 max-w-xl">
                    We are 100% POPIA compliant. SkoolSwap never shares your private contact details. All trades are facilitated via our secure, encrypted messenger.
                 </p>
                 <div className="flex gap-4">
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-black text-sm shadow-xl transition hover:scale-[1.05] active:scale-95">
                       Privacy Control Panel
                    </button>
                    <button className="bg-blue-500/50 text-white px-8 py-3 rounded-2xl font-black text-sm border border-white/20 backdrop-blur transition hover:bg-blue-500/70">
                       Legal Disclosure
                    </button>
                 </div>
              </div>
           </div>

           {/* Safety Exchange Points Table */}
           <div className="bg-white rounded-[50px] p-10 shadow-sm border border-gray-50">
              <h3 className="text-2xl font-black text-[#0a0f2c] mb-6 tracking-tighter">My Safety Settings</h3>
              <div className="space-y-6">
                 <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                    <div>
                       <h4 className="font-black text-[#0a0f2c]">Blur Listing Location</h4>
                       <p className="text-xs text-gray-400 font-bold">Only show neighborhood, not exact pin.</p>
                    </div>
                    <div className="w-14 h-8 bg-skool-teal rounded-full p-1 flex items-center justify-end">
                       <div className="w-6 h-6 bg-white rounded-full shadow-sm"></div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                    <div>
                       <h4 className="font-black text-[#0a0f2c]">Block Anonymous Chats</h4>
                       <p className="text-xs text-gray-400 font-bold">Only allow verified parents to message you.</p>
                    </div>
                    <div className="w-14 h-8 bg-skool-teal rounded-full p-1 flex items-center justify-end">
                       <div className="w-6 h-6 bg-white rounded-full shadow-sm"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
