import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDocs, limit, query, setDoc, where } from 'firebase/firestore';
import { Navbar, Footer } from '../components/Layout';
import { CardPreview } from '../components/CardPreview';
import { ShareModal } from '../components/ShareModal';
import { useAuth } from '../contexts/AuthContext';
import { CardData, SocialLink } from '../types';
import { DEFAULT_CARD_DATA, SOCIAL_PLATFORMS, THEMES } from '../constants';
import { generateBio } from '../services/geminiService';
import { db } from '../services/firebase';

const CardBuilder: React.FC = () => {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const baseHost = typeof window !== 'undefined' ? window.location.host : 'your-domain.com';
  const [cardData, setCardData] = useState<CardData>(DEFAULT_CARD_DATA);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'social'>('content');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'builder' | 'public'>('builder');
  const [isLoadingOwnedCard, setIsLoadingOwnedCard] = useState(false);
  const [hasLoadedOwnedCard, setHasLoadedOwnedCard] = useState(false);

  const updateField = (field: keyof CardData, value: any) => {
    if (field === 'slug') {
      value = value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    }
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const loadOwnedCard = async () => {
      if (loading) {
        return;
      }

      if (!user) {
        setHasLoadedOwnedCard(false);
        setIsLoadingOwnedCard(false);
        setCardData(DEFAULT_CARD_DATA);
        return;
      }

      setIsLoadingOwnedCard(true);

      try {
        const cardsRef = collection(db, 'cards');
        const ownerUidQuery = query(cardsRef, where('ownerUid', '==', user.uid), limit(1));
        let snapshot = await getDocs(ownerUidQuery);

        if (snapshot.empty && user.email) {
          const ownerEmailQuery = query(cardsRef, where('ownerEmail', '==', user.email), limit(1));
          snapshot = await getDocs(ownerEmailQuery);
        }

        if (!snapshot.empty) {
          const nextCard = snapshot.docs[0].data() as Partial<CardData>;
          setCardData({
            ...DEFAULT_CARD_DATA,
            ...nextCard,
            socialLinks: Array.isArray(nextCard.socialLinks) ? nextCard.socialLinks : DEFAULT_CARD_DATA.socialLinks,
          });
        } else {
          setCardData({
            ...DEFAULT_CARD_DATA,
            email: user.email ?? DEFAULT_CARD_DATA.email,
          });
        }
      } catch (error) {
        console.error('Error loading owned card:', error);
      } finally {
        setIsLoadingOwnedCard(false);
        setHasLoadedOwnedCard(true);
      }
    };

    if (!hasLoadedOwnedCard || user) {
      void loadOwnedCard();
    }
  }, [hasLoadedOwnedCard, loading, user]);

  const handleAiBio = async () => {
    if (!hasGeminiKey) {
      return;
    }

    setIsGeneratingBio(true);
    const newBio = await generateBio(
      cardData.name,
      cardData.title,
      cardData.company,
      'Professional, minimalist, friendly'
    );
    updateField('bio', newBio);
    setIsGeneratingBio(false);
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: Math.random().toString(36).substr(2, 9),
      platform: SOCIAL_PLATFORMS[0],
      url: '',
    };
    updateField('socialLinks', [...cardData.socialLinks, newLink]);
  };

  const updateSocialLink = (id: string, field: 'platform' | 'url', value: string) => {
    const updatedLinks = cardData.socialLinks.map(link =>
      link.id === id ? { ...link, [field]: value } : link
    );
    updateField('socialLinks', updatedLinks);
  };

  const removeSocialLink = (id: string) => {
    updateField('socialLinks', cardData.socialLinks.filter(link => link.id !== id));
  };

  const handlePublish = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!cardData.slug) {
      alert('Please enter a custom link (slug) first!');
      return;
    }

    setIsSaving(true);
    try {
      await setDoc(doc(db, 'cards', cardData.slug), {
        ...cardData,
        ownerUid: user.uid,
        ownerEmail: user.email ?? '',
        updatedAt: new Date().toISOString(),
      });
      setShowShareModal(true);
    } catch (error) {
      console.error('Error saving card: ', error);
      alert('Failed to publish card. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewPublic = () => {
    if (!cardData.slug) {
      alert('Please enter a custom link (slug) first, then publish your card.');
      return;
    }
    navigate(`/card/${cardData.slug}`);
  };

  if (viewMode === 'public') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-0 md:p-8">
        <div className="relative min-h-screen w-full max-w-md overflow-hidden border border-gray-100 bg-white shadow-2xl md:min-h-[auto] md:rounded-[3rem]">
          <button
            onClick={() => setViewMode('builder')}
            className="fixed right-4 top-4 z-50 rounded-full border border-gray-200 bg-white/90 px-4 py-2 text-[11px] font-bold text-gray-900 shadow-lg backdrop-blur-md transition hover:bg-black hover:text-white md:right-6 md:top-6 md:px-6 md:py-2.5 md:text-xs"
          >
            Back to Editor
          </button>
          <CardPreview data={cardData} isStandalone={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        <section className="border-b border-gray-100 bg-gradient-to-b from-indigo-50/50 to-transparent py-12 md:py-24">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 font-outfit sm:text-5xl md:mb-6 md:text-7xl">
              Your Professional <br className="hidden sm:block" />
              <span className="text-indigo-600">Digital Identity</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-base text-gray-600 sm:text-lg md:mb-10 md:text-xl">
              Create a custom link at <span className="font-bold text-indigo-600">{baseHost}/card/</span> and
              start networking better.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              {!loading && !user && (
                <button
                  onClick={() => navigate('/login')}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 font-bold text-white shadow-sm transition hover:bg-indigo-700 sm:w-auto sm:px-10 sm:py-4"
                >
                  Login to Save Card
                </button>
              )}
              <button
                onClick={handleViewPublic}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-indigo-600 bg-white px-6 py-3.5 font-bold text-indigo-600 shadow-sm transition hover:bg-indigo-50 sm:w-auto sm:px-10 sm:py-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                View My Public Card
              </button>
            </div>
            {!loading && user && isLoadingOwnedCard && (
              <p className="mt-4 text-sm font-medium text-gray-400">
                Loading your saved card details...
              </p>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
            <div className="order-2 w-full space-y-8 lg:order-1 lg:w-7/12">
              <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-xl sm:rounded-[2.5rem]">
                <div className="grid grid-cols-3 gap-1 border-b border-gray-100 bg-gray-50/50 p-2">
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`rounded-xl px-2 py-3 text-[11px] font-bold transition sm:rounded-2xl sm:px-3 sm:py-4 sm:text-sm ${activeTab === 'content' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    1. Identity
                  </button>
                  <button
                    onClick={() => setActiveTab('social')}
                    className={`rounded-xl px-2 py-3 text-[11px] font-bold transition sm:rounded-2xl sm:px-3 sm:py-4 sm:text-sm ${activeTab === 'social' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    2. Socials
                  </button>
                  <button
                    onClick={() => setActiveTab('design')}
                    className={`rounded-xl px-2 py-3 text-[11px] font-bold transition sm:rounded-2xl sm:px-3 sm:py-4 sm:text-sm ${activeTab === 'design' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    3. Theme
                  </button>
                </div>

                <div className="p-4 sm:p-6 md:p-8">
                  {activeTab === 'content' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 sm:space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Custom Card Link</label>
                        <div className="flex flex-col items-stretch shadow-sm sm:flex-row">
                          <div className="flex items-center rounded-t-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm font-bold text-gray-500 select-none sm:rounded-l-2xl sm:rounded-tr-none sm:border-r-0 sm:py-0">
                            {baseHost}/card/
                          </div>
                          <input
                            type="text"
                            value={cardData.slug}
                            onChange={e => updateField('slug', e.target.value)}
                            className="flex-1 rounded-b-2xl border border-gray-200 bg-white p-4 font-bold text-indigo-600 outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500 sm:rounded-b-none sm:rounded-r-2xl"
                            placeholder="your-name"
                          />
                        </div>
                        <p className="px-1 text-[10px] font-medium italic text-gray-400">Choose a unique name that represents you.</p>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                          <input
                            type="text"
                            value={cardData.name}
                            onChange={e => updateField('name', e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 font-medium outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. John Smith"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Job Title</label>
                          <input
                            type="text"
                            value={cardData.title}
                            onChange={e => updateField('title', e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 font-medium outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. Design Lead"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Company</label>
                          <input
                            type="text"
                            value={cardData.company}
                            onChange={e => updateField('company', e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 font-medium outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. Tech Corp"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Location</label>
                          <input
                            type="text"
                            value={cardData.location}
                            onChange={e => updateField('location', e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 font-medium outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. New York, NY"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contact Details</label>
                          <p className="mt-1 text-xs font-medium text-gray-400">
                            Add the details people can tap from your digital card.
                          </p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</label>
                            <input
                              type="tel"
                              value={cardData.phone}
                              onChange={e => updateField('phone', e.target.value)}
                              className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 font-medium outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                              placeholder="e.g. +1 555 123 4567"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                            <input
                              type="email"
                              value={cardData.email}
                              onChange={e => updateField('email', e.target.value)}
                              className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 font-medium outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                              placeholder="e.g. hello@yourbrand.com"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Website</label>
                            <input
                              type="text"
                              value={cardData.website}
                              onChange={e => updateField('website', e.target.value)}
                              className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 font-medium outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                              placeholder="e.g. www.yourbrand.com"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="relative space-y-2">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Professional Bio</label>
                          {hasGeminiKey ? (
                            <button
                              onClick={handleAiBio}
                              disabled={isGeneratingBio}
                              className="flex self-start items-center gap-1.5 rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-600 transition hover:text-indigo-700 disabled:opacity-50"
                            >
                              <svg className={`h-3.5 w-3.5 ${isGeneratingBio ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                              Refine with AI
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold italic text-gray-300">AI bio helper disabled (no Gemini API key)</span>
                          )}
                        </div>
                        <textarea
                          rows={3}
                          value={cardData.bio}
                          onChange={e => updateField('bio', e.target.value)}
                          className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 font-medium outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                          placeholder="Tell your story..."
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'social' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-xl font-bold text-gray-900 font-outfit sm:text-2xl">Connect Socials</h3>
                        <button
                          onClick={addSocialLink}
                          className="rounded-2xl bg-indigo-50 px-5 py-3 text-sm font-bold text-indigo-600 shadow-sm transition hover:bg-indigo-100"
                        >
                          + Add Link
                        </button>
                      </div>

                      <div className="grid gap-4">
                        {cardData.socialLinks.map(link => (
                          <div key={link.id} className="group flex flex-col gap-4 rounded-[2rem] border border-gray-100 bg-gray-50 p-4 transition-all hover:bg-white hover:shadow-lg sm:p-5 md:flex-row">
                            <div className="w-full md:w-48">
                              <select
                                value={link.platform}
                                onChange={e => updateSocialLink(link.id, 'platform', e.target.value)}
                                className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-3 text-sm font-bold outline-none"
                              >
                                {SOCIAL_PLATFORMS.map(platform => (
                                  <option key={platform} value={platform}>
                                    {platform}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={link.url}
                                onChange={e => updateSocialLink(link.id, 'url', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-white p-3 pr-10 text-sm font-medium outline-none"
                                placeholder="Profile link or username..."
                              />
                            </div>
                            <button
                              onClick={() => removeSocialLink(link.id)}
                              className="self-end p-2 text-gray-300 transition hover:text-red-500 md:self-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>

                      {cardData.socialLinks.length === 0 && (
                        <div className="rounded-[2.5rem] border-2 border-dashed border-gray-100 bg-gray-50/30 py-16 text-center sm:py-20">
                          <p className="font-medium text-gray-400">No links added yet. Let&apos;s get social!</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'design' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 sm:space-y-10">
                      <div>
                        <label className="mb-6 block text-[10px] font-black uppercase tracking-widest text-gray-400">Choose Color Palette</label>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
                          {THEMES.map(theme => (
                            <button
                              key={theme.id}
                              onClick={() => {
                                updateField('themeColor', theme.primary);
                                updateField('secondaryColor', theme.secondary);
                              }}
                              className={`space-y-4 rounded-[1.5rem] border-2 p-4 text-left transition sm:rounded-[2rem] sm:p-6 ${cardData.themeColor === theme.primary ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-50 sm:ring-8' : 'border-gray-100 bg-white hover:border-indigo-100'}`}
                            >
                              <div className="flex gap-2">
                                <div className="h-8 w-8 rounded-full shadow-md" style={{ backgroundColor: theme.primary }} />
                                <div className="h-8 w-8 rounded-full shadow-md" style={{ backgroundColor: theme.secondary }} />
                              </div>
                              <p className="text-sm font-bold text-gray-800">{theme.name}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[2rem] border border-gray-100 bg-gray-50/80 p-5 sm:p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Card Style</p>
                        <p className="mt-3 text-sm font-medium leading-relaxed text-gray-600">
                          This card now uses solid theme colors for the header and avatar instead of photo and banner URLs.
                          Pick a palette above to change the look.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-stretch justify-between gap-4 border-t border-gray-100 bg-gray-50 p-4 sm:gap-6 sm:p-6 md:flex-row md:items-center md:p-8">
                  <div className="flex items-center gap-2 text-sm font-bold tracking-tight text-gray-400">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-sm shadow-green-200" />
                    {user ? `SIGNED IN AS ${user.email ?? 'ACCOUNT OWNER'}` : 'LOGIN REQUIRED TO PUBLISH'}
                  </div>
                  <button
                    onClick={handlePublish}
                    disabled={isSaving}
                    className="flex w-full items-center justify-center gap-3 rounded-3xl bg-indigo-600 px-8 py-4 text-base font-black text-white shadow-2xl shadow-indigo-100 transition active:scale-95 hover:bg-indigo-700 disabled:opacity-50 md:w-auto md:px-12 md:py-5 md:text-lg"
                  >
                    {isSaving ? (
                      <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                    )}
                    {isSaving ? 'Publishing...' : 'Publish to wbify.com'}
                  </button>
                </div>
              </div>
            </div>

            <div className="order-1 w-full lg:order-2 lg:w-5/12 lg:sticky lg:top-24">
              <div className="flex flex-col items-center rounded-[2rem] border border-gray-100 bg-gradient-to-b from-indigo-50/70 to-white p-4 sm:p-6 lg:border-0 lg:bg-transparent lg:p-0">
                <div className="mb-4 rounded-full bg-indigo-600 px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl shadow-indigo-100 sm:mb-6 sm:px-8 sm:py-2.5 lg:mb-8">
                  Live View
                </div>
                <CardPreview data={cardData} />
                <p className="mt-5 max-w-xs text-center text-xs font-semibold leading-relaxed text-gray-400 sm:mt-8">
                  The preview above shows exactly what users will see at <br />
                  <span className="break-all text-indigo-600">{baseHost}/card/{cardData.slug}</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} slug={cardData.slug} />
    </div>
  );
};

export default CardBuilder;
