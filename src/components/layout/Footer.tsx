import React from 'react';
import { Trophy, Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-bento-border bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-bento-ink text-white">
              <Trophy className="h-4 w-4" />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-bento-ink uppercase">SwingFund</span>
          </div>

          <div className="flex gap-8 text-[12px] font-bold text-bento-muted uppercase tracking-wider">
            <a href="#" className="hover:text-bento-ink">About</a>
            <a href="#" className="hover:text-bento-ink">Charities</a>
            <a href="#" className="hover:text-bento-ink">Terms</a>
            <a href="#" className="hover:text-bento-ink">Privacy</a>
          </div>

          <div className="flex gap-4 text-bento-muted">
            <Twitter className="h-4 w-4 cursor-pointer hover:text-bento-ink" />
            <Instagram className="h-4 w-4 cursor-pointer hover:text-bento-ink" />
          </div>
        </div>
        <div className="mt-8 border-t border-bento-border pt-8 text-center text-[11px] font-medium text-bento-muted uppercase tracking-widest">
          © {new Date().getFullYear()} SwingFund · All systems operational
        </div>
      </div>
    </footer>
  );
}

