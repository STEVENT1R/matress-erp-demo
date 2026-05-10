import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, Eye, Calendar } from "lucide-react";
import { useData } from "../context/DataContext";
import { formatEGP, formatDate } from "../utils/helpers";

// Parse dd/mm/yyyy string to Date object
function parseDMY(str) {
  if (!str || !/^\d{2}\/\d{2}\/\d{4}$/.test(str)) return null;
  const [day, month, year] = str.split('/').map(Number);
  const d = new Date(year, month - 1, day);
  return isNaN(d.getTime()) ? null : d;
}

// Format Date object to dd/mm/yyyy for display in text input
function formatToDMYInput(date) {
  if (!date || isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function SalesHistory() {
  const { sales, branches } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'this-week', 'this-month', 'this-year', 'custom'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [customStartDMY, setCustomStartDMY] = useState(''); // dd/mm/yyyy display
  const [customEndDMY, setCustomEndDMY] = useState(''); // dd/mm/yyyy display

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const filteredSales = useMemo(() => {
    const start = parseDMY(customStartDate);
    const end = parseDMY(customEndDate);

    return sales.filter((s) => {
      const saleDate = new Date(s.date);

      // Date filter
      if (dateFilter === 'today' && saleDate < startOfDay) return false;
      if (dateFilter === 'this-week' && saleDate < startOfWeek) return false;
      if (dateFilter === 'this-month' && saleDate < startOfMonth) return false;
      if (dateFilter === 'this-year' && saleDate < startOfYear) return false;
      if (dateFilter === 'custom') {
        if (start && saleDate < start) return false;
        if (end) {
          const endDate = new Date(end);
          endDate.setHours(23, 59, 59, 999);
          if (saleDate > endDate) return false;
        }
      }

      const matchesSearch =
        !searchQuery ||
        s.invoice.includes(searchQuery) ||
        s.customer.includes(searchQuery);
      const matchesBranch = branchFilter === 'all' || s.branch === branchFilter;
      return matchesSearch && matchesBranch;
    });
  }, [sales, searchQuery, branchFilter, dateFilter, customStartDate, customEndDate,
      startOfDay, startOfWeek, startOfMonth, startOfYear]);

  const totalRevenue = filteredSales.reduce((s, sale) => s + sale.total, 0);
  const avgInvoice = filteredSales.length > 0 ? Math.round(totalRevenue / filteredSales.length) : 0;

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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">المبيعات</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          سجل حركة المبيعات
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <p className="text-xs text-gray-500 dark:text-slate-400">إجمالي الفواتير</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{filteredSales.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-gray-500 dark:text-slate-400">إجمالي المبيعات</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatEGP(totalRevenue)}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-gray-500 dark:text-slate-400">متوسط الفاتورة</p>
          <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
            {formatEGP(avgInvoice)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث برقم الفاتورة أو اسم العميل..."
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
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="select-field text-sm py-2 sm:w-48"
        >
          <option value="all">كل الفروع</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
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

      {/* Desktop Table */}
      <div className="hidden lg:block glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                <th className="text-right p-4 text-xs font-medium text-gray-500 dark:text-slate-400">الفاتورة</th>
                <th className="text-right p-4 text-xs font-medium text-gray-500 dark:text-slate-400">العميل</th>
                <th className="text-right p-4 text-xs font-medium text-gray-500 dark:text-slate-400">التاريخ</th>
                <th className="text-center p-4 text-xs font-medium text-gray-500 dark:text-slate-400">المنتجات</th>
                <th className="text-center p-4 text-xs font-medium text-gray-500 dark:text-slate-400">طريقة الدفع</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-slate-400">الإجمالي</th>
                <th className="text-center p-4 text-xs font-medium text-gray-500 dark:text-slate-400">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                      {sale.invoice}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-900 dark:text-slate-200">
                    {sale.customer}
                  </td>
                  <td className="p-4 text-sm text-gray-500 dark:text-slate-400">
                    {formatDate(sale.date)}
                  </td>
                  <td className="p-4 text-center text-sm text-slate-900 dark:text-slate-200">
                    {sale.items}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <span className="badge-info text-xs">{sale.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="p-4 text-left text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {formatEGP(sale.total)}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <span className="badge-success text-xs">{sale.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {filteredSales.map((sale) => (
          <div key={sale.id} className="mobile-card">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-primary-600">{sale.invoice}</span>
              <span className="badge-success text-xs">{sale.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="mobile-card-label">العميل</p>
                <p className="mobile-card-value">{sale.customer}</p>
              </div>
              <div>
                <p className="mobile-card-label">الإجمالي</p>
                <p className="mobile-card-value text-emerald-600">{formatEGP(sale.total)}</p>
              </div>
              <div>
                <p className="mobile-card-label">التاريخ</p>
                <p className="mobile-card-value">{formatDate(sale.date)}</p>
              </div>
              <div>
                <p className="mobile-card-label">طريقة الدفع</p>
                <p className="mobile-card-value">{sale.paymentMethod}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}