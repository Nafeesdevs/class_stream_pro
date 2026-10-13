import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, Lock, PlayCircle, Unlock, Crown, Clock3, Film, ChevronLeft, ChevronRight } from 'lucide-react';
import { money, durationLabel } from '../lib/format.js';
import { Button, Pill } from './ui.jsx';
import { Rocket3D, Checkmark3D, ShoppingBag3D } from './Visuals.tsx';

export const ACCENTS = [
  { bar: '#FF6B4A', soft: '#FDEBE4', Art: Rocket3D },
  { bar: '#7B61FF', soft: '#EDE9FE', Art: Checkmark3D },
  { bar: '#48CAE4', soft: '#E5FAFD', Art: ShoppingBag3D },
  { bar: '#F5C344', soft: '#FFF3CE', Art: Rocket3D },
  { bar: '#10B981', soft: '#E6F9F0', Art: Checkmark3D },
];
export const accentFor = (i) => ACCENTS[i % ACCENTS.length];

/* ----------------------- CLASS (lesson) CARD ----------------------- */
export function LessonCard({ lesson, index = 0, unlockedBadge = true }) {
  const a = accentFor(index);
  const free = lesson.videos?.filter((v) => v.accessType === 'free').length || 0;
  const total = lesson.videos?.length || 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Link to={`/classes/${lesson._id}`} className="group relative block h-full bg-white rounded-[24px] p-6 pl-7 shadow-smart-card border border-gray-100/80 overflow-hidden">
        <span className="absolute left-0 top-0 bottom-0 w-[5px]" style={{ background: a.bar }} />
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex gap-1.5">
            <span className="h-1 w-7 rounded-full" style={{ background: a.bar }} />
            <span className="h-1 w-4 rounded-full bg-[#10B981]" />
            <span className="h-1 w-5 rounded-full bg-[#3B82F6]" />
          </div>
          {unlockedBadge && lesson.isUnlocked && (
            <Pill tone="green">
              <Unlock size={10} /> Assigned
            </Pill>
          )}
        </div>
        <h3 className="font-display text-[19px] font-extrabold tracking-tight leading-snug mb-2 group-hover:text-[#6C5CE7] transition-colors">{lesson.title}</h3>
        <p className="text-[13px] text-[#808191] leading-[1.6] line-clamp-2 min-h-[42px] mb-5">{lesson.description || 'Stream this class and learn at your own pace.'}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-semibold text-[#6E7191]">
          <span className="inline-flex items-center gap-1.5">
            <Film size={14} style={{ color: a.bar }} /> {total} video{total === 1 ? '' : 's'}
          </span>
          {lesson.duration && (
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={14} style={{ color: a.bar }} /> {lesson.duration}
            </span>
          )}
          {free > 0 && <span className="px-2 py-0.5 rounded bg-[#E6F4FF] text-[#3B82F6] text-[10.5px] font-extrabold">{free} FREE</span>}
        </div>
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-[12.5px] font-bold">
          {lesson.isUnlocked ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E6F9F0] text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-colors">
              <PlayCircle size={15} /> Continue watching
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#6C5CE7] text-white shadow-sm shadow-[#6C5CE7]/20 group-hover:bg-[#5743D8] transition-colors">
              <Lock size={14} /> Unlock with plan
            </span>
          )}
          <span className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-[#6C5CE7] group-hover:bg-[#6C5CE7] group-hover:text-white group-hover:translate-x-0.5 transition-all">→</span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ----------------------- PLAN CARD ----------------------- */
const PLAN_THEMES = [
  { bg: 'bg-[#E5FAFD]', bar: '#48CAE4' },
  { bg: 'bg-[#EDE9FE]', bar: '#7B61FF' },
  { bg: 'bg-[#FFF3CE]', bar: '#F5C344' },
  { bg: 'bg-[#FDEBE4]', bar: '#FF6B4A' },
];

export function PlanCard({ plan, index = 0, onSelect, loading, current, label = 'Subscribe & pay', disabled }) {
  const t = PLAN_THEMES[index % PLAN_THEMES.length];
  const perClass = plan.classLimit ? plan.price / plan.classLimit : plan.price;
  const featured = plan.isPopular;
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      className={`relative rounded-[28px] p-7 flex flex-col h-full ${featured ? 'bg-[#11142D] text-white shadow-smart-float' : `${t.bg} text-[#11142D]`}`}
    >
      {featured && (
        <span className="absolute -top-3 left-7 inline-flex items-center gap-1.5 bg-[#FF856B] text-white text-[10px] font-extrabold uppercase tracking-[0.12em] px-3.5 py-1.5 rounded-md">
          <Crown size={11} /> Most popular
        </span>
      )}
      <div className="flex gap-1.5 mb-5">
        <span className="h-1 w-8 rounded-full" style={{ background: t.bar }} />
        <span className="h-1 w-5 rounded-full bg-[#10B981]" />
      </div>
      <h3 className="font-display text-[22px] font-extrabold tracking-tight">{plan.name}</h3>
      <p className={`text-[13px] mt-1.5 leading-relaxed min-h-[40px] ${featured ? 'text-white/65' : 'text-[#6E7191]'}`}>{plan.description || `${plan.classLimit} classes for ${durationLabel(plan.durationMonths)}`}</p>

      <div className="mt-6 mb-6 flex items-end gap-2">
        <span className="font-display text-[42px] font-extrabold tracking-[-0.04em] leading-none">{money(plan.price, plan.currency)}</span>
        <span className={`text-[12.5px] font-semibold pb-1.5 ${featured ? 'text-white/60' : 'text-[#808191]'}`}>/ {durationLabel(plan.durationMonths)}</span>
      </div>

      <ul className="space-y-3 mb-8 text-[13.5px] font-semibold">
        {[`${plan.classLimit} class${plan.classLimit > 1 ? 'es' : ''} included`, `${durationLabel(plan.durationMonths)} of access`, `≈ ${money(perClass, plan.currency)} per class`, 'Unlimited free previews', 'Receipt for every payment'].map((f) => (
          <li key={f} className="flex items-center gap-3">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${featured ? 'bg-[#6852ED] text-white' : 'bg-white text-[#11142D]'}`}>
              <Check size={12} strokeWidth={3} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        {current ? (
          <div className={`text-center text-[13px] font-bold py-3.5 rounded-full ${featured ? 'bg-white/10' : 'bg-white'}`}>✓ Your current plan</div>
        ) : (
          <Button variant={featured ? 'purple' : 'dark'} size="lg" className="w-full" loading={loading} disabled={disabled} onClick={() => onSelect?.(plan)}>
            {label}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

const SLIDER_GAP = 28;

/* ----------------------- PLANS SLIDER ----------------------- */
export function PlansSlider({ plans = [], onSelect, disabled, label = 'Choose plan' }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const getStep = () => {
    const el = trackRef.current;
    const first = el?.firstElementChild;
    return first ? first.offsetWidth + SLIDER_GAP : 0;
  };

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const step = getStep() || 1;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
    setPages(Math.max(1, Math.round(max / step) + 1));
    setPage(Math.min(Math.round(el.scrollLeft / step), Math.max(0, Math.round(max / step))));
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update, plans.length]);

  const slide = (dir) => trackRef.current?.scrollBy({ left: dir * getStep(), behavior: 'smooth' });
  const goTo = (i) => trackRef.current?.scrollTo({ left: i * getStep(), behavior: 'smooth' });

  const arrowCls = (enabled) =>
    `w-11 h-11 rounded-full flex items-center justify-center border transition-colors ${
      enabled
        ? 'bg-[#11142D] text-white border-[#11142D] hover:bg-[#6C5CE7] hover:border-[#6C5CE7] shadow-smart-card'
        : 'bg-white text-[#C4C6D3] border-gray-200 cursor-not-allowed'
    }`;

  return (
    <div>
      {/* Header with arrows */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-[13px] font-bold text-[#808191]">
          {plans.length} plans available · swipe or use the arrows
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            aria-label="Previous plans"
            disabled={!canPrev}
            onClick={() => slide(-1)}
            whileHover={canPrev ? { scale: 1.1 } : undefined}
            whileTap={canPrev ? { scale: 0.92 } : undefined}
            className={arrowCls(canPrev)}
          >
            <ChevronLeft size={20} />
          </motion.button>
          <motion.button
            type="button"
            aria-label="Next plans"
            disabled={!canNext}
            onClick={() => slide(1)}
            whileHover={canNext ? { scale: 1.1 } : undefined}
            whileTap={canNext ? { scale: 0.92 } : undefined}
            className={arrowCls(canNext)}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-7 overflow-x-auto snap-x snap-mandatory scroll-smooth pt-8 pb-10 px-3 -mx-3 scroll-pl-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {plans.map((p, i) => (
          <motion.div
            key={p._id || i}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
            whileHover={{ y: -8 }}
            className="snap-start shrink-0 w-[85%] sm:w-[calc((100%-28px)/2)] lg:w-[calc((100%-56px)/3)]"
          >
            <PlanCard plan={p} index={i} onSelect={onSelect} disabled={disabled} label={label} />
          </motion.div>
        ))}
      </div>

      {/* Dots */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 -mt-3">
          {Array.from({ length: pages }).map((_, i) => (
            <motion.button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              animate={{ width: page === i ? 26 : 8, backgroundColor: page === i ? '#6C5CE7' : '#D9DBE6' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="h-2 rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}

