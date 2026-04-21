import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Heart, Users, Calendar } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl"
        >
          <div className="mb-8 flex justify-center">
            <span className="bento-tag">EST. 2026 · PHASE 1</span>
          </div>
          <h1 className="font-sans text-5xl font-extrabold leading-[1] tracking-[-3px] text-bento-ink sm:text-7xl lg:text-9xl uppercase">
            Winning <br/> is only the <br/> <span className="text-bento-muted">beginning.</span>
          </h1>
          <p className="mx-auto mt-12 max-w-2xl text-lg font-medium leading-relaxed text-bento-muted sm:text-xl">
            A subscription-driven platform combining golf performance tracking, charity fundraising, and a monthly reward engine.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/login"
              className="flex w-full items-center justify-center rounded-full bg-bento-ink px-10 py-4 text-xs font-black uppercase tracking-[2px] text-white transition-all hover:opacity-90 sm:w-auto"
            >
              Start Playing
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Section as Bento Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-y border-bento-border">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Charity Contributions', value: '$1.2M+', tag: 'IMPACT' },
              { label: 'Monthly Winners', value: '450+', tag: 'REWARDS' },
              { label: 'Active Heroes', value: '12k+', tag: 'COMMUNITY' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bento-card bg-bento-bg"
              >
                <div className="bento-title">{stat.tag}</div>
                <div className="bento-val-large">{stat.value}</div>
                <p className="mt-2 text-sm font-bold text-bento-muted uppercase tracking-tight">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-2xl">
            <h2 className="font-display text-4xl font-bold tracking-tight text-neutral-900">How the platform works</h2>
            <p className="mt-4 text-lg text-neutral-600">Simple, engaging, and impactful. Here is how you can get started.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Subscribe', desc: 'Join SwingFund with a monthly or yearly plan.', step: '01' },
              { title: 'Track Scores', desc: 'Enter your last 5 Stableford scores automatically.', step: '02' },
              { title: 'Support', desc: 'Choose a charity to receive a portion of your fee.', step: '03' },
              { title: 'Win', desc: 'Participate in monthly draws and verified rewards.', step: '04' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative h-full rounded-3xl border border-neutral-200 bg-white p-8 transition-all hover:border-neutral-900"
              >
                <span className="font-display text-5xl font-black text-neutral-100 group-hover:text-neutral-50">{item.step}</span>
                <h4 className="mt-4 text-xl font-bold text-neutral-900">{item.title}</h4>
                <p className="mt-2 text-neutral-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
