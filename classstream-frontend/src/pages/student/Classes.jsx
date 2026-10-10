import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, BookOpen } from 'lucide-react';
import { DotGrid } from '../../components/Visuals.tsx';
import { PageHeader, PageLoader, EmptyState, ErrorBox, inputCls, Button } from '../../components/ui.jsx';
import { LessonCard } from '../../components/Cards.jsx';
import SubscriptionCard from '../../components/SubscriptionCard.jsx';
import { api } from '../../lib/api.js';
import { useAsync } from '../../lib/hooks.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Classes() {
  const { user, isAdmin } = useAuth();
  const { data, loading, error, refetch } = useAsync(() => api.lessons(), [user?._id]);
  const [q, setQ] = useState('');
  const [tab, setTab] = useState('all');

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

  const tabs = [
    ['all', `All classes (${lessons.length})`],
    ...(user ? [['assigned', `Assigned (${lessons.filter((l) => l.isUnlocked).length})`]] : []),
    ['free', 'Has free preview'],
  ];

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
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((l, i) => (
                <LessonCard key={l._id} lesson={l} index={i} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
