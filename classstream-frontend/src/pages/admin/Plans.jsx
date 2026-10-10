import { useState } from 'react';
import { Pencil, Plus, Trash2, CreditCard, Crown } from 'lucide-react';
import { AdminHead, IconBtn, TableCard, Td, Th } from '../../components/admin.jsx';
import { Button, ConfirmModal, EmptyState, ErrorBox, Field, Modal, PageLoader, Pill, Toggle, inputCls } from '../../components/ui.jsx';
import { api } from '../../lib/api.js';
import { durationLabel, money } from '../../lib/format.js';
import { useAsync } from '../../lib/hooks.js';
import { useToast } from '../../context/ToastContext.jsx';

const blank = { name: '', description: '', durationMonths: 1, classLimit: 5, price: 499, isPopular: false, isActive: true };

export default function AdminPlans() {
  const toast = useToast();
  const { data, loading, error, refetch, reload, setData } = useAsync(() => api.adminPlans(), []);
  const [edit, setEdit] = useState(null); // blank | plan
  const [form, setForm] = useState(blank);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [del, setDel] = useState(null);

  const open = (plan) => {
    setErr('');
    setEdit(plan || 'new');
    setForm(plan ? { name: plan.name, description: plan.description || '', durationMonths: plan.durationMonths, classLimit: plan.classLimit, price: plan.price, isPopular: plan.isPopular, isActive: plan.isActive } : blank);
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const body = { ...form, durationMonths: Number(form.durationMonths), classLimit: Number(form.classLimit), price: Number(form.price) };
      if (edit === 'new') await api.createPlan(body);
      else await api.updatePlan(edit._id, body);
      toast.success(edit === 'new' ? 'Plan created' : 'Plan updated');
      setEdit(null);
      reload();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (p, isActive) => {
    setData((d) => ({ ...d, plans: d.plans.map((x) => (x._id === p._id ? { ...x, isActive } : x)) }));
    try {
      await api.updatePlan(p._id, { isActive });
      toast.success(`${p.name} ${isActive ? 'activated' : 'deactivated'}`);
    } catch (e) {
      toast.error(e.message);
      reload();
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      const r = await api.deletePlan(del._id);
      r.deactivated ? toast.info(r.message) : toast.success('Plan deleted');
      setDel(null);
      reload();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <>
      <AdminHead title="Subscription plans" text="Create the plans students can buy.">
        <Button onClick={() => open()}><Plus size={15} /> New plan</Button>
      </AdminHead>

      {loading ? <PageLoader /> : error ? <ErrorBox message={error} onRetry={refetch} /> : data.plans.length === 0 ? (
        <EmptyState icon={CreditCard} title="No plans yet" text="Create your first subscription plan so students can start subscribing." action={<Button onClick={() => open()}>Create plan</Button>} />
      ) : (
        <TableCard>
          <table className="w-full min-w-[860px]">
            <thead><tr><Th>Plan</Th><Th>Price</Th><Th>Duration</Th><Th>Classes</Th><Th>Subscribers</Th><Th>Active</Th><Th className="text-right">Actions</Th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {data.plans.map((p) => (
                <tr key={p._id} className="hover:bg-[#FAFAFC]">
                  <Td>
                    <div className="flex items-center gap-2 font-extrabold">{p.name}{p.isPopular && <Pill tone="yellow"><Crown size={10} /> Popular</Pill>}</div>
                    <div className="text-[11.5px] text-[#808191] font-semibold max-w-[260px] truncate">{p.description || '—'}</div>
                  </Td>
                  <Td className="font-extrabold">{money(p.price, p.currency)}</Td>
                  <Td className="font-semibold text-[#6E7191]">{durationLabel(p.durationMonths)}</Td>
                  <Td className="font-bold">{p.classLimit}</Td>
                  <Td className="font-bold">{p.subscribers}</Td>
                  <Td><Toggle checked={p.isActive} onChange={(v) => toggle(p, v)} label="Toggle plan" /></Td>
                  <Td className="text-right">
                    <div className="inline-flex gap-2">
                      <IconBtn icon={Pencil} label="Edit plan" onClick={() => open(p)} />
                      <IconBtn icon={Trash2} label="Delete plan" tone="danger" onClick={() => setDel(p)} />
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      )}

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit === 'new' ? 'Create plan' : 'Edit plan'}>
        <form onSubmit={save} className="space-y-4">
          {err && <ErrorBox message={err} />}
          <Field label="PLAN NAME"><input required value={form.name} onChange={set('name')} className={inputCls} placeholder="e.g. Starter" /></Field>
          <Field label="DESCRIPTION"><textarea rows={2} value={form.description} onChange={set('description')} className={`${inputCls} resize-none`} placeholder="Short pitch shown on the pricing card" /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="PRICE (₹)"><input required type="number" min={1} value={form.price} onChange={set('price')} className={inputCls} /></Field>
            <Field label="MONTHS"><input required type="number" min={1} step={1} value={form.durationMonths} onChange={set('durationMonths')} className={inputCls} /></Field>
            <Field label="CLASSES"><input required type="number" min={1} step={1} value={form.classLimit} onChange={set('classLimit')} className={inputCls} /></Field>
          </div>
          <div className="flex flex-wrap gap-6 pt-1">
            <label className="flex items-center gap-3 text-[13px] font-bold"><Toggle checked={form.isPopular} onChange={(v) => setForm({ ...form, isPopular: v })} label="Popular" /> Mark as popular</label>
            <label className="flex items-center gap-3 text-[13px] font-bold"><Toggle checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} label="Active" /> Active (visible)</label>
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="soft" onClick={() => setEdit(null)}>Cancel</Button>
            <Button type="submit" loading={busy}>{edit === 'new' ? 'Create plan' : 'Save changes'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal open={!!del} onClose={() => setDel(null)} onConfirm={remove} loading={busy} danger title="Delete this plan?" confirmLabel="Delete plan" text={del?.subscribers ? `"${del?.name}" has ${del.subscribers} subscriber(s), so it will be hidden from the pricing page instead of deleted.` : `"${del?.name}" will be permanently deleted.`} />
    </>
  );
}
