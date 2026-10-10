import { motion } from 'motion/react';
import { DotGrid, Rocket3D, Checkmark3D } from './Visuals.tsx';

/** Split layout used by login / register: form on the left, cream panel on the right. */
export default function AuthShell({ badge, title, text, children, side }) {
  return (
    <section className="relative overflow-hidden pb-24">
      <div className="hidden lg:block absolute top-0 right-0 w-[46.5%] h-full bg-[#FBF6EF] pointer-events-none" aria-hidden="true" />
      <div className="hidden lg:block absolute -bottom-16 left-[53.5%] -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-[#DCF6F9] pointer-events-none" aria-hidden="true" />
      <div className="hidden sm:block absolute bottom-6 left-0">
        <DotGrid rows={8} cols={6} color="#6FD4F2" gap={12} />
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-10 pt-6 lg:pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }} className="lg:col-span-5">
          <span className="inline-block bg-[#FF856B] text-white text-[10px] font-extrabold uppercase tracking-[0.12em] px-3.5 py-1.5 rounded-md mb-5">{badge}</span>
          <h1 className="font-display text-[44px] sm:text-[54px] font-extrabold text-[#11142D] leading-[1.05] tracking-[-0.035em] mb-4">{title}</h1>
          <p className="text-[15px] text-[#808191] leading-[1.65] max-w-[380px] mb-8">{text}</p>
          {children}
        </motion.div>

        <div className="lg:col-span-7 relative min-h-[420px] hidden lg:flex items-center justify-center">
          <svg width="115" height="150" viewBox="0 0 115 150" fill="none" className="absolute top-2 left-[60px] pointer-events-none">
            <motion.path
              d="M42 135 C8 118 4 64 36 44 C64 26 85 52 72 72 C59 92 32 68 55 34 C72 10 96 14 106 24"
              stroke="#11142D"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: 0.3 }}
            />
          </svg>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-10 right-16">
            <Rocket3D />
          </motion.div>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-16 right-10">
            <Checkmark3D withCard />
          </motion.div>
          <div className="relative z-10 w-full max-w-[390px]">{side}</div>
        </div>
      </div>
    </section>
  );
}
