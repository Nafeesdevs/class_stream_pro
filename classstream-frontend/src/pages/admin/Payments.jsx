import { useMemo, useState } from 'react';
import { Eye, Receipt } from 'lucide-react';
import { AdminHead, IconBtn, SearchBox, Select, TableCard, Td, Th } from '../../components/admin.jsx';
import { Avatar, EmptyState, ErrorBox, PageLoader, Pill, statusTone } from '../../components/ui.jsx';
import ReceiptModal, { paymentTitle } from '../../components/ReceiptModal.jsx';
import { api } from '../../lib/api.js';
import { fdate, money } from '../../lib/format.js';
import { useAsync } from '../../lib/hooks.js';

export default function AdminPayments() {
  const { data, loading, error, refetch } = useAsync(() => api.adminPayments(), []);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [receipt, setReceipt] = useState(null);

  const rows = useMemo(
    () =>
      (data?.payments || []).filter(
        (p) =>
          (status === 'all' || p.status === status) &&
          (!q || `${p.user?.name} ${p.user?.email} ${paymentTitle(p)} ${p.razorpayPaymentId} ${p.razorpayOrderId}`.toLowerCase().includes(q.toLowerCase()))
      ),
    [data, q, status]
  );
  const total = rows.filter((p) => p.status === 'paid').reduce((a, p) => a + p.amount, 0);

  return (
    <>
      <AdminHead title="Payments" text="Every payment attempt made on the platform.">
        <div className="bg-white rounded-2xl shadow-smart-card px-5 py-3 border border-gray-100/80">
          <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#808191]">Paid (filtered)</div>
          <div className="font-display text-[22px] font-extrabold leading-tight">{money(total)}</div>
        </div>
      </AdminHead>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchBox value={q} onChange={setQ} placeholder="Search user, plan, payment id…" />
        <Select value={status} onChange={setStatus} options={[['all', 'All statuses'], ['paid', 'Paid'], ['created', 'Created'], ['failed', 'Failed']]} />
      </div>

      {loading ? <PageLoader /> : error ? <ErrorBox message={error} onRetry={refetch} /> : rows.length === 0 ? (
        <EmptyState icon={Receipt} title="No payments found" text="Payments will show up here as students subscribe." />
      ) : (
        <TableCard>
          <table className="w-full min-w-[900px]">
            <thead><tr><Th>User</Th><Th>Item</Th><Th>Amount</Th><Th>Razorpay payment</Th><Th>Date</Th><Th>Status</Th><Th className="text-right">Receipt</Th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((p) => (
                <tr key={p._id} className="hover:bg-[#FAFAFC]">
                  <Td><div className="flex items-center gap-3"><Avatar user={p.user} size={34} /><div className="min-w-0"><div className="font-extrabold truncate">{p.user?.name || 'Deleted user'}</div><div className="text-[11.5px] text-[#808191] truncate">{p.user?.email}</div></div></div></Td>
                  <Td><div className="font-bold">{paymentTitle(p)}</div><div className="text-[11px] text-[#808191] font-semibold capitalize">{p.type}</div></Td>
                  <Td className="font-extrabold">{money(p.amount, p.currency)}</Td>
                  <Td className="text-[11.5px] text-[#808191] font-semibold break-all max-w-[190px]">{p.razorpayPaymentId || p.razorpayOrderId}</Td>
                  <Td className="text-[#6E7191] font-semibold whitespace-nowrap">{fdate(p.paidAt || p.createdAt)}</Td>
                  <Td><Pill tone={statusTone(p.status)}>{p.status}</Pill></Td>
                  <Td className="text-right">{p.status === 'paid' ? <IconBtn icon={Eye} label="View receipt" onClick={() => setReceipt(p)} /> : '—'}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      )}
      {receipt && <ReceiptModal payment={receipt} onClose={() => setReceipt(null)} />}
    </>
  );
}
