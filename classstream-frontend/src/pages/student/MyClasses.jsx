// import { Link } from 'react-router-dom';
// import { Unlock, Compass } from 'lucide-react';
// import { DotGrid } from '../../components/Visuals.tsx';
// import { PageHeader, PageLoader, EmptyState, ErrorBox, Button, Pill, statusTone } from '../../components/ui.jsx';
// import { LessonCard } from '../../components/Cards.jsx';
// import SubscriptionCard from '../../components/SubscriptionCard.jsx';
// import { api } from '../../lib/api.js';
// import { fdate } from '../../lib/format.js';
// import { useAsync } from '../../lib/hooks.js';

// /** "Assigned classes" — only the classes unlocked by the student's current subscription. */
// export default function MyClasses() {
//   const { data, loading, error, refetch } = useAsync(async () => {
//     const [l, s] = await Promise.all([api.lessons(), api.mySubscription()]);
//     return { lessons: l.lessons, current: s.current, upcoming: s.upcoming };
//   }, []);

//   if (loading) return <PageLoader label="Loading your classes…" />;
//   if (error) return <div className="max-w-[1240px] mx-auto px-6 py-10"><ErrorBox message={error} onRetry={refetch} /></div>;

//   const assigned = data.lessons.filter((l) => l.isUnlocked);

//   return (
//     <div className="relative">
//       <div className="hidden sm:block absolute top-0 left-0"><DotGrid rows={6} cols={5} color="#6FD4F2" gap={12} /></div>
//       <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10 pt-6 pb-24">
//         <PageHeader badge="MY CLASSES" badgeColor="purple" title="Classes assigned to you" text="Everything you've unlocked with your subscription lives here — pick up exactly where you left off." />

//         <div className="grid lg:grid-cols-12 gap-8 mt-10">
//           <div className="lg:col-span-4 space-y-5">
//             <SubscriptionCard sub={data.current} />
//             {data.upcoming?.length > 0 && (
//               <div className="bg-[#E8EAFC] rounded-[24px] p-5">
//                 <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6E7191] mb-3">Up next</div>
//                 {data.upcoming.map((u) => (
//                   <div key={u._id} className="flex items-center justify-between text-[13px] py-1.5">
//                     <span className="font-extrabold">{u.planName}</span>
//                     <span className="text-[#6E7191] font-semibold">starts {fdate(u.startDate)}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//             <Button as={Link} to="/classes" variant="outline" className="w-full">
//               <Compass size={15} /> Browse more classes
//             </Button>
//           </div>

//           <div className="lg:col-span-8">
//             <div className="flex items-center justify-between mb-5">
//               <h2 className="font-display text-[20px] font-extrabold flex items-center gap-2.5">
//                 <Unlock size={18} className="text-[#10B981]" /> Assigned classes
//               </h2>
//               <Pill tone={statusTone('active')}>{assigned.length} unlocked</Pill>
//             </div>
//             {assigned.length === 0 ? (
//               <EmptyState
//                 icon={Unlock}
//                 title="No classes assigned yet"
//                 text={data.current ? 'Open any class and press play on a subscription video — it will be assigned to you automatically.' : 'Subscribe to a plan, then open a class to assign it to your account.'}
//                 action={<Button as={Link} to={data.current ? '/classes' : '/subscription'}>{data.current ? 'Browse classes' : 'View plans'}</Button>}
//               />
//             ) : (
//               <div className="grid sm:grid-cols-2 gap-6">
//                 {assigned.map((l, i) => (
//                   <LessonCard key={l._id} lesson={l} index={i} />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Unlock, Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import { DotGrid } from '../../components/Visuals.tsx';
import { PageHeader, PageLoader, EmptyState, ErrorBox, Button, Pill, statusTone } from '../../components/ui.jsx';
import { LessonCard } from '../../components/Cards.jsx';
import SubscriptionCard from '../../components/SubscriptionCard.jsx';
import { api } from '../../lib/api.js';
import { fdate } from '../../lib/format.js';
import { useAsync } from '../../lib/hooks.js';

const PAGE_SIZE = 4;

