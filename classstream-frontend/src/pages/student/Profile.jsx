import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Repeat, Receipt, ShieldAlert, Save, Eye, BookOpen, Calendar, Mail } from 'lucide-react';
import { DotGrid } from '../../components/Visuals.tsx';
import { Avatar, Button, EmptyState, ErrorBox, Field, Modal, PageLoader, Pill, inputCls, statusTone } from '../../components/ui.jsx';
import SubscriptionCard from '../../components/SubscriptionCard.jsx';
import ReceiptModal, { paymentTitle } from '../../components/ReceiptModal.jsx';
import { api } from '../../lib/api.js';
import { fdate, money } from '../../lib/format.js';
import { useAsync } from '../../lib/hooks.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const TABS = [
  ['overview', User, 'Details'],
  ['subscription', Repeat, 'Subscription'],
  ['receipts', Receipt, 'Receipts'],
  ['account', ShieldAlert, 'Account'],
];

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();
  const tab = TABS.some(([k]) => k === sp.get('tab')) ? sp.get('tab') : 'overview';

  const subs = useAsync(() => api.mySubscription(), []);
  const pays = useAsync(() => api.myPayments(), []);
  const lessons = useAsync(() => api.lessons(), []);

  const [form, setForm] = useState({ name: user.name, avatar: user.avatar || '' });
  const [saving, setSaving] = useState(false);
  const [receipt, setReceipt] = useState(null);

  // delete-account flow
  const [del, setDel] = useState(0); // 0 closed, 1 password, 2 reason
  const [pw, setPw] = useState('');
  const [reason, setReason] = useState('');
  const [vtoken, setVtoken] = useState('');
  const [delBusy, setDelBusy] = useState(false);
  const [delErr, setDelErr] = useState('');

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateMe({ name: form.name, avatar: form.avatar });
      setUser((u) => ({ ...u, ...res.user }));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const closeDel = () => { setDel(0); setPw(''); setReason(''); setVtoken(''); setDelErr(''); };
  const verifyPw = async () => {
    setDelBusy(true); setDelErr('');
    try {
      const r = await api.verifyDeletePassword(pw);
      setVtoken(r.verificationToken);
      setDel(2);
    } catch (e) { setDelErr(e.message); } finally { setDelBusy(false); }
  };
  const sendDel = async () => {
    setDelBusy(true); setDelErr('');
    try {
      await api.requestDeletion({ verificationToken: vtoken, reason });
      toast.success('Deletion request sent to the admin.');
      closeDel();
      await logout();
      nav('/login');
    } catch (e) {
      if (e.code === 'VERIFICATION_EXPIRED') setDel(1);
      setDelErr(e.message);
    } finally { setDelBusy(false); }
  };

  const assigned = lessons.data?.lessons.filter((l) => l.isUnlocked) || [];
  const payments = pays.data?.payments || [];
  const paid = payments.filter((p) => p.status === 'paid');
  const current = subs.data?.current;

  return (
    <div className="relative">
      <div className="hidden sm:block absolute top-0 left-0"><DotGrid rows={6} cols={5} color="#6FD4F2" gap={12} /></div>
      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10 pt-6 pb-24">
        {/* Header card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-[#FBF6EF] rounded-[30px] p-6 sm:p-9 overflow-hidden">
          <div className="absolute -right-10 -bottom-16 w-56 h-56 rounded-full bg-[#DCF6F9]" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
            <Avatar user={user} size={92} className="ring-4 ring-white shadow-smart-card" />
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-[30px] sm:text-[36px] font-extrabold tracking-[-0.03em] leading-tight truncate">{user.name}</h1>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-2 text-[13px] text-[#6E7191] font-semibold">
                <span className="inline-flex items-center gap-2"><Mail size={14} />{user.email}</span>
                <span className="inline-flex items-center gap-2"><Calendar size={14} />Joined {fdate(user.createdAt)}</span>
              </div>
            </div>
            <div className="relative grid grid-cols-3 gap-3 sm:gap-4">
              {[[assigned.length, 'Assigned'], [paid.length, 'Payments'], [current ? current.classesLeft : 0, 'Classes left']].map(([n, l]) => (
                <div key={l} className="bg-white rounded-2xl px-4 py-3 text-center shadow-smart-card">
                  <div className="font-display text-[22px] font-extrabold leading-none">{n}</div>
                  <div className="text-[10.5px] font-bold text-[#808191] mt-1.5 uppercase tracking-wide">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto py-6">
          {TABS.map(([k, Icon, l]) => (
            <button key={k} onClick={() => setSp(k === 'overview' ? {} : { tab: k })} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[12.5px] font-bold whitespace-nowrap transition-all ${tab === k ? 'bg-[#11142D] text-white shadow-md' : 'bg-[#F4F5F8] text-[#4F5265] hover:bg-[#E8EAFC]'}`}>
              <Icon size={14} /> {l}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid lg:grid-cols-12 gap-8">
            <form onSubmit={save} className="lg:col-span-7 bg-white rounded-[28px] border border-gray-100 shadow-smart-card p-6 sm:p-8">
              <h2 className="font-display text-[20px] font-extrabold mb-6">Personal details</h2>
              <div className="space-y-4">
                <Field label="FULL NAME"><input required minLength={2} maxLength={50} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
                <Field label="EMAIL" hint="Email cannot be changed."><input value={user.email} disabled className={`${inputCls} bg-[#F4F5F8] text-[#808191]`} /></Field>
                <Field label="AVATAR URL" hint="Paste a link to an image (optional)."><input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="https://…" className={inputCls} /></Field>
              </div>
              <Button type="submit" loading={saving} className="mt-6"><Save size={15} /> Save changes</Button>
            </form>

            <div className="lg:col-span-5 bg-white rounded-[28px] border border-gray-100 shadow-smart-card p-6 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-[20px] font-extrabold">Assigned classes</h2>
                <Link to="/my-classes" className="text-[12.5px] font-bold text-[#6C5CE7] hover:underline">View all</Link>
              </div>
              {lessons.loading ? <PageLoader label="" /> : assigned.length === 0 ? (
                <p className="text-[13px] text-[#808191]">No classes assigned yet.</p>
              ) : (
                <ul className="space-y-2.5">
                  {assigned.slice(0, 6).map((l) => (
                    <li key={l._id}>
                      <Link to={`/classes/${l._id}`} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F4F5F8] transition">
                        <span className="w-9 h-9 rounded-xl bg-[#EDE9FE] text-[#6C5CE7] flex items-center justify-center"><BookOpen size={16} /></span>
                        <span className="text-[13.5px] font-bold truncate flex-1">{l.title}</span>
                        <span className="text-[11px] font-bold text-[#808191]">{l.videos.length} videos</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {tab === 'subscription' && (
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              {subs.loading ? <PageLoader /> : <SubscriptionCard sub={current} />}
              <Button as={Link} to="/subscription" variant="outline" className="w-full">Change / renew plan</Button>
            </div>
            <div className="lg:col-span-7 bg-white rounded-[28px] border border-gray-100 shadow-smart-card p-6 sm:p-8">
              <h2 className="font-display text-[20px] font-extrabold mb-5">All subscriptions</h2>
              {subs.error ? <ErrorBox message={subs.error} onRetry={subs.refetch} /> : !subs.data ? <PageLoader label="" /> : (() => {
                const all = [...(current ? [current] : []), ...subs.data.upcoming, ...subs.data.history];
                return all.length === 0 ? <p className="text-[13px] text-[#808191]">You haven't subscribed yet.</p> : (
                  <div className="divide-y divide-gray-100">
                    {all.map((s) => (
                      <div key={s._id} className="flex items-center justify-between gap-3 py-4">
                        <div className="min-w-0">
                          <div className="text-[14px] font-extrabold truncate">{s.planName}</div>
                          <div className="text-[12px] text-[#808191] font-semibold">{fdate(s.startDate)} → {fdate(s.endDate)}</div>
                          <div className="text-[12px] text-[#808191] font-semibold">{s.classesUsed}/{s.classesAllowed} classes used · {money(s.pricePaid)}</div>
                        </div>
                        <Pill tone={statusTone(s.state)}>{s.state}</Pill>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {tab === 'receipts' && (
          <div className="bg-white rounded-[28px] border border-gray-100 shadow-smart-card overflow-hidden">
            <div className="px-6 sm:px-8 pt-7 pb-4"><h2 className="font-display text-[20px] font-extrabold">Payment receipts</h2></div>
            {pays.loading ? <PageLoader /> : pays.error ? <div className="p-6"><ErrorBox message={pays.error} onRetry={pays.refetch} /></div> : payments.length === 0 ? (
              <div className="p-6"><EmptyState icon={Receipt} title="No payments yet" text="When you subscribe to a plan, your receipt will appear here." action={<Button as={Link} to="/subscription">View plans</Button>} /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[13px] min-w-[640px]">
                  <thead>
                    <tr className="text-left text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#808191] border-y border-gray-100 bg-[#FAFAFC]">
                      <th className="px-6 sm:px-8 py-3">Item</th><th className="py-3">Date</th><th className="py-3">Amount</th><th className="py-3">Status</th><th className="py-3 pr-6 sm:pr-8 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.map((p) => (
                      <tr key={p._id} className="hover:bg-[#FAFAFC]">
                        <td className="px-6 sm:px-8 py-4"><div className="font-extrabold">{paymentTitle(p)}</div><div className="text-[11px] text-[#A0A3B5] font-semibold">{p.razorpayPaymentId || p.razorpayOrderId}</div></td>
                        <td className="py-4 font-semibold text-[#6E7191]">{fdate(p.paidAt || p.createdAt)}</td>
                        <td className="py-4 font-extrabold">{money(p.amount, p.currency)}</td>
                        <td className="py-4"><Pill tone={statusTone(p.status)}>{p.status}</Pill></td>
                        <td className="py-4 pr-6 sm:pr-8 text-right">
                          {p.status === 'paid' ? <Button size="sm" variant="outline" onClick={() => setReceipt(p)}><Eye size={13} /> View</Button> : <span className="text-[#A0A3B5]">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'account' && (
          <div className="max-w-2xl bg-white rounded-[28px] border border-[#FFD9D0] shadow-smart-card p-6 sm:p-8">
            <h2 className="font-display text-[20px] font-extrabold mb-2 text-[#C2410C]">Delete my account</h2>
            <p className="text-[13.5px] text-[#808191] leading-[1.7] mb-6">Send a deletion request to the administrator. You'll be asked to confirm your password and tell us why. You won't be able to sign in until the request is reviewed, and approval permanently removes your account.</p>
            <Button variant="danger" onClick={() => setDel(1)}>Request account deletion</Button>
          </div>
        )}
      </div>

      {receipt && <ReceiptModal payment={receipt} user={user} onClose={() => setReceipt(null)} />}

      <Modal
        open={del > 0}
        onClose={closeDel}
        title={del === 1 ? 'Confirm your password' : 'Why are you leaving?'}
        footer={
          <>
            <Button variant="soft" onClick={closeDel}>Cancel</Button>
            {del === 1 ? <Button variant="danger" onClick={verifyPw} loading={delBusy} disabled={!pw}>Continue</Button> : <Button variant="danger" onClick={sendDel} loading={delBusy} disabled={reason.trim().length < 10}>Send request</Button>}
          </>
        }
      >
        {delErr && <div className="mb-4"><ErrorBox message={delErr} /></div>}
        {del === 1 ? (
          <Field label="PASSWORD"><input type="password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} className={inputCls} placeholder="Your current password" /></Field>
        ) : (
          <Field label="REASON" hint={`${reason.trim().length}/500 — at least 10 characters`}>
            <textarea rows={4} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} className={`${inputCls} resize-none`} placeholder="Tell us why you want to delete your account" />
          </Field>
        )}
      </Modal>
    </div>
  );
}
