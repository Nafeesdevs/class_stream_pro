import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Film, Lock, Play } from 'lucide-react';
import { DotGrid, Rocket3D, Checkmark3D, ShoppingBag3D, Envelope3D, TestimonialAvatar } from '../components/Visuals.tsx';
import { SectionBadge, Button } from '../components/ui.jsx';
import { PlanCard, LessonCard, PlansSlider, accentFor } from '../components/Cards.jsx';
import { api } from '../lib/api.js';

/* ---- small class-themed cards in the SmartList card style (hero collage) ---- */
const MiniCard = ({ bars = ['#FF6B4A', '#3B82F6', '#10B981'], title, meta, text, tag, tagCls, accent, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-smart-card border border-gray-100/80 p-3.5 select-none ${accent ? 'border-l-[3.5px]' : ''} ${className}`} style={accent ? { borderLeftColor: accent } : undefined}>
    <div className="flex gap-1.5 mb-2">
      {bars.map((c, i) => (
        <span key={i} className="h-1 rounded-full" style={{ background: c, width: 18 + i * 6 }} />
      ))}
    </div>
    <div className="text-[11px] font-bold text-[#11142D] mb-1.5">{title}</div>
    {meta && <div className="flex items-center gap-1.5 text-[9px] text-[#6E7191] font-medium mb-2">{meta}</div>}
    {text && <p className="text-[8.5px] leading-[1.45] text-[#808191] mb-2.5">{text}</p>}
    {tag && (
      <div className="flex justify-end">
        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${tagCls}`}>{tag}</span>
      </div>
    )}
  </div>
);

const TESTIMONIALS = [
  { id: 'a', bg: 'bg-[#FFF3CE]', quote: 'I only wanted a few specific classes, and the plan let me unlock exactly those. No bloated subscription, just the lessons I needed.', name: 'Ralph Edwards', role: 'Product Designer', avatar: 'ralph', r: -22, x: -45, y: -35, rest: 20 },
  { id: 'b', bg: 'bg-[#E5FAFD]', quote: 'The video quality is great and my assigned classes are always one click away from my profile. Receipts are right there when I need them.', name: 'Kathryn Murphy', role: 'Marketing Lead', avatar: 'kathryn', r: 24, x: 25, y: 95, rest: -16 },
  { id: 'c', bg: 'bg-[#FDEBE4]', quote: 'Checkout took seconds and I could start watching immediately. It is the simplest learning platform I have used so far.', name: 'Albert Flores', role: 'Software Engineer', avatar: 'albert', r: -16, x: 60, y: 75, rest: 20 },
];

