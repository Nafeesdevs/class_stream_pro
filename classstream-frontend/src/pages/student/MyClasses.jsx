import { Link } from 'react-router-dom';
import { Unlock, Compass } from 'lucide-react';
import { DotGrid } from '../../components/Visuals.tsx';
import { PageHeader, PageLoader, EmptyState, ErrorBox, Button, Pill, statusTone } from '../../components/ui.jsx';
import { LessonCard } from '../../components/Cards.jsx';
import SubscriptionCard from '../../components/SubscriptionCard.jsx';
import { api } from '../../lib/api.js';
import { fdate } from '../../lib/format.js';
import { useAsync } from '../../lib/hooks.js';

/** "Assigned classes" — only the classes unlocked by the student's current subscription. */
export default function MyClasses() {
  const { data, loading, error, refetch } = useAsync(async () => {
    const [l, s] = await Promise.all([api.lessons(), api.mySubscription()]);
    return { lessons: l.lessons, current: s.current, upcoming: s.upcoming };
  }, []);

  if (loading) return <PageLoader label="Loading your classes…" />;
  if (error) return <div className="max-w-[1240px] mx-auto px-6 py-10"><ErrorBox message={error} onRetry={refetch} /></div>;

  const assigned = data.lessons.filter((l) => l.isUnlocked);

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
              <div className="grid sm:grid-cols-2 gap-6">
                {assigned.map((l, i) => (
                  <LessonCard key={l._id} lesson={l} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
