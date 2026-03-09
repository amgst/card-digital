
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, slug }) => {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const fullUrl = `${origin}/card/${slug}`;
  const [qrCodeSrc, setQrCodeSrc] = useState('');

  useEffect(() => {
    let active = true;

    if (!isOpen || !slug) {
      setQrCodeSrc('');
      return () => {
        active = false;
      };
    }

    QRCode.toDataURL(fullUrl, {
      width: 256,
      margin: 1,
      color: {
        dark: '#4F46E5',
        light: '#FFFFFF',
      },
    })
      .then(url => {
        if (active) {
          setQrCodeSrc(url);
        }
      })
      .catch(error => {
        console.error('Failed to generate QR code:', error);
        if (active) {
          setQrCodeSrc('');
        }
      });

    return () => {
      active = false;
    };
  }, [fullUrl, isOpen, slug]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-8 text-center">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold font-outfit text-gray-900">Share Your Card</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl mb-6 inline-block border border-indigo-100 group">
            <div className="w-48 h-48 bg-white p-4 border border-gray-100 rounded-2xl flex items-center justify-center shadow-inner">
              {qrCodeSrc ? (
                <img
                  src={qrCodeSrc}
                  alt={`QR code for ${fullUrl}`}
                  className="h-full w-full rounded-xl object-contain transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-xs font-bold uppercase tracking-widest text-gray-300">
                  Generating QR
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Live Link</p>
            <div className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl text-sm font-bold text-indigo-600 truncate">
               {fullUrl}
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(fullUrl);
                alert("Link copied to clipboard!");
              }}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy Link
            </button>
            <button 
              onClick={() => {
                const text = `Check out my digital card: ${fullUrl}`;
                const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
              }}
              className="w-full border border-gray-200 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-50 transition"
            >
              Share via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
