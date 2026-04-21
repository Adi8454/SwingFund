import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/src/context/AuthContext';
import { db } from '@/src/lib/firebase';
import { collection, query, getDocs, doc, updateDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { Users, Trophy, Heart, BarChart3, Search, MoreVertical, ShieldCheck, Ticket } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<any[]>([]);
  const [draws, setDraws] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPrizePool: 0,
    totalCharity: 0
  });

  useEffect(() => {
    if (!profile?.isAdmin) {
      navigate('/dashboard');
      return;
    }

    // Fetch Users
    const usersQuery = query(collection(db, 'users'));
    const unsubscribeUsers = onSnapshot(usersQuery, (snap) => {
      const usersData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsers(usersData);
      
      const totalPool = usersData.reduce((acc: number, u: any) => acc + (u.subscriptionStatus === 'active' ? 100 : 0), 0);
      setStats({
        totalUsers: snap.size,
        totalPrizePool: totalPool * 0.4,
        totalCharity: totalPool * 0.1
      });
    });

    // Fetch Draws
    const drawsQuery = query(collection(db, 'draws'), orderBy('month', 'desc'));
    const unsubscribeDraws = onSnapshot(drawsQuery, (snap) => {
      setDraws(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubscribeUsers();
      unsubscribeDraws();
    };
  }, [profile, navigate]);

  const toggleAdmin = async (userId: string, currentStatus: boolean) => {
    await updateDoc(doc(db, 'users', userId), { isAdmin: !currentStatus });
  };

  const runDraw = async () => {
    // Basic simulation: generate random numbers and create a "simulated" draw
    const numbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 45) + 1);
    console.log('Random Draw Numbers:', numbers);
    alert('Draw Simulation: Winning Numbers are ' + numbers.join(', '));
  };

  if (!profile?.isAdmin) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-bento-ink uppercase">Admin Control</h1>
          <p className="mt-1 text-sm text-bento-muted uppercase font-bold tracking-wider underline underline-offset-4 decoration-bento-border">Platform Oversight</p>
        </div>
        <div className="flex gap-2 rounded-xl bg-bento-tag-bg p-1">
          {['users', 'draws', 'charities', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-lg px-4 py-1.5 text-[11px] font-black uppercase tracking-widest transition-all",
                activeTab === tab ? "bg-white text-bento-ink shadow-sm" : "text-bento-muted hover:text-bento-ink"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Stats Overview */}
      <div className="mb-12 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Users', value: stats.totalUsers, tag: 'USERS' },
          { label: 'Prize Pool', value: `$${stats.totalPrizePool.toFixed(0)}`, tag: 'TREASURY' },
          { label: 'Impact', value: `$${stats.totalCharity.toFixed(0)}`, tag: 'CHARITY' },
        ].map((stat) => (
          <div key={stat.label} className="bento-card">
            <div className="bento-title">{stat.tag}</div>
            <div className="bento-val-large">{stat.value}</div>
            <p className="mt-2 text-[11px] font-bold text-bento-muted uppercase tracking-tight">{stat.label}</p>
          </div>
        ))}
      </div>

      <main className="bento-card !p-0">
        {activeTab === 'users' && (
          <div>
            <div className="border-b border-neutral-50 bg-neutral-50/50 p-6">
              <div className="flex items-center gap-4">
                <Search className="h-5 w-5 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="flex-1 bg-transparent text-sm font-medium focus:outline-none"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-100 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Subscription</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {users.map((u) => (
                    <tr key={u.id} className="group hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
                            <Users className="h-full w-full p-2 text-neutral-400" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 flex items-center gap-1">
                              {u.email}
                              {u.isAdmin && <ShieldCheck className="h-3 w-3 text-blue-500" />}
                            </p>
                            <p className="text-xs text-neutral-400">UID: {u.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex rounded-full px-2 py-1 text-xs font-bold uppercase",
                          u.subscriptionStatus === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-500"
                        )}>
                          {u.subscriptionStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {u.subscriptionPeriod || 'None'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => toggleAdmin(u.id, u.isAdmin)}
                          className={cn(
                            "rounded-lg px-3 py-1.5 text-xs font-bold uppercase transition-all",
                            u.isAdmin ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "bg-neutral-50 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
                          )}
                        >
                          {u.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'draws' && (
          <div className="p-8 text-center py-20">
            <Ticket className="mx-auto h-12 w-12 text-neutral-200 mb-4" />
            <h2 className="text-xl font-bold mb-2">Draw Engine</h2>
            <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
              Configure lottery logic and run monthly simulations before publishing official results.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={runDraw}
                className="rounded-full bg-neutral-900 px-8 py-3 font-semibold text-white hover:bg-neutral-800"
              >
                Run Simulation
              </button>
              <button className="rounded-full border border-neutral-200 px-8 py-3 font-semibold hover:bg-neutral-50">
                Configure Logic
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
