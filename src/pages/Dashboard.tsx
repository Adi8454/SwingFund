import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/src/context/AuthContext';
import { Trophy, Plus, Trash2, AlertCircle, CheckCircle2, User as UserIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [scores, setScores] = useState<any[]>([]);
  const [newScore, setNewScore] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/scores', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setScores(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchScores();
  }, [user]);

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseInt(newScore);
    if (isNaN(value) || value < 1 || value > 45) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ value })
      });
      if (res.ok) {
        setNewScore('');
        setIsAdding(false);
        fetchScores();
      }
    } catch (err) {
      console.error('Error adding score:', err);
    }
  };

  const deleteScore = async (id: string) => {
    // In a real app we'd have a delete endpoint, for now we just filter or implement it in server.ts
    // I'll add the delete endpoint to server.ts in the next turn if needed, or just let users replace/overwrite.
    alert('Delete functionality should be implemented in the MERN API');
  };

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4 text-neutral-900">
          <div className="h-12 w-12 overflow-hidden rounded-full border border-bento-border bg-neutral-100 flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-neutral-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-bento-ink">
              {profile.email.split('@')[0]}
            </h1>
            <p className="text-sm text-bento-muted font-bold uppercase tracking-wider">SwingFund Dashboard</p>
          </div>
        </div>
        <div className="bento-tag">MERN STACK</div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
        {/* Main Hero Card */}
        <div className="bento-card col-span-1 md:col-span-2 bg-bento-ink text-white border-none">
          <div className="bento-title !text-bento-muted">Career Winnings</div>
          <div className="bento-val-large">${profile.totalWon?.toLocaleString() || '0'}</div>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-[14px] text-[#a1a1aa]">MERN Database Record</span>
            <Trophy className="h-10 w-10 text-amber-400 opacity-20" />
          </div>
        </div>

        {/* Subscription Info */}
        <div className="bento-card col-span-1">
          <div className="bento-title text-neutral-900">Subscription</div>
          <div className="flex items-center gap-2 mb-2 text-neutral-900">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span className="font-bold text-lg capitalize">{profile.subscriptionStatus}</span>
          </div>
          <p className="text-[13px] text-bento-muted mt-auto border-t border-bento-border pt-4">
            Type: {profile.subscriptionPeriod}
          </p>
        </div>

        {/* Quick Controls Card */}
        <div className="bento-card col-span-1 row-span-2 bg-bento-highlight border-bento-highlight-border">
          <div className="bento-title">Actions</div>
          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={() => setIsAdding(true)}
              disabled={scores.length >= 5}
              className="w-full rounded-xl bg-white border border-bento-highlight-border p-3 text-[13px] font-bold text-bento-ink hover:bg-neutral-50 transition-all text-left flex justify-between items-center"
            >
              Add New Score
              <Plus className="h-4 w-4" />
            </button>
            <button className="w-full rounded-xl bg-white border border-bento-highlight-border p-3 text-[13px] font-bold text-bento-ink hover:bg-neutral-50 transition-all text-left">
              API Settings
            </button>
            <button className="w-full rounded-xl bg-white border border-bento-highlight-border p-3 text-[13px] font-bold text-bento-ink hover:bg-neutral-50 transition-all text-left">
              Help Center
            </button>
          </div>
        </div>

        {/* Recent Scores */}
        <div className="bento-card col-span-1 md:col-span-3 text-neutral-900">
          <div className="bento-title">Last 5 Entry Window</div>
          
          <AnimatePresence mode="popLayout">
            {isAdding && (
              <motion.form 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleAddScore}
                className="overflow-hidden border-b border-bento-border bg-neutral-50 mb-4 rounded-xl p-4"
              >
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      min="1"
                      max="45"
                      required
                      value={newScore}
                      onChange={(e) => setNewScore(e.target.value)}
                      className="w-full rounded-xl border border-bento-border bg-white px-4 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-neutral-200"
                      placeholder="Enter points (1-45)..."
                    />
                  </div>
                  <button type="submit" className="rounded-xl bg-bento-ink px-6 py-2 text-sm font-bold text-white">Save</button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            {scores.length > 0 ? (
              scores.map((score) => (
                <div key={score._id} className="flex items-center justify-between py-2 border-b border-bento-border last:border-0 font-bold">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bento-tag-bg font-black">
                      {score.value}
                    </div>
                    <div>
                      <p className="text-[13px]">Stability Score</p>
                      <p className="text-[11px] text-bento-muted uppercase tracking-tighter">{new Date(score.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-8 w-8 text-neutral-200 mb-2" />
                <p className="text-[13px] text-bento-muted uppercase font-bold">No data in MongoDB.</p>
              </div>
            )}
          </div>
        </div>

        {/* MERN Specs */}
        <div className="bento-card col-span-1 md:col-span-4 flex-row items-center gap-8">
          <div className="flex-1 text-neutral-900">
            <div className="bento-title">Stack Specifications</div>
            <div className="flex gap-12 font-bold">
              <div>
                <div className="text-2xl">MongoDB</div>
                <div className="text-[11px] text-bento-muted">Database Engine</div>
              </div>
              <div>
                <div className="text-2xl">Express</div>
                <div className="text-[11px] text-bento-muted">Middleware</div>
              </div>
              <div>
                <div className="text-2xl">Node.js</div>
                <div className="text-[11px] text-bento-muted">Runtime</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-[11px] text-emerald-500 uppercase tracking-widest px-2 py-1 bg-emerald-50 rounded-md inline-block">Secure (JWT)</div>
                <div className="text-[10px] text-bento-muted mt-1 uppercase">Auth active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
