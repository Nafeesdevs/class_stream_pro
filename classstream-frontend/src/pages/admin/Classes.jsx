import { useState } from 'react';
import { Pencil, Plus, Trash2, BookOpenCheck, ChevronDown, PlayCircle, Upload, Link2, X, Save } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { AdminHead, IconBtn } from '../../components/admin.jsx';
import { Button, ConfirmModal, EmptyState, ErrorBox, Field, Modal, PageLoader, Pill, Toggle, inputCls } from '../../components/ui.jsx';
import { api, mediaUrl } from '../../lib/api.js';
import { toEmbed } from '../../lib/format.js';
import { useAsync } from '../../lib/hooks.js';
import { useToast } from '../../context/ToastContext.jsx';

const ACCESS = [['subscription', 'Subscription only'], ['free', 'Free preview']];

/** Builds the multipart body the backend expects for add/update video. */
const videoForm = (v) => {
  const f = new FormData();
  f.append('title', v.title);
  f.append('duration', v.duration || '');
  f.append('accessType', v.accessType);
  if (v.mode === 'file' && v.file) f.append('video', v.file);
  else if (v.url) f.append('videoUrl', v.url);
  return f;
};

/** One video input block (used for new videos and when editing an existing one). */
function VideoFields({ v, onChange, existing }) {
  const set = (k, val) => onChange({ ...v, [k]: val });
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <Field label="VIDEO TITLE" className="sm:col-span-2"><input required value={v.title ?? ''} onChange={(e) => set('title', e.target.value)} className={inputCls} placeholder="e.g. 01. Introduction" /></Field>
      <Field label="DURATION"><input value={v.duration ?? ''} onChange={(e) => set('duration', e.target.value)} className={inputCls} placeholder="12:30" /></Field>
      <Field label="ACCESS">
        <select value={v.accessType} onChange={(e) => set('accessType', e.target.value)} className={inputCls}>
          {ACCESS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      </Field>
      <div className="sm:col-span-2">
        <div className="flex gap-2 mb-2">
          {[['file', Upload, 'Upload file'], ['url', Link2, 'Paste URL']].map(([m, Icon, l]) => (
            <button key={m} type="button" onClick={() => set('mode', m)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold transition ${v.mode === m ? 'bg-[#11142D] text-white' : 'bg-[#F4F5F8] text-[#4F5265] hover:bg-[#E8EAFC]'}`}>
              <Icon size={13} /> {l}
            </button>
          ))}
        </div>
        {v.mode === 'file' ? (
          <input type="file" accept="video/*" onChange={(e) => set('file', e.target.files?.[0] || null)} className="block w-full text-[12.5px] text-[#6E7191] file:mr-4 file:rounded-full file:border-0 file:bg-[#E8EAFC] file:text-[#6C5CE7] file:font-bold file:px-4 file:py-2.5 hover:file:bg-[#DCD9FB]" />
        ) : (
          <input value={v.url ?? ''} onChange={(e) => set('url', e.target.value)} className={inputCls} placeholder="https://… .mp4 / YouTube / Vimeo link" />
        )}
        {existing && <p className="text-[11px] text-[#808191] mt-1.5">Leave empty to keep the current video.</p>}
      </div>
    </div>
  );
}

const newVideo = () => ({ key: Math.random().toString(36).slice(2), title: '', duration: '', accessType: 'subscription', mode: 'file', file: null, url: '' });

/* ------------------------------------------------------------------ */
function ClassModal({ lesson, onClose, onSaved }) {
  const toast = useToast();
  const isNew = !lesson;
  const [f, setF] = useState({ title: lesson?.title || '', description: lesson?.description || '', order: lesson?.order ?? '', duration: lesson?.duration || '', isActive: lesson?.isActive ?? true });
  const [videos, setVideos] = useState(lesson?.videos || []);
  const [staged, setStaged] = useState(isNew ? [newVideo()] : []);
  const [editing, setEditing] = useState(null); // {id, ...fields}
  const [delVid, setDelVid] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [progress, setProgress] = useState('');

  const saveExisting = async () => {
    setBusy(true);
    try {
      const res = await api.updateVideo(lesson._id, editing.id, videoForm(editing));
      setVideos(res.lesson.videos);
      setEditing(null);
      toast.success('Video updated');
      onSaved(true);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const removeExisting = async () => {
    setBusy(true);
    try {
      const res = await api.deleteVideo(lesson._id, delVid._id);
      setVideos(res.lesson.videos);
      setDelVid(null);
      toast.success('Video removed');
      onSaved(true);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const ready = staged.filter((s) => s.title.trim() || s.file || s.url);
    for (const s of ready) {
      if (!s.title.trim()) return setErr('Every new video needs a title.');
      if (s.mode === 'file' ? !s.file : !s.url.trim()) return setErr(`"${s.title}" needs a video file or URL.`);
    }
    setBusy(true);
    try {
      const body = { title: f.title, description: f.description, duration: f.duration, isActive: f.isActive, ...(f.order !== '' ? { order: Number(f.order) } : {}) };
      const saved = isNew ? await api.createLesson(body) : await api.updateLesson(lesson._id, body);
      const id = saved.lesson._id;

      let failed = 0;
      for (let i = 0; i < ready.length; i++) {
        setProgress(`Uploading video ${i + 1} of ${ready.length}…`);
        try {
          await api.addVideo(id, videoForm(ready[i]));
        } catch (e2) {
          failed++;
          toast.error(`"${ready[i].title}": ${e2.message}`);
        }
      }
      toast.success(isNew ? 'Class created' : 'Class updated');
      if (failed) toast.info(`${failed} video(s) failed — open the class to retry.`);
      onSaved();
      onClose();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
      setProgress('');
    }
  };

  return (
    <Modal open onClose={() => !busy && onClose()} title={isNew ? 'Create class' : 'Edit class'} wide>
      <form onSubmit={submit} className="space-y-5">
        {err && <ErrorBox message={err} />}
        <div className="grid sm:grid-cols-6 gap-3">
          <Field label="CLASS TITLE" className="sm:col-span-6"><input required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className={inputCls} placeholder="e.g. Full-Stack Web Development" /></Field>
          <Field label="DESCRIPTION" className="sm:col-span-6"><textarea rows={3} value={f.description ?? ''} onChange={(e) => setF({ ...f, description: e.target.value })} className={`${inputCls} resize-none`} /></Field>
          <Field label="TOTAL DURATION" className="sm:col-span-2"><input value={f.duration ?? ''} onChange={(e) => setF({ ...f, duration: e.target.value })} className={inputCls} placeholder="6h 20m" /></Field>
          <Field label="ORDER" className="sm:col-span-2" hint="Blank = add at end"><input type="number" min={0} value={f.order ?? ''} onChange={(e) => setF({ ...f, order: e.target.value })} className={inputCls} /></Field>
          <div className="sm:col-span-2 flex items-center gap-3 sm:pt-6">
            <Toggle checked={f.isActive} onChange={(v) => setF({ ...f, isActive: v })} label="Active" />
            <span className="text-[13px] font-bold">Active</span>
          </div>
        </div>

        {/* Existing videos */}
        {!isNew && (
          <div>
            <h4 className="font-display text-[15px] font-extrabold mb-3">Videos in this class ({videos.length})</h4>
            {videos.length === 0 ? <p className="text-[12.5px] text-[#808191]">No videos yet — add some below.</p> : (
              <div className="space-y-2">
                {[...videos].sort((a, b) => a.order - b.order).map((v) => (
                  <div key={v._id} className="rounded-2xl border border-gray-100 bg-[#FAFAFC]">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <PlayCircle size={18} className="text-[#6C5CE7] shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-extrabold truncate">{v.title}</div>
                        <div className="text-[11px] text-[#808191] font-semibold truncate">{v.duration || '—'} · {v.url}</div>
                      </div>
                      <Pill tone={v.accessType === 'free' ? 'blue' : 'purple'}>{v.accessType === 'free' ? 'Free' : 'Plan'}</Pill>
                      <IconBtn icon={Pencil} label="Edit video" onClick={() => setEditing(editing?.id === v._id ? null : { id: v._id, title: v.title, duration: v.duration, accessType: v.accessType, mode: 'url', file: null, url: v.url || '' })} />
                      <IconBtn icon={Trash2} label="Delete video" tone="danger" onClick={() => setDelVid(v)} />
                    </div>
                    <AnimatePresence initial={false}>
                      {editing?.id === v._id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="px-4 pb-4 pt-1">
                            <VideoFields v={editing} onChange={(nv) => setEditing({ ...nv, id: editing.id })} existing />
                            <div className="flex justify-end gap-2 mt-4">
                              <Button type="button" size="sm" variant="soft" onClick={() => setEditing(null)}>Cancel</Button>
                              <Button type="button" size="sm" loading={busy} onClick={saveExisting}><Save size={13} /> Save video</Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* New videos (multiple) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-display text-[15px] font-extrabold">{isNew ? 'Videos' : 'Add new videos'}</h4>
            <Button type="button" size="sm" variant="outline" onClick={() => setStaged([...staged, newVideo()])}><Plus size={13} /> Add another video</Button>
          </div>
          <div className="space-y-3">
            {staged.map((s, i) => (
              <div key={s.key} className="relative rounded-2xl border border-dashed border-[#C9CCDD] p-4 bg-white">
                <button type="button" onClick={() => setStaged(staged.filter((x) => x.key !== s.key))} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#F4F5F8] hover:bg-[#FFE0D9] hover:text-[#FF5E3A] flex items-center justify-center" aria-label="Remove"><X size={13} /></button>
                <div className="text-[11px] font-bold text-[#808191] uppercase tracking-wider mb-3">New video {i + 1}</div>
                <VideoFields v={s} onChange={(nv) => setStaged(staged.map((x) => (x.key === s.key ? nv : x)))} />
              </div>
            ))}
            {staged.length === 0 && <p className="text-[12.5px] text-[#808191]">No new videos staged.</p>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          {progress && <span className="text-[12px] font-bold text-[#6C5CE7] mr-auto">{progress}</span>}
          <Button type="button" variant="soft" onClick={onClose} disabled={busy}>Close</Button>
          <Button type="submit" loading={busy}>{isNew ? 'Create class' : 'Save class'}</Button>
        </div>
      </form>

      <ConfirmModal open={!!delVid} onClose={() => setDelVid(null)} onConfirm={removeExisting} loading={busy} danger title="Remove this video?" confirmLabel="Remove" text={`"${delVid?.title}" will be removed from this class.`} />
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
export default function AdminClasses() {
  const toast = useToast();
  const { data, loading, error, refetch, reload, setData } = useAsync(() => api.adminLessons(), []);
  const [modal, setModal] = useState(null); // 'new' | lesson
  const [open, setOpen] = useState(null);
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(null);

  const toggle = async (l, isActive) => {
    setData((d) => ({ ...d, lessons: d.lessons.map((x) => (x._id === l._id ? { ...x, isActive } : x)) }));
    try {
      await api.updateLesson(l._id, { isActive });
      toast.success(`${l.title} ${isActive ? 'activated' : 'deactivated'}`);
    } catch (e) {
      toast.error(e.message);
      reload();
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await api.deleteLesson(del._id);
      toast.success('Class deleted');
      setDel(null);
      reload();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const embed = preview && toEmbed(preview.url);

  return (
    <>
      <AdminHead title="Classes" text="Each class holds multiple videos with their own access rules.">
        <Button onClick={() => setModal('new')}><Plus size={15} /> New class</Button>
      </AdminHead>

      {loading ? <PageLoader /> : error ? <ErrorBox message={error} onRetry={refetch} /> : data.lessons.length === 0 ? (
        <EmptyState icon={BookOpenCheck} title="No classes yet" text="Create a class and add one or more videos to it." action={<Button onClick={() => setModal('new')}>Create class</Button>} />
      ) : (
        <div className="space-y-4">
          {data.lessons.map((l) => {
            const isOpen = open === l._id;
            return (
              <div key={l._id} className="bg-white rounded-[22px] shadow-smart-card border border-gray-100/80 overflow-hidden">
                <div className="flex flex-wrap items-center gap-4 p-5">
                  <button onClick={() => setOpen(isOpen ? null : l._id)} className="flex items-center gap-4 flex-1 min-w-[240px] text-left">
                    <span className="w-11 h-11 rounded-2xl bg-[#EDE9FE] text-[#6C5CE7] flex items-center justify-center font-extrabold text-[14px] shrink-0">{l.order}</span>
                    <span className="min-w-0">
                      <span className="block font-display text-[16px] font-extrabold truncate">{l.title}</span>
                      <span className="block text-[12px] text-[#808191] font-semibold">{l.videos.length} video{l.videos.length === 1 ? '' : 's'}{l.duration && ` · ${l.duration}`} · {l.videos.filter((v) => v.accessType === 'free').length} free</span>
                    </span>
                    <ChevronDown size={18} className={`ml-auto text-[#A0A3B5] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2.5"><Toggle checked={l.isActive} onChange={(v) => toggle(l, v)} label="Toggle class" /><span className="text-[12px] font-bold text-[#6E7191] w-14">{l.isActive ? 'Active' : 'Hidden'}</span></div>
                    <IconBtn icon={Pencil} label="Edit class" onClick={() => setModal(l)} />
                    <IconBtn icon={Trash2} label="Delete class" tone="danger" onClick={() => setDel(l)} />
                  </div>
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                        {l.description && <p className="text-[13px] text-[#808191] mb-4 leading-relaxed">{l.description}</p>}
                        {l.videos.length === 0 ? <p className="text-[13px] text-[#808191]">No videos yet.</p> : (
                          <div className="grid sm:grid-cols-2 gap-2.5">
                            {[...l.videos].sort((a, b) => a.order - b.order).map((v, i) => (
                              <button key={v._id} onClick={() => setPreview(v)} className="flex items-center gap-3 rounded-2xl bg-[#F6F7FB] hover:bg-[#EDE9FE] transition px-4 py-3 text-left">
                                <PlayCircle size={18} className="text-[#6C5CE7] shrink-0" />
                                <span className="min-w-0 flex-1"><span className="block text-[13px] font-extrabold truncate">{i + 1}. {v.title}</span><span className="block text-[11px] text-[#808191] font-semibold">{v.duration || '—'}</span></span>
                                <Pill tone={v.accessType === 'free' ? 'blue' : 'purple'}>{v.accessType === 'free' ? 'Free' : 'Plan'}</Pill>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {modal && <ClassModal lesson={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSaved={() => reload()} key={modal === 'new' ? 'new' : modal._id} />}

      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.title || ''} wide>
        {preview && (
          <div className="aspect-video rounded-2xl overflow-hidden bg-black">
            {embed ? <iframe src={embed} title={preview.title} className="w-full h-full" allowFullScreen /> : <video src={mediaUrl(preview.url)} controls autoPlay className="w-full h-full" />}
          </div>
        )}
      </Modal>

      <ConfirmModal open={!!del} onClose={() => setDel(null)} onConfirm={remove} loading={busy} danger title="Delete this class?" confirmLabel="Delete class" text={`"${del?.title}" and all ${del?.videos.length || 0} of its videos will be permanently deleted.`} />
    </>
  );
}
