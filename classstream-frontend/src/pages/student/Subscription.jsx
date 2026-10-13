// // import { useState } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { AnimatePresence, motion } from 'motion/react';
// // import { CheckCircle2, ChevronDown, CreditCard, ShieldCheck, Info } from 'lucide-react';
// // import { DotGrid, Checkmark3D } from '../../components/Visuals.tsx';
// // import { Button, EmptyState, ErrorBox, Modal, PageHeader, PageLoader, Pill, statusTone } from '../../components/ui.jsx';
// // import { PlanCard } from '../../components/Cards.jsx';
// // import SubscriptionCard from '../../components/SubscriptionCard.jsx';
// // import { api } from '../../lib/api.js';
// // import { paySubscription } from '../../lib/razorpay.js';
// // import { durationLabel, fdate, money } from '../../lib/format.js';
// // import { useAsync } from '../../lib/hooks.js';
// // import { useAuth } from '../../context/AuthContext.jsx';
// // import { useToast } from '../../context/ToastContext.jsx';

// // const FAQ = [
// //   ['How do classes get assigned to me?', 'Open a class and press play on any subscription video. The whole class is assigned to your account and uses one class from your plan. Free videos never use a class.'],
// //   ['What happens if I buy a plan while another is running?', 'Your new plan is queued and starts automatically the moment the current one ends — you never lose time.'],
// //   ['Can I get a receipt?', 'Yes. Every successful payment has a receipt in your profile under the Receipts tab, which you can print or save as a PDF.'],
// //   ['Which payment methods are supported?', 'Cards, UPI, net banking and wallets through Razorpay. Payments are processed securely in INR.'],
// // ];

// // export default function Subscription() {
// //   const { user, isAdmin } = useAuth();
// //   const toast = useToast();
// //   const nav = useNavigate();
// //   const plans = useAsync(() => api.plans(), []);
// //   const mine = useAsync(() => (user && !isAdmin ? api.mySubscription() : Promise.resolve(null)), [user?._id]);

// //   const [selected, setSelected] = useState(null);
// //   const [paying, setPaying] = useState(false);
// //   const [done, setDone] = useState(null);
// //   const [open, setOpen] = useState(0);

// //   const choose = (plan) => {
// //     if (!user) return nav('/login', { state: { from: '/subscription' } });
// //     if (isAdmin) return toast.info('Administrators cannot purchase plans.');
// //     setSelected(plan);
// //   };

// //   const pay = async () => {
// //     setPaying(true);
// //     try {
// //       const res = await paySubscription(selected, user);
// //       setSelected(null);
// //       setDone(res.subscription);
// //       mine.reload();
// //     } catch (e) {
// //       if (e.message === 'cancelled') toast.info('Payment cancelled.');
// //       else toast.error(e.message);
// //     } finally {
// //       setPaying(false);
// //     }
// //   };

// //   const current = mine.data?.current;
// //   const queued = current && selected;

// //   return (
// //     <div className="relative">
// //       <div className="hidden sm:block absolute top-0 left-0"><DotGrid rows={6} cols={5} color="#6FD4F2" gap={12} /></div>
// //       <div className="hidden lg:block absolute top-0 right-0 w-[30%] h-[380px] bg-[#FBF6EF] pointer-events-none" />
// //       <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10 pt-6 pb-24">
// //         <PageHeader badge="SUBSCRIPTION PLANS" badgeColor="yellow" title="Pick a plan, unlock classes" text="Choose how many classes you want and for how long. Pay securely and start learning immediately." />

// //         {user && !isAdmin && (
// //           <div className="grid lg:grid-cols-12 gap-6 mt-10">
// //             <div className="lg:col-span-5"><SubscriptionCard sub={current} cta={false} /></div>
// //             <div className="lg:col-span-7 bg-white rounded-[28px] border border-gray-100 shadow-smart-card p-6">
// //               <h3 className="font-display text-[17px] font-extrabold mb-4">Subscription history</h3>
// //               {mine.loading ? (
// //                 <PageLoader label="" />
// //               ) : (mine.data?.upcoming?.length || mine.data?.history?.length) ? (
// //                 <div className="divide-y divide-gray-100 max-h-[210px] overflow-y-auto">
// //                   {[...(mine.data.upcoming || []), ...(mine.data.history || [])].map((s) => (
// //                     <div key={s._id} className="flex items-center justify-between gap-3 py-3 text-[13px]">
// //                       <div className="min-w-0">
// //                         <div className="font-extrabold truncate">{s.planName}</div>
// //                         <div className="text-[11.5px] text-[#808191] font-semibold">{fdate(s.startDate)} → {fdate(s.endDate)} · {s.classesUsed}/{s.classesAllowed} classes</div>
// //                       </div>
// //                       <Pill tone={statusTone(s.state)}>{s.state}</Pill>
// //                     </div>
// //                   ))}
// //                 </div>
// //               ) : (
// //                 <p className="text-[13px] text-[#808191]">Your past and upcoming subscriptions will appear here.</p>
// //               )}
// //               <Link to="/profile?tab=receipts" className="inline-block mt-4 text-[12.5px] font-bold text-[#6C5CE7] hover:underline">View payment receipts →</Link>
// //             </div>
// //           </div>
// //         )}

// //         <div className="mt-14">
// //           {plans.loading ? (
// //             <PageLoader label="Loading plans…" />
// //           ) : plans.error ? (
// //             <ErrorBox message={plans.error} onRetry={plans.refetch} />
// //           ) : plans.data.plans.length === 0 ? (
// //             <EmptyState icon={CreditCard} title="No plans available" text="Subscription plans haven't been published yet. Please check back soon." />
// //           ) : (
// //             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 pt-4">
// //               {plans.data.plans.map((p, i) => (
// //                 <PlanCard key={p._id} plan={p} index={i} onSelect={choose} disabled={isAdmin} label={user ? (current ? 'Buy / queue plan' : 'Subscribe & pay') : 'Log in to subscribe'} />
// //               ))}
// //             </div>
// //           )}
// //           <p className="flex items-center justify-center gap-2 text-[12.5px] text-[#808191] font-semibold mt-8">
// //             <ShieldCheck size={15} className="text-[#10B981]" /> Secure payments powered by Razorpay
// //           </p>
// //         </div>

