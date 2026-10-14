// import { Link } from 'react-router-dom';
// import { Users, IndianRupee, Receipt, Repeat, BookOpenCheck, CreditCard, ArrowRight } from 'lucide-react';
// import { StatCard, AdminHead } from '../../components/admin.jsx';
// import { Avatar, ErrorBox, PageLoader, Pill, statusTone } from '../../components/ui.jsx';
// import { api } from '../../lib/api.js';
// import { fdate, money } from '../../lib/format.js';
// import { useAsync } from '../../lib/hooks.js';
// import { useAuth } from '../../context/AuthContext.jsx';
// import { paymentTitle } from '../../components/ReceiptModal.jsx';

// export default function Dashboard() {
//   const { user } = useAuth();
//   const { data, loading, error, refetch } = useAsync(async () => {
//     const [stats, lessons, subs, plans] = await Promise.all([api.adminStats(), api.adminLessons(), api.adminSubscriptions(), api.adminPlans()]);
//     return { ...stats, lessons: lessons.lessons, subs: subs.subscriptions, plans: plans.plans };
//   }, []);

//   if (loading) return <PageLoader />;
//   if (error) return <ErrorBox message={error} onRetry={refetch} />;

//   const { stats, recentPayments, recentUsers, lessons, subs, plans } = data;
//   const activeSubs = subs.filter((s) => s.state === 'active').length;
//   const maxSub = Math.max(1, ...plans.map((p) => p.subscribers));

//   const cards = [
//     [Users, 'Total users', stats.totalUsers, '#EDE9FE', '#6C5CE7'],
//     [IndianRupee, 'Total revenue', money(stats.totalRevenue), '#E6F9F0', '#10B981'],
//     [Receipt, 'Paid payments', stats.totalPayments, '#E5FAFD', '#0891B2'],
//     [Repeat, 'Active subscriptions', activeSubs, '#FFF3CE', '#D97706'],
//     [BookOpenCheck, 'Classes', lessons.length, '#FDEBE4', '#FF5E3A'],
//     [CreditCard, 'Subscription plans', plans.length, '#E6F4FF', '#3B82F6'],
//   ];

//   return (
//     <>
//       <AdminHead title={`Hello, ${user.name.split(' ')[0]} `} text="Here's what's happening on ClassStream today." />

//       <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
//         {cards.map(([icon, label, value, tint, color], i) => (
//           <StatCard key={label} icon={icon} label={label} value={value} tint={tint} color={color} i={i} />
//         ))}
//       </div>

//       <div className="grid lg:grid-cols-12 gap-6 mt-8">
//         <div className="lg:col-span-7 bg-white rounded-[24px] shadow-smart-card border border-gray-100/80 p-6">
//           <div className="flex items-center justify-between mb-5">
//             <h2 className="font-display text-[18px] font-extrabold">Recent payments</h2>
//             <Link to="/admin/payments" className="text-[12.5px] font-bold text-[#6C5CE7] inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">View all <ArrowRight size={14} /></Link>
//           </div>
//           {recentPayments.length === 0 ? (
//             <p className="text-[13px] text-[#808191] py-6 text-center">No payments yet.</p>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {recentPayments.map((p) => (
//                 <div key={p._id} className="flex items-center gap-4 py-3.5">
//                   <Avatar user={p.user} size={38} />
//                   <div className="min-w-0 flex-1">
//                     <div className="text-[13.5px] font-extrabold truncate">{p.user?.name || 'Deleted user'}</div>
//                     <div className="text-[11.5px] text-[#808191] font-semibold truncate">{paymentTitle(p)} · {fdate(p.paidAt)}</div>
//                   </div>
//                   <div className="text-[14px] font-extrabold">{money(p.amount)}</div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="lg:col-span-5 space-y-6">
//           <div className="bg-white rounded-[24px] shadow-smart-card border border-gray-100/80 p-6">
//             <h2 className="font-display text-[18px] font-extrabold mb-5">Subscribers by plan</h2>
//             {plans.length === 0 ? <p className="text-[13px] text-[#808191]">No plans yet.</p> : (
//               <div className="space-y-4">
//                 {plans.map((p, i) => (
//                   <div key={p._id}>
//                     <div className="flex justify-between text-[12.5px] font-bold mb-1.5"><span>{p.name}</span><span className="text-[#808191]">{p.subscribers}</span></div>
//                     <div className="h-2.5 rounded-full bg-[#F1F2F7] overflow-hidden">
//                       <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(p.subscribers / maxSub) * 100}%`, background: ['#7B61FF', '#48CAE4', '#FF6B4A', '#F5C344'][i % 4] }} />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="bg-white rounded-[24px] shadow-smart-card border border-gray-100/80 p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-display text-[18px] font-extrabold">New users</h2>
//               <Link to="/admin/users" className="text-[12.5px] font-bold text-[#6C5CE7]">Manage</Link>
//             </div>
//             <div className="space-y-3">
//               {recentUsers.map((u) => (
//                 <Link key={u._id} to={`/admin/users/${u._id}`} className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-[#F4F5F8] transition">
//                   <Avatar user={u} size={34} />
//                   <div className="min-w-0 flex-1">
//                     <div className="text-[13px] font-extrabold truncate">{u.name}</div>
//                     <div className="text-[11.5px] text-[#808191] truncate">{u.email}</div>
//                   </div>
//                   <Pill tone={u.role === 'admin' ? 'purple' : 'gray'}>{u.role}</Pill>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, IndianRupee, Receipt, Repeat, BookOpenCheck, CreditCard, ArrowRight } from 'lucide-react';
import { StatCard, AdminHead } from '../../components/admin.jsx';
import { Avatar, ErrorBox, PageLoader, Pill, statusTone } from '../../components/ui.jsx';
import { api } from '../../lib/api.js';
import { fdate, money } from '../../lib/format.js';
import { useAsync } from '../../lib/hooks.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { paymentTitle } from '../../components/ReceiptModal.jsx';

