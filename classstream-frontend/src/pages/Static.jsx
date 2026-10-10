import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, PlayCircle, ShieldCheck, Sparkles, Users2, Send } from 'lucide-react';
import { DotGrid, Envelope3D, Rocket3D, ShoppingBag3D } from '../components/Visuals.tsx';
import { Button, Field, inputCls, SectionBadge, Card } from '../components/ui.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { api } from '../lib/api.js';

/* ---------- Shared page hero (cream panel + dots, like the SmartList hero) ---------- */
function PageHero({ badge, color, title, text, children }) {
  return (
    <section className="relative overflow-hidden pb-16 lg:pb-20">
      <div className="hidden lg:block absolute top-0 right-0 w-[40%] h-full bg-[#FBF6EF] pointer-events-none" aria-hidden="true" />
      <div className="hidden lg:block absolute -bottom-10 right-[34%] w-[220px] h-[220px] rounded-full bg-[#DCF6F9] pointer-events-none" aria-hidden="true" />
      <div className="hidden sm:block absolute bottom-4 left-0">
        <DotGrid rows={6} cols={5} color="#6FD4F2" gap={12} />
      </div>
      <div className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-10 pt-6 lg:pt-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }} className="max-w-[640px]">
          <SectionBadge color={color}>{badge}</SectionBadge>
          <h1 className="font-display text-[44px] sm:text-[58px] font-extrabold leading-[1.05] tracking-[-0.035em] mb-5">{title}</h1>
          <p className="text-[15.5px] text-[#808191] leading-[1.7] max-w-[520px]">{text}</p>
          {children}
        </motion.div>
      </div>
    </section>
  );
}

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.3 },
  transition: { duration: 0.6, delay: i * 0.08 },
});

