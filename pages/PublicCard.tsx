import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CardPreview } from '../components/CardPreview';
import { CardData } from '../types';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

const PublicCard: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      if (!slug) return;
      
      try {
        const docRef = doc(db, "cards", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCardData(docSnap.data() as CardData);
        } else {
          setError("Card not found");
        }
      } catch (err) {
        console.error("Error fetching card:", err);
        setError("Failed to load card");
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || "Card not found"}</h1>
        <button 
          onClick={() => navigate('/')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Create your own card
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-0 md:p-8">
      <div className="w-full max-w-md bg-white min-h-screen md:min-h-[auto] md:rounded-[3rem] shadow-2xl overflow-hidden relative border border-gray-100">
        <CardPreview data={cardData} isStandalone={true} />
        
        <div className="absolute bottom-4 left-0 right-0 text-center pb-safe">
           <a href="/" className="inline-block px-4 py-1 bg-white/80 backdrop-blur-sm rounded-full text-[10px] font-bold text-gray-400 hover:text-indigo-600 transition border border-gray-100 shadow-sm">
             Made with TheCard Digital
           </a>
        </div>
      </div>
    </div>
  );
};

export default PublicCard;
