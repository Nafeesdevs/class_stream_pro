import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, User, BookOpen, LayoutDashboard, LogOut, ChevronDown, CreditCard } from 'lucide-react';
import { BrandLogo } from '../components/Visuals.tsx';
import { Avatar } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Footer from './Footer.jsx';

export default function PublicLayout() {
  const { user, logout, isAdmin } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    setOpen(false);
    setMenu(false);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  const links = [
    ['Home', '/'],
    ['Classes', '/classes'],
    ...(user && !isAdmin ? [['My Classes', '/my-classes']] : []),
    ['Subscription', '/subscription'],
    ['About', '/about'],
    ['Contact', '/contact'],
  ];
  const linkCls = ({ isActive }) =>
    `text-[13.5px] font-semibold whitespace-nowrap transition-colors ${isActive ? 'text-[#6C5CE7]' : 'text-[#11142D] hover:text-[#6C5CE7]'}`;

  const doLogout = async () => {
    await logout();
    nav('/');
  };

  return (
    <div className="min-h-screen bg-white text-[#11142D] overflow-x-hidden selection:bg-[#6C5CE7]/15 selection:text-[#6C5CE7] flex flex-col">
      <header className="relative z-40 max-w-[1240px] w-full mx-auto px-6 sm:px-10 pt-7 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-12 lg:gap-14">
          <BrandLogo />
          <nav className="hidden lg:flex items-center gap-8">
            {links.map(([l, to]) => (
              <NavLink key={to} to={to} end={to === '/'} className={linkCls}>
                {l}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenu((v) => !v)}
                className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border border-[#D5D8E2] bg-white/80 hover:bg-[#F4F5F8] transition"
              >
                <Avatar user={user} size={32} />
                <span className="hidden sm:block text-[13px] font-semibold max-w-[110px] truncate">{user.name}</span>
                <ChevronDown size={14} className="text-[#808191]" />
              </button>
              <AnimatePresence>
                {menu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-smart-float border border-gray-100 p-2 z-50"
                    >
                      <div className="px-3 py-2.5 mb-1">
                        <div className="text-[13px] font-extrabold truncate">{user.name}</div>
                        <div className="text-[11.5px] text-[#808191] truncate">{user.email}</div>
                      </div>
                      {[
                        isAdmin && [LayoutDashboard, 'Admin Dashboard', '/admin'],
                        !isAdmin && [BookOpen, 'My Classes', '/my-classes'],
                        !isAdmin && [CreditCard, 'Subscription', '/subscription'],
                        [User, 'My Profile', '/profile'],
                      ]
                        .filter(Boolean)
                        .map(([Icon, label, to]) => (
                          <Link key={to} to={to} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-[#F4F5F8]">
                            <Icon size={15} className="text-[#6C5CE7]" />
                            {label}
                          </Link>
                        ))}
                      <button onClick={doLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-[#FF5E3A] hover:bg-[#FFF3F0]">
                        <LogOut size={15} />
                        Sign out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden sm:inline-block px-6 py-2.5 rounded-full border border-[#D5D8E2] bg-white/80 text-[13px] font-semibold hover:bg-[#11142D] hover:text-white hover:border-[#11142D] transition-all">
                Log in
              </Link>
              <Link to="/register" className="hidden sm:inline-block px-6 py-2.5 rounded-full bg-[#0B0D17] text-white text-[13px] font-semibold hover:bg-[#22263A] transition-all">
                Get started
              </Link>
            </>
          )}
          <button className="lg:hidden w-10 h-10 rounded-full bg-[#F4F5F8] flex items-center justify-center" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={18} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-72 bg-white p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <BrandLogo />
                <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-full bg-[#F4F5F8] flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {links.map(([l, to]) => (
                  <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `px-4 py-3 rounded-xl text-[14px] font-semibold ${isActive ? 'bg-[#E8EAFC] text-[#6C5CE7]' : 'hover:bg-[#F4F5F8]'}`}>
                    {l}
                  </NavLink>
                ))}
                {user && (
                  <NavLink to="/profile" className="px-4 py-3 rounded-xl text-[14px] font-semibold hover:bg-[#F4F5F8]">
                    Profile
                  </NavLink>
                )}
                {isAdmin && (
                  <NavLink to="/admin" className="px-4 py-3 rounded-xl text-[14px] font-semibold hover:bg-[#F4F5F8]">
                    Admin Dashboard
                  </NavLink>
                )}
              </nav>
              <div className="mt-auto flex flex-col gap-3">
                {user ? (
                  <button onClick={doLogout} className="px-6 py-3 rounded-full bg-[#FFF3F0] text-[#FF5E3A] text-[13px] font-semibold">
                    Sign out
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="px-6 py-3 rounded-full border border-[#D5D8E2] text-center text-[13px] font-semibold">
                      Log in
                    </Link>
                    <Link to="/register" className="px-6 py-3 rounded-full bg-[#0B0D17] text-white text-center text-[13px] font-semibold">
                      Get started
                    </Link>
                  </>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer showCta={pathname !== '/login' && pathname !== '/register'} />
    </div>
  );
}
