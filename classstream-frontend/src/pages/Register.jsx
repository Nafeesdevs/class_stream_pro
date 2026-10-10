import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import AuthShell from '../components/AuthShell.jsx';
import { Button, Field, inputCls, ErrorBox } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ClassPreviewSide } from './Login.jsx';

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [agree, setAgree] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.password.length < 6) return setErr('Password must be at least 6 characters long');
    if (form.password !== form.confirm) return setErr('Passwords do not match');
    setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created — welcome to ClassStream!');
      nav('/subscription', { replace: true });
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  const icon = (I) => <I size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A3B5]" />;

  return (
    <AuthShell badge="Get started" title="Create your account" text="Join ClassStream, choose a plan and start unlocking classes in minutes." side={<ClassPreviewSide />}>
      <form onSubmit={submit} className="space-y-4 max-w-[400px]">
        {err && <ErrorBox message={err} />}
        <Field label="FULL NAME">
          <div className="relative">
            {icon(User)}
            <input required value={form.name} onChange={set('name')} placeholder="Alex Morgan" className={`${inputCls} pl-11`} />
          </div>
        </Field>
        <Field label="EMAIL">
          <div className="relative">
            {icon(Mail)}
            <input type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" className={`${inputCls} pl-11`} />
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="PASSWORD">
            <div className="relative">
              {icon(Lock)}
              <input type="password" required value={form.password} onChange={set('password')} placeholder="Min 6 chars" className={`${inputCls} pl-11`} />
            </div>
          </Field>
          <Field label="CONFIRM">
            <input type="password" required value={form.confirm} onChange={set('confirm')} placeholder="Repeat" className={inputCls} />
          </Field>
        </div>
        <label className="flex items-start gap-3 text-[12.5px] text-[#808191] leading-relaxed">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 accent-[#6C5CE7]" />
          <span>
            I agree to the{' '}
            <Link to="/terms" className="font-bold text-[#11142D] hover:underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-bold text-[#11142D] hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        <Button type="submit" size="lg" loading={busy} disabled={!agree} className="w-full">
          Create account
        </Button>
        <p className="text-[13px] text-[#808191] text-center">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-[#6C5CE7] hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
