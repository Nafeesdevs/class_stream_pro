import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, ChevronDown, CreditCard, ShieldCheck, Info } from 'lucide-react';
import { DotGrid, Checkmark3D } from '../../components/Visuals.tsx';
import { Button, EmptyState, ErrorBox, Modal, PageHeader, PageLoader, Pill, statusTone } from '../../components/ui.jsx';
import { PlanCard } from '../../components/Cards.jsx';
import SubscriptionCard from '../../components/SubscriptionCard.jsx';
import { api } from '../../lib/api.js';
import { paySubscription } from '../../lib/razorpay.js';
import { durationLabel, fdate, money } from '../../lib/format.js';
import { useAsync } from '../../lib/hooks.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const FAQ = [
  ['How do classes get assigned to me?', 'Open a class and press play on any subscription video. The whole class is assigned to your account and uses one class from your plan. Free videos never use a class.'],
  ['What happens if I buy a plan while another is running?', 'Your new plan is queued and starts automatically the moment the current one ends — you never lose time.'],
  ['Can I get a receipt?', 'Yes. Every successful payment has a receipt in your profile under the Receipts tab, which you can print or save as a PDF.'],
  ['Which payment methods are supported?', 'Cards, UPI, net banking and wallets through Razorpay. Payments are processed securely in INR.'],
];

