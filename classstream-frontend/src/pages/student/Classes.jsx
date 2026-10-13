// import { useMemo, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { motion } from 'motion/react';
// import { Search, BookOpen } from 'lucide-react';
// import { DotGrid } from '../../components/Visuals.tsx';
// import { PageHeader, PageLoader, EmptyState, ErrorBox, inputCls, Button } from '../../components/ui.jsx';
// import { LessonCard } from '../../components/Cards.jsx';
// import SubscriptionCard from '../../components/SubscriptionCard.jsx';
// import { api } from '../../lib/api.js';
// import { useAsync } from '../../lib/hooks.js';
// import { useAuth } from '../../context/AuthContext.jsx';

// export default function Classes() {
//   const { user, isAdmin } = useAuth();
//   const { data, loading, error, refetch } = useAsync(() => api.lessons(), [user?._id]);
//   const [q, setQ] = useState('');
//   const [tab, setTab] = useState('all');

//   const lessons = data?.lessons || [];
//   const filtered = useMemo(
//     () =>
//       lessons.filter((l) => {
//         if (q && !`${l.title} ${l.description}`.toLowerCase().includes(q.toLowerCase())) return false;
//         if (tab === 'assigned') return l.isUnlocked;
//         if (tab === 'free') return l.videos.some((v) => v.accessType === 'free');
//         return true;
//       }),
//     [lessons, q, tab]
//   );

//   const tabs = [
//     ['all', `All classes (${lessons.length})`],
//     ...(user ? [['assigned', `Assigned (${lessons.filter((l) => l.isUnlocked).length})`]] : []),
//     ['free', 'Has free preview'],
//   ];

//   return (
//     <div className="relative">
//       <div className="hidden sm:block absolute top-0 left-0"><DotGrid rows={6} cols={5} color="#6FD4F2" gap={12} /></div>
//       <div className="hidden lg:block absolute top-0 right-0 w-[34%] h-[420px] bg-[#FBF6EF] -z-0 pointer-events-none" />
//       <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10 pt-6 pb-24">
//         <PageHeader badge="ALL CLASSES" badgeColor="coral" title="Explore every class" text="Preview free videos, then unlock the classes you want with your subscription.">
//           {user && !isAdmin && (
//             <div className="w-full md:w-[360px]">
//               <SubscriptionCard sub={data?.subscription} />
//             </div>
//           )}
//         </PageHeader>

//         <div className="mt-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
//           <div className="flex flex-wrap gap-2">
//             {tabs.map(([k, l]) => (
//               <button key={k} onClick={() => setTab(k)} className={`px-5 py-2.5 rounded-full text-[12.5px] font-bold transition-all ${tab === k ? 'bg-[#11142D] text-white shadow-md' : 'bg-[#F4F5F8] text-[#4F5265] hover:bg-[#E8EAFC]'}`}>
//                 {l}
//               </button>
//             ))}
//           </div>
//           <div className="relative w-full lg:w-[320px]">
//             <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A3B5]" />
//             <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search classes…" className={`${inputCls} pl-11 rounded-full`} />
//           </div>
//         </div>

//         <div className="mt-8">
//           {loading ? (
//             <PageLoader label="Loading classes…" />
//           ) : error ? (
//             <ErrorBox message={error} onRetry={refetch} />
//           ) : filtered.length === 0 ? (
//             <EmptyState
//               icon={BookOpen}
//               title={lessons.length ? 'No classes match' : 'No classes yet'}
//               text={lessons.length ? 'Try a different search or filter.' : 'New classes will appear here as soon as they are published.'}
//               action={tab === 'assigned' && <Button as={Link} to="/subscription">View plans</Button>}
//             />
//           ) : (
//             <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filtered.map((l, i) => (
//                 <LessonCard key={l._id} lesson={l} index={i} />
//               ))}
//             </motion.div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { DotGrid } from '../../components/Visuals.tsx';
import { PageHeader, PageLoader, EmptyState, ErrorBox, inputCls, Button } from '../../components/ui.jsx';
import { LessonCard } from '../../components/Cards.jsx';
import SubscriptionCard from '../../components/SubscriptionCard.jsx';
import { api } from '../../lib/api.js';
import { useAsync } from '../../lib/hooks.js';
import { useAuth } from '../../context/AuthContext.jsx';

const PAGE_SIZE = 6;

export default function Classes() {
  const { user, isAdmin } = useAuth();
  const { data, loading, error, refetch } = useAsync(() => api.lessons(), [user?._id]);
  const [q, setQ] = useState('');
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = previous

  const lessons = data?.lessons || [];

  const filtered = useMemo(
    () =>
      lessons.filter((l) => {
        if (q && !`${l.title} ${l.description}`.toLowerCase().includes(q.toLowerCase())) return false;
        if (tab === 'assigned') return l.isUnlocked;
        if (tab === 'free') return l.videos.some((v) => v.accessType === 'free');
        return true;
      }),
    [lessons, q, tab]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Reset to first page whenever filters change
  useEffect(() => {
    setPage(1);
  }, [q, tab]);

  // Clamp page if data shrinks
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const goToPage = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    setDirection(p > page ? 1 : -1);
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build page numbers with ellipsis: 1 … 4 5 6 … 10
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

  const tabs = [
    ['all', `All classes (${lessons.length})`],
    ...(user ? [['assigned', `Assigned (${lessons.filter((l) => l.isUnlocked).length})`]] : []),
    ['free', 'Has free preview'],
  ];

  const pageVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <div className="relative">
      <div className="hidden sm:block absolute top-0 left-0"><DotGrid rows={6} cols={5} color="#6FD4F2" gap={12} /></div>
      <div className="hidden lg:block absolute top-0 right-0 w-[34%] h-[420px] bg-[#FBF6EF] -z-0 pointer-events-none" />
      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10 pt-6 pb-24">
        <PageHeader badge="ALL CLASSES" badgeColor="coral" title="Explore every class" text="Preview free videos, then unlock the classes you want with your subscription.">
          {user && !isAdmin && (
            <div className="w-full md:w-[360px]">
              <SubscriptionCard sub={data?.subscription} />
            </div>
          )}
        </PageHeader>

        <div className="mt-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex flex-wrap gap-2">
            {tabs.map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} className={`px-5 py-2.5 rounded-full text-[12.5px] font-bold transition-all ${tab === k ? 'bg-[#11142D] text-white shadow-md' : 'bg-[#F4F5F8] text-[#4F5265] hover:bg-[#E8EAFC]'}`}>
                {l}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-[320px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A3B5]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search classes…" className={`${inputCls} pl-11 rounded-full`} />
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <PageLoader label="Loading classes…" />
          ) : error ? (
            <ErrorBox message={error} onRetry={refetch} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title={lessons.length ? 'No classes match' : 'No classes yet'}
              text={lessons.length ? 'Try a different search or filter.' : 'New classes will appear here as soon as they are published.'}
              action={tab === 'assigned' && <Button as={Link} to="/subscription">View plans</Button>}
            />
          ) : (
            <>
              <div className="overflow-hidden">
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  <motion.div
                    key={`${tab}-${q}-${page}`}
                    custom={direction}
                    variants={pageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
                  className="mt-12 flex flex-col items-center gap-3"
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
                              layoutId="active-page-pill"
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
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} classes
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
