import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Calendar, ShieldCheck, Eye, Trash2, Ban } from 'lucide-react';
import { TableCard, Td, Th, IconBtn } from '../../components/admin.jsx';
import { Avatar, Button, ConfirmModal, EmptyState, ErrorBox, PageLoader, Pill, Toggle, statusTone } from '../../components/ui.jsx';
import ReceiptModal, { paymentTitle } from '../../components/ReceiptModal.jsx';
import { api } from '../../lib/api.js';
import { fdate, money } from '../../lib/format.js';
import { useAsync } from '../../lib/hooks.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function AdminUserDetail() {
  const { id } = useParams();
  const { user: me } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const { data, loading, error, refetch, reload, setData } = useAsync(async () => {
    const [u, s, p] = await Promise.allSettled([api.user(id), api.adminSubscriptions(), api.adminPayments()]);
    if (u.status === 'rejected') throw u.reason;
    return {
      user: u.value.user,
      subs: s.status === 'fulfilled' ? s.value.subscriptions.filter((x) => x.user?._id === id) : [],
      pays: p.status === 'fulfilled' ? p.value.payments.filter((x) => x.user?._id === id) : [],
    };
  }, [id]);

  const [receipt, setReceipt] = useState(null);
  const [cancel, setCancel] = useState(null);
  const [delOpen, setDelOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  if (loading) return <PageLoader />;
  if (error) return <ErrorBox message={error} onRetry={refetch} />;
  const { user, subs, pays } = data;
  const self = user._id === me._id;
  const current = subs.find((s) => s.state === 'active');

  const toggle = async (isActive) => {
    setData((d) => ({ ...d, user: { ...d.user, isActive } }));
    try {
      await api.updateUser(id, { isActive });
      toast.success(`Account ${isActive ? 'activated' : 'deactivated'}`);
    } catch (e) {
      toast.error(e.message);
      reload();
    }
  };

  const doCancel = async () => {
    setBusy(true);
    try {
      await api.cancelSubscription(cancel._id);
      toast.success('Subscription cancelled');
      setCancel(null);
      reload();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const doDelete = async () => {
    setBusy(true);
    try {
      await api.deleteUser(id);
      toast.success('User deleted');
      nav('/admin/users');
    } catch (e) {
      toast.error(e.message);
      setBusy(false);
    }
  };

  return (
    <>
      <Link to="/admin/users" className="inline-flex items-center gap-2 text-[13px] font-bold text-[#6E7191] hover:text-[#11142D] mb-5 pt-2"><ArrowLeft size={15} /> All users</Link>

      <div className="relative bg-white rounded-[28px] shadow-smart-card border border-gray-100/80 p-6 sm:p-8 overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#DCF6F9]" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <Avatar user={user} size={88} className="ring-4 ring-[#F4F5F8]" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-[30px] font-extrabold tracking-[-0.03em]">{user.name}</h1>
              <Pill tone={user.role === 'admin' ? 'purple' : 'gray'}>{user.role}</Pill>
              <Pill tone={user.isActive === false ? 'red' : 'green'}>{user.isActive === false ? 'Inactive' : 'Active'}</Pill>
              {user.deletionRequestStatus === 'pending' && <Pill tone="yellow">deletion pending</Pill>}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1.5 mt-2.5 text-[13px] text-[#6E7191] font-semibold">
              <span className="inline-flex items-center gap-2"><Mail size={14} />{user.email}</span>
              <span className="inline-flex items-center gap-2"><Calendar size={14} />Joined {fdate(user.createdAt)}</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck size={14} />ID {user._id.slice(-8)}</span>
            </div>
          </div>
          <div className="relative flex items-center gap-4 bg-[#F4F5F8] rounded-2xl px-5 py-3.5">
            <div>
              <div className="text-[12.5px] font-extrabold">Account active</div>
              <div className="text-[11px] text-[#808191] font-semibold">{self ? 'Cannot change yourself' : 'Allow sign-in'}</div>
            </div>
            <Toggle checked={user.isActive !== false} onChange={toggle} disabled={self} label="Toggle active" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-6">
        <div className="bg-[#11142D] text-white rounded-[24px] p-6">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/50 mb-2">Current plan</div>
          {current ? (
            <>
              <div className="font-display text-[24px] font-extrabold">{current.planName}</div>
              <div className="text-[13px] text-white/60 mt-1 font-semibold">{current.classesUsed} of {current.classesAllowed} classes used</div>
              <div className="h-2 rounded-full bg-white/10 mt-4 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-[#7B61FF] to-[#63D2FF]" style={{ width: `${(current.classesUsed / current.classesAllowed) * 100}%` }} /></div>
              <div className="text-[12px] text-white/60 mt-3 font-semibold">Ends {fdate(current.endDate)} · {current.daysLeft} days left</div>
            </>
          ) : <div className="font-display text-[20px] font-extrabold mt-1">No active plan</div>}
        </div>
        <div className="bg-white rounded-[24px] p-6 shadow-smart-card border border-gray-100/80">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#808191] mb-2">Total paid</div>
          <div className="font-display text-[30px] font-extrabold tracking-tight">{money(pays.filter((p) => p.status === 'paid').reduce((a, p) => a + p.amount, 0))}</div>
          <div className="text-[12.5px] text-[#808191] font-semibold mt-1">{pays.filter((p) => p.status === 'paid').length} successful payments</div>
        </div>
        <div className="bg-white rounded-[24px] p-6 shadow-smart-card border border-gray-100/80">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#808191] mb-2">Subscriptions</div>
          <div className="font-display text-[30px] font-extrabold tracking-tight">{subs.length}</div>
          <div className="text-[12.5px] text-[#808191] font-semibold mt-1">{subs.filter((s) => s.state === 'active').length} active now</div>
        </div>
      </div>

      <h2 className="font-display text-[20px] font-extrabold mt-10 mb-4">Subscriptions & plans</h2>
      {subs.length === 0 ? <EmptyState title="No subscriptions" text="This user hasn't bought a plan yet." /> : (
        <TableCard>
          <table className="w-full min-w-[720px]">
            <thead><tr><Th>Plan</Th><Th>Period</Th><Th>Classes</Th><Th>Paid</Th><Th>Status</Th><Th className="text-right">Action</Th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {subs.map((s) => (
                <tr key={s._id}>
                  <Td className="font-extrabold">{s.planName}</Td>
                  <Td className="text-[#6E7191] font-semibold whitespace-nowrap">{fdate(s.startDate)} → {fdate(s.endDate)}</Td>
                  <Td className="font-bold">{s.classesUsed}/{s.classesAllowed}</Td>
                  <Td className="font-bold">{money(s.pricePaid)}</Td>
                  <Td><Pill tone={statusTone(s.state)}>{s.state}</Pill></Td>
                  <Td className="text-right">{s.status === 'active' && s.state !== 'expired' ? <Button size="sm" variant="outline" onClick={() => setCancel(s)}><Ban size={13} /> Cancel</Button> : <span className="text-[#A0A3B5]">—</span>}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      )}

      <h2 className="font-display text-[20px] font-extrabold mt-10 mb-4">Payment details</h2>
      {pays.length === 0 ? <EmptyState title="No payments" text="No payment records for this user." /> : (
        <TableCard>
          <table className="w-full min-w-[720px]">
            <thead><tr><Th>Item</Th><Th>Date</Th><Th>Amount</Th><Th>Razorpay payment</Th><Th>Status</Th><Th className="text-right">Receipt</Th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {pays.map((p) => (
                <tr key={p._id}>
                  <Td className="font-extrabold">{paymentTitle(p)}</Td>
                  <Td className="text-[#6E7191] font-semibold whitespace-nowrap">{fdate(p.paidAt || p.createdAt)}</Td>
                  <Td className="font-bold">{money(p.amount, p.currency)}</Td>
                  <Td className="text-[11.5px] text-[#808191] font-semibold break-all max-w-[200px]">{p.razorpayPaymentId || '—'}</Td>
                  <Td><Pill tone={statusTone(p.status)}>{p.status}</Pill></Td>
                  <Td className="text-right">{p.status === 'paid' ? <IconBtn icon={Eye} label="View receipt" onClick={() => setReceipt(p)} /> : '—'}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      )}

      {!self && (
        <div className="mt-10 flex justify-end">
          <Button variant="danger" onClick={() => setDelOpen(true)}><Trash2 size={15} /> Delete user</Button>
        </div>
      )}

      {receipt && <ReceiptModal payment={receipt} user={user} onClose={() => setReceipt(null)} />}
      <ConfirmModal open={!!cancel} onClose={() => setCancel(null)} onConfirm={doCancel} loading={busy} danger title="Cancel this subscription?" confirmLabel="Cancel subscription" text={`"${cancel?.planName}" will be marked cancelled and ${user.name} will lose access to its classes immediately.`} />
      <ConfirmModal open={delOpen} onClose={() => setDelOpen(false)} onConfirm={doDelete} loading={busy} danger title="Delete this user?" confirmLabel="Delete user" text={`${user.name} will be permanently removed. This cannot be undone.`} />
    </>
  );
}
