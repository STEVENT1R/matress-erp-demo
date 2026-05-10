import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard, Percent, Receipt, Activity, BadgeDollarSign } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatEGP, timeAgo } from '../utils/helpers';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { sales, products, branches, auditLogs, logistics } = useData();

  // Financial calculations
  const metrics = useMemo(() => {
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const salesCount = sales.length;
    const avgTransaction = salesCount > 0 ? Math.round(totalRevenue / salesCount) : 0;

    // Estimate cost of goods sold (COGS) using product costs
    // Each sale has an "items" count - we estimate the average cost per item
    const avgCostPerItem = products.reduce((sum, p) => sum + p.cost, 0) / (products.length || 1);
    const totalItemsSold = sales.reduce((sum, s) => sum + s.items, 0);
    const estimatedCOGS = totalItemsSold * avgCostPerItem * 0.85; // 85% factor to account for mix
    const netProfit = totalRevenue - estimatedCOGS;
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100) : 0;

    // مديونيات (Outstanding debts) - sales that might still be unpaid
    // Using deposit/card payments as proxy for outstanding amounts
    const depositSales = sales.filter(s => s.paymentMethod === 'تحويل بنكي' || s.paymentMethod === 'بطاقة');
    const outstandingDebts = depositSales.reduce((sum, s) => sum + s.total, 0);
    const outstandingCount = depositSales.length;

    // Today's data
    const todaySalesData = sales.filter(
      (s) => new Date(s.date).toDateString() === new Date().toDateString()
    );
    const todayRevenue = todaySalesData.reduce((sum, s) => sum + s.total, 0);
    const todayProfit = todayRevenue - (todaySalesData.reduce((sum, s) => sum + s.items, 0) * avgCostPerItem * 0.85);
    const todayCount = todaySalesData.length;

    // Total stock value
    const totalStockValue = products.reduce((sum, p) => {
      const totalStock = Object.values(p.stock).reduce((a, b) => a + b, 0);
      return sum + (totalStock * p.cost);
    }, 0);

    // Returns
    const returns = logistics.filter(l => l.status === 'مرتجع').length;
    const returnValue = returns * avgCostPerItem * 0.6;

    // Pending deliveries
    const pendingDeliveries = logistics.filter(l => l.status === 'قيد التوصيل' || l.status === 'قيد الانتظار').length;
    const delivered = logistics.filter(l => l.status === 'تم التوصيل').length;

    // Top brand by revenue
    const brandRevenue = {};
    products.forEach(p => {
      const brandSalesCount = sales.filter(s => s.invoice.includes('INV')).length;
      brandRevenue[p.brand] = (brandRevenue[p.brand] || 0) + (brandSalesCount * p.price);
    });
    const topBrand = Object.entries(brandRevenue).sort((a, b) => b[1] - a[1])[0];

    return {
      totalRevenue, netProfit, profitMargin, avgTransaction,
      outstandingDebts, outstandingCount,
      todayRevenue, todayProfit, todayCount,
      totalStockValue,
      returns, returnValue,
      pendingDeliveries, delivered,
      topBrand: topBrand ? topBrand[0] : '—',
    };
  }, [sales, products, logistics]);

  const statCards = [
    {
      title: 'مبيعات اليوم',
      value: formatEGP(metrics.todayRevenue),
      sub: `${metrics.todayCount} فاتورة`,
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'صافي الربح',
      value: formatEGP(metrics.netProfit),
      sub: `بهامش ${Math.round(metrics.profitMargin)}%`,
      icon: TrendingUp,
      color: 'from-primary-500 to-primary-600',
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      textColor: 'text-primary-600 dark:text-primary-400',
    },
    {
      title: 'المديونيات',
      value: formatEGP(metrics.outstandingDebts),
      sub: `${metrics.outstandingCount} فاتورة معلقة`,
      icon: CreditCard,
      color: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      title: 'قيمة المخزون',
      value: formatEGP(metrics.totalStockValue),
      sub: 'تكلفة الشراء',
      icon: Wallet,
      color: 'from-rose-500 to-rose-600',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      textColor: 'text-rose-600 dark:text-rose-400',
    },
  ];

  const summaryCards = [
    {
      title: 'متوسط الفاتورة',
      value: formatEGP(metrics.avgTransaction),
      icon: Receipt,
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      textColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      title: 'عمليات التوصيل',
      value: `${metrics.delivered} تم / ${metrics.pendingDeliveries} معلق`,
      icon: Activity,
      bg: 'bg-sky-50 dark:bg-sky-900/20',
      textColor: 'text-sky-600 dark:text-sky-400',
    },
    {
      title: 'المرتجعات',
      value: `${metrics.returns} شحنة`,
      icon: TrendingDown,
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      title: 'أفضل ماركة',
      value: metrics.topBrand,
      icon: BadgeDollarSign,
      bg: 'bg-teal-50 dark:bg-teal-900/20',
      textColor: 'text-teal-600 dark:text-teal-400',
    },
  ];

  // Monthly summary
  const monthlyData = useMemo(() => {
    const months = {};
    sales.forEach((s) => {
      const d = new Date(s.date);
      const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
      if (!months[key]) months[key] = { revenue: 0, cost: 0, count: 0, items: 0 };
      months[key].revenue += s.total;
      months[key].count += 1;
      months[key].items += s.items;
    });
    const avgCost = products.reduce((sum, p) => sum + p.cost, 0) / (products.length || 1);
    return Object.entries(months)
      .sort((a, b) => {
        const [mA, yA] = a[0].split('/').map(Number);
        const [mB, yB] = b[0].split('/').map(Number);
        return yA - yB || mA - mB;
      })
      .slice(-5)
      .map(([month, data]) => {
        const estCost = data.items * avgCost * 0.85;
        return {
          month,
          revenue: data.revenue,
          profit: data.revenue - estCost,
          margin: data.revenue > 0 ? Math.round(((data.revenue - estCost) / data.revenue) * 100) : 0,
          count: data.count,
        };
      });
  }, [sales, products]);

  const recentLogs = auditLogs.slice(0, 5);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">لوحة التحكم</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">المؤشرات المالية والتشغيلية</p>
      </div>

      {/* Main Financial Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={i} variants={item} className="glass-card p-4 lg:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
                {stat.title}
              </span>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
              </div>
            </div>
            <p className={`text-xl lg:text-2xl font-bold ${stat.textColor}`}>
              {stat.value}
            </p>

            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div key={i} variants={item} className="glass-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`}>
              <card.icon className={`w-5 h-5 ${card.textColor}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-slate-400">{card.title}</p>
              <p className={`text-sm font-bold ${card.textColor} truncate`}>{card.value}</p>
            </div>

          </motion.div>
        ))}
      </div>

      {/* Monthly Financial Summary Table */}
      <motion.div variants={item} className="glass-card p-5">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          الملخص المالي الشهري
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                <th className="text-right p-3 text-xs font-medium text-gray-500 dark:text-slate-400">الشهر</th>
                <th className="text-center p-3 text-xs font-medium text-gray-500 dark:text-slate-400">الإيرادات</th>
                <th className="text-center p-3 text-xs font-medium text-gray-500 dark:text-slate-400">صافي الربح</th>
                <th className="text-center p-3 text-xs font-medium text-gray-500 dark:text-slate-400">هامش الربح</th>
                <th className="text-center p-3 text-xs font-medium text-gray-500 dark:text-slate-400">عدد الفواتير</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 text-sm font-medium text-slate-900 dark:text-white">{row.month}</td>
                  <td className="p-3 text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatEGP(row.revenue)}
                  </td>
                  <td className="p-3 text-center text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {formatEGP(row.profit)}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      row.margin > 40
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : row.margin > 30
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                    }`}>
                      {row.margin}%
                    </span>
                  </td>
                  <td className="p-3 text-center text-sm text-gray-500 dark:text-slate-400">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item} className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            آخر النشاطات
          </h3>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                  {log.user.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {log.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  {timeAgo(log.timestamp)}
                </p>
              </div>
              <span className="text-xs text-gray-400 dark:text-slate-500 whitespace-nowrap">
                {log.action}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
