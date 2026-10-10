import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Lock, Play, PlayCircle, Unlock, Clock3, Film, Check } from 'lucide-react';
import { DotGrid } from '../../components/Visuals.tsx';
import { Button, ConfirmModal, EmptyState, ErrorBox, Modal, PageLoader, Pill } from '../../components/ui.jsx';
import { accentFor } from '../../components/Cards.jsx';
import { api, mediaUrl } from '../../lib/api.js';
import { toEmbed } from '../../lib/format.js';
import { useAsync } from '../../lib/hooks.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function ClassDetail() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const { data, loading, error, refetch, reload } = useAsync(() => api.lessons(), [user?._id]);

  const [playing, setPlaying] = useState(null); // { _id, title, url }
  const [busy, setBusy] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [gate, setGate] = useState(null); // 'login' | 'subscribe' | 'limit' | 'admin'

  if (loading) return <PageLoader label="Loading class…" />;
  if (error) return <div className="max-w-[1240px] mx-auto px-6 py-10"><ErrorBox message={error} onRetry={refetch} /></div>;

  const idx = data.lessons.findIndex((l) => l._id === id);
  const lesson = data.lessons[idx];
  const sub = data.subscription;
  if (!lesson)
    return (
      <div className="max-w-[900px] mx-auto px-6 py-16">
        <EmptyState title="Class not found" text="This class may have been removed or is no longer available." action={<Button as={Link} to="/classes">Back to classes</Button>} />
      </div>
    );

  const a = accentFor(idx);
  const unlocked = lesson.isUnlocked;
  const needsSlot = (v) => v.accessType === 'subscription' && !unlocked;

  const play = async (video, confirmed = false) => {
    if (!user) return setGate('login');
    if (isAdmin) return setGate('admin');
    if (needsSlot(video)) {
      if (!sub) return setGate('subscribe');
      if (sub.classesLeft <= 0) return setGate('limit');
      if (!confirmed) return setConfirm(video);
    }
    setBusy(video._id);
    try {
      const res = await api.accessVideo(lesson._id, video._id);
      setPlaying({ _id: video._id, title: video.title, url: res.video.url });
      if (res.newlyUnlocked) {
        toast.success(`"${lesson.title}" is now assigned to you — ${res.subscription.classesLeft} class${res.subscription.classesLeft === 1 ? '' : 'es'} left.`);
      }
      reload();
    } catch (e) {
      if (e.code === 'NO_SUBSCRIPTION') setGate('subscribe');
      else if (e.code === 'LIMIT_REACHED') setGate('limit');
      else toast.error(e.message);
    } finally {
      setBusy(null);
      setConfirm(null);
    }
  };

  const embed = playing && toEmbed(playing.url);
  const total = lesson.videos.length;

  return (
    <div className="relative">
      <div className="hidden sm:block absolute top-0 left-0"><DotGrid rows={6} cols={4} color="#6FD4F2" gap={12} /></div>
      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10 pt-4 pb-24">
        <Link to="/classes" className="inline-flex items-center gap-2 text-[13px] font-bold text-[#6E7191] hover:text-[#11142D] mb-6">
          <ArrowLeft size={15} /> All classes
        </Link>

        <div className="mb-8 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-1 w-10 rounded-full" style={{ background: a.bar }} />
            {unlocked ? <Pill tone="green"><Unlock size={10} /> Assigned to you</Pill> : <Pill tone="gray"><Lock size={10} /> Not unlocked</Pill>}
          </div>
          <h1 className="font-display text-[36px] sm:text-[48px] font-extrabold leading-[1.1] tracking-[-0.03em]">{lesson.title}</h1>
          {lesson.description && <p className="text-[15px] text-[#808191] leading-[1.7] mt-3">{lesson.description}</p>}
          <div className="flex flex-wrap gap-5 mt-5 text-[13px] font-semibold text-[#6E7191]">
            <span className="inline-flex items-center gap-2"><Film size={15} style={{ color: a.bar }} />{total} video{total === 1 ? '' : 's'}</span>
            {lesson.duration && <span className="inline-flex items-center gap-2"><Clock3 size={15} style={{ color: a.bar }} />{lesson.duration}</span>}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Player */}
          <div className="lg:col-span-8">
            <div className="relative aspect-video rounded-[28px] overflow-hidden bg-[#0B0D17] shadow-smart-float">
              <AnimatePresence mode="wait">
                {playing ? (
                  <motion.div key={playing._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                    {embed ? (
                      <iframe src={embed} title={playing.title} className="w-full h-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
                    ) : (
                      <video key={playing.url} src={mediaUrl(playing.url)} controls autoPlay controlsList="nodownload" onContextMenu={(e) => e.preventDefault()} className="w-full h-full bg-black" />
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center text-center p-6" style={{ background: `radial-gradient(circle at 30% 20%, ${a.bar}55, transparent 55%), radial-gradient(circle at 80% 80%, #6852ED66, transparent 55%), #0B0D17` }}>
                    <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.6, repeat: Infinity }} className="w-20 h-20 rounded-full bg-white/15 backdrop-blur flex items-center justify-center mb-5">
                      <Play size={32} className="text-white ml-1" fill="white" />
                    </motion.div>
                    <div className="text-white font-display text-[20px] font-extrabold">Select a video to start</div>
                    <div className="text-white/60 text-[13px] mt-1.5">Free videos can be watched anytime</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {playing && (
              <div className="mt-5 px-1">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#808191] mb-1">Now playing</div>
                <h2 className="font-display text-[20px] font-extrabold">{playing.title}</h2>
              </div>
            )}
          </div>

          {/* Video list */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-smart-card p-4">
              <div className="px-2 pt-2 pb-3 flex items-center justify-between">
                <h3 className="font-display text-[16px] font-extrabold">Videos in this class</h3>
                <span className="text-[12px] font-bold text-[#808191]">{total}</span>
              </div>
              {total === 0 ? (
                <p className="text-[13px] text-[#808191] px-2 pb-4">Videos are coming soon.</p>
              ) : (
                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {lesson.videos.map((v, i) => {
                    const active = playing?._id === v._id;
                    const free = v.accessType === 'free';
                    const open = free || unlocked;
                    return (
                      <button key={v._id} onClick={() => play(v)} disabled={busy === v._id} className={`w-full text-left flex items-center gap-3 rounded-2xl px-3.5 py-3 transition-all border ${active ? 'bg-[#EDE9FE] border-[#9186F7]/40' : 'bg-white border-gray-100 hover:bg-[#F9FAFF]'}`}>
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[12px] font-extrabold ${active ? 'bg-[#6C5CE7] text-white' : open ? 'bg-[#E6F9F0] text-[#10B981]' : 'bg-[#F4F5F8] text-[#A0A3B5]'}`}>
                          {busy === v._id ? <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : active ? <PlayCircle size={17} /> : open ? <Check size={15} strokeWidth={3} /> : <Lock size={14} />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-bold truncate">{i + 1}. {v.title}</span>
                          <span className="block text-[11px] text-[#808191] font-semibold">{v.duration || '—'}</span>
                        </span>
                        {free ? <Pill tone="blue">Free</Pill> : <Pill tone={unlocked ? 'green' : 'purple'}>{unlocked ? 'Open' : 'Plan'}</Pill>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {!unlocked && user && !isAdmin && (
              <div className="bg-[#11142D] text-white rounded-[24px] p-6">
                <h3 className="font-display text-[17px] font-extrabold mb-2">Unlock this class</h3>
                <p className="text-[12.5px] text-white/60 leading-relaxed mb-5">
                  {sub ? `Playing any plan video assigns this class to you and uses 1 of your ${sub.classesLeft} remaining classes.` : 'Subscribe to a plan to watch the plan videos in this class.'}
                </p>
                {!sub && <Button as={Link} to="/subscription" variant="purple" className="w-full">View plans</Button>}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => play(confirm, true)}
        loading={!!busy}
        title="Assign this class to you?"
        confirmLabel="Assign & play"
        text={`Watching "${confirm?.title}" will assign "${lesson.title}" to your account and use 1 of your ${sub?.classesLeft} remaining classes. You can then watch every video in it until ${sub ? new Date(sub.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'your plan ends'}.`}
      />

      <Modal
        open={!!gate}
        onClose={() => setGate(null)}
        title={{ login: 'Log in to watch', subscribe: 'Subscription required', limit: 'Class limit reached', admin: 'Student accounts only' }[gate] || ''}
        footer={
          <>
            <Button variant="soft" onClick={() => setGate(null)}>Not now</Button>
            {gate === 'login' && <Button onClick={() => nav('/login', { state: { from: `/classes/${id}` } })}>Log in</Button>}
            {(gate === 'subscribe' || gate === 'limit') && <Button onClick={() => nav('/subscription')}>{gate === 'limit' ? 'Upgrade or renew' : 'View plans'}</Button>}
          </>
        }
      >
        <p className="text-[14px] text-[#6E7191] leading-relaxed">
          {gate === 'login' && 'Please log in or create a free account to stream videos.'}
          {gate === 'subscribe' && 'You need an active subscription to unlock this class. Free preview videos stay available to everyone.'}
          {gate === 'limit' && 'You have used every class included in your plan. Renew or buy another plan to unlock more classes.'}
          {gate === 'admin' && 'Administrators manage content from the admin console. Sign in with a student account to stream classes.'}
        </p>
      </Modal>
    </div>
  );
}
