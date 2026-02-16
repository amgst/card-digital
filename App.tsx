import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CardBuilder from './pages/CardBuilder';
import PublicCard from './pages/PublicCard';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CardBuilder />} />
      <Route path="/card/:slug" element={<PublicCard />} />
    </Routes>
  );
};

export default App;
