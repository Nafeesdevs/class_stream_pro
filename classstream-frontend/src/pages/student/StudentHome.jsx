import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, CreditCard, UserCircle, Receipt } from 'lucide-react';
import { DotGrid, Rocket3D } from '../../components/Visuals.tsx';
import { PageLoader, SectionBadge, Button, ErrorBox } from '../../components/ui.jsx';
import { LessonCard } from '../../components/Cards.jsx';
import SubscriptionCard from '../../components/SubscriptionCard.jsx';
import { api } from '../../lib/api.js';
import { useAsync } from '../../lib/hooks.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function StudentHome() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useAsync(() => api.lessons(), [user._id]);
  if (loading) return <PageLoader />;
  if (error) return <div className="max-w-[1240px] mx-auto px-6 py-10"><ErrorBox message={error} onRetry={refetch} /></div>;

  const { lessons = [], subscription } = data || {};
  const assigned = lessons.filter((l) => l.isUnlocked);
  const explore = lessons.filter((l) => !l.isUnlocked);
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const quick = [
    [BookOpen, 'My classes', 'Assigned to you', '/my-classes', 'bg-[#EDE9FE]', '#6C5CE7'],
    [CreditCard, 'Subscription', 'Plans & payment', '/subscription', 'bg-[#FFF3CE]', '#D97706'],
    [Receipt, 'Receipts', 'Payment history', '/profile?tab=receipts', 'bg-[#E5FAFD]', '#0891B2'],
    [UserCircle, 'Profile', 'Your details', '/profile', 'bg-[#FDEBE4]', '#FF5E3A'],
  ];

  return (
    <div>
      <section className="relative overflow-hidden pb-16">
        <div className="hidden lg:block absolute top-0 right-0 w-[40%] h-full bg-[#FBF6EF] pointer-events-none" />
        <div className="hidden lg:block absolute -bottom-12 right-[34%] w-[240px] h-[240px] rounded-full bg-[#DCF6F9] pointer-events-none" />
        <div className="hidden sm:block absolute bottom-4 left-0"><DotGrid rows={6} cols={5} color="#6FD4F2" gap={12} /></div>
        <div className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-10 pt-6 lg:pt-10 grid lg:grid-cols-12 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }} className="lg:col-span-6">
            <SectionBadge color="coral">{greet.toUpperCase()}</SectionBadge>
            <h1 className="font-display text-[44px] sm:text-[58px] font-extrabold leading-[1.05] tracking-[-0.035em] mb-5">
              Welcome back,
              <br />
              {user.name.split(' ')[0]} 
            </h1>
            <p className="text-[15.5px] text-[#808191] leading-[1.7] max-w-[420px] mb-8">
              {assigned.length ? `You have ${assigned.length} class${assigned.length > 1 ? 'es' : ''} assigned. Jump back in whenever you're ready.` : 'Browse the library, watch a free preview and unlock your first class.'}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button as={Link} to={assigned.length ? '/my-classes' : '/classes'} size="lg">
                {assigned.length ? 'Go to my classes' : 'Browse classes'}
              </Button>
              <Link to="/subscription" className="inline-flex items-center gap-2 text-[13.5px] font-bold hover:text-[#6C5CE7] transition-colors">
                Manage plan <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="lg:col-span-6 relative max-w-[460px] lg:ml-auto w-full">
            <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }} className="hidden sm:block absolute -top-16 -right-4 z-10"><Rocket3D /></motion.div>
            <SubscriptionCard sub={subscription} />
          </motion.div>
        </div>
      </section>

      <section className="bg-[#F3FAFA] py-14">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {quick.map(([Icon, t, d, to, bg, c], i) => (
            <motion.div key={t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ y: -6 }}>
              <Link to={to} className="block bg-white rounded-[22px] p-5 sm:p-6 shadow-smart-card border border-gray-100/80">
                <div className={`w-11 h-11 rounded-2xl ${bg} flex items-center justify-center mb-4`}><Icon size={20} color={c} /></div>
                <div className="font-display text-[16px] font-extrabold">{t}</div>
                <div className="text-[12px] text-[#808191] font-semibold">{d}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {assigned.length > 0 && (
        <section className="py-20">
          <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
            <div className="flex items-end justify-between mb-10">
              <div>
                <SectionBadge color="purple">ASSIGNED TO YOU</SectionBadge>
                <h2 className="font-display text-[32px] sm:text-[38px] font-extrabold tracking-[-0.025em] leading-tight">Continue learning</h2>
              </div>
              <Link to="/my-classes" className="hidden sm:inline-flex items-center gap-2 text-[13.5px] font-bold hover:text-[#6C5CE7]">View all <ArrowRight size={16} /></Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {assigned.slice(0, 3).map((l, i) => <LessonCard key={l._id} lesson={l} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {explore.length > 0 && (
        <section className={`${assigned.length ? 'bg-[#E8EAFC]' : ''} py-20`}>
          <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
            <div className="flex items-end justify-between mb-10">
              <div>
                <SectionBadge color="cyan">DISCOVER</SectionBadge>
                <h2 className="font-display text-[32px] sm:text-[38px] font-extrabold tracking-[-0.025em] leading-tight">More classes to unlock</h2>
              </div>
              <Link to="/classes" className="hidden sm:inline-flex items-center gap-2 text-[13.5px] font-bold hover:text-[#6C5CE7]">All classes <ArrowRight size={16} /></Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {explore.slice(0, 3).map((l, i) => <LessonCard key={l._id} lesson={l} index={i + 2} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
