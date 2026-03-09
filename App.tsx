import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CardBuilder from './pages/CardBuilder';
import Login from './pages/Login';
import PublicCard from './pages/PublicCard';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<CardBuilder />} />
      <Route path="/card/:slug" element={<PublicCard />} />
    </Routes>
  );
};

export default App;