// //         <div className="mt-24 max-w-3xl mx-auto">
// //           <h2 className="font-display text-[28px] font-extrabold text-center tracking-tight mb-8">Frequently asked questions</h2>
// //           <div className="space-y-3">
// //             {FAQ.map(([q, a], i) => (
// //               <div key={q} className="bg-white rounded-2xl border border-gray-100 shadow-smart-card overflow-hidden">
// //                 <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 text-left px-6 py-5">
// //                   <span className="text-[14.5px] font-extrabold">{q}</span>
// //                   <ChevronDown size={18} className={`shrink-0 text-[#6C5CE7] transition-transform ${open === i ? 'rotate-180' : ''}`} />
// //                 </button>
// //                 <AnimatePresence initial={false}>
// //                   {open === i && (
// //                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
// //                       <p className="px-6 pb-5 text-[13.5px] text-[#808191] leading-[1.7]">{a}</p>
// //                     </motion.div>
// //                   )}
// //                 </AnimatePresence>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Checkout summary */}
// //       <Modal
// //         open={!!selected}
// //         onClose={() => !paying && setSelected(null)}
// //         title="Confirm your plan"
// //         footer={
// //           <>
// //             <Button variant="soft" onClick={() => setSelected(null)} disabled={paying}>Cancel</Button>
// //             <Button variant="purple" onClick={pay} loading={paying}>Pay {selected && money(selected.price, selected.currency)}</Button>
// //           </>
// //         }
// //       >
// //         {selected && (
// //           <div>
// //             <div className="bg-[#F3FAFA] rounded-2xl p-5 mb-4">
// //               <div className="font-display text-[20px] font-extrabold">{selected.name}</div>
// //               <div className="text-[13px] text-[#808191] font-semibold mt-1">{selected.classLimit} classes · {durationLabel(selected.durationMonths)}</div>
// //               <div className="flex items-center justify-between mt-4 pt-4 border-t border-white">
// //                 <span className="text-[12px] font-bold text-[#808191] uppercase tracking-wider">Total</span>
// //                 <span className="font-display text-[26px] font-extrabold">{money(selected.price, selected.currency)}</span>
// //               </div>
// //             </div>
// //             {queued && (
// //               <div className="flex gap-3 bg-[#FFF3CE] text-[#92400E] rounded-2xl p-4 text-[12.5px] font-semibold leading-relaxed mb-4">
// //                 <Info size={16} className="shrink-0 mt-0.5" />
// //                 You already have an active plan, so this one will start when it ends on {fdate(current.endDate)}.
// //               </div>
// //             )}
// //             <p className="text-[12.5px] text-[#808191] leading-relaxed">You'll complete the payment in a secure Razorpay window. A receipt will be saved to your profile.</p>
// //           </div>
// //         )}
// //       </Modal>

// //       {/* Success */}
// //       <Modal open={!!done} onClose={() => setDone(null)} title="Payment successful">
// //         {done && (
// //           <div className="text-center">
// //             <div className="flex justify-center -mt-2 mb-2"><Checkmark3D /></div>
// //             <CheckCircle2 className="mx-auto text-[#10B981] mb-3" size={30} />
// //             <h4 className="font-display text-[22px] font-extrabold">{done.planName} is active</h4>
// //             <p className="text-[13.5px] text-[#808191] mt-2">
// //               {done.classesAllowed} classes · valid {fdate(done.startDate)} → {fdate(done.endDate)}
// //               {done.state === 'upcoming' && ' (starts when your current plan ends)'}
// //             </p>
// //             <div className="flex flex-wrap justify-center gap-3 mt-7">
// //               <Button onClick={() => nav('/classes')}>Browse classes</Button>
// //               <Button variant="outline" onClick={() => nav('/profile?tab=receipts')}>View receipt</Button>
// //             </div>
// //           </div>
// //         )}
// //       </Modal>
// //     </div>
// //   );
// // }


// // import { useState } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { AnimatePresence, motion } from 'motion/react';
// // import {
// //   CheckCircle2,
// //   ChevronDown,
// //   CreditCard,
// //   ShieldCheck,
// //   Info,
// //   Zap,
// //   Receipt,
// //   Headphones,
// //   Sparkles,
// //   Mail,
// // } from 'lucide-react';
// // import { DotGrid, Checkmark3D } from '../../components/Visuals.tsx';
// // import { Button, EmptyState, ErrorBox, Modal, PageHeader, PageLoader, Pill, statusTone } from '../../components/ui.jsx';
// // import { PlanCard } from '../../components/Cards.jsx';
// // import SubscriptionCard from '../../components/SubscriptionCard.jsx';
// // import { api } from '../../lib/api.js';
// // import { paySubscription } from '../../lib/razorpay.js';
// // import { durationLabel, fdate, money } from '../../lib/format.js';
// // import { useAsync } from '../../lib/hooks.js';
// // import { useAuth } from '../../context/AuthContext.jsx';
// // import { useToast } from '../../context/ToastContext.jsx';

// // const FAQ = [
// //   ['How do classes get assigned to me?', 'Open a class and press play on any subscription video. The whole class is assigned to your account and uses one class from your plan. Free videos never use a class.'],
// //   ['What happens if I buy a plan while another is running?', 'Your new plan is queued and starts automatically the moment the current one ends — you never lose time.'],
// //   ['Can I get a receipt?', 'Yes. Every successful payment has a receipt in your profile under the Receipts tab, which you can print or save as a PDF.'],
// //   ['Which payment methods are supported?', 'Cards, UPI, net banking and wallets through Razorpay. Payments are processed securely in INR.'],
// // ];

