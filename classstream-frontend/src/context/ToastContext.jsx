import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const Ctx = createContext(null);
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setItems((p) => [...p, { id, message, type }]);
    setTimeout(() => setItems((p) => p.filter((t) => t.id !== id)), 4200);
  }, []);
  const toast = {
    success: (m) => push(m, 'success'),
    error: (m) => push(m, 'error'),
    info: (m) => push(m, 'info'),
  };
  const icon = { success: CheckCircle2, error: AlertCircle, info: Info };
  const tone = { success: 'text-[#10B981]', error: 'text-[#FF5E3A]', info: 'text-[#6C5CE7]' };

  return (
    <Ctx.Provider value={toast}>
      {children}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3 w-[calc(100vw-2.5rem)] max-w-sm pointer-events-none">
        <AnimatePresence>
          {items.map((t) => {
            const Icon = icon[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40 }}
                className="pointer-events-auto bg-white rounded-2xl shadow-smart-float border border-gray-100 px-4 py-3.5 flex items-start gap-3"
              >
                <Icon size={18} className={`mt-0.5 shrink-0 ${tone[t.type]}`} />
                <p className="text-[13px] font-semibold text-[#11142D] leading-snug">{t.message}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}
