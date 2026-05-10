import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { useData } from "../context/DataContext";
import { formatDate, formatDateTime, timeAgo, getSeverityBadge } from "../utils/helpers";

// Parse dd/mm/yyyy string to Date object
function parseDMY(str) {
  if (!str || !/^\d{2}\/\d{2}\/\d{4}$/.test(str)) return null;
  const [day, month, year] = str.split('/').map(Number);
  const d = new Date(year, month - 1, day);
  return isNaN(d.getTime()) ? null : d;
}

export default function AuditLogPage() {
  const { auditLogs } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'this-week', 'this-month', 'this-year', 'custom'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const filteredLogs = useMemo(() => {
    const start = parseDMY(customStartDate);
    const end = parseDMY(customEndDate);

    return auditLogs.filter((log) => {
      const logDate = new Date(log.timestamp);

      // Date filter
      if (dateFilter === 'today' && logDate < startOfDay) return false;
      if (dateFilter === 'this-week' && logDate < startOfWeek) return false;
      if (dateFilter === 'this-month' && logDate < startOfMonth) return false;
      if (dateFilter === 'this-year' && logDate < startOfYear) return false;
      if (dateFilter === 'custom') {
        if (start && logDate < start) return false;
        if (end) {
          const endDate = new Date(end);
          endDate.setHours(23, 59, 59, 999);
          if (logDate > endDate) return false;
        }
      }

      const matchesSearch =
        !searchQuery ||
        log.user.includes(searchQuery) ||
        log.description.includes(searchQuery) ||
        log.entity.includes(searchQuery);
      const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
      const matchesAction = actionFilter === 'all' || log.action === actionFilter;
      return matchesSearch && matchesSeverity && matchesAction;
    });
  }, [auditLogs, searchQuery, severityFilter, actionFilter, dateFilter, customStartDate, customEndDate,
      startOfDay, startOfWeek, startOfMonth, startOfYear]);

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'danger': return AlertCircle;
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      default: return Info;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'danger': return 'text-rose-500';
      case 'warning': return 'text-amber-500';
      case 'success': return 'text-emerald-500';
      default: return 'text-blue-500';
    }
  };

  // Handle dd/mm/yyyy input with auto-slash formatting
  const handleStartChange = (e) => {
    let val = e.target.value.replace(/[^\d]/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    let formatted = '';
    if (val.length > 0) formatted += val.slice(0, 2);
    if (val.length > 2) formatted += '/' + val.slice(2, 4);
    if (val.length > 4) formatted += '/' + val.slice(4, 8);
    setCustomStartDate(formatted);
  };

  const handleEndChange = (e) => {
    let val = e.target.value.replace(/[^\d]/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    let formatted = '';
    if (val.length > 0) formatted += val.slice(0, 2);
    if (val.length > 2) formatted += '/' + val.slice(2, 4);
    if (val.length > 4) formatted += '/' + val.slice(4, 8);
    setCustomEndDate(formatted);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">سجل النشاطات</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          تتبع جميع الأحداث والإجراءات في النظام
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي', value: auditLogs.length, icon: Shield, color: 'text-primary-600', bg: 'bg-primary-100 dark:bg-primary-900/20' },
          { label: 'معلومات', value: auditLogs.filter(l => l.severity === 'info').length, icon: Info, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
          { label: 'تحذيرات', value: auditLogs.filter(l => l.severity === 'warning').length, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/20' },
          { label: 'حرجة', value: auditLogs.filter(l => l.severity === 'danger').length, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/20' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400">{stat.label}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث في النشاطات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pr-10 py-2 text-sm"
          />
        </div>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="select-field text-sm py-2 sm:w-40"
        >
          <option value="all">كل الفترات</option>
          <option value="today">اليوم</option>
          <option value="this-week">هذا الأسبوع</option>
          <option value="this-month">هذا الشهر</option>
          <option value="this-year">هذه السنة</option>
          <option value="custom">فترة مخصصة</option>
        </select>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="select-field text-sm py-2 sm:w-40"
        >
          <option value="all">كل الأنواع</option>
          <option value="info">معلومات</option>
          <option value="success">نجاح</option>
          <option value="warning">تحذير</option>
          <option value="danger">حرج</option>
        </select>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="select-field text-sm py-2 sm:w-40"
        >
          <option value="all">كل الإجراءات</option>
          <option value="بيع">بيع</option>
          <option value="تسجيل دخول">تسجيل دخول</option>
          <option value="تعديل">تعديل</option>
          <option value="إضافة مخزون">إضافة مخزون</option>
          <option value="توصيل">توصيل</option>
          <option value="مرتجع">مرتجع</option>
        </select>
      </div>

      {/* Custom Date Range */}
      {dateFilter === 'custom' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex flex-col sm:flex-row gap-3 items-end bg-gray-50 dark:bg-slate-800/50 p-3 rounded-xl"
        >
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">من تاريخ (يوم/شهر/سنة)</label>
            <input
              type="text"
              placeholder="dd/mm/yyyy"
              value={customStartDate}
              onChange={handleStartChange}
              className="input-field text-sm py-2 w-full ltr text-left"
              dir="ltr"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">إلى تاريخ (يوم/شهر/سنة)</label>
            <input
              type="text"
              placeholder="dd/mm/yyyy"
              value={customEndDate}
              onChange={handleEndChange}
              className="input-field text-sm py-2 w-full ltr text-left"
              dir="ltr"
            />
          </div>
          <button
            onClick={() => { setCustomStartDate(''); setCustomEndDate(''); }}
            className="btn-secondary text-xs py-2 px-3"
          >
            إعادة تعيين
          </button>
        </motion.div>
      )}

      {/* Activity Feed */}
      <div className="space-y-2">
        {filteredLogs.map((log, i) => {
          const Icon = getSeverityIcon(log.severity);
          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  log.severity === 'danger' ? 'bg-rose-100 dark:bg-rose-900/30' :
                  log.severity === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' :
                  log.severity === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                  'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  <Icon className={`w-5 h-5 ${getSeverityColor(log.severity)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {log.user}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-slate-400">·</span>
                    <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                      {log.action}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-slate-400">·</span>
                    <span className={`${getSeverityBadge(log.severity)}`}>
                      {log.severity === 'info' ? 'معلومات' :
                       log.severity === 'success' ? 'نجاح' :
                       log.severity === 'warning' ? 'تحذير' : 'حرج'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-300">
                    {log.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400 dark:text-slate-500">
                      {formatDate(log.timestamp)}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-slate-500">·</span>
                    <span className="text-xs text-gray-400 dark:text-slate-500">
                      {log.entity}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}