import { useState } from 'react';
import { Mail, Calendar, ShieldCheck, Save } from 'lucide-react';
import { AdminHead } from '../../components/admin.jsx';
import { Avatar, Button, Field, Pill, inputCls } from '../../components/ui.jsx';
import { api } from '../../lib/api.js';
import { fdate } from '../../lib/format.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function AdminProfile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: user.name, avatar: user.avatar || '' });
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api.updateMe(form);
      setUser((u) => ({ ...u, ...r.user }));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AdminHead title="My profile" text="Your administrator account." />
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white rounded-[28px] shadow-smart-card border border-gray-100/80 p-8 text-center relative overflow-hidden">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#DCF6F9]" />
          <div className="relative">
            <Avatar user={user} size={112} className="mx-auto ring-4 ring-white shadow-smart-card" />
            <h2 className="font-display text-[24px] font-extrabold mt-5">{user.name}</h2>
            <div className="mt-2"><Pill tone="purple"><ShieldCheck size={11} /> Administrator</Pill></div>
            <div className="mt-6 space-y-3 text-[13px] text-[#6E7191] font-semibold text-left">
              <div className="flex items-center gap-3"><Mail size={15} className="text-[#6C5CE7]" />{user.email}</div>
              <div className="flex items-center gap-3"><Calendar size={15} className="text-[#6C5CE7]" />Joined {fdate(user.createdAt)}</div>
            </div>
          </div>
        </div>

        <form onSubmit={save} className="lg:col-span-8 bg-white rounded-[28px] shadow-smart-card border border-gray-100/80 p-6 sm:p-8">
          <h2 className="font-display text-[20px] font-extrabold mb-6">Edit details</h2>
          <div className="space-y-4 max-w-lg">
            <Field label="FULL NAME"><input required minLength={2} maxLength={50} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
            <Field label="EMAIL" hint="Email cannot be changed."><input disabled value={user.email} className={`${inputCls} bg-[#F4F5F8] text-[#808191]`} /></Field>
            <Field label="AVATAR URL" hint="Paste a link to an image (optional)."><input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="https://…" className={inputCls} /></Field>
          </div>
          <Button type="submit" loading={busy} className="mt-6"><Save size={15} /> Save changes</Button>
        </form>
      </div>
    </>
  );
}
