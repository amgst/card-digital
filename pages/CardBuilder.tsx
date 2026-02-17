import React, { useState } from 'react';
import { Navbar, Footer } from '../components/Layout';
import { CardPreview } from '../components/CardPreview';
import { ShareModal } from '../components/ShareModal';
import { CardData, SocialLink } from '../types';
import { DEFAULT_CARD_DATA, SOCIAL_PLATFORMS, THEMES } from '../constants';
import { generateBio } from '../services/geminiService';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

const CardBuilder: React.FC = () => {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  const [cardData, setCardData] = useState<CardData>(DEFAULT_CARD_DATA);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'social'>('content');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'builder' | 'public'>('builder');

  const updateField = (field: keyof CardData, value: any) => {
    if (field === 'slug') {
      // Basic slug validation: lowercase and hyphens only
      value = value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    }
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const handleAiBio = async () => {
    if (!hasGeminiKey) {
      return;
    }
    setIsGeneratingBio(true);
    const newBio = await generateBio(
      cardData.name, 
      cardData.title, 
      cardData.company, 
      "Professional, minimalist, friendly"
    );
    updateField('bio', newBio);
    setIsGeneratingBio(false);
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: Math.random().toString(36).substr(2, 9),
      platform: SOCIAL_PLATFORMS[0],
      url: ''
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
    updateField('socialLinks', cardData.socialLinks.filter(l => l.id !== id));
  };

  const handlePublish = async () => {
    if (!cardData.slug) {
      alert("Please enter a custom link (slug) first!");
      return;
    }
    setIsSaving(true);
    try {
      await setDoc(doc(db, "cards", cardData.slug), cardData);
      setShowShareModal(true);
    } catch (error) {
      console.error("Error saving card: ", error);
      alert("Failed to publish card. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (viewMode === 'public') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-0 md:p-8">
        <div className="w-full max-w-md bg-white min-h-screen md:min-h-[auto] md:rounded-[3rem] shadow-2xl overflow-hidden relative border border-gray-100">
          <button 
            onClick={() => setViewMode('builder')}
            className="fixed top-6 right-6 z-50 bg-white/90 backdrop-blur-md text-gray-900 px-6 py-2.5 rounded-full text-xs font-bold hover:bg-black hover:text-white transition shadow-lg border border-gray-200"
          >
            ← Back to Editor
          </button>
          <CardPreview data={cardData} isStandalone={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <section className="bg-gradient-to-b from-indigo-50/50 to-transparent py-16 md:py-24 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-7xl font-bold font-outfit text-gray-900 mb-6 tracking-tight">
              Your Professional <br/>
              <span className="text-indigo-600">Digital Identity</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Create a custom link at <span className="font-bold text-indigo-600">wbify.com/card/</span> and start networking better.
            </p>
            <div className="flex justify-center gap-4">
               <button 
                onClick={() => setViewMode('public')}
                className="bg-white border-2 border-indigo-600 text-indigo-600 px-10 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition shadow-sm flex items-center gap-2"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                 View My Public Card
               </button>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            <div className="w-full lg:w-7/12 space-y-8">
              <div className="bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden shadow-xl">
                <div className="flex border-b border-gray-100 p-2 gap-1 bg-gray-50/50">
                  <button 
                    onClick={() => setActiveTab('content')}
                    className={`flex-1 py-4 text-sm font-bold rounded-2xl transition ${activeTab === 'content' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    1. Identity
                  </button>
                  <button 
                    onClick={() => setActiveTab('social')}
                    className={`flex-1 py-4 text-sm font-bold rounded-2xl transition ${activeTab === 'social' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    2. Socials
                  </button>
                  <button 
                    onClick={() => setActiveTab('design')}
                    className={`flex-1 py-4 text-sm font-bold rounded-2xl transition ${activeTab === 'design' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    3. Theme
                  </button>
                </div>

                <div className="p-8">
                  {activeTab === 'content' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      
                      {/* NEW: Custom URL Slug Input */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Custom Card Link</label>
                        <div className="flex items-stretch shadow-sm">
                           <div className="bg-gray-100 border border-gray-200 border-r-0 rounded-l-2xl flex items-center px-4 text-sm font-bold text-gray-500 select-none">
                              wbify.com/card/
                           </div>
                           <input 
                            type="text" 
                            value={cardData.slug} 
                            onChange={(e) => updateField('slug', e.target.value)}
                            className="flex-1 p-4 bg-white border border-gray-200 rounded-r-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none font-bold text-indigo-600"
                            placeholder="your-name"
                          />
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium italic px-1">Choose a unique name that represents you.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                          <input 
                            type="text" 
                            value={cardData.name} 
                            onChange={(e) => updateField('name', e.target.value)}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none font-medium"
                            placeholder="e.g. John Smith"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Job Title</label>
                          <input 
                            type="text" 
                            value={cardData.title} 
                            onChange={(e) => updateField('title', e.target.value)}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none font-medium"
                            placeholder="e.g. Design Lead"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Company</label>
                          <input 
                            type="text" 
                            value={cardData.company} 
                            onChange={(e) => updateField('company', e.target.value)}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none font-medium"
                            placeholder="e.g. Tech Corp"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</label>
                          <input 
                            type="text" 
                            value={cardData.location} 
                            onChange={(e) => updateField('location', e.target.value)}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none font-medium"
                            placeholder="e.g. New York, NY"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 relative">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Professional Bio</label>
                          {hasGeminiKey ? (
                            <button 
                              onClick={handleAiBio}
                              disabled={isGeneratingBio}
                              className="text-xs flex items-center gap-1.5 text-indigo-600 font-bold hover:text-indigo-700 transition disabled:opacity-50 bg-indigo-50 px-4 py-2 rounded-full"
                            >
                              <svg className={`w-3.5 h-3.5 ${isGeneratingBio ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                              Refine with AI
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-300 italic">
                              AI bio helper disabled (no Gemini API key)
                            </span>
                          )}
                        </div>
                        <textarea 
                          rows={3}
                          value={cardData.bio} 
                          onChange={(e) => updateField('bio', e.target.value)}
                          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none font-medium resize-none"
                          placeholder="Tell your story..."
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'social' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="flex justify-between items-center mb-6">
                         <h3 className="font-bold text-gray-900 font-outfit text-2xl">Connect Socials</h3>
                         <button 
                          onClick={addSocialLink}
                          className="text-sm font-bold text-indigo-600 bg-indigo-50 px-6 py-3 rounded-2xl hover:bg-indigo-100 transition shadow-sm"
                         >
                           + Add Link
                         </button>
                      </div>

                      <div className="grid gap-4">
                        {cardData.socialLinks.map((link) => (
                          <div key={link.id} className="flex flex-col md:flex-row gap-4 p-5 border border-gray-100 rounded-[2rem] bg-gray-50 hover:bg-white hover:shadow-lg transition-all group">
                            <div className="w-full md:w-48">
                              <select 
                                value={link.platform}
                                onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold outline-none cursor-pointer"
                              >
                                {SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                              </select>
                            </div>
                            <div className="flex-1 relative">
                              <input 
                                type="text"
                                value={link.url}
                                onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm outline-none font-medium pr-10"
                                placeholder="Profile link or username..."
                              />
                            </div>
                            <button 
                              onClick={() => removeSocialLink(link.id)}
                              className="text-gray-300 hover:text-red-500 p-2 self-end md:self-center transition"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                          </div>
                        ))}
                      </div>

                      {cardData.socialLinks.length === 0 && (
                        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/30">
                          <p className="text-gray-400 font-medium">No links added yet. Let's get social!</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'design' && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                       <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-6">Choose Color Palette</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                          {THEMES.map(theme => (
                            <button
                              key={theme.id}
                              onClick={() => {
                                updateField('themeColor', theme.primary);
                                updateField('secondaryColor', theme.secondary);
                              }}
                              className={`p-6 rounded-[2rem] border-2 transition text-left space-y-4 ${cardData.themeColor === theme.primary ? 'border-indigo-600 bg-indigo-50 ring-8 ring-indigo-50' : 'border-gray-100 bg-white hover:border-indigo-100'}`}
                            >
                              <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-full shadow-md" style={{ backgroundColor: theme.primary }}></div>
                                <div className="w-8 h-8 rounded-full shadow-md" style={{ backgroundColor: theme.secondary }}></div>
                              </div>
                              <p className="text-sm font-bold text-gray-800">{theme.name}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Image Assets</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <p className="text-xs text-gray-500 font-bold">Profile Photo URL</p>
                             <input 
                              type="text" 
                              value={cardData.profileImage}
                              onChange={(e) => updateField('profileImage', e.target.value)}
                              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none font-medium"
                             />
                          </div>
                          <div className="space-y-2">
                             <p className="text-xs text-gray-500 font-bold">Cover Banner URL</p>
                             <input 
                              type="text" 
                              value={cardData.bannerImage}
                              onChange={(e) => updateField('bannerImage', e.target.value)}
                              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none font-medium"
                             />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-8 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-between">
                   <div className="flex items-center gap-2 text-sm text-gray-400 font-bold tracking-tight">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm shadow-green-200"></div>
                      READY TO LAUNCH
                   </div>
                   <button 
                    onClick={handlePublish}
                    disabled={isSaving}
                    className="w-full md:w-auto bg-indigo-600 text-white px-12 py-5 rounded-3xl font-black text-lg hover:bg-indigo-700 transition shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 transform active:scale-95 disabled:opacity-50"
                   >
                      {isSaving ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                      )}
                      {isSaving ? 'Publishing...' : 'Publish to wbify.com'}
                   </button>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-5/12 lg:sticky lg:top-24">
              <div className="flex flex-col items-center">
                <div className="mb-8 bg-indigo-600 text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-indigo-100">
                  Live View
                </div>
                <CardPreview data={cardData} />
                <p className="mt-8 text-xs text-gray-400 text-center max-w-xs font-semibold leading-relaxed">
                  The preview above shows exactly what users will see at <br/>
                  <span className="text-indigo-600">{window.location.host}/card/{cardData.slug}</span>
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
      <ShareModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        slug={cardData.slug} 
      />
    </div>
  );
};

export default CardBuilder;
