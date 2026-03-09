
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardData } from '../types';
import { downloadVcf } from '../utils/vcfGenerator';

interface CardPreviewProps {
  data: CardData;
  isStandalone?: boolean;
}

const SocialIcon: React.FC<{ platform: string }> = ({ platform }) => {
  const key = platform.toLowerCase();

  switch (key) {
    case 'linkedin':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A2.01 2.01 0 0 0 3.25 5c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2ZM20.75 13.05c0-3.26-1.74-4.78-4.05-4.78-1.87 0-2.7 1.03-3.17 1.75V8.5h-3.38V20h3.38v-6.02c0-1.59.3-3.12 2.27-3.12 1.94 0 1.97 1.81 1.97 3.22V20h3.38v-6.95Z" />
        </svg>
      );
    case 'twitter':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.9 2H22l-6.77 7.73L23.2 22h-6.25l-4.9-6.95L5.96 22H2.85l7.24-8.27L1 2h6.4l4.43 6.28L18.9 2Zm-1.1 18h1.73L6.44 3.9H4.6L17.8 20Z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'github':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 .5A12 12 0 0 0 8.2 23.9c.6.12.82-.26.82-.58v-2.1c-3.33.73-4.03-1.41-4.03-1.41-.55-1.37-1.33-1.73-1.33-1.73-1.1-.74.08-.73.08-.73 1.2.08 1.83 1.24 1.83 1.24 1.08 1.82 2.84 1.3 3.53 1 .1-.78.42-1.3.76-1.6-2.66-.3-5.47-1.3-5.47-5.86 0-1.3.47-2.37 1.24-3.2-.12-.3-.54-1.54.12-3.2 0 0 1-.33 3.3 1.22a11.7 11.7 0 0 1 6 0c2.3-1.55 3.3-1.22 3.3-1.22.66 1.66.24 2.9.12 3.2.77.83 1.24 1.9 1.24 3.2 0 4.57-2.82 5.55-5.5 5.85.43.37.82 1.1.82 2.22v3.3c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.4.58A3 3 0 0 0 .5 6.2 31.8 31.8 0 0 0 0 12a31.8 31.8 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.85.58 9.4.58 9.4.58s7.55 0 9.4-.58a3 3 0 0 0 2.1-2.12A31.8 31.8 0 0 0 24 12a31.8 31.8 0 0 0-.5-5.8ZM9.75 15.7V8.3L16.25 12l-6.5 3.7Z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.08c0-.87.24-1.46 1.5-1.46H17V4.93c-.37-.05-1.64-.13-3.12-.13-3.08 0-5.18 1.88-5.18 5.33V11H6v3h2.7v8h4.8Z" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16.5 3c.2 1.7 1.17 3.27 2.62 4.27A7.6 7.6 0 0 0 22 8v3.2a10.9 10.9 0 0 1-3.98-.76v5.67A5.62 5.62 0 1 1 12.4 10.5c.3 0 .6.03.88.08v3.28a2.4 2.4 0 1 0 1.52 2.25V3h1.7Z" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.5 3.5A11.82 11.82 0 0 0 1.58 17.7L0 24l6.46-1.54A11.82 11.82 0 0 0 24 12c0-3.2-1.24-6.2-3.5-8.5Zm-8.46 18.46c-1.85 0-3.66-.5-5.23-1.45l-.37-.22-3.83.91.91-3.73-.24-.38A9.93 9.93 0 1 1 12.04 21.96Zm5.44-7.44c-.3-.15-1.76-.87-2.03-.97-.27-.1-.46-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.35.22-.65.08-.3-.15-1.27-.47-2.42-1.5a8.99 8.99 0 0 1-1.67-2.08c-.18-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.58-.91-2.17-.24-.57-.48-.5-.66-.51h-.56c-.2 0-.52.08-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.1 4.48.71.3 1.27.48 1.7.61.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.08-.12-.28-.2-.58-.35Z" />
        </svg>
      );
    default:
      return <span className="text-[10px] font-bold">{platform.substring(0, 2).toUpperCase()}</span>;
  }
};

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
      text: data.name ? `Check out ${data.name}'s Instagram card.` : 'Check out my Instagram card.',
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
              {data.bio || "Tap through from Instagram to explore my links, offers, and contact details."}
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
                      <span className="transition group-hover:scale-110">
                        <SocialIcon platform={link.platform} />
                      </span>
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
                Create Your Instagram Card
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
