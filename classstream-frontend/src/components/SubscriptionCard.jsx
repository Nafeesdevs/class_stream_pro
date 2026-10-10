import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CalendarClock, Layers, Sparkles } from 'lucide-react';
import { fdate } from '../lib/format.js';
import { Pill, statusTone } from './ui.jsx';

/** Dark "current plan" card with a usage progress bar. */
export default function SubscriptionCard({ sub, cta = true }) {
  if (!sub) {
    return (
      <div className="relative bg-[#11142D] text-white rounded-[28px] p-7 overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#6852ED]/30" />
        <Sparkles className="text-[#63D2FF] mb-4" />
        <h3 className="font-display text-[22px] font-extrabold tracking-tight">No active subscription</h3>
        <p className="text-[13.5px] text-white/60 mt-2 mb-6 max-w-sm">Pick a plan to unlock classes. You can still watch every free preview video.</p>
        {cta && (
          <Link to="/subscription" className="inline-flex bg-[#6852ED] hover:bg-[#7B66F8] text-white text-[13px] font-semibold px-7 py-3.5 rounded-full transition shadow-lg shadow-[#6852ED]/30">
            Choose a plan
          </Link>
        )}
      </div>
    );
  }
  const pct = Math.min(100, Math.round((sub.classesUsed / sub.classesAllowed) * 100));
  return (
    <div className="relative bg-[#11142D] text-white rounded-[28px] p-7 overflow-hidden">
      <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-[#6852ED]/25" />
      <div className="absolute right-10 bottom-[-50px] w-32 h-32 rounded-full bg-[#63D2FF]/15" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3 mb-6">
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/50 mb-1.5">Current plan</div>
            <h3 className="font-display text-[26px] font-extrabold tracking-tight">{sub.planName}</h3>
          </div>
          <Pill tone={statusTone(sub.state)}>{sub.state}</Pill>
        </div>

        <div className="flex items-end justify-between mb-2.5">
          <div>
            <span className="font-display text-[36px] font-extrabold tracking-tight leading-none">{sub.classesLeft}</span>
            <span className="text-[13px] text-white/60 font-semibold ml-2">of {sub.classesAllowed} classes left</span>
          </div>
          <span className="text-[12px] font-bold text-white/70">{pct}% used</span>
        </div>
        <div className="h-2.5 rounded-full bg-white/10 overflow-hidden mb-6">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease: 'easeOut' }} className="h-full rounded-full bg-gradient-to-r from-[#7B61FF] to-[#63D2FF]" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-[12.5px]">
          <div className="flex items-center gap-2.5">
            <CalendarClock size={16} className="text-[#63D2FF]" />
            <div>
              <div className="text-white/50 text-[10.5px] font-semibold">Valid until</div>
              <div className="font-bold">{fdate(sub.endDate)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Layers size={16} className="text-[#FF856B]" />
            <div>
              <div className="text-white/50 text-[10.5px] font-semibold">Days left</div>
              <div className="font-bold">{sub.daysLeft} days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
