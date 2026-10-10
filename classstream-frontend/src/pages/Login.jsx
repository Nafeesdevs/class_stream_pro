import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import AuthShell from '../components/AuthShell.jsx';
import { Button, Field, inputCls, ErrorBox } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

// Matches the credentials seeded by the backend (config/db.js)
const DEMOS = [
  { label: 'Demo admin', email: 'admin@classstream.com', password: 'admin12345' },
  { label: 'Demo student', email: 'student@classstream.com', password: 'student12345' },
];

export function ClassPreviewSide() {
  return (
    <div className="bg-white rounded-[28px] shadow-smart-float p-6 border border-gray-100">
      <div className="flex gap-1.5 mb-4">
        <span className="h-1 w-8 rounded-full bg-[#FF6B4A]" />
        <span className="h-1 w-10 rounded-full bg-[#3B82F6]" />
        <span className="h-1 w-6 rounded-full bg-[#10B981]" />
      </div>
      <div className="text-[15px] font-extrabold mb-1">Continue learning</div>
      <p className="text-[12px] text-[#808191] mb-5">Pick up exactly where you left off.</p>
      {['Introduction to the course', 'Core fundamentals', 'Advanced deep dive'].map((t, i) => (
        <div key={t} className="flex items-center gap-3 py-3 border-t border-gray-100">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${i === 0 ? 'bg-[#14172B] text-white' : 'border-2 border-[#9186F7]'}`}>{i === 0 && '✓'}</span>
          <span className="text-[13px] font-semibold">{t}</span>
        </div>
      ))}
    </div>
  );
}

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const u = await login(form.email, form.password);
      toast.success(`Welcome back, ${u.name.split(' ')[0]}!`);
      nav(u.role === 'admin' ? '/admin' : loc.state?.from || '/', { replace: true });
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell badge="Welcome back" title="Log in to your classes" text="Sign in to continue streaming the classes assigned to you." side={<ClassPreviewSide />}>
      <form onSubmit={submit} className="space-y-4 max-w-[400px]">
        {err && <ErrorBox message={err} />}
        <Field label="EMAIL">
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A3B5]" />
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className={`${inputCls} pl-11`} />
          </div>
        </Field>
        <Field label="PASSWORD">
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A3B5]" />
            <input type={show ? 'text' : 'password'} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className={`${inputCls} pl-11 pr-11`} />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A3B5] hover:text-[#11142D]" aria-label="Toggle password">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>
        <Button type="submit" size="lg" loading={busy} className="w-full">
          Log in
        </Button>
        <p className="text-[13px] text-[#808191] text-center">
          New to ClassStream?{' '}
          <Link to="/register" className="font-bold text-[#6C5CE7] hover:underline">
            Create an account
          </Link>
        </p>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#A0A3B5] mb-2.5">Quick fill (seeded accounts)</p>
          <div className="flex flex-wrap gap-2">
            {DEMOS.map((d) => (
              <button key={d.label} type="button" onClick={() => setForm({ email: d.email, password: d.password })} className="px-4 py-2 rounded-full bg-[#E8EAFC] text-[#6C5CE7] text-[12px] font-bold hover:bg-[#DCD9FB] transition">
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </AuthShell>
  );
}
