import { Printer, CheckCircle2 } from 'lucide-react';
import { Modal, Button, Pill, statusTone } from './ui.jsx';
import { BrandLogo } from './Visuals.tsx';
import { fdate, money, durationLabel } from '../lib/format.js';

export const paymentTitle = (p) =>
  p.type === 'subscription' ? p.planSnapshot?.name || p.plan?.name || 'Subscription' : p.course?.courseName || 'Course';

export default function ReceiptModal({ payment, user, onClose }) {
  if (!payment) return null;
  const rows = [
    ['Receipt no.', `CS-${String(payment._id).slice(-8).toUpperCase()}`],
    ['Date', fdate(payment.paidAt || payment.createdAt, true)],
    ['Billed to', `${payment.user?.name || user?.name || ''} (${payment.user?.email || user?.email || ''})`],
    ['Item', paymentTitle(payment)],
    ...(payment.type === 'subscription'
      ? [
          ['Duration', payment.planSnapshot?.durationMonths ? durationLabel(payment.planSnapshot.durationMonths) : '—'],
          ['Classes included', payment.planSnapshot?.classLimit ?? '—'],
        ]
      : []),
    ['Razorpay order', payment.razorpayOrderId],
    ['Razorpay payment', payment.razorpayPaymentId || '—'],
  ];
  return (
    <Modal
      open
      onClose={onClose}
      title="Payment receipt"
      footer={
        <>
          <Button variant="soft" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => window.print()}>
            <Printer size={15} /> Print / Save PDF
          </Button>
        </>
      }
    >
      <div id="receipt-print" className="rounded-2xl border border-dashed border-[#D5D8E2] p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <BrandLogo />
          <Pill tone={statusTone(payment.status)}>{payment.status}</Pill>
        </div>
        <div className="flex flex-col items-center py-5 mb-5 rounded-2xl bg-[#F3FAFA]">
          <CheckCircle2 className="text-[#10B981] mb-2" size={30} />
          <div className="text-[12px] font-bold text-[#808191] uppercase tracking-wider">Amount paid</div>
          <div className="font-display text-[34px] font-extrabold tracking-tight">{money(payment.amount, payment.currency)}</div>
        </div>
        <dl className="divide-y divide-gray-100">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-3 text-[13px]">
              <dt className="text-[#808191] font-semibold shrink-0">{k}</dt>
              <dd className="font-bold text-right break-all">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="text-[11px] text-[#A0A3B5] text-center mt-6">Thank you for learning with ClassStream. This is a computer-generated receipt.</p>
      </div>
    </Modal>
  );
}