// // const PERKS = [
// //   { icon: Zap, title: 'Instant activation', text: 'Your plan starts the moment payment succeeds.', bg: '#FFF3CE', fg: '#92400E' },
// //   { icon: Receipt, title: 'Receipts saved', text: 'Download or print every receipt from your profile.', bg: '#E6F8FD', fg: '#0E7490' },
// //   { icon: ShieldCheck, title: 'Secure checkout', text: 'Cards, UPI and wallets via Razorpay.', bg: '#DCFCE7', fg: '#047857' },
// // ];

// // function FaqSide() {
// //   return (
// //     <div className="lg:sticky lg:top-24 space-y-5">
// //       {/* Help card */}
// //       <motion.div
// //         initial={{ opacity: 0, y: 30 }}
// //         whileInView={{ opacity: 1, y: 0 }}
// //         viewport={{ once: true }}
// //         transition={{ duration: 0.6 }}
// //         className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#6C5CE7] to-[#8E7DFF] text-white p-8 shadow-smart-card"
// //       >
// //         {/* animated blobs */}
// //         <motion.div
// //           className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10"
// //           animate={{ scale: [1, 1.2, 1] }}
// //           transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
// //         />
// //         <motion.div
// //           className="absolute -bottom-12 -left-8 w-36 h-36 rounded-full bg-[#6FD4F2]/25"
// //           animate={{ scale: [1.15, 1, 1.15] }}
// //           transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
// //         />

// //         {/* floating icon */}
// //         <motion.div
// //           className="relative w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-5"
// //           animate={{ y: [0, -8, 0], rotate: [0, 4, -4, 0] }}
// //           transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
// //         >
// //           <Headphones size={26} />
// //         </motion.div>

// //         <h3 className="relative font-display text-[24px] font-extrabold leading-tight">Still have questions?</h3>
// //         <p className="relative text-[13.5px] text-white/80 mt-2 leading-relaxed">
// //           Our team is happy to help you pick the right plan for the way you learn.
// //         </p>
// //         <a
// //           href="mailto:support@classstream.com"
// //           className="relative inline-flex items-center gap-2 mt-6 bg-white text-[#6C5CE7] font-bold text-[13px] px-5 py-3 rounded-full hover:scale-105 transition-transform"
// //         >
// //           <Mail size={15} /> Contact support
// //         </a>

// //         {/* floating sparkle chip */}
// //         <motion.div
// //           className="absolute top-6 right-6 flex items-center gap-1.5 bg-[#FFF3CE] text-[#92400E] text-[11px] font-extrabold px-3 py-1.5 rounded-full"
// //           animate={{ y: [0, -6, 0] }}
// //           transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
// //         >
// //           <Sparkles size={12} /> 24h reply
// //         </motion.div>
// //       </motion.div>

// //       {/* Perks */}
// //       <div className="space-y-3">
// //         {PERKS.map(({ icon: Icon, title, text, bg, fg }, i) => (
// //           <motion.div
// //             key={title}
// //             initial={{ opacity: 0, x: 40 }}
// //             whileInView={{ opacity: 1, x: 0 }}
// //             viewport={{ once: true }}
// //             transition={{ delay: 0.15 * i, duration: 0.5 }}
// //             whileHover={{ y: -4 }}
// //             className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-smart-card p-4"
// //           >
// //             <motion.div
// //               className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
// //               style={{ background: bg, color: fg }}
// //               animate={{ scale: [1, 1.08, 1] }}
// //               transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
// //             >
// //               <Icon size={20} />
// //             </motion.div>
// //             <div>
// //               <div className="text-[14px] font-extrabold">{title}</div>
// //               <div className="text-[12.5px] text-[#808191] font-semibold leading-snug">{text}</div>
// //             </div>
// //           </motion.div>
// //         ))}
// //       </div>

// //       <div className="hidden lg:flex justify-end">
// //         <DotGrid rows={4} cols={6} color="#6FD4F2" gap={12} />
// //       </div>
// //     </div>
// //   );
// // }

// // export default function Subscription() {
// //   const { user, isAdmin } = useAuth();
// //   const toast = useToast();
// //   const nav = useNavigate();
// //   const plans = useAsync(() => api.plans(), []);
// //   const mine = useAsync(() => (user && !isAdmin ? api.mySubscription() : Promise.resolve(null)), [user?._id]);

// //   const [selected, setSelected] = useState(null);
// //   const [paying, setPaying] = useState(false);
// //   const [done, setDone] = useState(null);
// //   const [open, setOpen] = useState(0);

// //   const choose = (plan) => {
// //     if (!user) return nav('/login', { state: { from: '/subscription' } });
// //     if (isAdmin) return toast.info('Administrators cannot purchase plans.');
// //     setSelected(plan);
// //   };

// //   const pay = async () => {
// //     setPaying(true);
// //     try {
// //       const res = await paySubscription(selected, user);
// //       setSelected(null);
// //       setDone(res.subscription);
// //       mine.reload();
// //     } catch (e) {
// //       if (e.message === 'cancelled') toast.info('Payment cancelled.');
// //       else toast.error(e.message);
// //     } finally {
// //       setPaying(false);
// //     }
// //   };

// //   const current = mine.data?.current;
// //   const queued = current && selected;

// //   return (
// //     <div className="relative">
// //       <div className="hidden sm:block absolute top-0 left-0"><DotGrid rows={6} cols={5} color="#6FD4F2" gap={12} /></div>
// //       <div className="hidden lg:block absolute top-0 right-0 w-[30%] h-[380px] bg-[#FBF6EF] pointer-events-none" />
// //       <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10 pt-6 pb-24">
// //         <PageHeader badge="SUBSCRIPTION PLANS" badgeColor="yellow" title="Pick a plan, unlock classes" text="Choose how many classes you want and for how long. Pay securely and start learning immediately." />