/* ---- Counter animation: counts from 0 up to `value` with an ease-out curve ---- */
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function CountUp({ value, duration = 1400, delay = 0, format }) {
  const target = Number(value) || 0;
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(target);
      return undefined;
    }
    let start = null;
    const timer = setTimeout(() => {
      const step = (ts) => {
        if (start === null) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        setDisplay(target * easeOutExpo(p));
        if (p < 1) raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timer);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, duration, delay]);

  const shown = Math.round(display);
  return <span className="tabular-nums">{format ? format(shown) : shown.toLocaleString('en-IN')}</span>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [barsReady, setBarsReady] = useState(false);
  const { data, loading, error, refetch } = useAsync(async () => {
    const [stats, lessons, subs, plans] = await Promise.all([api.adminStats(), api.adminLessons(), api.adminSubscriptions(), api.adminPlans()]);
    return { ...stats, lessons: lessons.lessons, subs: subs.subscriptions, plans: plans.plans };
  }, []);

  // Let the plan bars grow from 0 once data has rendered
  useEffect(() => {
    if (!data) return undefined;
    const t = setTimeout(() => setBarsReady(true), 150);
    return () => clearTimeout(t);
  }, [data]);

  if (loading) return <PageLoader />;
  if (error) return <ErrorBox message={error} onRetry={refetch} />;

  const { stats, recentPayments, recentUsers, lessons, subs, plans } = data;
  const activeSubs = subs.filter((s) => s.state === 'active').length;
  const maxSub = Math.max(1, ...plans.map((p) => p.subscribers));

  const cards = [
    [Users, 'Total users', <CountUp value={stats.totalUsers} />, '#EDE9FE', '#6C5CE7'],
    [IndianRupee, 'Total revenue', <CountUp value={stats.totalRevenue} duration={1800} format={(n) => money(n)} />, '#E6F9F0', '#10B981'],
    [Receipt, 'Paid payments', <CountUp value={stats.totalPayments} />, '#E5FAFD', '#0891B2'],
    [Repeat, 'Active subscriptions', <CountUp value={activeSubs} />, '#FFF3CE', '#D97706'],
    [BookOpenCheck, 'Classes', <CountUp value={lessons.length} />, '#FDEBE4', '#FF5E3A'],
    [CreditCard, 'Subscription plans', <CountUp value={plans.length} />, '#E6F4FF', '#3B82F6'],
  ];

  return (
    <>
      <AdminHead title={`Hello, ${user.name.split(' ')[0]} `} text="Here's what's happening on ClassStream today." />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map(([icon, label, value, tint, color], i) => (
          <StatCard key={label} icon={icon} label={label} value={value} tint={tint} color={color} i={i} />
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-6 mt-8">
        <div className="lg:col-span-7 bg-white rounded-[24px] shadow-smart-card border border-gray-100/80 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-[18px] font-extrabold">Recent payments</h2>
            <Link to="/admin/payments" className="text-[12.5px] font-bold text-[#6C5CE7] inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">View all <ArrowRight size={14} /></Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="text-[13px] text-[#808191] py-6 text-center">No payments yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentPayments.map((p, i) => (
                <div key={p._id} className="flex items-center gap-4 py-3.5">
                  <Avatar user={p.user} size={38} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-extrabold truncate">{p.user?.name || 'Deleted user'}</div>
                    <div className="text-[11.5px] text-[#808191] font-semibold truncate">{paymentTitle(p)} · {fdate(p.paidAt)}</div>
                  </div>
                  <div className="text-[14px] font-extrabold">
                    <CountUp value={p.amount} duration={1200} delay={300 + i * 90} format={(n) => money(n)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[24px] shadow-smart-card border border-gray-100/80 p-6">
            <h2 className="font-display text-[18px] font-extrabold mb-5">Subscribers by plan</h2>
            {plans.length === 0 ? <p className="text-[13px] text-[#808191]">No plans yet.</p> : (
              <div className="space-y-4">
                {plans.map((p, i) => (
                  <div key={p._id}>
                    <div className="flex justify-between text-[12.5px] font-bold mb-1.5">
                      <span>{p.name}</span>
                      <span className="text-[#808191]"><CountUp value={p.subscribers} duration={1000} delay={400 + i * 80} /></span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#F1F2F7] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: barsReady ? `${(p.subscribers / maxSub) * 100}%` : '0%',
                          transitionDelay: `${400 + i * 80}ms`,
                          background: ['#7B61FF', '#48CAE4', '#FF6B4A', '#F5C344'][i % 4],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-[24px] shadow-smart-card border border-gray-100/80 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-[18px] font-extrabold">New users</h2>
              <Link to="/admin/users" className="text-[12.5px] font-bold text-[#6C5CE7]">Manage</Link>
            </div>
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <Link key={u._id} to={`/admin/users/${u._id}`} className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-[#F4F5F8] transition">
                  <Avatar user={u} size={34} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-extrabold truncate">{u.name}</div>
                    <div className="text-[11.5px] text-[#808191] truncate">{u.email}</div>
                  </div>
                  <Pill tone={u.role === 'admin' ? 'purple' : 'gray'}>{u.role}</Pill>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
