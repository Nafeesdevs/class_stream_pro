import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { LayoutDashboard, Users, CreditCard, BookOpenCheck, Receipt, Repeat, UserX, UserCircle, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { BrandLogo, DotGrid } from '../components/Visuals.tsx';
import { Avatar } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const items = [
  [LayoutDashboard, 'Dashboard', '/admin', true],
  [Users, 'Users', '/admin/users'],
  [CreditCard, 'Subscription Plans', '/admin/plans'],
  [BookOpenCheck, 'Classes', '/admin/classes'],
  [Receipt, 'Payments', '/admin/payments'],
  [Repeat, 'Subscriptions', '/admin/subscriptions'],
  [UserX, 'Deletion Requests', '/admin/deletion-requests'],
  [UserCircle, 'My Profile', '/admin/profile'],
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  const Sidebar = (
    <div className="h-full flex flex-col bg-white">
      <div className="px-7 pt-8 pb-6">
        <BrandLogo />
        <span className="inline-block mt-3 bg-[#11142D] text-white text-[9.5px] font-extrabold uppercase tracking-[0.14em] px-2.5 py-1 rounded">Admin Console</span>
      </div>
      <nav className="px-4 flex-1 overflow-y-auto space-y-1">
        {items.map(([Icon, label, to, end]) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-[13.5px] font-semibold transition-all ${
                isActive ? 'bg-[#11142D] text-white shadow-md' : 'text-[#4F5265] hover:bg-[#F4F5F8]'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 space-y-2">
        {/* <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-semibold text-[#6E7191] hover:bg-[#F4F5F8]">
          <ExternalLink size={16} /> View website
        </Link> */}
        <button
          onClick={async () => {
            await logout();
            nav('/login');
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-semibold text-[#FF5E3A] hover:bg-[#FFF3F0]"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-[#11142D]">
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-[268px] border-r border-gray-100 z-30">{Sidebar}</aside>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="w-72 h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {Sidebar}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lg:pl-[268px]">
        <header className="sticky top-0 z-20 bg-[#F6F7FB]/85 backdrop-blur-md px-5 sm:px-10 py-4 flex items-center justify-between">
          <button className="lg:hidden w-10 h-10 rounded-full bg-white shadow-smart-card flex items-center justify-center" onClick={() => setOpen(true)} aria-label="Open menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="hidden lg:block" />
          <Link to="/admin/profile" className="flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full bg-white shadow-smart-card hover:shadow-smart-float transition">
            <Avatar user={user} size={34} />
            <div className="leading-tight">
              <div className="text-[12.5px] font-extrabold">{user?.name}</div>
              <div className="text-[10.5px] text-[#808191] font-semibold">Administrator</div>
            </div>
          </Link>
        </header>

        <main className="relative px-5 sm:px-10 pb-16 pt-2">
          <div className="hidden xl:block absolute top-0 right-0 pointer-events-none opacity-70">
            <DotGrid rows={6} cols={4} color="#74D4F4" gap={12} />
          </div>
          <div className="relative max-w-[1180px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