/** "Assigned classes" — only the classes unlocked by the student's current subscription. */
export default function MyClasses() {
  const { data, loading, error, refetch } = useAsync(async () => {
    const [l, s] = await Promise.all([api.lessons(), api.mySubscription()]);
    return { lessons: l.lessons, current: s.current, upcoming: s.upcoming };
  }, []);

  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = previous

  // Hooks must run on every render, so compute these before any early return
  const assigned = useMemo(
    () => (data?.lessons || []).filter((l) => l.isUnlocked),
    [data]
  );

  const totalPages = Math.max(1, Math.ceil(assigned.length / PAGE_SIZE));

  // Clamp page if the list shrinks
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginated = useMemo(
    () => assigned.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [assigned, page]
  );

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, page - 1, page, page + 1]);
    const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
    const result = [];
    sorted.forEach((p, i) => {
      if (i > 0 && p - sorted[i - 1] > 1) result.push('...');
      result.push(p);
    });
    return result;
  }, [page, totalPages]);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    setDirection(p > page ? 1 : -1);
    setPage(p);
  };

  const pageVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  if (loading) return <PageLoader label="Loading your classes…" />;
  if (error) return <div className="max-w-[1240px] mx-auto px-6 py-10"><ErrorBox message={error} onRetry={refetch} /></div>;

  return (
    <div className="relative">
      <div className="hidden sm:block absolute top-0 left-0"><DotGrid rows={6} cols={5} color="#6FD4F2" gap={12} /></div>
      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10 pt-6 pb-24">
        <PageHeader badge="MY CLASSES" badgeColor="purple" title="Classes assigned to you" text="Everything you've unlocked with your subscription lives here — pick up exactly where you left off." />

        <div className="grid lg:grid-cols-12 gap-8 mt-10">
          <div className="lg:col-span-4 space-y-5">
            <SubscriptionCard sub={data.current} />
            {data.upcoming?.length > 0 && (
              <div className="bg-[#E8EAFC] rounded-[24px] p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6E7191] mb-3">Up next</div>
                {data.upcoming.map((u) => (
                  <div key={u._id} className="flex items-center justify-between text-[13px] py-1.5">
                    <span className="font-extrabold">{u.planName}</span>
                    <span className="text-[#6E7191] font-semibold">starts {fdate(u.startDate)}</span>
                  </div>
                ))}
              </div>
            )}
            <Button as={Link} to="/classes" variant="outline" className="w-full">
              <Compass size={15} /> Browse more classes
            </Button>
          </div>

          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-[20px] font-extrabold flex items-center gap-2.5">
                <Unlock size={18} className="text-[#10B981]" /> Assigned classes
              </h2>
              <Pill tone={statusTone('active')}>{assigned.length} unlocked</Pill>
            </div>

            {assigned.length === 0 ? (
              <EmptyState
                icon={Unlock}
                title="No classes assigned yet"
                text={data.current ? 'Open any class and press play on a subscription video — it will be assigned to you automatically.' : 'Subscribe to a plan, then open a class to assign it to your account.'}
                action={<Button as={Link} to={data.current ? '/classes' : '/subscription'}>{data.current ? 'Browse classes' : 'View plans'}</Button>}
              />
            ) : (
              <>
                <div className="overflow-hidden">
                  <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.div
                      key={page}
                      custom={direction}
                      variants={pageVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="grid sm:grid-cols-2 gap-6"
                    >
                      {paginated.map((l, i) => (
                        <LessonCard key={l._id} lesson={l} index={i} />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mt-10 flex flex-col items-center gap-3"
                  >
                    <nav className="flex items-center gap-2" aria-label="Pagination">
                      <motion.button
                        whileHover={{ scale: page === 1 ? 1 : 1.08 }}
                        whileTap={{ scale: page === 1 ? 1 : 0.92 }}
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 1}
                        aria-label="Previous page"
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F4F5F8] text-[#4F5265] hover:bg-[#E8EAFC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft size={18} />
                      </motion.button>

                      {pageNumbers.map((p, i) =>
                        p === '...' ? (
                          <span key={`dots-${i}`} className="w-8 text-center text-[#A0A3B5] font-bold">…</span>
                        ) : (
                          <motion.button
                            key={p}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => goToPage(p)}
                            aria-label={`Page ${p}`}
                            aria-current={p === page ? 'page' : undefined}
                            className={`relative w-10 h-10 rounded-full text-[13px] font-bold transition-colors ${
                              p === page ? 'text-white' : 'bg-[#F4F5F8] text-[#4F5265] hover:bg-[#E8EAFC]'
                            }`}
                          >
                            {p === page && (
                              <motion.span
                                layoutId="my-classes-active-page"
                                className="absolute inset-0 rounded-full bg-[#11142D] shadow-md"
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                              />
                            )}
                            <span className="relative z-10">{p}</span>
                          </motion.button>
                        )
                      )}

                      <motion.button
                        whileHover={{ scale: page === totalPages ? 1 : 1.08 }}
                        whileTap={{ scale: page === totalPages ? 1 : 0.92 }}
                        onClick={() => goToPage(page + 1)}
                        disabled={page === totalPages}
                        aria-label="Next page"
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F4F5F8] text-[#4F5265] hover:bg-[#E8EAFC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight size={18} />
                      </motion.button>
                    </nav>

                    <p className="text-[12px] text-[#A0A3B5] font-medium">
                      Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, assigned.length)} of {assigned.length} classes
                    </p>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

