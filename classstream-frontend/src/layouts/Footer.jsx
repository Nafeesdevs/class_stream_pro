import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BrandLogo } from '../components/Visuals.tsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Footer({ showCta = true }) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setDone(true);
    setTimeout(() => {
      setEmail('');
      setDone(false);
    }, 3500);
  };

  const col = (title, items) => (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6E7191] mb-5">{title}</div>
      <ul className="space-y-3.5 text-[13.5px] text-[#D1D5DB]">
        {items.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="hover:text-white transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="relative bg-[#07070B] text-white pt-24 pb-14 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[110px] -left-[80px] w-[380px] h-[380px] rounded-full bg-[#101118]" />
        <div className="absolute top-[130px] left-[38%] w-[340px] h-[340px] bg-[#101118] rotate-12 rounded-xl" />
        <svg width="360" height="340" viewBox="0 0 360 340" fill="none" className="absolute top-[180px] right-[5%]">
          <path d="M180 20 L340 300 L20 300 Z" fill="#101118" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1140px] mx-auto px-6 sm:px-10">
        {showCta && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.65 }}
            className="text-center max-w-[720px] mx-auto pb-24"
          >
            <h2 className="font-display text-[32px] sm:text-[40px] font-extrabold text-white leading-[1.22] tracking-[-0.02em]">
              Join learners, creators
              <br className="hidden sm:inline" /> and curious minds
            </h2>
            <p className="text-[14px] text-[#8A8D9F] mt-4 mb-9">Subscribe to a plan and start streaming classes today</p>
            <Link
              to={user ? '/subscription' : '/register'}
              className="inline-block bg-[#6852ED] hover:bg-[#7B66F8] text-white text-[13.5px] font-semibold px-9 py-4 rounded-full transition-all duration-200 shadow-lg shadow-[#6852ED]/30"
            >
              {user ? 'View Plans' : 'Get Started Now'}
            </Link>
          </motion.div>
        )}

        <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6">
            <BrandLogo dark />
            <p className="text-[14px] text-[#9CA3AF] mt-5 mb-7 max-w-sm">Stream expert-led classes. Unlock what you need, learn at your own pace.</p>
            <form onSubmit={submit} className="bg-white rounded-2xl p-1.5 pl-5 flex items-center justify-between max-w-[420px] shadow-lg">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={done ? '✓ You are on the list!' : 'Enter your email'}
                className="w-full bg-transparent text-[13.5px] text-[#11142D] placeholder-[#808191] focus:outline-none pr-3"
              />
              <button type="submit" className="bg-[#0B0D17] hover:bg-[#22263A] text-white text-[13px] font-semibold px-6 py-3.5 rounded-xl transition-colors whitespace-nowrap shrink-0">
                {done ? 'Joined ✓' : 'Subscribe'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 lg:justify-items-end">
            {col('PRODUCT', [
              ['Classes', '/classes'],
              ['Subscription', '/subscription'],
              ['My Classes', '/my-classes'],
            ])}
            {col('ABOUT', [
              ['About Us', '/about'],
              ['Contact', '/contact'],
              ['Profile', '/profile'],
            ])}
            {col('LEGAL', [
              ['Terms of Service', '/terms'],
              ['Privacy Policy', '/privacy'],
            ])}
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/10 text-[12px] text-[#6E7191] flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} ClassStream. All rights reserved.</span>
          <span>Made for learners everywhere.</span>
        </div>
      </div>
    </footer>
  );
}
