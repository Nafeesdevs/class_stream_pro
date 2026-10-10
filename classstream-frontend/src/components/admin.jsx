import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { inputCls } from './ui.jsx';

export const AdminHead = ({ title, text, children }) => (
  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8 pt-2">
    <div>
      <h1 className="font-display text-[30px] sm:text-[36px] font-extrabold tracking-[-0.03em] leading-tight">{title}</h1>
      {text && <p className="text-[14px] text-[#808191] mt-1.5">{text}</p>}
    </div>
    <div className="flex flex-wrap items-center gap-3">{children}</div>
  </div>
);

export const StatCard = ({ icon: Icon, label, value, tint, color, i = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.06, duration: 0.5 }}
    whileHover={{ y: -4 }}
    className="bg-white rounded-[22px] p-5 shadow-smart-card border border-gray-100/80"
  >
    <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: tint }}>
      <Icon size={20} color={color} />
    </div>
    <div className="font-display text-[26px] font-extrabold tracking-tight leading-none">{value}</div>
    <div className="text-[12px] font-semibold text-[#808191] mt-1.5">{label}</div>
  </motion.div>
);

export const TableCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-[24px] border border-gray-100/80 shadow-smart-card overflow-hidden ${className}`}>
    <div className="overflow-x-auto">{children}</div>
  </div>
);

export const Th = ({ children, className = '' }) => (
  <th className={`px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#808191] bg-[#FAFAFC] border-b border-gray-100 whitespace-nowrap ${className}`}>{children}</th>
);
export const Td = ({ children, className = '' }) => <td className={`px-5 py-4 text-[13px] align-middle ${className}`}>{children}</td>;

export const SearchBox = ({ value, onChange, placeholder = 'Search…' }) => (
  <div className="relative w-full sm:w-[280px]">
    <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A3B5]" />
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${inputCls} pl-10 rounded-full bg-white`} />
  </div>
);

export const Select = ({ value, onChange, options, className = '' }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls} rounded-full bg-white w-auto pr-8 ${className}`}>
    {options.map(([v, l]) => (
      <option key={v} value={v}>
        {l}
      </option>
    ))}
  </select>
);

export const IconBtn = ({ icon: Icon, label, onClick, tone = 'default', disabled, as: As = 'button', ...rest }) => (
  <As
    type={As === 'button' ? rest.type || 'button' : undefined}
    title={label}
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    className={`w-9 h-9 rounded-xl flex items-center justify-center transition disabled:opacity-40 disabled:pointer-events-none ${
      tone === 'danger' ? 'bg-[#FFF3F0] text-[#FF5E3A] hover:bg-[#FFE0D9]' : 'bg-[#F4F5F8] text-[#4F5265] hover:bg-[#E8EAFC] hover:text-[#6C5CE7]'
    }`}
    {...rest}
  >
    <Icon size={15} />
  </As>
);

