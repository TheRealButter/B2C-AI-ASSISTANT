
import React from 'react';
import { Listing } from '../types';

interface ItemDetailsProps {
  item: Listing;
  onBack: () => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item, onBack }) => {
  return (
    <div className="w-full min-h-screen bg-[#f8fafc] flex flex-col items-center">
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-8 px-6 py-10 pb-32">
        {/* Left Column: Image & Basic Info */}
        <div className="space-y-6">
           <button onClick={onBack} className="text-skool-orange font-black text-sm flex items-center mb-4 group">
             <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             Back to Map
           </button>
           
           <div className="aspect-square rounded-[50px] overflow-hidden shadow-2xl relative bg-white">
              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-xl text-skool-teal text-[10px] font-black uppercase tracking-widest z-10 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 .3l7.834 4.6a1 1 0 01.5.865v1.301C18.334 12.332 14.834 16.5 10 16.5s-8.334-4.168-8.334-9.434V5.765a1 1 0 01.5-.865z" clipRule="evenodd" /></svg>
                Safety Verified Listing
              </div>
              <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.title} />
           </div>

           <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                 <h1 className="text-5xl font-black text-[#0a0f2c] tracking-tighter leading-[0.9]">{item.title}</h1>
                 <span className="text-4xl font-black text-skool-orange">R{item.price}</span>
              </div>
              <p className="text-gray-400 font-medium leading-relaxed mb-6">
                Excellent condition, minimal markings. Perfect for the Grade 10 curriculum. Saving you over R600 vs buying new.
              </p>
              <div className="flex flex-wrap gap-2">
                 <span className="bg-gray-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-gray-500 tracking-widest">{item.category}</span>
                 <span className="bg-gray-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-gray-500 tracking-widest">Education</span>
                 <span className="bg-gray-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-gray-500 tracking-widest">High School</span>
              </div>
           </div>
        </div>

        {/* Right Column: Seller & Safety - Practical for SA */}
        <div className="space-y-6">
           {/* Seller Card */}
           <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-black text-[#0a0f2c] mb-8 tracking-tighter">Parent Information</h3>
              <div className="flex items-center space-x-5 mb-8">
                 <div className="w-20 h-20 bg-skool-teal rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg">S</div>
                 <div>
                    <h4 className="text-2xl font-black text-[#0a0f2c] flex items-center">
                       {item.seller}
                       <svg className="w-6 h-6 ml-2 text-skool-teal" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    </h4>
                    <div className="flex items-center space-x-2">
                       <div className="flex text-skool-yellow"><svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> <span className="text-sm font-black ml-1">{item.sellerRating} Trust Score</span></div>
                       <span className="text-gray-300 font-bold text-xs">• Verified Parent</span>
                    </div>
                 </div>
              </div>
              <button className="w-full py-6 bg-skool-orange text-white rounded-[30px] font-black text-xl flex items-center justify-center space-x-4 shadow-2xl shadow-skool-orange/30 transition hover:scale-[1.02] active:scale-95">
                 <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                 <span>Start Safe Chat</span>
              </button>
           </div>

           {/* Safe Meetup Recommendation - Practical for SA */}
           <div className="bg-skool-teal rounded-[50px] p-10 text-white shadow-xl shadow-skool-teal/20">
              <div className="flex items-center space-x-4 mb-6">
                 <div className="bg-white/20 p-3 rounded-2xl backdrop-blur">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 </div>
                 <h4 className="text-3xl font-black tracking-tighter">Safe Meetup Point</h4>
              </div>
              <p className="text-lg font-medium text-white/80 leading-relaxed mb-8">
                 We recommend meeting at the <span className="text-white font-black underline">{item.safeMeetingPoint || 'Your Local Police Station Public Zone'}</span>. Both have 24/7 CCTV and visible security.
              </p>
              <div className="bg-white/10 border border-white/20 p-6 rounded-3xl">
                 <h5 className="font-black mb-2 flex items-center uppercase tracking-widest text-xs">Physical Safety Protocol:</h5>
                 <ul className="space-y-2 text-sm font-bold text-white/90">
                    <li className="flex items-start"><svg className="w-4 h-4 mr-2 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Never meet at a private residence.</li>
                    <li className="flex items-start"><svg className="w-4 h-4 mr-2 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Use cashless payment (e.g. SnapScan) if possible.</li>
                    <li className="flex items-start"><svg className="w-4 h-4 mr-2 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Tell a friend about your meetup location.</li>
                 </ul>
              </div>
           </div>

           <div className="pt-10">
              <h3 className="text-3xl font-black text-[#0a0f2c] mb-8 tracking-tighter">Related Items</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[
                   { title: 'Grade 10 Science Textbook', price: 'R220', img: 'https://images.unsplash.com/photo-1532012197367-e3381019d514?q=80&w=400&auto=format&fit=crop' },
                   { title: 'Oxford School Atlas', price: 'R150', img: 'https://images.unsplash.com/photo-1524850041227-63d2ad3a5a35?q=80&w=400&auto=format&fit=crop' }
                 ].map((rel, idx) => (
                   <div key={idx} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:border-skool-orange/20 transition-all">
                      <img src={rel.img} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
                      <div className="p-6">
                         <h5 className="text-lg font-black text-[#0a0f2c] mb-1 leading-tight line-clamp-1">{rel.title}</h5>
                         <span className="text-xl font-black text-skool-orange">{rel.price}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
