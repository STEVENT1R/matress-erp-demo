import { Moon, Sun, Bell, Search, Menu, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

export default function Topbar({ onMenuClick }) {
  const { darkMode, toggleTheme } = useTheme();
  const { users } = useData();
  const currentUser = users[0];

  return (
    <header className="sticky top-0 z-30 glass-card rounded-none rounded-b-2xl px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Right side - Menu & Search */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="بحث..."
              className="input-field pr-10 py-2 text-sm"
            />
          </div>
        </div>

        {/* Left side - Theme, Notifications, User */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            title={darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
            <Bell className="w-5 h-5 text-gray-600 dark:text-slate-300" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User */}
          <div className="flex items-center gap-2 pr-2 border-r-2 border-gray-200 dark:border-slate-700">
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {currentUser?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {currentUser?.role}
              </p>
            </div>
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