// //         {user && !isAdmin && (
// //           <div className="grid lg:grid-cols-12 gap-6 mt-10">
// //             <div className="lg:col-span-5"><SubscriptionCard sub={current} cta={false} /></div>
// //             <div className="lg:col-span-7 bg-white rounded-[28px] border border-gray-100 shadow-smart-card p-6">
// //               <h3 className="font-display text-[17px] font-extrabold mb-4">Subscription history</h3>
// //               {mine.loading ? (
// //                 <PageLoader label="" />
// //               ) : (mine.data?.upcoming?.length || mine.data?.history?.length) ? (
// //                 <div className="divide-y divide-gray-100 max-h-[210px] overflow-y-auto">
// //                   {[...(mine.data.upcoming || []), ...(mine.data.history || [])].map((s) => (
// //                     <div key={s._id} className="flex items-center justify-between gap-3 py-3 text-[13px]">
// //                       <div className="min-w-0">
// //                         <div className="font-extrabold truncate">{s.planName}</div>
// //                         <div className="text-[11.5px] text-[#808191] font-semibold">{fdate(s.startDate)} → {fdate(s.endDate)} · {s.classesUsed}/{s.classesAllowed} classes</div>
// //                       </div>
// //                       <Pill tone={statusTone(s.state)}>{s.state}</Pill>
// //                     </div>
// //                   ))}
// //                 </div>
// //               ) : (
// //                 <p className="text-[13px] text-[#808191]">Your past and upcoming subscriptions will appear here.</p>
// //               )}
// //               <Link to="/profile?tab=receipts" className="inline-block mt-4 text-[12.5px] font-bold text-[#6C5CE7] hover:underline">View payment receipts →</Link>
// //             </div>
// //           </div>
// //         )}

// //         <div className="mt-14">
// //           {plans.loading ? (
// //             <PageLoader label="Loading plans…" />
// //           ) : plans.error ? (
// //             <ErrorBox message={plans.error} onRetry={plans.refetch} />
// //           ) : plans.data.plans.length === 0 ? (
// //             <EmptyState icon={CreditCard} title="No plans available" text="Subscription plans haven't been published yet. Please check back soon." />
// //           ) : (
// //             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 pt-4">
// //               {plans.data.plans.map((p, i) => (
// //                 <PlanCard key={p._id} plan={p} index={i} onSelect={choose} disabled={isAdmin} label={user ? (current ? 'Buy / queue plan' : 'Subscribe & pay') : 'Log in to subscribe'} />
// //               ))}
// //             </div>
// //           )}
// //           <p className="flex items-center justify-center gap-2 text-[12.5px] text-[#808191] font-semibold mt-8">
// //             <ShieldCheck size={15} className="text-[#10B981]" /> Secure payments powered by Razorpay
// //           </p>
// //         </div>

// //         {/* FAQ (left) + support panel (right) */}
// //         <div className="mt-24 grid lg:grid-cols-12 gap-10 items-start">
// //           <div className="lg:col-span-7">
// //             <h2 className="font-display text-[28px] font-extrabold tracking-tight mb-8">Frequently asked questions</h2>
// //             <div className="space-y-3">
// //               {FAQ.map(([q, a], i) => (
// //                 <motion.div
// //                   key={q}
// //                   initial={{ opacity: 0, y: 20 }}
// //                   whileInView={{ opacity: 1, y: 0 }}
// //                   viewport={{ once: true }}
// //                   transition={{ delay: i * 0.08 }}
// //                   className="bg-white rounded-2xl border border-gray-100 shadow-smart-card overflow-hidden"
// //                 >
// //                   <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 text-left px-6 py-5">
// //                     <span className="text-[14.5px] font-extrabold">{q}</span>
// //                     <ChevronDown size={18} className={`shrink-0 text-[#6C5CE7] transition-transform ${open === i ? 'rotate-180' : ''}`} />
// //                   </button>
// //                   <AnimatePresence initial={false}>
// //                     {open === i && (
// //                       <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
// //                         <p className="px-6 pb-5 text-[13.5px] text-[#808191] leading-[1.7]">{a}</p>
// //                       </motion.div>
// //                     )}
// //                   </AnimatePresence>
// //                 </motion.div>
// //               ))}
// //             </div>
// //           </div>

// //           <div className="lg:col-span-5">
// //             <FaqSide />
// //           </div>
// //         </div>
// //       </div>

// //       {/* Checkout summary */}
// //       <Modal
// //         open={!!selected}
// //         onClose={() => !paying && setSelected(null)}
// //         title="Confirm your plan"
// //         footer={
// //           <>
// //             <Button variant="soft" onClick={() => setSelected(null)} disabled={paying}>Cancel</Button>
// //             <Button variant="purple" onClick={pay} loading={paying}>Pay {selected && money(selected.price, selected.currency)}</Button>
// //           </>
// //         }
// //       >
// //         {selected && (
// //           <div>
// //             <div className="bg-[#F3FAFA] rounded-2xl p-5 mb-4">
// //               <div className="font-display text-[20px] font-extrabold">{selected.name}</div>
// //               <div className="text-[13px] text-[#808191] font-semibold mt-1">{selected.classLimit} classes · {durationLabel(selected.durationMonths)}</div>
// //               <div className="flex items-center justify-between mt-4 pt-4 border-t border-white">
// //                 <span className="text-[12px] font-bold text-[#808191] uppercase tracking-wider">Total</span>
// //                 <span className="font-display text-[26px] font-extrabold">{money(selected.price, selected.currency)}</span>
// //               </div>
// //             </div>
// //             {queued && (
// //               <div className="flex gap-3 bg-[#FFF3CE] text-[#92400E] rounded-2xl p-4 text-[12.5px] font-semibold leading-relaxed mb-4">
// //                 <Info size={16} className="shrink-0 mt-0.5" />
// //                 You already have an active plan, so this one will start when it ends on {fdate(current.endDate)}.
// //               </div>
// //             )}
// //             <p className="text-[12.5px] text-[#808191] leading-relaxed">You'll complete the payment in a secure Razorpay window. A receipt will be saved to your profile.</p>
// //           </div>
// //         )}
// //       </Modal>

