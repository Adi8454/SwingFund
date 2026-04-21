import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { motion } from 'motion/react';
import { Trophy, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-bento-border bg-white p-8 shadow-sm"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-bento-ink text-white">
            <Trophy className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-bento-ink uppercase">
            {isRegister ? 'Join SwingFund' : 'Welcome Back'}
          </h1>
          <p className="mt-2 text-sm text-bento-muted uppercase tracking-wider font-bold">
            {isRegister ? 'Create your hero account' : 'Sign in to your dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-neutral-900">
          <div>
            <label className="block text-[11px] font-bold text-bento-muted uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-bento-border bg-neutral-50 px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-neutral-200"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-bento-muted uppercase tracking-widest mb-1.5 ml-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-bento-border bg-neutral-50 px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-neutral-200"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs font-bold text-rose-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-bento-ink py-4 text-xs font-black uppercase tracking-[2px] text-white transition-all hover:opacity-90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isRegister ? 'Join Platform' : 'Sign In')}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs font-bold text-bento-muted uppercase tracking-widest hover:text-bento-ink underline underline-offset-4"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Join now"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
