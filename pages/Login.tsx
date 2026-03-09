import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Footer, Navbar } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      navigate('/');
    } catch (submitError) {
      const nextError = submitError instanceof Error ? submitError.message : 'Authentication failed.';
      setError(nextError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Enter your email address first to reset your password.');
      setMessage('');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Check your inbox.');
    } catch (resetError) {
      const nextError = resetError instanceof Error ? resetError.message : 'Failed to send reset email.';
      setError(nextError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-indigo-50/60 to-white px-4 py-12">
        <div className="w-full max-w-md rounded-[2rem] border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-8 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Account Access</p>
            <h1 className="mt-3 text-3xl font-bold text-gray-900 font-outfit">
              {mode === 'login' ? 'Sign in to your card' : 'Create your account'}
            </h1>
            <p className="mt-3 text-sm text-gray-500">
              {mode === 'login'
                ? 'Use your email and password to manage your digital card.'
                : 'Create an account to save and publish your digital card.'}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${mode === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${mode === 'signup' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 font-medium outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 font-medium outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your password"
                minLength={6}
                required
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between gap-4 text-sm">
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={isSubmitting}
              className="font-semibold text-indigo-600 transition hover:text-indigo-700 disabled:opacity-50"
            >
              Forgot password?
            </button>
            <Link to="/" className="font-semibold text-gray-500 transition hover:text-gray-700">
              Back to builder
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
