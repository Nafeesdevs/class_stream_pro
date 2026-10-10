import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Trash2, UserPlus, Users as UsersIcon } from 'lucide-react';
import { AdminHead, IconBtn, SearchBox, Select, TableCard, Td, Th } from '../../components/admin.jsx';
import { Avatar, Button, ConfirmModal, EmptyState, ErrorBox, Field, Modal, PageLoader, Pill, Toggle, inputCls, statusTone } from '../../components/ui.jsx';
import { api } from '../../lib/api.js';
import { fdate } from '../../lib/format.js';
import { useAsync } from '../../lib/hooks.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function AdminUsers() {
  const { user: me } = useAuth();
  const toast = useToast();
  const { data, loading, error, refetch, reload, setData } = useAsync(async () => {
    // Subscriptions only enrich the "Current plan" column, so never let them block the list.
    const [u, s] = await Promise.allSettled([api.users(), api.adminSubscriptions()]);
    if (u.status === 'rejected') throw u.reason;
    return { users: u.value.users, subs: s.status === 'fulfilled' ? s.value.subscriptions : [], subsError: s.status === 'rejected' ? s.reason.message : '' };
  }, []);

  const [q, setQ] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [del, setDel] = useState(null);

  // user id -> their current (or next) plan
  const planOf = useMemo(() => {
    const m = new Map();
    (data?.subs || []).forEach((s) => {
      const id = s.user?._id;
      if (!id) return;
      const prev = m.get(id);
      if (s.state === 'active') m.set(id, s);
      else if (s.state === 'upcoming' && (!prev || prev.state !== 'active')) m.set(id, s);
    });
    return m;
  }, [data]);

  const users = (data?.users || []).filter(
    (u) =>
      (!q || `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase())) &&
      (role === 'all' || u.role === role) &&
      (status === 'all' || (status === 'active' ? u.isActive !== false : u.isActive === false))
  );

  const toggleActive = async (u, isActive) => {
    setData((d) => ({ ...d, users: d.users.map((x) => (x._id === u._id ? { ...x, isActive } : x)) })); // optimistic
    try {
      await api.updateUser(u._id, { isActive });
      toast.success(`${u.name} ${isActive ? 'activated' : 'deactivated'}`);
    } catch (e) {
      toast.error(e.message);
      reload();
    }
  };

  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await api.createUser(form);
      toast.success('User created');
      setCreating(false);
      setForm({ name: '', email: '', password: '', role: 'user' });
      reload();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await api.deleteUser(del._id);
      toast.success('User deleted');
      setDel(null);
      reload();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AdminHead title="Users" text={`${data?.users.length ?? 0} registered accounts`}>
        <Button onClick={() => setCreating(true)}><UserPlus size={15} /> Create user</Button>
      </AdminHead>

      {data?.subsError && <div className="mb-4"><ErrorBox message={`Plan details unavailable: ${data.subsError}`} onRetry={reload} /></div>}
      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        <SearchBox value={q} onChange={setQ} placeholder="Search name or email…" />
        <Select value={role} onChange={setRole} options={[['all', 'All roles'], ['user', 'Students'], ['admin', 'Admins']]} />
        <Select value={status} onChange={setStatus} options={[['all', 'Any status'], ['active', 'Active'], ['inactive', 'Inactive']]} />
      </div>

      {loading ? <PageLoader /> : error ? <ErrorBox message={error} onRetry={refetch} /> : users.length === 0 ? (
        <EmptyState icon={UsersIcon} title="No users found" text="Try adjusting your search or filters." />
      ) : (
        <TableCard>
          <table className="w-full min-w-[860px]">
            <thead><tr><Th>User</Th><Th>Role</Th><Th>Current plan</Th><Th>Joined</Th><Th>Active</Th><Th className="text-right">Actions</Th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => {
                const plan = planOf.get(u._id);
                const self = u._id === me._id;
                return (
                  <tr key={u._id} className="hover:bg-[#FAFAFC] transition-colors">
                    <Td>
                      <Link to={`/admin/users/${u._id}`} className="flex items-center gap-3 group">
                        <Avatar user={u} size={38} />
                        <div className="min-w-0">
                          <div className="font-extrabold truncate group-hover:text-[#6C5CE7]">{u.name}{self && <span className="text-[#A0A3B5] font-semibold"> (you)</span>}</div>
                          <div className="text-[11.5px] text-[#808191] truncate">{u.email}</div>
                        </div>
                      </Link>
                    </Td>
                    <Td>
                      <Pill tone={u.role === 'admin' ? 'purple' : 'gray'}>{u.role}</Pill>
                      {u.deletionRequestStatus === 'pending' && <Pill tone="yellow" className="ml-1.5">deletion pending</Pill>}
                    </Td>
                    <Td>
                      {plan ? (
                        <div>
                          <div className="font-bold">{plan.planName}</div>
                          <div className="text-[11px] text-[#808191] font-semibold">{plan.classesUsed}/{plan.classesAllowed} classes · to {fdate(plan.endDate)}</div>
                        </div>
                      ) : <span className="text-[#A0A3B5] font-semibold">No plan</span>}
                    </Td>
                    <Td className="text-[#6E7191] font-semibold whitespace-nowrap">{fdate(u.createdAt)}</Td>
                    <Td><Toggle checked={u.isActive !== false} onChange={(v) => toggleActive(u, v)} disabled={self} label="Toggle active" /></Td>
                    <Td className="text-right">
                      <div className="inline-flex gap-2">
                        <IconBtn as={Link} to={`/admin/users/${u._id}`} icon={Eye} label="View user" />
                        <IconBtn icon={Trash2} label="Delete user" tone="danger" disabled={self} onClick={() => setDel(u)} />
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableCard>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="Create user">
        <form onSubmit={create} className="space-y-4">
          {err && <ErrorBox message={err} />}
          <Field label="FULL NAME"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
          <Field label="EMAIL"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="PASSWORD"><input required minLength={6} type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputCls} placeholder="Min 6 chars" /></Field>
            <Field label="ROLE">
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls}>
                <option value="user">Student</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="soft" onClick={() => setCreating(false)}>Cancel</Button>
            <Button type="submit" loading={busy}>Create user</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal open={!!del} onClose={() => setDel(null)} onConfirm={remove} loading={busy} danger title="Delete this user?" confirmLabel="Delete user" text={`${del?.name} (${del?.email}) will be permanently removed along with their enrollments. This cannot be undone.`} />
    </>
  );
}