export default function Subscription() {
  const { user, isAdmin } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const plans = useAsync(() => api.plans(), []);
  const mine = useAsync(() => (user && !isAdmin ? api.mySubscription() : Promise.resolve(null)), [user?._id]);

  const [selected, setSelected] = useState(null);
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(null);
  const [open, setOpen] = useState(0);

  const choose = (plan) => {
    if (!user) return nav('/login', { state: { from: '/subscription' } });
    if (isAdmin) return toast.info('Administrators cannot purchase plans.');
    setSelected(plan);
  };

  const pay = async () => {
    setPaying(true);
    try {
      const res = await paySubscription(selected, user);
      setSelected(null);
      setDone(res.subscription);
      mine.reload();
    } catch (e) {
      if (e.message === 'cancelled') toast.info('Payment cancelled.');
      else toast.error(e.message);
    } finally {
      setPaying(false);
    }
  };

  const current = mine.data?.current;
  const queued = current && selected;

  return (
    <div className="relative">
      <div className="hidden sm:block absolute top-0 left-0"><DotGrid rows={6} cols={5} color="#6FD4F2" gap={12} /></div>
      <div className="hidden lg:block absolute top-0 right-0 w-[30%] h-[380px] bg-[#FBF6EF] pointer-events-none" />
      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10 pt-6 pb-24">
        <PageHeader badge="SUBSCRIPTION PLANS" badgeColor="yellow" title="Pick a plan, unlock classes" text="Choose how many classes you want and for how long. Pay securely and start learning immediately." />

        {user && !isAdmin && (
          <div className="grid lg:grid-cols-12 gap-6 mt-10">
            <div className="lg:col-span-5"><SubscriptionCard sub={current} cta={false} /></div>
            <div className="lg:col-span-7 bg-white rounded-[28px] border border-gray-100 shadow-smart-card p-6">
              <h3 className="font-display text-[17px] font-extrabold mb-4">Subscription history</h3>
              {mine.loading ? (
                <PageLoader label="" />
              ) : (mine.data?.upcoming?.length || mine.data?.history?.length) ? (
                <div className="divide-y divide-gray-100 max-h-[210px] overflow-y-auto">
                  {[...(mine.data.upcoming || []), ...(mine.data.history || [])].map((s) => (
                    <div key={s._id} className="flex items-center justify-between gap-3 py-3 text-[13px]">
                      <div className="min-w-0">
                        <div className="font-extrabold truncate">{s.planName}</div>
                        <div className="text-[11.5px] text-[#808191] font-semibold">{fdate(s.startDate)} → {fdate(s.endDate)} · {s.classesUsed}/{s.classesAllowed} classes</div>
                      </div>
                      <Pill tone={statusTone(s.state)}>{s.state}</Pill>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-[#808191]">Your past and upcoming subscriptions will appear here.</p>
              )}
              <Link to="/profile?tab=receipts" className="inline-block mt-4 text-[12.5px] font-bold text-[#6C5CE7] hover:underline">View payment receipts →</Link>
            </div>
          </div>
        )}

        <div className="mt-14">
          {plans.loading ? (
            <PageLoader label="Loading plans…" />
          ) : plans.error ? (
            <ErrorBox message={plans.error} onRetry={plans.refetch} />
          ) : plans.data.plans.length === 0 ? (
            <EmptyState icon={CreditCard} title="No plans available" text="Subscription plans haven't been published yet. Please check back soon." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 pt-4">
              {plans.data.plans.map((p, i) => (
                <PlanCard key={p._id} plan={p} index={i} onSelect={choose} disabled={isAdmin} label={user ? (current ? 'Buy / queue plan' : 'Subscribe & pay') : 'Log in to subscribe'} />
              ))}
            </div>
          )}
          <p className="flex items-center justify-center gap-2 text-[12.5px] text-[#808191] font-semibold mt-8">
            <ShieldCheck size={15} className="text-[#10B981]" /> Secure payments powered by Razorpay
          </p>
        </div>

        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="font-display text-[28px] font-extrabold text-center tracking-tight mb-8">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQ.map(([q, a], i) => (
              <div key={q} className="bg-white rounded-2xl border border-gray-100 shadow-smart-card overflow-hidden">
                <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 text-left px-6 py-5">
                  <span className="text-[14.5px] font-extrabold">{q}</span>
                  <ChevronDown size={18} className={`shrink-0 text-[#6C5CE7] transition-transform ${open === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="px-6 pb-5 text-[13.5px] text-[#808191] leading-[1.7]">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checkout summary */}
      <Modal
        open={!!selected}
        onClose={() => !paying && setSelected(null)}
        title="Confirm your plan"
        footer={
          <>
            <Button variant="soft" onClick={() => setSelected(null)} disabled={paying}>Cancel</Button>
            <Button variant="purple" onClick={pay} loading={paying}>Pay {selected && money(selected.price, selected.currency)}</Button>
          </>
        }
      >
        {selected && (
          <div>
            <div className="bg-[#F3FAFA] rounded-2xl p-5 mb-4">
              <div className="font-display text-[20px] font-extrabold">{selected.name}</div>
              <div className="text-[13px] text-[#808191] font-semibold mt-1">{selected.classLimit} classes · {durationLabel(selected.durationMonths)}</div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white">
                <span className="text-[12px] font-bold text-[#808191] uppercase tracking-wider">Total</span>
                <span className="font-display text-[26px] font-extrabold">{money(selected.price, selected.currency)}</span>
              </div>
            </div>
            {queued && (
              <div className="flex gap-3 bg-[#FFF3CE] text-[#92400E] rounded-2xl p-4 text-[12.5px] font-semibold leading-relaxed mb-4">
                <Info size={16} className="shrink-0 mt-0.5" />
                You already have an active plan, so this one will start when it ends on {fdate(current.endDate)}.
              </div>
            )}
            <p className="text-[12.5px] text-[#808191] leading-relaxed">You'll complete the payment in a secure Razorpay window. A receipt will be saved to your profile.</p>
          </div>
        )}
      </Modal>

      {/* Success */}
      <Modal open={!!done} onClose={() => setDone(null)} title="Payment successful">
        {done && (
          <div className="text-center">
            <div className="flex justify-center -mt-2 mb-2"><Checkmark3D /></div>
            <CheckCircle2 className="mx-auto text-[#10B981] mb-3" size={30} />
            <h4 className="font-display text-[22px] font-extrabold">{done.planName} is active</h4>
            <p className="text-[13.5px] text-[#808191] mt-2">
              {done.classesAllowed} classes · valid {fdate(done.startDate)} → {fdate(done.endDate)}
              {done.state === 'upcoming' && ' (starts when your current plan ends)'}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-7">
              <Button onClick={() => nav('/classes')}>Browse classes</Button>
              <Button variant="outline" onClick={() => nav('/profile?tab=receipts')}>View receipt</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