// //       {/* Success */}
// //       <Modal open={!!done} onClose={() => setDone(null)} title="Payment successful">
// //         {done && (
// //           <div className="text-center">
// //             <div className="flex justify-center -mt-2 mb-2"><Checkmark3D /></div>
// //             <CheckCircle2 className="mx-auto text-[#10B981] mb-3" size={30} />
// //             <h4 className="font-display text-[22px] font-extrabold">{done.planName} is active</h4>
// //             <p className="text-[13.5px] text-[#808191] mt-2">
// //               {done.classesAllowed} classes · valid {fdate(done.startDate)} → {fdate(done.endDate)}
// //               {done.state === 'upcoming' && ' (starts when your current plan ends)'}
// //             </p>
// //             <div className="flex flex-wrap justify-center gap-3 mt-7">
// //               <Button onClick={() => nav('/classes')}>Browse classes</Button>
// //               <Button variant="outline" onClick={() => nav('/profile?tab=receipts')}>View receipt</Button>
// //             </div>
// //           </div>
// //         )}
// //       </Modal>
// //     </div>
// //   );
// // }


// import { useCallback, useEffect, useRef, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AnimatePresence, motion } from 'motion/react';
// import {
//   CheckCircle2,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   CreditCard,
//   ShieldCheck,
//   Info,
//   Zap,
//   Receipt,
//   Headphones,
//   Sparkles,
//   Mail,
// } from 'lucide-react';
// import { DotGrid, Checkmark3D } from '../../components/Visuals.tsx';
// import { Button, EmptyState, ErrorBox, Modal, PageHeader, PageLoader, Pill, statusTone } from '../../components/ui.jsx';
// import { PlanCard } from '../../components/Cards.jsx';
// import SubscriptionCard from '../../components/SubscriptionCard.jsx';
// import { api } from '../../lib/api.js';
// import { paySubscription } from '../../lib/razorpay.js';
// import { durationLabel, fdate, money } from '../../lib/format.js';
// import { useAsync } from '../../lib/hooks.js';
// import { useAuth } from '../../context/AuthContext.jsx';
// import { useToast } from '../../context/ToastContext.jsx';

// const FAQ = [
//   ['How do classes get assigned to me?', 'Open a class and press play on any subscription video. The whole class is assigned to your account and uses one class from your plan. Free videos never use a class.'],
//   ['What happens if I buy a plan while another is running?', 'Your new plan is queued and starts automatically the moment the current one ends — you never lose time.'],
//   ['Can I get a receipt?', 'Yes. Every successful payment has a receipt in your profile under the Receipts tab, which you can print or save as a PDF.'],
//   ['Which payment methods are supported?', 'Cards, UPI, net banking and wallets through Razorpay. Payments are processed securely in INR.'],
// ];

// const PERKS = [
//   { icon: Zap, title: 'Instant activation', text: 'Your plan starts the moment payment succeeds.', bg: '#FFF3CE', fg: '#92400E' },
//   { icon: Receipt, title: 'Receipts saved', text: 'Download or print every receipt from your profile.', bg: '#E6F8FD', fg: '#0E7490' },
//   { icon: ShieldCheck, title: 'Secure checkout', text: 'Cards, UPI and wallets via Razorpay.', bg: '#DCFCE7', fg: '#047857' },
// ];

// const GAP = 28; // matches gap-7 in the slider

// /* ---------- Plans slider ---------- */
// function PlansSlider({ plans, onSelect, disabled, label }) {
//   const trackRef = useRef(null);
//   const [canPrev, setCanPrev] = useState(false);
//   const [canNext, setCanNext] = useState(false);
//   const [page, setPage] = useState(0);
//   const [pages, setPages] = useState(1);

//   const getStep = () => {
//     const el = trackRef.current;
//     const first = el?.firstElementChild;
//     return first ? first.offsetWidth + GAP : 0;
//   };

//   const update = useCallback(() => {
//     const el = trackRef.current;
//     if (!el) return;
//     const step = getStep() || 1;
//     const max = el.scrollWidth - el.clientWidth;
//     setCanPrev(el.scrollLeft > 4);
//     setCanNext(el.scrollLeft < max - 4);
//     setPages(Math.max(1, Math.round(max / step) + 1));
//     setPage(Math.min(Math.round(el.scrollLeft / step), Math.max(0, Math.round(max / step))));
//   }, []);

//   useEffect(() => {
//     update();
//     const el = trackRef.current;
//     if (!el) return;
//     el.addEventListener('scroll', update, { passive: true });
//     window.addEventListener('resize', update);
//     return () => {
//       el.removeEventListener('scroll', update);
//       window.removeEventListener('resize', update);
//     };
//   }, [update, plans.length]);

//   const slide = (dir) => trackRef.current?.scrollBy({ left: dir * getStep(), behavior: 'smooth' });
//   const goTo = (i) => trackRef.current?.scrollTo({ left: i * getStep(), behavior: 'smooth' });

//   const arrowCls = (enabled) =>
//     `w-11 h-11 rounded-full flex items-center justify-center border transition-colors ${
//       enabled
//         ? 'bg-[#11142D] text-white border-[#11142D] hover:bg-[#6C5CE7] hover:border-[#6C5CE7] shadow-smart-card'
//         : 'bg-white text-[#C4C6D3] border-gray-200 cursor-not-allowed'
//     }`;

//   return (
//     <div>
//       {/* Header with arrows */}
//       <div className="flex items-center justify-between mb-2">
//         <div className="text-[13px] font-bold text-[#808191]">
//           {plans.length} plans available · swipe or use the arrows
//         </div>
//         <div className="flex items-center gap-3">
//           <motion.button
//             type="button"
//             aria-label="Previous plans"
//             disabled={!canPrev}
//             onClick={() => slide(-1)}
//             whileHover={canPrev ? { scale: 1.1 } : undefined}
//             whileTap={canPrev ? { scale: 0.92 } : undefined}
//             className={arrowCls(canPrev)}
//           >
//             <ChevronLeft size={20} />
//           </motion.button>
//           <motion.button
//             type="button"
//             aria-label="Next plans"
//             disabled={!canNext}
//             onClick={() => slide(1)}
//             whileHover={canNext ? { scale: 1.1 } : undefined}
//             whileTap={canNext ? { scale: 0.92 } : undefined}
//             className={arrowCls(canNext)}
//           >
//             <ChevronRight size={20} />
//           </motion.button>
//         </div>
//       </div>

