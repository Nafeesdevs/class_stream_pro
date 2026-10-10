import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ban, Repeat } from 'lucide-react';
import { AdminHead, SearchBox, Select, TableCard, Td, Th } from '../../components/admin.jsx';
import { Button, ConfirmModal, EmptyState, ErrorBox, PageLoader, Pill, statusTone } from '../../components/ui.jsx';
import { api } from '../../lib/api.js';
import { fdate, money } from '../../lib/format.js';
import { useAsync } from '../../lib/hooks.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function AdminSubscriptions() {
  const toast = useToast();
  const { data, loading, error, refetch, reload } = useAsync(() => api.adminSubscriptions(), []);
  const [q, setQ] = useState('');
  const [state, setState] = useState('all');
  const [cancel, setCancel] = useState(null);
  const [busy, setBusy] = useState(false);

  const rows = useMemo(
    () => (data?.subscriptions || []).filter((s) => (state === 'all' || s.state === state) && (!q || `${s.user?.name} ${s.user?.email} ${s.planName}`.toLowerCase().includes(q.toLowerCase()))),
    [data, q, state]
  );

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

  return (
    <>
      <AdminHead title="Subscriptions" text="Who is subscribed to what, and how much they've used." />
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchBox value={q} onChange={setQ} placeholder="Search user or plan…" />
        <Select value={state} onChange={setState} options={[['all', 'All states'], ['active', 'Active'], ['upcoming', 'Upcoming'], ['expired', 'Expired'], ['cancelled', 'Cancelled']]} />
      </div>
      {loading ? <PageLoader /> : error ? <ErrorBox message={error} onRetry={refetch} /> : rows.length === 0 ? (
        <EmptyState icon={Repeat} title="No subscriptions found" text="Subscriptions appear when students purchase plans." />
      ) : (
        <TableCard>
          <table className="w-full min-w-[900px]">
            <thead><tr><Th>User</Th><Th>Plan</Th><Th>Period</Th><Th>Usage</Th><Th>Paid</Th><Th>State</Th><Th className="text-right">Action</Th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((s) => (
                <tr key={s._id} className="hover:bg-[#FAFAFC]">
                  <Td>{s.user ? <Link to={`/admin/users/${s.user._id}`} className="block"><div className="font-extrabold hover:text-[#6C5CE7]">{s.user.name}</div><div className="text-[11.5px] text-[#808191]">{s.user.email}</div></Link> : <span className="text-[#A0A3B5]">Deleted user</span>}</Td>
                  <Td className="font-bold">{s.planName}</Td>
                  <Td className="text-[#6E7191] font-semibold whitespace-nowrap">{fdate(s.startDate)} → {fdate(s.endDate)}</Td>
                  <Td>
                    <div className="text-[12px] font-bold mb-1.5">{s.classesUsed}/{s.classesAllowed}</div>
                    <div className="h-1.5 w-24 rounded-full bg-[#F1F2F7] overflow-hidden"><div className="h-full rounded-full bg-[#7B61FF]" style={{ width: `${(s.classesUsed / s.classesAllowed) * 100}%` }} /></div>
                  </Td>
                  <Td className="font-bold">{money(s.pricePaid)}</Td>
                  <Td><Pill tone={statusTone(s.state)}>{s.state}</Pill></Td>
                  <Td className="text-right">{s.status === 'active' && s.state !== 'expired' ? <Button size="sm" variant="outline" onClick={() => setCancel(s)}><Ban size={13} /> Cancel</Button> : <span className="text-[#A0A3B5]">—</span>}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      )}
      <ConfirmModal open={!!cancel} onClose={() => setCancel(null)} onConfirm={doCancel} loading={busy} danger title="Cancel this subscription?" confirmLabel="Cancel subscription" text={`${cancel?.user?.name}'s "${cancel?.planName}" subscription will be cancelled and its classes will lock immediately.`} />
    </>
  );
}
