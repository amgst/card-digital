
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardData } from '../types';
import { downloadVcf } from '../utils/vcfGenerator';

interface CardPreviewProps {
  data: CardData;
  isStandalone?: boolean;
}

export const CardPreview: React.FC<CardPreviewProps> = ({ data, isStandalone = false }) => {
  const navigate = useNavigate();
  const containerClass = isStandalone 
    ? "w-full min-h-screen bg-white" 
    : "relative mx-auto w-full max-w-[320px] aspect-[9/18.5] bg-gray-900 rounded-[3rem] p-3 shadow-2xl border-4 border-gray-800";

  return (
    <div className={containerClass}>
      {!isStandalone && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-2xl z-10 flex items-center justify-center">
          <div className="w-8 h-1.5 bg-gray-700 rounded-full"></div>
        </div>
      )}

      <div className={`w-full h-full bg-white relative flex flex-col ${!isStandalone ? 'rounded-[2.2rem] overflow-hidden overflow-y-auto no-scrollbar' : ''}`}>
        <div className="relative h-40 w-full flex-shrink-0">
          <img 
            src={data.bannerImage} 
            alt="Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="relative px-6 -mt-12 flex flex-col items-center flex-grow pb-12">
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
            <img 
              src={data.profileImage} 
              alt={data.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <h2 className="mt-4 text-2xl font-bold text-gray-900 text-center font-outfit">{data.name}</h2>
          <p className="text-indigo-600 font-semibold text-base text-center">{data.title}</p>
          <p className="text-gray-500 text-sm text-center">{data.company}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 w-full">
            <button 
              onClick={() => downloadVcf(data)}
              className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-2xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 transform active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Save Contact
            </button>
            <button className="p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition text-gray-600">
               <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
          </div>

          <div className="mt-8 w-full space-y-6">
             <div className="text-sm text-gray-600 leading-relaxed text-center px-2">
              {data.bio || "Building the future, one connection at a time."}
            </div>

            <div className="space-y-3">
              {data.phone && (
                <a href={`tel:${data.phone}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition border border-transparent hover:border-indigo-100 group">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Call Me</p>
                      <p className="text-sm font-semibold text-gray-800">{data.phone}</p>
                  </div>
                </a>
              )}

              {data.email && (
                <a href={`mailto:${data.email}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition border border-transparent hover:border-indigo-100 group">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Email Me</p>
                      <p className="text-sm font-semibold text-gray-800">{data.email}</p>
                  </div>
                </a>
              )}

              {data.website && (
                <a href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition border border-transparent hover:border-indigo-100 group">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Portfolio</p>
                      <p className="text-sm font-semibold text-gray-800 truncate max-w-[160px]">{data.website}</p>
                  </div>
                </a>
              )}
            </div>

            <div className="pt-8">
               <div className="flex flex-wrap justify-center gap-4">
                 {data.socialLinks.map((link) => (
                   <a 
                    key={link.id} 
                    href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 cursor-pointer hover:bg-indigo-600 hover:text-white transition shadow-sm border border-gray-100 group"
                    title={link.platform}
                   >
                      <span className="text-xs font-bold group-hover:scale-110 transition">{link.platform.substring(0, 2).toUpperCase()}</span>
                   </a>
                 ))}
               </div>
            </div>
          </div>
        </div>

        <div className="mt-auto py-8 bg-gray-50/50 text-center flex flex-col items-center justify-center gap-2">
           <div className="flex items-center gap-1.5 opacity-60">
            <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Powered by</span>
            <span className="text-[10px] font-bold text-indigo-600">TheCard</span>
           </div>
           {isStandalone && (
             <button 
               onClick={() => navigate('/')}
               className="mt-2 text-xs font-bold text-indigo-600 bg-white border border-indigo-100 px-4 py-2 rounded-full shadow-sm"
             >
                Create Your Own Card
             </button>
           )}
        </div>
      </div>

      {!isStandalone && (
        <>
          <div className="absolute -right-1.5 top-24 w-1.5 h-12 bg-gray-800 rounded-l-md"></div>
          <div className="absolute -right-1.5 top-40 w-1.5 h-20 bg-gray-800 rounded-l-md"></div>
          <div className="absolute -left-1.5 top-28 w-1.5 h-12 bg-gray-800 rounded-r-md"></div>
        </>
      )}
    </div>
  );
};