//       {/* Track */}
//       <div
//         ref={trackRef}
//         className="flex gap-7 overflow-x-auto snap-x snap-mandatory scroll-smooth pt-8 pb-10 px-3 -mx-3 scroll-pl-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
//       >
//         {plans.map((p, i) => (
//           <motion.div
//             key={p._id}
//             initial={{ opacity: 0, y: 40, scale: 0.96 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
//             whileHover={{ y: -8 }}
//             className="snap-start shrink-0 w-[85%] sm:w-[calc((100%-28px)/2)] lg:w-[calc((100%-56px)/3)]"
//           >
//             <PlanCard plan={p} index={i} onSelect={onSelect} disabled={disabled} label={label} />
//           </motion.div>
//         ))}
//       </div>

//       {/* Dots */}
//       {pages > 1 && (
//         <div className="flex items-center justify-center gap-2 -mt-3">
//           {Array.from({ length: pages }).map((_, i) => (
//             <motion.button
//               key={i}
//               type="button"
//               aria-label={`Go to slide ${i + 1}`}
//               onClick={() => goTo(i)}
//               animate={{ width: page === i ? 26 : 8, backgroundColor: page === i ? '#6C5CE7' : '#D9DBE6' }}
//               transition={{ type: 'spring', stiffness: 400, damping: 30 }}
//               className="h-2 rounded-full"
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ---------- FAQ side panel ---------- */
// function FaqSide() {
//   return (
//     <div className="lg:sticky lg:top-24 space-y-5">
//       {/* Help card */}
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.6 }}
//         className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#6C5CE7] to-[#8E7DFF] text-white p-8 shadow-smart-card"
//       >
//         <motion.div
//           className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10"
//           animate={{ scale: [1, 1.2, 1] }}
//           transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
//         />
//         <motion.div
//           className="absolute -bottom-12 -left-8 w-36 h-36 rounded-full bg-[#6FD4F2]/25"
//           animate={{ scale: [1.15, 1, 1.15] }}
//           transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
//         />

//         <motion.div
//           className="relative w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-5"
//           animate={{ y: [0, -8, 0], rotate: [0, 4, -4, 0] }}
//           transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
//         >
//           <Headphones size={26} />
//         </motion.div>

//         <h3 className="relative font-display text-[24px] font-extrabold leading-tight">Still have questions?</h3>
//         <p className="relative text-[13.5px] text-white/80 mt-2 leading-relaxed">
//           Our team is happy to help you pick the right plan for the way you learn.
//         </p>
//         <a
//           href="mailto:support@classstream.com"
//           className="relative inline-flex items-center gap-2 mt-6 bg-white text-[#6C5CE7] font-bold text-[13px] px-5 py-3 rounded-full hover:scale-105 transition-transform"
//         >
//           <Mail size={15} /> Contact support
//         </a>

//         <motion.div
//           className="absolute top-6 right-6 flex items-center gap-1.5 bg-[#FFF3CE] text-[#92400E] text-[11px] font-extrabold px-3 py-1.5 rounded-full"
//           animate={{ y: [0, -6, 0] }}
//           transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
//         >
//           <Sparkles size={12} /> 24h reply
//         </motion.div>
//       </motion.div>

//       {/* Perks */}
//       <div className="space-y-3">
//         {PERKS.map(({ icon: Icon, title, text, bg, fg }, i) => (
//           <motion.div
//             key={title}
//             initial={{ opacity: 0, x: 40 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.15 * i, duration: 0.5 }}
//             whileHover={{ y: -4 }}
//             className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-smart-card p-4"
//           >
//             <motion.div
//               className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
//               style={{ background: bg, color: fg }}
//               animate={{ scale: [1, 1.08, 1] }}
//               transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
//             >
//               <Icon size={20} />
//             </motion.div>
//             <div>
//               <div className="text-[14px] font-extrabold">{title}</div>
//               <div className="text-[12.5px] text-[#808191] font-semibold leading-snug">{text}</div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       <div className="hidden lg:flex justify-end">
//         <DotGrid rows={4} cols={6} color="#6FD4F2" gap={12} />
//       </div>
//     </div>
//   );
// }

// /* ---------- Page ---------- */
// export default function Subscription() {
//   const { user, isAdmin } = useAuth();
//   const toast = useToast();
//   const nav = useNavigate();
//   const plans = useAsync(() => api.plans(), []);
//   const mine = useAsync(() => (user && !isAdmin ? api.mySubscription() : Promise.resolve(null)), [user?._id]);

//   const [selected, setSelected] = useState(null);
//   const [paying, setPaying] = useState(false);
//   const [done, setDone] = useState(null);
//   const [open, setOpen] = useState(0);

//   const choose = (plan) => {
//     if (!user) return nav('/login', { state: { from: '/subscription' } });
//     if (isAdmin) return toast.info('Administrators cannot purchase plans.');
//     setSelected(plan);
//   };

//   const pay = async () => {
//     setPaying(true);
//     try {
//       const res = await paySubscription(selected, user);
//       setSelected(null);
//       setDone(res.subscription);
//       mine.reload();
//     } catch (e) {
//       if (e.message === 'cancelled') toast.info('Payment cancelled.');
//       else toast.error(e.message);
//     } finally {
//       setPaying(false);
//     }
//   };

//   const current = mine.data?.current;
//   const queued = current && selected;

//   return (
//     <div className="relative">
//       <div className="hidden sm:block absolute top-0 left-0"><DotGrid rows={6} cols={5} color="#6FD4F2" gap={12} /></div>
//       <div className="hidden lg:block absolute top-0 right-0 w-[30%] h-[380px] bg-[#FBF6EF] pointer-events-none" />
//       <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10 pt-6 pb-24">
//         <PageHeader badge="SUBSCRIPTION PLANS" badgeColor="yellow" title="Pick a plan, unlock classes" text="Choose how many classes you want and for how long. Pay securely and start learning immediately." />

