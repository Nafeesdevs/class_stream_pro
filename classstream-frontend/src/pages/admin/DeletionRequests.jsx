import { useState } from 'react';
import { Check, UserX, X } from 'lucide-react';
import { AdminHead } from '../../components/admin.jsx';
import { Button, ConfirmModal, EmptyState, ErrorBox, PageLoader, Pill, statusTone } from '../../components/ui.jsx';
import { api } from '../../lib/api.js';
import { fdate } from '../../lib/format.js';
import { useAsync } from '../../lib/hooks.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function DeletionRequests() {
  const toast = useToast();
  const { data, loading, error, refetch, reload } = useAsync(() => api.deletionRequests(), []);
  const [act, setAct] = useState(null); // {type, req}
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      const r = act.type === 'approve' ? await api.approveDeletion(act.req._id) : await api.rejectDeletion(act.req._id);
      toast.success(r.message);
      setAct(null);
      reload();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AdminHead title="Deletion requests" text={data ? `${data.pendingCount} pending review` : ''} />
      {loading ? <PageLoader /> : error ? <ErrorBox message={error} onRetry={refetch} /> : data.requests.length === 0 ? (
        <EmptyState icon={UserX} title="No deletion requests" text="When a student asks to delete their account, it will appear here." />
      ) : (
        <div className="space-y-4">
          {data.requests.map((r) => (
            <div key={r._id} className="bg-white rounded-[22px] shadow-smart-card border border-gray-100/80 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1"><h3 className="font-display text-[17px] font-extrabold">{r.name}</h3><Pill tone={statusTone(r.status)}>{r.status}</Pill></div>
                  <div className="text-[12.5px] text-[#808191] font-semibold">{r.email} · requested {fdate(r.createdAt, true)} · {r.enrollmentsCount} enrollments</div>
                </div>
                {r.status === 'pending' ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setAct({ type: 'reject', req: r })}><X size={13} /> Reject</Button>
                    <Button size="sm" variant="danger" onClick={() => setAct({ type: 'approve', req: r })}><Check size={13} /> Approve & delete</Button>
                  </div>
                ) : (
                  <div className="text-[12px] text-[#808191] font-semibold">Reviewed by {r.reviewedByName || '—'} on {fdate(r.reviewedAt)}</div>
                )}
              </div>
              <blockquote className="mt-4 bg-[#F6F7FB] rounded-2xl px-5 py-4 text-[13.5px] text-[#4F5265] leading-relaxed">“{r.reason}”</blockquote>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal
        open={!!act}
        onClose={() => setAct(null)}
        onConfirm={run}
        loading={busy}
        danger={act?.type === 'approve'}
        title={act?.type === 'approve' ? 'Approve and delete account?' : 'Reject this request?'}
        confirmLabel={act?.type === 'approve' ? 'Approve & delete' : 'Reject'}
        text={act?.type === 'approve' ? `${act?.req.name}'s account will be permanently deleted. This cannot be undone.` : `${act?.req.name} will be able to sign in again.`}
      />
    </>
  );
}
