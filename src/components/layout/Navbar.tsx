import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, LogOut, LayoutDashboard, Settings, User as UserIcon } from 'lucide-react';
import { auth } from '@/src/lib/firebase';
import { useAuth } from '@/src/context/AuthContext';
import { cn } from '@/src/lib/utils';

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-bento-border bg-bento-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-bento-ink transition-transform group-hover:scale-105">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-bento-ink">SWINGFUND</span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <nav className="hidden md:flex gap-8 text-[14px] font-medium text-bento-muted">
                <Link to="/dashboard" className="hover:text-bento-ink">Dashboard</Link>
                {profile?.isAdmin && <Link to="/admin" className="hover:text-bento-ink">Admin</Link>}
              </nav>
              <div className="flex items-center gap-4 border-l border-bento-border pl-6">
                <button
                  onClick={handleLogout}
                  className="text-[14px] font-medium text-bento-muted hover:text-bento-ink"
                >
                  Logout
                </button>
                <div className="bento-tag">PRO PLAN</div>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="bento-tag !bg-bento-ink !text-white px-6 py-2"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