//         {user && !isAdmin && (
//           <div className="grid lg:grid-cols-12 gap-6 mt-10">
//             <div className="lg:col-span-5"><SubscriptionCard sub={current} cta={false} /></div>
//             <div className="lg:col-span-7 bg-white rounded-[28px] border border-gray-100 shadow-smart-card p-6">
//               <h3 className="font-display text-[17px] font-extrabold mb-4">Subscription history</h3>
//               {mine.loading ? (
//                 <PageLoader label="" />
//               ) : (mine.data?.upcoming?.length || mine.data?.history?.length) ? (
//                 <div className="divide-y divide-gray-100 max-h-[210px] overflow-y-auto">
//                   {[...(mine.data.upcoming || []), ...(mine.data.history || [])].map((s) => (
//                     <div key={s._id} className="flex items-center justify-between gap-3 py-3 text-[13px]">
//                       <div className="min-w-0">
//                         <div className="font-extrabold truncate">{s.planName}</div>
//                         <div className="text-[11.5px] text-[#808191] font-semibold">{fdate(s.startDate)} → {fdate(s.endDate)} · {s.classesUsed}/{s.classesAllowed} classes</div>
//                       </div>
//                       <Pill tone={statusTone(s.state)}>{s.state}</Pill>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-[13px] text-[#808191]">Your past and upcoming subscriptions will appear here.</p>
//               )}
//               <Link to="/profile?tab=receipts" className="inline-block mt-4 text-[12.5px] font-bold text-[#6C5CE7] hover:underline">View payment receipts →</Link>
//             </div>
//           </div>
//         )}

//         <div className="mt-14">
//           {plans.loading ? (
//             <PageLoader label="Loading plans…" />
//           ) : plans.error ? (
//             <ErrorBox message={plans.error} onRetry={plans.refetch} />
//           ) : plans.data.plans.length === 0 ? (
//             <EmptyState icon={CreditCard} title="No plans available" text="Subscription plans haven't been published yet. Please check back soon." />
//           ) : (
//             <PlansSlider
//               plans={plans.data.plans}
//               onSelect={choose}
//               disabled={isAdmin}
//               label={user ? (current ? 'Buy / queue plan' : 'Subscribe & pay') : 'Log in to subscribe'}
//             />
//           )}
//           <p className="flex items-center justify-center gap-2 text-[12.5px] text-[#808191] font-semibold mt-8">
//             <ShieldCheck size={15} className="text-[#10B981]" /> Secure payments powered by Razorpay
//           </p>
//         </div>

//         {/* FAQ (left) + support panel (right) */}
//         <div className="mt-24 grid lg:grid-cols-12 gap-10 items-start">
//           <div className="lg:col-span-7">
//             <h2 className="font-display text-[28px] font-extrabold tracking-tight mb-8">Frequently asked questions</h2>
//             <div className="space-y-3">
//               {FAQ.map(([q, a], i) => (
//                 <motion.div
//                   key={q}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: i * 0.08 }}
//                   className="bg-white rounded-2xl border border-gray-100 shadow-smart-card overflow-hidden"
//                 >
//                   <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 text-left px-6 py-5">
//                     <span className="text-[14.5px] font-extrabold">{q}</span>
//                     <ChevronDown size={18} className={`shrink-0 text-[#6C5CE7] transition-transform ${open === i ? 'rotate-180' : ''}`} />
//                   </button>
//                   <AnimatePresence initial={false}>
//                     {open === i && (
//                       <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
//                         <p className="px-6 pb-5 text-[13.5px] text-[#808191] leading-[1.7]">{a}</p>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </motion.div>
//               ))}
//             </div>
//           </div>

//           <div className="lg:col-span-5">
//             <FaqSide />
//           </div>
//         </div>
//       </div>

//       {/* Checkout summary */}
//       <Modal
//         open={!!selected}
//         onClose={() => !paying && setSelected(null)}
//         title="Confirm your plan"
//         footer={
//           <>
//             <Button variant="soft" onClick={() => setSelected(null)} disabled={paying}>Cancel</Button>
//             <Button variant="purple" onClick={pay} loading={paying}>Pay {selected && money(selected.price, selected.currency)}</Button>
//           </>
//         }
//       >
//         {selected && (
//           <div>
//             <div className="bg-[#F3FAFA] rounded-2xl p-5 mb-4">
//               <div className="font-display text-[20px] font-extrabold">{selected.name}</div>
//               <div className="text-[13px] text-[#808191] font-semibold mt-1">{selected.classLimit} classes · {durationLabel(selected.durationMonths)}</div>
//               <div className="flex items-center justify-between mt-4 pt-4 border-t border-white">
//                 <span className="text-[12px] font-bold text-[#808191] uppercase tracking-wider">Total</span>
//                 <span className="font-display text-[26px] font-extrabold">{money(selected.price, selected.currency)}</span>
//               </div>
//             </div>
//             {queued && (
//               <div className="flex gap-3 bg-[#FFF3CE] text-[#92400E] rounded-2xl p-4 text-[12.5px] font-semibold leading-relaxed mb-4">
//                 <Info size={16} className="shrink-0 mt-0.5" />
//                 You already have an active plan, so this one will start when it ends on {fdate(current.endDate)}.
//               </div>
//             )}
//             <p className="text-[12.5px] text-[#808191] leading-relaxed">You'll complete the payment in a secure Razorpay window. A receipt will be saved to your profile.</p>
//           </div>
//         )}
//       </Modal>

//       {/* Success */}
//       <Modal open={!!done} onClose={() => setDone(null)} title="Payment successful">
//         {done && (
//           <div className="text-center">
//             <div className="flex justify-center -mt-2 mb-2"><Checkmark3D /></div>
//             <CheckCircle2 className="mx-auto text-[#10B981] mb-3" size={30} />
//             <h4 className="font-display text-[22px] font-extrabold">{done.planName} is active</h4>
//             <p className="text-[13.5px] text-[#808191] mt-2">
//               {done.classesAllowed} classes · valid {fdate(done.startDate)} → {fdate(done.endDate)}
//               {done.state === 'upcoming' && ' (starts when your current plan ends)'}
//             </p>
//             <div className="flex flex-wrap justify-center gap-3 mt-7">
//               <Button onClick={() => nav('/classes')}>Browse classes</Button>
//               <Button variant="outline" onClick={() => nav('/profile?tab=receipts')}>View receipt</Button>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// }


