import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Loader2 } from 'lucide-react';
import { initials } from '../lib/format.js';

/* ---------- Section badge (FIND YOUR FLOW style) ---------- */
const badgeColors = {
  coral: 'bg-[#FF856B]',
  purple: 'bg-[#9B8AFB]',
  cyan: 'bg-[#5BCEFA]',
  yellow: 'bg-[#F5C344]',
  navy: 'bg-[#11142D]',
};
export const SectionBadge = ({ children, color = 'coral', className = '' }) => (
  <span className={`inline-block ${badgeColors[color]} text-white text-[10px] font-extrabold uppercase tracking-[0.12em] px-3.5 py-1.5 rounded-md mb-5 ${className}`}>
    {children}
  </span>
);

/* ---------- Buttons ---------- */
const btn = {
  dark: 'bg-[#0B0D17] text-white hover:bg-[#22263A] shadow-md shadow-black/10',
  purple: 'bg-[#6852ED] text-white hover:bg-[#7B66F8] shadow-lg shadow-[#6852ED]/30',
  outline: 'border border-[#D5D8E2] bg-white/80 text-[#11142D] hover:bg-[#11142D] hover:text-white hover:border-[#11142D]',
  soft: 'bg-[#F4F5F8] text-[#11142D] hover:bg-[#E8EAFC]',
  danger: 'bg-[#FF5E3A] text-white hover:bg-[#E94B28] shadow-md shadow-[#FF5E3A]/20',
  ghost: 'text-[#6E7191] hover:text-[#11142D] hover:bg-[#F4F5F8]',
};
const sizes = { sm: 'px-4 py-2 text-[12px]', md: 'px-6 py-3 text-[13px]', lg: 'px-8 py-4 text-[13.5px]' };

export const Button = ({ variant = 'dark', size = 'md', loading, disabled, className = '', children, as: As = 'button', ...rest }) => (
  <As
    disabled={As === 'button' ? disabled || loading : undefined}
    className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${btn[variant]} ${sizes[size]} ${className}`}
    {...rest}
  >
    {loading && <Loader2 size={15} className="animate-spin" />}
    {children}
  </As>
);

/* ---------- Spinner / loaders / empty ---------- */
export const Spinner = ({ className = '' }) => <Loader2 className={`animate-spin text-[#6C5CE7] ${className}`} />;

export const PageLoader = ({ label = 'Loading…' }) => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-[#808191]">
    <Spinner size={28} />
    <span className="text-[13px] font-semibold">{label}</span>
  </div>
);

export const EmptyState = ({ icon: Icon, title, text, action }) => (
  <div className="bg-white rounded-[28px] border border-gray-100 shadow-smart-card py-14 px-6 text-center">
    {Icon && (
      <div className="w-14 h-14 rounded-2xl bg-[#E8EAFC] text-[#6C5CE7] flex items-center justify-center mx-auto mb-5">
        <Icon size={24} />
      </div>
    )}
    <h3 className="font-display text-[18px] font-extrabold text-[#11142D]">{title}</h3>
    {text && <p className="text-[13.5px] text-[#808191] mt-2 max-w-sm mx-auto leading-relaxed">{text}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export const ErrorBox = ({ message, onRetry }) => (
  <div className="bg-[#FDEBE4] text-[#C2410C] rounded-2xl px-5 py-4 text-[13px] font-semibold flex items-center justify-between gap-4">
    <span>{message}</span>
    {onRetry && (
      <button onClick={onRetry} className="underline underline-offset-2">
        Retry
      </button>
    )}
  </div>
);

/* ---------- Form bits ---------- */
export const inputCls =
  'w-full px-4 py-3 rounded-xl border border-[#E4E6EF] bg-white text-[13.5px] text-[#11142D] placeholder-[#A0A3B5] focus:outline-none focus:border-[#6C5CE7] focus:ring-4 focus:ring-[#6C5CE7]/10 transition';

export const Field = ({ label, hint, children, className = '' }) => (
  <label className={`block ${className}`}>
    {label && <span className="block text-[11.5px] font-bold text-[#4F5265] mb-1.5 tracking-wide">{label}</span>}
    {children}
    {hint && <span className="block text-[11px] text-[#808191] mt-1.5">{hint}</span>}
  </label>
);

export const Toggle = ({ checked, onChange, disabled, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 disabled:opacity-50 ${checked ? 'bg-[#6C5CE7]' : 'bg-[#D5D8E2]'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
  </button>
);

/* ---------- Pills ---------- */
const pill = {
  green: 'bg-[#E6F9F0] text-[#10B981]',
  red: 'bg-[#FFE5E0] text-[#FF5E3A]',
  yellow: 'bg-[#FFF3D1] text-[#D97706]',
  purple: 'bg-[#EDE9FE] text-[#6C5CE7]',
  blue: 'bg-[#E6F4FF] text-[#3B82F6]',
  gray: 'bg-[#F4F5F8] text-[#6E7191]',
};
export const Pill = ({ tone = 'gray', children, className = '' }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-extrabold uppercase tracking-wider ${pill[tone]} ${className}`}>{children}</span>
);

export const statusTone = (s) =>
  ({ active: 'green', paid: 'green', approved: 'green', created: 'yellow', pending: 'yellow', upcoming: 'blue', expired: 'gray', cancelled: 'red', failed: 'red', rejected: 'red', inactive: 'red' }[s] || 'gray');

/* ---------- Avatar ---------- */
export const Avatar = ({ user, size = 40, className = '' }) =>
  user?.avatar ? (
    <img src={user.avatar} alt={user.name} style={{ width: size, height: size }} className={`rounded-full object-cover shrink-0 ${className}`} />
  ) : (
    <span
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={`rounded-full bg-gradient-to-br from-[#8E7CF8] to-[#63D2FF] text-white font-extrabold flex items-center justify-center shrink-0 ${className}`}
    >
      {initials(user?.name)}
    </span>
  );

/* ---------- Modal ---------- */
export const Modal = ({ open, onClose, title, children, wide, footer }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-3xl w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[90vh] flex flex-col shadow-2xl border border-gray-100`}
          >
            <div className="flex items-center justify-between px-6 sm:px-8 pt-6 pb-4">
              <h3 className="font-display text-[20px] font-extrabold text-[#11142D]">{title}</h3>
              <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">
                <X size={15} />
              </button>
            </div>
            <div className="px-6 sm:px-8 pb-6 overflow-y-auto">{children}</div>
            {footer && <div className="px-6 sm:px-8 py-4 border-t border-gray-100 flex justify-end gap-3">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ConfirmModal = ({ open, onClose, onConfirm, title, text, confirmLabel = 'Confirm', danger, loading }) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    footer={
      <>
        <Button type="button" variant="soft" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant={danger ? 'danger' : 'dark'} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </>
    }
  >
    <p className="text-[14px] text-[#6E7191] leading-relaxed">{text}</p>
  </Modal>
);

/* ---------- Page headings ---------- */
export const PageHeader = ({ badge, badgeColor, title, text, children }) => (
  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
    <div>
      {badge && <SectionBadge color={badgeColor}>{badge}</SectionBadge>}
      <h1 className="font-display text-[34px] sm:text-[42px] font-extrabold text-[#11142D] leading-[1.12] tracking-[-0.03em]">{title}</h1>
      {text && <p className="text-[15px] text-[#808191] leading-[1.65] max-w-xl mt-3">{text}</p>}
    </div>
    {children}
  </div>
);

export const Card = ({ className = '', children, ...rest }) => (
  <div className={`bg-white rounded-[24px] border border-gray-100/80 shadow-smart-card ${className}`} {...rest}>
    {children}
  </div>
);
