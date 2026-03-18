import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiDashboardLine, RiBookOpenLine, RiShoppingBasketLine,
  RiAdminLine, RiUserAddLine, RiAddBoxLine,
  RiLogoutBoxLine, RiLeafLine, RiMenuLine, RiCloseLine,
} from 'react-icons/ri';
import useAuth from '../../hooks/useAuth';

const NAV_USER = [
  { to: '/dashboard', label: 'Dashboard',   icon: RiDashboardLine },
  { to: '/khata',     label: 'Khata Book',  icon: RiBookOpenLine },
  { to: '/products',  label: 'Products',    icon: RiShoppingBasketLine },
];

const NAV_ADMIN = [
  { to: '/admin',              label: 'Overview',      icon: RiAdminLine },
  { to: '/admin/khata/add',    label: 'Add Customer',  icon: RiUserAddLine },
  { to: '/admin/products/add', label: 'Add Product',   icon: RiAddBoxLine },
];

const NavItem = ({ to, label, Icon, onClick }) => (
  <NavLink
    to={to}
    end={to === '/dashboard' || to === '/admin'}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
       ${isActive
         ? 'bg-sage-700 text-white shadow-sm'
         : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'}`
    }
  >
    {({ isActive }) => (
      <>
        <Icon className={`text-base flex-shrink-0 ${isActive ? 'text-white' : 'text-stone-400 group-hover:text-stone-600'}`} />
        <span>{label}</span>
      </>
    )}
  </NavLink>
);

const SidebarContent = ({ onClose }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const links = isAdmin ? [...NAV_USER, ...NAV_ADMIN] : NAV_USER;

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-sage-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <RiLeafLine className="text-white text-base" />
          </div>
          <div>
            <div className="font-display text-base font-bold text-stone-900 leading-none">Ma Kali Vander</div>
            <div className="text-[10px] text-stone-400 mt-0.5 tracking-wider uppercase">Management</div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors lg:hidden">
            <RiCloseLine className="text-lg" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest px-3.5 mb-2">Menu</div>
        {NAV_USER.map(({ to, label, icon: Icon }) => (
          <NavItem key={to} to={to} label={label} Icon={Icon} onClick={onClose} />
        ))}
        {isAdmin && (
          <>
            <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest px-3.5 mt-5 mb-2">Admin</div>
            {NAV_ADMIN.map(({ to, label, icon: Icon }) => (
              <NavItem key={to} to={to} label={label} Icon={Icon} onClick={onClose} />
            ))}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-stone-100">
        <div className="flex items-center gap-2.5 px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-stone-800 truncate">{user?.name}</div>
            <div className="text-xs text-stone-400 capitalize">{user?.role}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm text-stone-500 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <RiLogoutBoxLine className="text-base" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-stone-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-sage-700 rounded-lg flex items-center justify-center">
            <RiLeafLine className="text-white text-sm" />
          </div>
          <span className="font-display text-base font-bold text-stone-900">Ma Kali Vander</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors"
        >
          <RiMenuLine className="text-xl" />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-2xl lg:hidden"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="hidden lg:flex w-60 min-h-screen bg-white border-r border-stone-100 flex-col sticky top-0 h-screen"
      >
        <SidebarContent />
      </motion.aside>
    </>
  );
};

export default Sidebar;