import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  ShieldCheck,
  Info,
  Zap,
  Receipt,
  Headphones,
  Sparkles,
  Mail,
} from 'lucide-react';
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
  ['What happens if I buy a plan while another is running?', 'Your new plan replaces the current one and starts immediately. Classes you have already unlocked stay available.'],
  ['Can I get a receipt?', 'Yes. Every successful payment has a receipt in your profile under the Receipts tab, which you can print or save as a PDF.'],
  ['Which payment methods are supported?', 'Cards, UPI, net banking and wallets through Razorpay. Payments are processed securely in INR.'],
  ['What happens if my payment fails?', 'If your payment fails, please check your bank account for any deduction and try again. If the amount was deducted, the refund will be processed according to your banks refund timeline'],
  ['Can I download the payment receipt after completing a transaction?', 'Yes. Once your payment is successfully verified, access to your purchased course or subscription will be activated automatically.'],
  ['What should I do if my payment is successful but my course is still locked', 'Yes. After a successful payment, you can keep the payment confirmation or receipt for future reference.'],
];

const PERKS = [
  { icon: Zap, title: 'Instant activation', text: 'Your plan starts the moment payment succeeds.', bg: '#FFF3CE', fg: '#92400E' },
  { icon: Receipt, title: 'Receipts saved', text: 'Download or print every receipt from your profile.', bg: '#E6F8FD', fg: '#0E7490' },
  { icon: ShieldCheck, title: 'Secure checkout', text: 'Cards, UPI and wallets via Razorpay.', bg: '#DCFCE7', fg: '#047857' },
];

const GAP = 28; // matches gap-7 in the slider

/* ---------- Plans slider ---------- */
function PlansSlider({ plans, onSelect, disabled, label }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const getStep = () => {
    const el = trackRef.current;
    const first = el?.firstElementChild;
    return first ? first.offsetWidth + GAP : 0;
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
            key={p._id}
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

/* ---------- FAQ side panel ---------- */
function FaqSide() {
  return (
    <div className="lg:sticky lg:top-24 space-y-5">
      {/* Help card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#6C5CE7] to-[#8E7DFF] text-white p-8 shadow-smart-card"
      >
        <motion.div
          className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-12 -left-8 w-36 h-36 rounded-full bg-[#6FD4F2]/25"
          animate={{ scale: [1.15, 1, 1.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="relative w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-5"
          animate={{ y: [0, -8, 0], rotate: [0, 4, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Headphones size={26} />
        </motion.div>

        <h3 className="relative font-display text-[24px] font-extrabold leading-tight">Still have questions?</h3>
        <p className="relative text-[13.5px] text-white/80 mt-2 leading-relaxed">
          Our team is happy to help you pick the right plan for the way you learn.
        </p>
        <a
          href="mailto:support@classstream.com"
          className="relative inline-flex items-center gap-2 mt-6 bg-white text-[#6C5CE7] font-bold text-[13px] px-5 py-3 rounded-full hover:scale-105 transition-transform"
        >
          <Mail size={15} /> Contact support
        </a>

        <motion.div
          className="absolute top-6 right-6 flex items-center gap-1.5 bg-[#FFF3CE] text-[#92400E] text-[11px] font-extrabold px-3 py-1.5 rounded-full"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles size={12} /> 24h reply
        </motion.div>
      </motion.div>

      {/* Perks */}
      <div className="space-y-3">
        {PERKS.map(({ icon: Icon, title, text, bg, fg }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 * i, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-smart-card p-4"
          >
            <motion.div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: bg, color: fg }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
            >
              <Icon size={20} />
            </motion.div>
            <div>
              <div className="text-[14px] font-extrabold">{title}</div>
              <div className="text-[12.5px] text-[#808191] font-semibold leading-snug">{text}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="hidden lg:flex justify-end">
        <DotGrid rows={4} cols={6} color="#6FD4F2" gap={12} />
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
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

  const current = mine.data?.current;

  const choose = (plan) => {
    if (!user) return nav('/login', { state: { from: '/subscription' } });
    if (isAdmin) return toast.info('Administrators cannot purchase plans.');
    if (current && plan.classLimit < current.classesAllowed) {
      return toast.info('You can only switch to a plan with the same or more classes than your current plan.');
    }
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

  const replacing = current && selected;

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
            <PlansSlider
              plans={plans.data.plans}
              onSelect={choose}
              disabled={isAdmin}
              label={user ? (current ? 'Upgrade to this plan' : 'Subscribe & pay') : 'Log in to subscribe'}
            />
          )}
          <p className="flex items-center justify-center gap-2 text-[12.5px] text-[#808191] font-semibold mt-8">
            <ShieldCheck size={15} className="text-[#10B981]" /> Secure payments powered by Razorpay
          </p>
        </div>

        {/* FAQ (left) + support panel (right) */}
        <div className="mt-24 grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <h2 className="font-display text-[28px] font-extrabold tracking-tight mb-8">Frequently asked questions</h2>
            <div className="space-y-3">
              {FAQ.map(([q, a], i) => (
                <motion.div
                  key={q}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-smart-card overflow-hidden"
                >
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
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <FaqSide />
          </div>
        </div>
      </div>

      {/* Checkout summary */}
      <Modal
        open={!!selected}
        onClose={() => !paying && setSelected(null)}
        title={current ? 'Confirm your upgrade' : 'Confirm your plan'}
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
            {replacing && (
              <div className="flex gap-3 bg-[#FFF3CE] text-[#92400E] rounded-2xl p-4 text-[12.5px] font-semibold leading-relaxed mb-4">
                <Info size={16} className="shrink-0 mt-0.5" />
                <span>
                  This will replace your current <b>{current.planName}</b> plan and start immediately.
                  Classes you've already unlocked stay available, and the remaining time on your current plan is not carried over.
                </span>
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

