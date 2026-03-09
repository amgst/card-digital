import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { CardPreview } from '../components/CardPreview';
import { CardData } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

const PublicCard: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
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
          Create your Instagram card
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-0 md:p-8">
      <div className="w-full max-w-md px-4 pt-4 md:px-0 md:pt-0">
        <div className="mb-4 flex justify-end">
          {!authLoading && (
            user ? (
              <Link
                to="/"
                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
              >
                Open My Builder
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Login
              </Link>
            )
          )}
        </div>
      </div>
      <div className="w-full max-w-md bg-white min-h-screen md:min-h-[auto] md:rounded-[3rem] shadow-2xl overflow-hidden relative border border-gray-100">
        <CardPreview data={cardData} isStandalone={true} />
      </div>
      <div className="w-full max-w-md px-4 py-4 text-center md:absolute md:bottom-12 md:left-1/2 md:-translate-x-1/2">
        <a href="/" className="inline-block rounded-full border border-gray-100 bg-white/80 px-4 py-1 text-[10px] font-bold text-gray-400 shadow-sm backdrop-blur-sm transition hover:text-indigo-600">
          Built for Instagram with TheCard
        </a>
      </div>
    </div>
  );
};

export default PublicCard;
