
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
  const cardUrl =
    typeof window !== 'undefined' && data.slug
      ? `${window.location.origin}/card/${data.slug}`
      : '';
  const containerClass = isStandalone
    ? 'w-full min-h-screen bg-white'
    : 'relative mx-auto w-full max-w-[290px] sm:max-w-[320px] aspect-[9/18.5] rounded-[2.5rem] border-4 border-gray-800 bg-gray-900 p-2.5 shadow-2xl sm:rounded-[3rem] sm:p-3';
  const initials = data.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('') || 'TC';

  const handleShare = async () => {
    if (!cardUrl) {
      alert('Add a custom link first so your card can be shared.');
      return;
    }

    const shareData = {
      title: data.name ? `${data.name} on TheCard` : 'My digital card',
      text: data.name ? `Check out ${data.name}'s digital card.` : 'Check out my digital card.',
      url: cardUrl,
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(cardUrl);
        alert('Card link copied to clipboard.');
        return;
      }

      window.open(cardUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      // Ignore aborts from closing the native share sheet.
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      alert('Unable to share right now. Please try again.');
    }
  };

  return (
    <div className={containerClass}>
      {!isStandalone && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-2xl z-10 flex items-center justify-center">
          <div className="w-8 h-1.5 bg-gray-700 rounded-full"></div>
        </div>
      )}

      <div className={`relative flex h-full w-full flex-col bg-white ${!isStandalone ? 'no-scrollbar overflow-hidden overflow-y-auto rounded-[2rem] sm:rounded-[2.2rem]' : ''}`}>
        <div
          className="relative h-32 w-full flex-shrink-0 sm:h-40"
          style={{
            background: `linear-gradient(135deg, ${data.themeColor} 0%, ${data.secondaryColor} 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.18),transparent_30%)]" />
        </div>

        <div className="relative -mt-10 flex flex-grow flex-col items-center px-4 pb-10 sm:-mt-12 sm:px-6 sm:pb-12">
          <div
            className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white text-2xl font-black text-white shadow-xl sm:h-28 sm:w-28 sm:text-3xl"
            style={{ backgroundColor: data.secondaryColor }}
            aria-label={data.name}
          >
            {initials}
          </div>
          
          <h2 className="mt-4 text-center text-xl font-bold text-gray-900 font-outfit sm:text-2xl">{data.name}</h2>
          <p className="text-center text-sm font-semibold text-indigo-600 sm:text-base">{data.title}</p>
          <p className="text-center text-sm text-gray-500">{data.company}</p>

          <div className="mt-6 flex w-full flex-wrap justify-center gap-3 sm:mt-8">
            <button 
              onClick={() => downloadVcf(data)}
              className="flex min-w-[170px] flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition transform active:scale-95 hover:bg-indigo-700 sm:px-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Save Contact
            </button>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share card"
              className="rounded-2xl border border-gray-200 p-3 text-gray-600 transition hover:bg-gray-50"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
          </div>

          <div className="mt-6 w-full space-y-5 sm:mt-8 sm:space-y-6">
             <div className="px-2 text-center text-sm leading-relaxed text-gray-600">
              {data.bio || "Building the future, one connection at a time."}
            </div>

            <div className="space-y-3">
              {data.phone && (
                <a href={`tel:${data.phone}`} className="group flex items-center gap-3 rounded-2xl border border-transparent bg-gray-50 p-4 transition hover:border-indigo-100 hover:bg-gray-100 sm:gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-indigo-600 transition group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Call Me</p>
                      <p className="text-sm font-semibold text-gray-800">{data.phone}</p>
                  </div>
                </a>
              )}

              {data.email && (
                <a href={`mailto:${data.email}`} className="group flex items-center gap-3 rounded-2xl border border-transparent bg-gray-50 p-4 transition hover:border-indigo-100 hover:bg-gray-100 sm:gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-indigo-600 transition group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Email Me</p>
                      <p className="text-sm font-semibold text-gray-800">{data.email}</p>
                  </div>
                </a>
              )}

              {data.website && (
                <a href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-2xl border border-transparent bg-gray-50 p-4 transition hover:border-indigo-100 hover:bg-gray-100 sm:gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-indigo-600 transition group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Portfolio</p>
                      <p className="max-w-[150px] truncate text-sm font-semibold text-gray-800 sm:max-w-[160px]">{data.website}</p>
                  </div>
                </a>
              )}
            </div>

            <div className="pt-6 sm:pt-8">
               <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                 {data.socialLinks.map((link) => (
                   <a 
                    key={link.id} 
                    href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 text-gray-600 shadow-sm transition hover:bg-indigo-600 hover:text-white sm:h-12 sm:w-12"
                    title={link.platform}
                   >
                      <span className="text-xs font-bold group-hover:scale-110 transition">{link.platform.substring(0, 2).toUpperCase()}</span>
                   </a>
                 ))}
               </div>
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center justify-center gap-2 bg-gray-50/50 py-6 text-center sm:py-8">
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