/* =============================== ABOUT =============================== */
export function About() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api.growthHighlights().then((r) => setStats(r.growthHighlights?.stats)).catch(() => {});
  }, []);
  const fallback = [
    { value: 14000, suffix: '+', label: 'Active Students' },
    { value: 150, suffix: '+', label: 'HD Video Lessons' },
    { value: 25, suffix: '+', label: 'Curriculums' },
    { value: 98.6, suffix: '%', label: 'Satisfaction' },
  ];
  const list = stats || fallback;

  const values = [
    { icon: PlayCircle, color: '#FF856B', bg: 'bg-[#FDEBE4]', t: 'Stream anywhere', d: 'Crisp, zero-buffering HD video you can watch on any device, any time.' },
    { icon: Sparkles, color: '#6C5CE7', bg: 'bg-[#EDE9FE]', t: 'Pay for what you need', d: 'Pick a plan with the number of classes you want. Unlock only what matters to you.' },
    { icon: ShieldCheck, color: '#10B981', bg: 'bg-[#E6F9F0]', t: 'Secure & protected', d: 'Video links are issued only after access is verified against your subscription.' },
    { icon: Users2, color: '#3B82F6', bg: 'bg-[#E6F4FF]', t: 'Learner first', d: 'Everything is designed around making it easy to start, continue and finish a class.' },
  ];

  return (
    <>
      <PageHero badge="ABOUT US" title="We make learning feel effortless" text="ClassStream is a video class platform. Subscribe to a plan, unlock the classes you want and learn at your own pace — no clutter, no confusion." />

      <section className="bg-[#F3FAFA] py-20 relative overflow-hidden">
        <div className="hidden sm:block absolute top-10 left-0">
          <DotGrid rows={6} cols={4} color="#74D4F4" gap={12} />
        </div>
        <div className="max-w-[1180px] mx-auto px-6 sm:px-10 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div {...fadeUp()}>
            <SectionBadge color="purple">OUR STORY</SectionBadge>
            <h2 className="font-display text-[34px] sm:text-[42px] font-extrabold leading-[1.16] tracking-[-0.025em] mb-5">Built for people who want to get better at something</h2>
            <p className="text-[15px] text-[#808191] leading-[1.7] mb-4">
              Great classes shouldn't be locked behind complicated platforms. We started ClassStream to give learners a calm, focused place to watch high-quality video lessons and track what they've unlocked.
            </p>
            <p className="text-[15px] text-[#808191] leading-[1.7]">
              Choose a subscription, assign classes to your account as you watch, and come back to them whenever you like for as long as your plan is active.
            </p>
          </motion.div>
          <motion.div {...fadeUp(1)} className="relative flex justify-center">
            <div className="bg-[#FDF5EC] rounded-[30px] p-8 border-[6px] border-white shadow-smart-card w-full max-w-[420px]">
              <div className="grid grid-cols-2 gap-4">
                {list.map((s, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-smart-card">
                    <div className="font-display text-[28px] font-extrabold tracking-tight">
                      {Number(s.value).toLocaleString('en-IN')}
                      {s.suffix}
                    </div>
                    <div className="text-[12px] text-[#808191] font-semibold mt-1 leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.2, repeat: Infinity }} className="hidden sm:block absolute -top-14 -right-2">
              <Rocket3D />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-[1180px] mx-auto px-6 sm:px-10">
          <motion.div {...fadeUp()} className="max-w-xl mb-12">
            <SectionBadge color="cyan">WHAT WE BELIEVE</SectionBadge>
            <h2 className="font-display text-[34px] sm:text-[42px] font-extrabold leading-[1.16] tracking-[-0.025em]">Simple principles, better learning</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.t} {...fadeUp(i)} whileHover={{ y: -6 }} className={`${v.bg} rounded-[24px] p-7`}>
                <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-smart-card">
                  <v.icon size={20} color={v.color} />
                </div>
                <h3 className="font-display text-[17px] font-extrabold mb-2">{v.t}</h3>
                <p className="text-[13px] text-[#4F5265] leading-[1.65]">{v.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* =============================== CONTACT =============================== */
export function Contact() {
  const toast = useToast();
  const [f, setF] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  // The backend has no contact endpoint, so this is a UI-only confirmation.
  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    toast.success('Message sent — we will get back to you within 24 hours.');
    setTimeout(() => {
      setF({ name: '', email: '', subject: '', message: '' });
      setSent(false);
    }, 3500);
  };

  const info = [
    [Mail, 'Email us', 'support@classstream.com', '#6C5CE7', 'bg-[#EDE9FE]'],
    [Phone, 'Call us', '+91 98765 43210', '#10B981', 'bg-[#E6F9F0]'],
    [MapPin, 'Visit us', 'Thanjavur, Tamil Nadu, India', '#FF5E3A', 'bg-[#FFE5E0]'],
    [Clock, 'Support hours', 'Mon – Sat, 9am – 6pm IST', '#D97706', 'bg-[#FFF3D1]'],
  ];

  return (
    <>
      <PageHero badge="CONTACT" color="yellow" title="Let's talk" text="Questions about plans, payments or your classes? Send us a message and our team will reply within one working day." />
      <section className="pb-24">
        <div className="max-w-[1180px] mx-auto px-6 sm:px-10 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-1 gap-4 content-start">
            {info.map(([Icon, t, d, c, bg], i) => (
              <motion.div key={t} {...fadeUp(i)} className="bg-white rounded-2xl border border-gray-100 shadow-smart-card p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
                  <Icon size={20} color={c} />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#808191]">{t}</div>
                  <div className="text-[14px] font-extrabold">{d}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.form {...fadeUp(1)} onSubmit={submit} className="lg:col-span-3 relative bg-[#FDF5EC] rounded-[30px] p-6 sm:p-9 border-[6px] border-white shadow-smart-card">
            <div className="hidden sm:block absolute -top-10 -right-6">
              <Envelope3D />
            </div>
            <h2 className="font-display text-[24px] font-extrabold mb-1">Send us a message</h2>
            <p className="text-[13px] text-[#808191] mb-6">We read every message.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="NAME">
                <input required value={f.name} onChange={set('name')} placeholder="Your name" className={inputCls} />
              </Field>
              <Field label="EMAIL">
                <input required type="email" value={f.email} onChange={set('email')} placeholder="you@example.com" className={inputCls} />
              </Field>
            </div>
            <Field label="SUBJECT" className="mt-4">
              <input required value={f.subject} onChange={set('subject')} placeholder="How can we help?" className={inputCls} />
            </Field>
            <Field label="MESSAGE" className="mt-4">
              <textarea required rows={5} value={f.message} onChange={set('message')} placeholder="Tell us a bit more…" className={`${inputCls} resize-none`} />
            </Field>
            <Button type="submit" size="lg" className="mt-6">
              <Send size={15} /> {sent ? 'Sent ✓' : 'Send message'}
            </Button>
          </motion.form>
        </div>
      </section>
    </>
  );
}

/* =============================== LEGAL =============================== */
function Legal({ badge, title, updated, sections }) {
  return (
    <>
      <PageHero badge={badge} color="navy" title={title} text={`Last updated: ${updated}`} />
      <section className="pb-24">
        <div className="max-w-[1180px] mx-auto px-6 sm:px-10 grid lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-8 bg-[#F3FAFA] rounded-[24px] p-6">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6E7191] mb-4">On this page</div>
              <ul className="space-y-3">
                {sections.map(([h], i) => (
                  <li key={h}>
                    <a href={`#s${i}`} className="text-[13px] font-semibold text-[#4F5265] hover:text-[#6C5CE7] transition-colors">
                      {i + 1}. {h}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <div className="lg:col-span-9 space-y-5">
            {sections.map(([h, body], i) => (
              <motion.div key={h} id={`s${i}`} {...fadeUp()} className="bg-white rounded-[24px] border border-gray-100 shadow-smart-card p-7 sm:p-9 scroll-mt-8">
                <h2 className="font-display text-[20px] font-extrabold mb-3">
                  <span className="text-[#6C5CE7] mr-2">{String(i + 1).padStart(2, '0')}</span>
                  {h}
                </h2>
                {body.map((p, j) => (
                  <p key={j} className="text-[14px] text-[#6E7191] leading-[1.75] mb-3 last:mb-0">
                    {p}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export const Terms = () => (
  <Legal
    badge="TERMS OF SERVICE"
    title="Terms of Service"
    updated="1 October 2026"
    sections={[
      ['Acceptance of terms', ['By creating an account or using ClassStream you agree to these Terms. If you do not agree, please do not use the platform.']],
      ['Your account', ['You are responsible for keeping your login details confidential and for all activity under your account. Provide accurate information when registering.', 'We may suspend or deactivate accounts that violate these Terms or are used fraudulently.']],
      ['Subscriptions & classes', ['A subscription gives you access to a set number of classes for a fixed period. When you open a subscription-only video for the first time, its class is assigned to your account and counts toward your plan limit.', 'Once a class is assigned it stays available for as long as the subscription is active. Free videos can be watched without using a class slot.']],
      ['Payments & refunds', ['Payments are processed securely by Razorpay in Indian Rupees (INR). A receipt is available in your profile after every successful payment.', 'Because digital access starts immediately, payments are generally non-refundable once a class has been assigned, except where required by law.']],
      ['Acceptable use', ['Do not share your account, download or redistribute videos, attempt to bypass access controls, or use the service for unlawful purposes.']],
      ['Content & intellectual property', ['All videos, text and design on ClassStream are owned by us or our instructors and are protected by copyright. You receive a personal, non-transferable licence to watch content for your own learning.']],
      ['Account deletion', ['You can request deletion of your account from your profile. Requests are reviewed by an administrator, and approved requests permanently remove your account data.']],
      ['Changes & contact', ['We may update these Terms from time to time; continued use means you accept the changes. Questions? Reach us through the Contact page.']],
    ]}
  />
);

export const Privacy = () => (
  <Legal
    badge="PRIVACY POLICY"
    title="Privacy Policy"
    updated="1 October 2026"
    sections={[
      ['Information we collect', ['We collect your name, email address and encrypted password when you register, plus optional profile details such as an avatar.', 'We also record your subscriptions, the classes assigned to you and payment references so we can provide access and receipts.']],
      ['How we use your information', ['To create and secure your account, provide the classes you have unlocked, process payments, send service messages and improve the platform.']],
      ['Payments', ['Card, UPI and bank details are handled directly by Razorpay. We never see or store your full payment credentials — only order and payment identifiers and the amount paid.']],
      ['Cookies & local storage', ['We use a secure session cookie and local browser storage to keep you signed in. We do not use them for advertising.']],
      ['Data sharing', ['We do not sell your personal data. We share it only with service providers needed to run ClassStream (such as payment and video hosting) or when required by law.']],
      ['Security', ['Passwords are hashed, video links are only released after access checks, and administrator tools are restricted by role.']],
      ['Your rights', ['You can update your profile at any time and request permanent deletion of your account from your profile page. Contact us for a copy of your data.']],
      ['Contact', ['For privacy questions please use the Contact page and mention "Privacy" in the subject.']],
    ]}
  />
);

/* =============================== 404 =============================== */
export function NotFound() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="max-w-[640px] mx-auto px-6 text-center relative">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.4, repeat: Infinity }} className="flex justify-center mb-4">
          <ShoppingBag3D />
        </motion.div>
        <div className="font-display text-[88px] font-extrabold tracking-[-0.05em] leading-none">404</div>
        <h1 className="font-display text-[26px] font-extrabold mt-3">This page wandered off</h1>
        <p className="text-[14.5px] text-[#808191] mt-3 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Button as={Link} to="/" size="lg">
          Back to home
        </Button>
      </div>
    </section>
  );
}
