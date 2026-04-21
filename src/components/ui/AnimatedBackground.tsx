import React from 'react';
import { motion } from 'motion/react';

const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2070&auto=format&fit=crop', // Golf club & ball
  'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop', // Golf course
  'https://images.unsplash.com/photo-1592919016381-f07ecd63f4aa?q=80&w=2070&auto=format&fit=crop', // Putter
  'https://images.unsplash.com/photo-1623513072020-0435930b953d?q=80&w=2076&auto=format&fit=crop', // Golf bag
  'https://images.unsplash.com/photo-1591491640784-33314959bb4b?q=80&w=1974&auto=format&fit=crop', // Fairway
];

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-20">
      {BACKGROUND_IMAGES.map((src, i) => (
        <motion.div
          key={i}
          className="absolute rounded-3xl overflow-hidden shadow-2xl brightness-75 grayscale-[0.2]"
          style={{
            width: `${200 + (i * 50)}px`,
            height: `${250 + (i * 30)}px`,
            left: `${(i * 25) % 80}%`,
            top: `${(i * 30) % 70}%`,
          }}
          initial={{ opacity: 0, scale: 0.8, rotate: i * 5 }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            rotate: [i * 5, i * 5 + 10, i * 5],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: 15 + (i * 2),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        >
          <img
            src={src}
            alt="Golf Decoration"
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bento-ink/40 to-transparent" />
        </motion.div>
      ))}
      
      {/* Subtle overlay to soften the imagery */}
      <div className="absolute inset-0 bg-bento-bg/30 backdrop-blur-[2px]" />
    </div>
  );
}
