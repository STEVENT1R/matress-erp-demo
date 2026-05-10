import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingCart, Package, ClipboardList,
  Truck, FileText, Shield, ChevronLeft, ChevronRight,
  Bed, Landmark, Receipt, Building2,
} from "lucide-react";
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'لوحة التحكم', end: true },
  { to: '/pos', icon: ShoppingCart, label: 'نقطة البيع' },
  { to: '/inventory', icon: Package, label: 'المخزون' },
  { to: '/products', icon: Bed, label: 'المنتجات' },
  { to: '/purchases', icon: Receipt, label: 'فواتير المشتريات' },
  { to: '/sales', icon: FileText, label: 'المبيعات' },
  { to: '/logistics', icon: Truck, label: 'التوصيل' },
  { to: '/branches', icon: Building2, label: 'الفروع' },
  { to: '/audit-log', icon: Shield, label: 'سجل النشاطات' },
  { to: '/finances', icon: Landmark, label: 'سجلات' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { darkMode } = useTheme();

  return (
    <aside
      dir="ltr"
      className={`fixed top-0 right-0 h-full z-40 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="relative h-full flex flex-col bg-slate-800 dark:bg-slate-950 border-l border-slate-700/50">
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-700/50">
          <div className="flex-shrink-0 w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <Bed className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <h1 className="text-white font-bold text-lg whitespace-nowrap">مراتب</h1>
                <p className="text-slate-400 text-xs">نظام إدارة المتاجر</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`
              }
            >
              <item.icon className="w-5 h-5 min-w-[20px]" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center p-3 border-t border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
        >
          {collapsed ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
