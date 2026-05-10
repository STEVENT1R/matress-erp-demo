import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, CreditCard, DollarSign,
  Banknote, Building, Wallet, Calendar, Eye, X,
  Package, ShoppingCart, ArrowUpDown, ChevronDown, ChevronUp,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { formatEGP, formatDate } from "../utils/helpers";

// Parse dd/mm/yyyy string to Date object
function parseDMY(str) {
  if (!str || !/^\d{2}\/\d{2}\/\d{4}$/.test(str)) return null;
  const [day, month, year] = str.split('/').map(Number);
  const d = new Date(year, month - 1, day);
  return isNaN(d.getTime()) ? null : d;
}

export default function FinancialRecords() {
  const { sales, products, logistics } = useData();
  const [period, setPeriod] = useState("day"); // 'day', 'month', 'year', 'custom'
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [viewSale, setViewSale] = useState(null);
  const [sortField, setSortField] = useState("date"); // 'date', 'total', 'customer'
  const [sortDir, setSortDir] = useState("desc");

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const filteredRangeLabel = useMemo(() => {
    if (period === "day") return formatDate(today.toISOString());
    if (period === "month") {
      return today.toLocaleDateString("ar-EG", { month: "long", year: "numeric" });
    }
    if (period === "year") return today.getFullYear().toString();
    if (period === "custom" && customStart && customEnd) {
      return `من ${customStart} ← ${customEnd}`;
    }
    if (period === "custom" && customStart) {
      return `من ${customStart}`;
    }
    return "فترة مخصصة";
  }, [period, customStart, customEnd, today]);

  const filteredSales = useMemo(() => {
    const start = parseDMY(customStart);
    const end = parseDMY(customEnd);
    let filtered = sales.filter((s) => {
      const d = new Date(s.date);
      if (period === "day") return d >= startOfDay;
      if (period === "month") return d >= startOfMonth;
      if (period === "year") return d >= startOfYear;
      if (period === "custom") {
        if (start && d < start) return false;
        if (end) {
          const endDate = new Date(end);
          endDate.setHours(23, 59, 59, 999);
          if (d > endDate) return false;
        }
        return true;
      }
      return true;
    });
    // Sort
    filtered.sort((a, b) => {
      let cmp = 0;
      if (sortField === "date") cmp = new Date(a.date) - new Date(b.date);
      else if (sortField === "total") cmp = a.total - b.total;
      else if (sortField === "customer") cmp = a.customer.localeCompare(b.customer);
      return sortDir === "desc" ? -cmp : cmp;
    });
    return filtered;
  }, [sales, period, customStart, customEnd, startOfDay, startOfMonth, startOfYear, sortField, sortDir]);

  const financials = useMemo(() => {
    const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);
    const salesCount = filteredSales.length;
    const avgCostPerItem = products.reduce((sum, p) => sum + p.cost, 0) / (products.length || 1);
    const totalItemsSold = filteredSales.reduce((sum, s) => sum + s.items, 0);
    const estimatedCOGS = totalItemsSold * avgCostPerItem * 0.85;
    const netProfit = totalRevenue - estimatedCOGS;
    const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

    const creditSales = filteredSales.filter(
      (s) => s.paymentMethod === "تحويل بنكي" || s.paymentMethod === "بطاقة" || s.paymentMethod === "عربون"
    );
    const outstandingTotal = creditSales.reduce((sum, s) => sum + s.total, 0);

    const cashSales = filteredSales.filter((s) => s.paymentMethod === "نقداً");
    const cashTotal = cashSales.reduce((sum, s) => sum + s.total, 0);
    const bankSales = filteredSales.filter((s) => s.paymentMethod === "تحويل بنكي");
    const bankTotal = bankSales.reduce((sum, s) => sum + s.total, 0);
    const cardSales = filteredSales.filter((s) => s.paymentMethod === "بطاقة" || s.paymentMethod === "فيزا");
    const cardTotal = cardSales.reduce((sum, s) => sum + s.total, 0);
    const depositSales = filteredSales.filter((s) => s.paymentMethod === "عربون");
    const depositTotal = depositSales.reduce((sum, s) => sum + s.total, 0);

    // Calculate deposits (amounts paid as deposit)
    const totalDepositPaid = depositSales.reduce((sum, s) => sum + (s.total - (s.remaining || 0)), 0);
    const totalRemaining = depositSales.reduce((sum, s) => sum + (s.remaining || 0), 0);

    const start = parseDMY(customStart);
    const end = parseDMY(customEnd);
    const returnedLogistics = logistics.filter((l) => {
      const ld = new Date(l.date);
      if (period === "day") return ld >= startOfDay && l.status === "مرتجع";
      if (period === "month") return ld >= startOfMonth && l.status === "مرتجع";
      if (period === "year") return ld >= startOfYear && l.status === "مرتجع";
      if (period === "custom") {
        let inRange = true;
        if (start && ld < start) inRange = false;
        if (end) {
          const endDate = new Date(end);
          endDate.setHours(23, 59, 59, 999);
          if (ld > endDate) inRange = false;
        }
        return inRange && l.status === "مرتجع";
      }
      return l.status === "مرتجع";
    });
    const returnCount = returnedLogistics.length;
    const returnEstimatedValue = returnCount * avgCostPerItem * 0.6;

    return {
      totalRevenue, netProfit, profitMargin, salesCount, estimatedCOGS,
      outstandingTotal, cashTotal, bankTotal, cardTotal, depositTotal,
      totalDepositPaid, totalRemaining, returnCount, returnEstimatedValue, totalItemsSold,
    };
  }, [filteredSales, products, logistics, period, customStart, customEnd, startOfDay, startOfMonth, startOfYear]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const summaryCards = [
    { title: "إجمالي الإيرادات", value: formatEGP(financials.totalRevenue), desc: `${financials.salesCount} فاتورة`, icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { title: "صافي الربح", value: formatEGP(financials.netProfit), desc: `${financials.profitMargin}% هامش ربح`, icon: TrendingUp, color: "text-primary-600 dark:text-primary-400", bg: "bg-primary-50 dark:bg-primary-900/20" },
    { title: "المديونيات (المتبقي)", value: formatEGP(financials.totalRemaining), desc: `${financials.salesCount} فاتورة بإجمالي ${formatEGP(financials.outstandingTotal)}`, icon: CreditCard, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { title: "تكلفة البضاعة", value: formatEGP(financials.estimatedCOGS), desc: `${financials.totalItemsSold} قطعة`, icon: TrendingDown, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20" },
  ];

  const paymentDetails = [
    { label: "نقداً", value: formatEGP(financials.cashTotal), icon: Banknote, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "تحويل بنكي", value: formatEGP(financials.bankTotal), icon: Building, color: "text-blue-600 dark:text-blue-400" },
    { label: "بطاقات", value: formatEGP(financials.cardTotal), icon: CreditCard, color: "text-violet-600 dark:text-violet-400" },
    { label: "عربون (مدفوع)", value: formatEGP(financials.totalDepositPaid), icon: Wallet, color: "text-amber-600 dark:text-amber-400", sub: `${formatEGP(financials.totalRemaining)} متبقي` },
  ];

  const handleStartChange = (e) => {
    let val = e.target.value.replace(/[^\d]/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    let formatted = '';
    if (val.length > 0) formatted += val.slice(0, 2);
    if (val.length > 2) formatted += '/' + val.slice(2, 4);
    if (val.length > 4) formatted += '/' + val.slice(4, 8);
    setCustomStart(formatted);
  };

  const handleEndChange = (e) => {
    let val = e.target.value.replace(/[^\d]/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    let formatted = '';
    if (val.length > 0) formatted += val.slice(0, 2);
    if (val.length > 2) formatted += '/' + val.slice(2, 4);
    if (val.length > 4) formatted += '/' + val.slice(4, 8);
    setCustomEnd(formatted);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">السجلات المالية</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          تقرير الأرباح والمصروفات والمديونيات مع تفاصيل كل فاتورة
        </p>
      </div>

      {/* Period Selector */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-primary-500" />
          <span className="text-sm font-semibold text-slate-900 dark:text-white">الفرز حسب:</span>
          <div className="flex gap-1 bg-gray-100 dark:bg-slate-700 rounded-xl p-1">
            {[
              { key: "day", label: "يوم" },
              { key: "month", label: "شهر" },
              { key: "year", label: "سنة" },
              { key: "custom", label: "فترة" },
            ].map((opt) => (
              <button key={opt.key} onClick={() => setPeriod(opt.key)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  period === opt.key
                    ? "bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm"
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white"
                }`}>{opt.label}</button>
            ))}
          </div>
        </div>
        {period === "custom" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">من تاريخ (يوم/شهر/سنة)</label>
              <input type="text" value={customStart} onChange={handleStartChange}
                className="input-field text-sm py-2 w-full ltr text-left" placeholder="dd/mm/yyyy" dir="ltr" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">إلى تاريخ (يوم/شهر/سنة)</label>
              <input type="text" value={customEnd} onChange={handleEndChange}
                className="input-field text-sm py-2 w-full ltr text-left" placeholder="dd/mm/yyyy" dir="ltr" />
            </div>
            <button onClick={() => { setCustomStart(""); setCustomEnd(""); }} className="btn-secondary text-xs py-2 px-3">إعادة تعيين</button>
          </motion.div>
        )}
        <div className="mt-2 flex items-center gap-2 text-xs text-primary-600 dark:text-primary-400 font-medium">
          <span>الفترة الحالية:</span>
          <span className="bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded-lg">{filteredRangeLabel}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-slate-400">{card.title}</span>
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{card.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Payment Method Details */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }} className="glass-card p-5">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">تفاصيل المدفوعات</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {paymentDetails.map((detail, i) => (
            <div key={i} className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <detail.icon className={`w-5 h-5 ${detail.color}`} />
                <span className="text-xs text-gray-500 dark:text-slate-400">{detail.label}</span>
              </div>
              <p className={`text-lg font-bold ${detail.color}`}>{detail.value}</p>
              {detail.sub && <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1">{detail.sub}</p>}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Detailed Sales List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }} className="glass-card overflow-hidden">
        <div className="p-5 pb-0 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            تفاصيل المبيعات
            <span className="text-sm font-normal text-gray-500 dark:text-slate-400 mr-2">
              ({financials.salesCount} فاتورة - {formatEGP(financials.totalRevenue)})
            </span>
          </h3>
        </div>
        <div className="overflow-x-auto p-5 pt-3">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                <th className="text-right p-3 text-xs font-medium text-gray-500">الفاتورة</th>
                <th className="text-right p-3 text-xs font-medium text-gray-500 cursor-pointer hover:text-primary-600"
                    onClick={() => toggleSort("customer")}>
                  <span className="flex items-center gap-1">العميل {sortField === "customer" && <ArrowUpDown className="w-3 h-3" />}</span>
                </th>
                <th className="text-right p-3 text-xs font-medium text-gray-500">الكاشير</th>
                <th className="text-right p-3 text-xs font-medium text-gray-500 cursor-pointer hover:text-primary-600"
                    onClick={() => toggleSort("date")}>
                  <span className="flex items-center gap-1">التاريخ {sortField === "date" && <ArrowUpDown className="w-3 h-3" />}</span>
                </th>
                <th className="text-center p-3 text-xs font-medium text-gray-500">المنتجات</th>
                <th className="text-center p-3 text-xs font-medium text-gray-500">طريقة الدفع</th>
                <th className="text-left p-3 text-xs font-medium text-gray-500 cursor-pointer hover:text-primary-600"
                    onClick={() => toggleSort("total")}>
                  <span className="flex items-center gap-1">الإجمالي {sortField === "total" && <ArrowUpDown className="w-3 h-3" />}</span>
                </th>
                <th className="text-center p-3 text-xs font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id}
                  className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3">
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{sale.invoice}</span>
                  </td>
                  <td className="p-3 text-sm text-slate-900 dark:text-slate-200">
                    {sale.customer}
                    {sale.phone && <span className="text-[10px] text-gray-400 block">{sale.phone}</span>}
                  </td>
                  <td className="p-3 text-sm text-gray-500 dark:text-slate-400">{sale.sellerName}</td>
                  <td className="p-3 text-sm text-gray-500 dark:text-slate-400">{formatDate(sale.date)}</td>
                  <td className="p-3 text-center text-sm text-slate-900 dark:text-slate-200">{sale.items}</td>
                  <td className="p-3">
                    <div className="flex justify-center">
                      <span className="badge-info text-xs">{sale.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="p-3 text-left text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatEGP(sale.total)}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => setViewSale(sale)} className="p-1.5 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg">
                      <Eye className="w-4 h-4 text-primary-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSales.length === 0 && (
            <p className="text-center text-gray-400 dark:text-slate-500 py-8 text-sm">لا توجد مبيعات في هذه الفترة</p>
          )}
        </div>
      </motion.div>

      {/* ===== View Sale Details Modal ===== */}
      {viewSale && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setViewSale(null)} className="fixed inset-0 bg-black/50 z-50" />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-xl my-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">تفاصيل فاتورة {viewSale.invoice}</h3>
                <button onClick={() => setViewSale(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>

              {/* Sale Header */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-slate-400">العميل</p>
                  <p className="text-sm font-semibold">{viewSale.customer}</p>
                  {viewSale.phone && <p className="text-[10px] text-gray-400">{viewSale.phone}</p>}
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-slate-400">التاريخ</p>
                  <p className="text-sm font-semibold">{new Date(viewSale.date).toLocaleDateString('ar-EG')}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-slate-400">الكاشير</p>
                  <p className="text-sm font-semibold">{viewSale.sellerName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-slate-400">طريقة الدفع</p>
                  <span className="badge-info text-xs">{viewSale.paymentMethod}</span>
                </div>
              </div>

              {/* Sale Items */}
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">المنتجات ({viewSale.items})</h4>
              <table className="w-full mb-4">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700 text-xs text-gray-500">
                    <th className="text-right p-2 font-medium">المنتج</th>
                    <th className="text-center p-2 font-medium">العدد</th>
                    <th className="text-left p-2 font-medium">السعر</th>
                    <th className="text-left p-2 font-medium">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {(viewSale.cartSnapshot || []).map((item, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-slate-800 text-sm">
                      <td className="p-2">
                        <span className="font-semibold text-slate-900 dark:text-white">{item.displayName || item.model}</span>
                        <span className="text-[10px] text-gray-400 block">{item.brand} · {item.dimensions}</span>
                      </td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-left">{formatEGP(item.price)}</td>
                      <td className="p-2 text-left font-semibold">{formatEGP(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300 dark:border-slate-600">
                    <td colSpan={2}></td>
                    <td className="p-2 text-left text-sm font-bold text-slate-900 dark:text-white">المجموع الفرعي</td>
                    <td className="p-2 text-left font-semibold">{formatEGP(viewSale.subtotal)}</td>
                  </tr>
                  {(viewSale.discount || 0) > 0 && (
                    <tr>
                      <td colSpan={2}></td>
                      <td className="p-2 text-left text-sm text-rose-600">الخصم</td>
                      <td className="p-2 text-left text-rose-600">-{formatEGP(viewSale.discount)}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={2}></td>
                    <td className="p-2 text-left text-sm text-slate-900 dark:text-white font-bold">ضريبة 14%</td>
                    <td className="p-2 text-left font-semibold">{formatEGP(viewSale.vat)}</td>
                  </tr>
                  <tr className="border-t border-gray-300 dark:border-slate-600">
                    <td colSpan={2}></td>
                    <td className="p-2 text-left text-base font-bold text-primary-600">الإجمالي</td>
                    <td className="p-2 text-left text-base font-bold text-primary-600">{formatEGP(viewSale.total)}</td>
                  </tr>
                  {viewSale.remaining > 0 && (
                    <tr>
                      <td colSpan={2}></td>
                      <td className="p-2 text-left text-sm text-amber-600 font-bold">المتبقي</td>
                      <td className="p-2 text-left text-amber-600 font-bold">{formatEGP(viewSale.remaining)}</td>
                    </tr>
                  )}
                </tfoot>
              </table>

              <div className="flex gap-3">
                <button onClick={() => setViewSale(null)} className="btn-secondary flex-1">إغلاق</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