export default function Landing() {
  const nav = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [plans, setPlans] = useState([]);
  const [stats, setStats] = useState(null);
  const [order, setOrder] = useState(TESTIMONIALS);
  const [picked, setPicked] = useState(null);

  // Interactive phone (section 4)
  const [tasks, setTasks] = useState([
    { id: 1, t: 'Introduction (free preview)', on: true },
    { id: 2, t: 'Core fundamentals', on: false },
    { id: 3, t: 'Advanced deep dive', on: false },
    { id: 4, t: 'Real-world project', on: false },
  ]);
  const [inView, setInView] = useState(false);
  const [day, setDay] = useState(15);
  const [cat, setCat] = useState(0);

  useEffect(() => {
    api.lessons().then((r) => setLessons(r.lessons)).catch(() => {});
    api.plans().then((r) => setPlans(r.plans)).catch(() => {});
    api.growthHighlights().then((r) => setStats(r.growthHighlights?.stats)).catch(() => {});
  }, []);

  const phoneCats = lessons.length
    ? lessons.slice(0, 3).map((l, i) => ({ title: l.title, sub: `${l.videos.length} videos`, ...accentFor(i) }))
    : [
        { title: 'Web Development', sub: '12 videos', ...accentFor(0) },
        { title: 'Design Basics', sub: '8 videos', ...accentFor(1) },
        { title: 'Data & AI', sub: '10 videos', ...accentFor(2) },
      ];
  const arts = [Rocket3D, Checkmark3D, ShoppingBag3D];

  const prev = () => setOrder((p) => [p[p.length - 1], ...p.slice(0, -1)]);
  const next = () => setOrder((p) => [...p.slice(1), p[0]]);
  const toggle = (id) => setTasks((p) => p.map((t) => (t.id === id ? { ...t, on: !t.on } : t)));
  const lead = tasks.find((t) => t.on);

  const heroCta = (
    <Link to="/register" className="inline-flex bg-[#0B0D17] text-white text-[13.5px] font-semibold px-8 py-4 rounded-full hover:bg-[#22263A] active:scale-[0.98] transition-all shadow-lg shadow-black/10 whitespace-nowrap">
      Get Started Now
    </Link>
  );
  const dark = (to, label) => (
    <Link to={to} className="inline-flex bg-[#0B0D17] text-white text-[13.5px] font-semibold px-8 py-4 rounded-full hover:bg-[#22263A] active:scale-[0.98] transition-all shadow-md">
      {label}
    </Link>
  );

  return (
    <div>
      {/* ============ HERO ============ */}
      <section id="home" className="relative overflow-hidden pb-20 lg:pb-28">
        <div className="hidden lg:block absolute top-0 right-0 w-[46.5%] h-full bg-[#FBF6EF] pointer-events-none" aria-hidden="true" />
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="hidden lg:block absolute -bottom-16 left-[53.5%] -translate-x-1/2 w-[330px] h-[330px] rounded-full bg-[#DCF6F9] pointer-events-none" aria-hidden="true" />
        <div className="hidden sm:block absolute bottom-6 left-0 z-10">
          <DotGrid rows={8} cols={6} color="#6FD4F2" gap={12} />
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-10 pt-4 lg:pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }} className="lg:col-span-5">
              <h1 className="font-display text-[54px] sm:text-[66px] lg:text-[70px] font-extrabold text-[#11142D] leading-[1.05] tracking-[-0.035em] mb-6">
                Learn at
                <br />
                your own pace
              </h1>
              <p className="text-[15px] sm:text-[15.5px] text-[#808191] leading-[1.65] max-w-[350px] mb-9">ClassStream is a video class platform that lets you unlock exactly the classes you need and keeps you in flow</p>
              <div className="flex flex-wrap items-center gap-4">
                {heroCta}
                <Link to="/classes" className="inline-flex items-center gap-2 text-[13.5px] font-bold text-[#11142D] hover:text-[#6C5CE7] transition-colors">
                  Browse classes <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            <div className="lg:col-span-7 relative min-h-[460px] sm:min-h-[500px] flex items-center justify-center">
              <div className="relative w-full max-w-[650px] h-[470px] sm:h-[490px]">
                <svg width="115" height="150" viewBox="0 0 115 150" fill="none" className="hidden sm:block absolute top-[26px] left-[105px] z-10 pointer-events-none">
                  <motion.path d="M42 135 C8 118 4 64 36 44 C64 26 85 52 72 72 C59 92 32 68 55 34 C72 10 96 14 106 24" stroke="#11142D" strokeWidth="1.5" strokeLinecap="round" fill="none" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.1, delay: 0.3, ease: 'easeInOut' }} />
                  <motion.path d="M101 16 L107 25 L97 27" stroke="#11142D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 1.3 }} />
                </svg>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="absolute top-0 left-[140px] xs:left-[165px] sm:left-[225px] w-[190px] sm:w-[195px] z-20 hover:-translate-y-1 transition-transform duration-300">
                  <MiniCard bars={['#FF6B4A', '#F59E0B']} title="Web Development" meta={<><span className="w-3.5 h-3.5 rounded bg-[#EDE9FE] text-[#7B61FF] flex items-center justify-center text-[8px]">▶</span><span>12 videos · 6h 20m</span></>} text="Build modern websites from scratch with step-by-step video lessons." tag="Assigned" tagCls="bg-[#E6F9F0] text-[#10B981]" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="hidden sm:block absolute top-[38px] right-0 w-[205px] z-20 hover:-translate-y-1 transition-transform duration-300">
                  <MiniCard title="Design Systems" meta={<><span className="w-3.5 h-3.5 rounded bg-[#EDE9FE] text-[#7B61FF] flex items-center justify-center text-[8px]">✓</span><span>8 videos</span></>} text="Learn how to create consistent, scalable interfaces teams love." tag="Free preview" tagCls="bg-[#E6F4FF] text-[#3B82F6]" />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="absolute top-[168px] left-0 sm:left-[22px] w-[165px] z-10 hover:-translate-y-1 transition-transform duration-300">
                  <MiniCard bars={['#FF6B4A', '#F59E0B']} title="Data & AI" meta={<span>10 videos</span>} text="From spreadsheets to machine learning basics..." />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="absolute bottom-[8px] left-[10px] sm:left-[38px] w-[330px] sm:w-[365px] z-30">
                  <div className="bg-white rounded-[22px] shadow-smart-float border border-gray-100/80 p-5 select-none">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex gap-1.5">
                        <span className="h-1 w-8 rounded-full bg-[#7B61FF]" />
                        <span className="h-1 w-5 rounded-full bg-[#10B981]" />
                      </div>
                      <span className="text-[10px] font-bold text-[#10B981] bg-[#E6F9F0] px-2 py-0.5 rounded">3 of 5 classes used</span>
                    </div>
                    <div className="text-[15px] font-extrabold mb-3">Your Pro plan</div>
                    <div className="h-2 rounded-full bg-[#EEF0F6] overflow-hidden mb-4">
                      <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ duration: 1.2, delay: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-[#7B61FF] to-[#63D2FF]" />
                    </div>
                    {['Intro to Web Development', 'Design Systems'].map((t, i) => (
                      <div key={t} className="flex items-center gap-3 py-2.5 border-t border-gray-100">
                        <span className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] ${i === 0 ? 'bg-[#14172B] text-white' : 'border-2 border-[#9186F7]'}`}>{i === 0 && '✓'}</span>
                        <span className="text-[12px] font-semibold flex-1">{t}</span>
                        <Play size={13} className="text-[#6C5CE7]" />
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="hidden sm:block absolute bottom-[28px] right-0 w-[205px] z-20 hover:-translate-y-1 transition-transform duration-300">
                  <MiniCard accent="#7B61FF" bars={['#F59E0B', '#10B981']} title="Receipt ready" meta={<><span className="font-semibold text-[#11142D]">₹999</span><span className="text-gray-300">|</span><span>Razorpay</span></>} text="Payment successful. Your subscription is active and classes are unlocked." tag="PAID" tagCls="bg-[#E6F9F0] text-[#10B981]" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 2 — EXPLORE ============ */}
      <section id="explore" className="relative bg-[#F3FAFA] pt-20 pb-0 overflow-hidden">
        <div className="hidden lg:block absolute top-0 left-[54%] -translate-x-1/2 w-[170px] h-[38px] bg-[#CBEFF4] rounded-b-xl pointer-events-none" aria-hidden="true" />
        <div className="hidden sm:block absolute top-14 left-0"><DotGrid rows={8} cols={5} color="#74D4F4" gap={12} /></div>
        <svg width="140" height="130" viewBox="0 0 140 130" fill="none" className="hidden lg:block absolute top-[210px] left-0 pointer-events-none"><path d="M0 15 C55 15 95 55 82 85 C70 110 42 96 56 72 C70 48 115 62 138 92" stroke="#11142D" strokeWidth="1.3" fill="none" /></svg>
        <div className="hidden sm:block absolute bottom-3 left-[65%]"><DotGrid rows={4} cols={9} color="#74D4F4" gap={11} /></div>
        <div className="hidden lg:block absolute bottom-20 right-0"><DotGrid rows={8} cols={4} color="#2D2B38" gap={12} /></div>

        <div className="max-w-[1180px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.25 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="lg:col-span-6 flex justify-center lg:justify-start pt-6">
              <div className="relative w-[320px] sm:w-[346px] rounded-t-[46px] bg-[#CEDDF7] p-3.5 pb-0 shadow-smart-phone border-t-[3px] border-x-[3px] border-[#DCE7FB]">
                <div className="bg-[#EEF3FC] rounded-t-[36px] pt-7 px-5 pb-8">
                  <div className="grid grid-cols-4 gap-2 mb-5">
                    {[[14, 'Mon'], [15, 'Tue'], [16, 'Wed'], [17, 'Thu']].map(([d, l]) => (
                      <button key={d} onClick={() => setDay(d)} className={`py-2.5 px-2 rounded-2xl flex flex-col items-center transition-all ${day === d ? 'bg-[#14172B] text-white shadow-md scale-105' : 'hover:bg-white/60'}`}>
                        <span className="text-[16px] font-extrabold tabular-nums">{d}</span>
                        <span className={`text-[10.5px] font-medium mt-0.5 ${day === d ? 'text-white/80' : 'text-[#808191]'}`}>{l}</span>
                      </button>
                    ))}
                  </div>
                  {phoneCats.map((c, i) => {
                    const Art = arts[i % 3];
                    const first = i === 0;
                    return (
                      <motion.div key={c.title + i} whileHover={{ scale: first ? 1.02 : 1.01 }} onClick={() => setCat(i)} className={`relative bg-white rounded-2xl p-4 pl-5 mb-3.5 flex items-center justify-between cursor-pointer transition-all ${first ? 'z-20 -mr-10 sm:-mr-12 ml-1 shadow-smart-float' : 'shadow-smart-card'} ${cat === i ? 'ring-2' : ''}`} style={cat === i ? { '--tw-ring-color': c.bar + '40' } : undefined}>
                        <div className="min-w-0 pr-16">
                          <div className="text-[16px] font-extrabold tracking-tight truncate">{c.title}</div>
                          <div className="text-[12px] text-[#808191] font-medium mt-0.5">{c.sub}</div>
                          <div className="h-1 rounded-full mt-3.5" style={{ background: c.bar, width: 48 + i * 6 }} />
                        </div>
                        {first ? (
                          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-14 -right-2 sm:right-1 pointer-events-none"><Rocket3D /></motion.div>
                        ) : (
                          <Art />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.65, delay: 0.1 }} className="lg:col-span-6 pb-20 lg:pb-24">
              <SectionBadge color="coral">FIND YOUR FLOW</SectionBadge>
              <h2 className="font-display text-[34px] sm:text-[42px] font-extrabold leading-[1.18] tracking-[-0.025em] mb-5 max-w-[460px]">ClassStream helps you learn more with less friction</h2>
              <p className="text-[15px] text-[#808191] leading-[1.65] max-w-[410px] mb-9">Browse every class, preview free videos and unlock only what you need so you spend less time searching and more time learning</p>
              {dark('/classes', 'Browse Classes')}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 3 — VIDEO LIBRARY ============ */}
      <section id="library" className="relative bg-white pt-24 pb-20 overflow-hidden">
        <div className="hidden lg:block absolute top-12 left-[59%] z-0"><DotGrid rows={7} cols={9} color="#74D4F4" gap={12} /></div>
        <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.65 }} className="lg:col-span-5">
              <SectionBadge color="purple">VIDEO LIBRARY</SectionBadge>
              <h2 className="font-display text-[36px] sm:text-[42px] font-extrabold leading-[1.16] tracking-[-0.025em] mb-5">Many videos in every class</h2>
              <p className="text-[15px] text-[#808191] leading-[1.65] max-w-[400px] mb-9">Each class bundles several HD videos. Watch the free previews first, then unlock the whole class with your plan and keep it for as long as you're subscribed.</p>
              {dark('/subscription', 'See Plans')}
            </motion.div>

            <div className="lg:col-span-7 relative">
              <motion.div initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false, amount: 0.25 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 bg-[#FDF5EC] rounded-[30px] p-4 sm:p-6 border-[6px] border-white shadow-smart-card">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-start">
                  <motion.div initial={{ opacity: 0, x: 40, y: 20 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-3.5">
                    <MiniCard title="01. Introduction" meta={<span>10:15 · Free</span>} text="Welcome! Learn the roadmap and what you will build." tag="FREE" tagCls="bg-[#E6F4FF] text-[#3B82F6]" />
                    <MiniCard accent="#7B61FF" bars={['#F59E0B', '#10B981']} title="02. Core fundamentals" meta={<span>14:20</span>} text="Tools, setup and the key ideas you'll rely on." tag="PLAN" tagCls="bg-[#EDE9FE] text-[#6C5CE7]" />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-3.5 sm:mt-4">
                    <MiniCard title="03. Advanced deep dive" meta={<span>24:45</span>} text="State management and production best practices." tag="PLAN" tagCls="bg-[#EDE9FE] text-[#6C5CE7]" />
                    <MiniCard bars={['#3B82F6', '#7B61FF']} title="04. Deployment" meta={<span>18:30</span>} text="Ship it with a modern CI/CD pipeline." tag="PLAN" tagCls="bg-[#EDE9FE] text-[#6C5CE7]" />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: -30, y: 25 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.3 }} className="space-y-3.5 sm:mt-2">
                    <MiniCard bars={['#3B82F6', '#7B61FF']} title="05. Final project" meta={<span>32:10</span>} text="Put it all together in a portfolio-ready build." tag="PLAN" tagCls="bg-[#FFF3D1] text-[#D97706]" />
                    <MiniCard title="06. Wrap-up" meta={<span>06:45 · Free</span>} text="Next steps and resources to keep growing." tag="FREE" tagCls="bg-[#E6F4FF] text-[#3B82F6]" />
                  </motion.div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 35, scale: 0.85 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.7, delay: 0.25 }} className="hidden sm:block absolute -bottom-11 -left-12 z-20"><Envelope3D /></motion.div>
              <svg width="210" height="90" viewBox="0 0 210 90" fill="none" className="hidden sm:block absolute -bottom-12 -right-10 z-0 pointer-events-none"><path d="M10 65 C65 65 95 15 145 15 C175 15 190 45 210 45" stroke="#11142D" strokeWidth="1.3" fill="none" /></svg>
            </div>
          </div>

          {/* Stats strip (in place of the partner-logos bar) */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.6, delay: 0.15 }} className="mt-24 pt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <h3 className="font-display text-[19px] sm:text-[21px] font-extrabold leading-[1.3] tracking-tight shrink-0">
              Trusted by learners
              <br />
              all around the world
            </h3>
            <div className="flex-1 max-w-[740px] grid grid-cols-2 sm:grid-cols-4 gap-6">
              {(stats || [{ value: 14000, suffix: '+', label: 'Students' }, { value: 150, suffix: '+', label: 'HD lessons' }, { value: 25, suffix: '+', label: 'Curriculums' }, { value: 98.6, suffix: '%', label: 'Satisfaction' }]).map((s, i) => (
                <div key={i}>
                  <div className="font-display text-[26px] font-extrabold tracking-tight text-[#4F5265]">{Number(s.value).toLocaleString('en-IN')}{s.suffix}</div>
                  <div className="text-[12px] text-[#808191] font-semibold leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ SECTION 4 — PLANNING / PLANS ============ */}
      <section id="planning" className="relative bg-[#E8EAFC] pt-20 pb-0 overflow-hidden">
        <svg width="180" height="220" viewBox="0 0 180 220" fill="none" className="hidden lg:block absolute bottom-10 left-[3%] z-0 pointer-events-none"><path d="M15 210 C10 120 45 30 95 45 C125 55 110 105 80 95 C50 85 75 20 165 15" stroke="#11142D" strokeWidth="1.2" fill="none" /></svg>
        <div className="hidden lg:block absolute bottom-10 right-0 z-0"><DotGrid rows={8} cols={4} color="#2D2B38" gap={12} /></div>
        <div className="max-w-[1180px] mx-auto px-6 sm:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <motion.div onViewportEnter={() => setInView(true)} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="lg:col-span-6 flex justify-center lg:justify-start pt-8">
              <div className="relative w-[320px] sm:w-[346px] rounded-t-[46px] bg-[#9186F7] p-3.5 pb-0 shadow-smart-purple-phone border-t-[3px] border-x-[3px] border-[#A79EFA]">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-6 -right-8 sm:-right-10 z-30"><Checkmark3D withCard /></motion.div>
                <div className="pt-7 pb-5 px-6 text-white">
                  <div className="text-[22px] font-extrabold tracking-tight">My assigned classes</div>
                  <div className="text-[12.5px] text-white/80 font-medium mt-0.5 tabular-nums">{tasks.filter((t) => t.on).length} of {tasks.length} unlocked</div>
                </div>
                <div className="bg-white rounded-t-[32px] p-3.5 pb-8 space-y-2.5">
                  {tasks.map((t, idx) => {
                    const pop = lead?.id === t.id && inView;
                    return (
                      <motion.div key={t.id} layout initial={false} animate={pop ? { scale: 1.08, y: -2 } : { scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 24, delay: idx === 0 ? 0.25 : 0 }} onClick={() => toggle(t.id)} className={`flex items-center justify-between rounded-2xl cursor-pointer select-none transition-shadow ${pop ? 'relative z-20 -mx-5 sm:-mx-7 px-6 py-4 bg-white shadow-smart-float border border-gray-100' : 'px-4 py-3.5 bg-white hover:bg-[#F9FAFF] border border-gray-100/90'}`}>
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${t.on ? 'bg-[#14172B] text-white' : 'border-2 border-[#9186F7] bg-white'}`}>
                            {t.on && <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.2L5 8.7L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </span>
                          <span className={`truncate ${pop ? 'text-[14.5px] font-extrabold' : 'text-[13px] font-semibold'}`}>{t.t}</span>
                        </div>
                        {!pop && (t.on ? <Film size={14} className="text-[#9186F7]" /> : <Lock size={13} className="text-gray-300" />)}
                      </motion.div>
                    );
                  })}
                  <Link to="/subscription" className="block w-full pt-2 px-4 py-2 text-[13px] font-semibold text-[#6E7191] hover:text-[#11142D] transition-colors">+ Unlock more classes</Link>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.65, delay: 0.1 }} className="lg:col-span-6 pb-20 lg:pb-24">
              <SectionBadge color="cyan">PLANNING</SectionBadge>
              <h2 className="font-display text-[36px] sm:text-[42px] font-extrabold leading-[1.16] tracking-[-0.025em] mb-5">Focus on what matters</h2>
              <p className="text-[15px] text-[#6E7191] leading-[1.65] max-w-[420px] mb-9">Pick a plan, watch a class and it's assigned to you automatically. Your profile always shows exactly which classes you've unlocked and how many you have left.</p>
              {dark('/register', 'Get Started Now')}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ CLASSES PREVIEW ============ */}
      {lessons.length > 0 && (
        <section className="bg-white py-24">
          <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.3 }}>
                <SectionBadge color="coral">POPULAR CLASSES</SectionBadge>
                <h2 className="font-display text-[34px] sm:text-[42px] font-extrabold leading-[1.16] tracking-[-0.025em]">Start with a class</h2>
              </motion.div>
              <Link to="/classes" className="inline-flex items-center gap-2 text-[13.5px] font-bold hover:text-[#6C5CE7] transition-colors">View all classes <ArrowRight size={16} /></Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.slice(0, 3).map((l, i) => <LessonCard key={l._id} lesson={l} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ============ PRICING ============ */}
      {plans.length > 0 && (
        <section id="pricing" className="relative bg-[#F3FAFA] py-24 overflow-hidden">
          <div className="hidden sm:block absolute top-10 right-0"><DotGrid rows={6} cols={5} color="#74D4F4" gap={12} /></div>
          <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.3 }} className="text-center max-w-xl mx-auto mb-14">
              <SectionBadge color="yellow">PRICING</SectionBadge>
              <h2 className="font-display text-[34px] sm:text-[42px] font-extrabold leading-[1.16] tracking-[-0.025em] mb-4">Simple plans, instant access</h2>
              <p className="text-[15px] text-[#808191] leading-[1.65]">Choose how many classes you want and for how long. Pay securely with Razorpay.</p>
            </motion.div>
            <PlansSlider
              plans={plans}
              label="Choose plan"
              onSelect={() => nav('/subscription')}
            />
          </div>
        </section>
      )}

      {/* ============ TESTIMONIALS ============ */}
      <section id="testimonials" className="relative bg-white py-24 lg:py-32 overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.6 }} className="lg:col-span-4">
              <SectionBadge color="yellow">TESTIMONIALS</SectionBadge>
              <h2 className="font-display text-[34px] sm:text-[38px] font-extrabold leading-[1.2] tracking-[-0.025em] mb-12">What others are<br />saying about<br />classstream</h2>
              <div className="flex items-center gap-4">
                <button onClick={prev} aria-label="Previous testimonial" className="w-11 h-11 rounded-full flex items-center justify-center text-[#808191] hover:text-[#11142D] hover:bg-gray-100 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M15 10H5M5 10L9.5 5.5M5 10L9.5 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button onClick={next} aria-label="Next testimonial" className="w-11 h-11 rounded-full bg-[#F4F5F8] hover:bg-[#11142D] hover:text-white flex items-center justify-center transition-colors">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M5 10H15M15 10L10.5 5.5M15 10L10.5 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </motion.div>
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {order.map((it, index) => (
                  <motion.div key={it.id} layout initial={{ opacity: 0, rotate: it.r, x: it.x, y: it.y, scale: 0.72 }} whileInView={{ opacity: 1, rotate: 0, x: 0, y: index === 1 ? -16 : 16, scale: 1 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.75, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }} onClick={() => setPicked(index)} className={`${it.bg} rounded-[24px] p-7 flex flex-col justify-between min-h-[320px] cursor-pointer transition-shadow hover:shadow-lg ${picked === index ? 'ring-2 ring-[#11142D]/15' : ''}`}>
                    <div>
                      <div className="flex items-center gap-2 text-[#14172B] text-[13px] mb-6">{'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}</div>
                      <p className="text-[12.5px] leading-[1.68] text-[#3B3E52]">{it.quote}</p>
                    </div>
                    <div className="flex items-center gap-3.5 mt-8 pt-2">
                      <TestimonialAvatar person={it.avatar} />
                      <div>
                        <div className="text-[13px] font-extrabold">{it.name}</div>
                        <div className="text-[11.5px] text-[#6E7191] font-medium">{it.role}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
