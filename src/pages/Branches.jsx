import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, User, Package, DollarSign, TrendingUp, Calendar, ChevronDown, ChevronUp, Building2, ShoppingCart, Edit2, Save, X, Eye, CheckCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatEGP } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function Branches() {
  const { branches: initialBranches, products, sales } = useData();
  const [branches, setBranches] = useState(initialBranches);
  const [expandedBranch, setExpandedBranch] = useState(null);
  const [editingBranch, setEditingBranch] = useState(null); // branch id being edited
  const [editForm, setEditForm] = useState({ name: '', address: '', phone: '', manager: '' });
  const [viewSale, setViewSale] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null); // For product details

  const branchStats = useMemo(() => {
    return branches.map((branch) => {
      const branchProducts = products.filter((p) => (p.stock[branch.id] || 0) > 0);
      const totalItems = branchProducts.reduce((s, p) => s + (p.stock[branch.id] || 0), 0);
      const totalStockValue = branchProducts.reduce((s, p) => s + (p.stock[branch.id] || 0) * p.cost, 0);
      const branchSales = sales.filter((s) => s.branch === branch.id);
      const totalRevenue = branchSales.reduce((s, sale) => s + sale.total, 0);
      const salesCount = branchSales.length;
      return { ...branch, totalItems, totalStockValue, totalRevenue, salesCount, branchProducts, branchSales };
    });
  }, [branches, products, sales]);

  const startEdit = (branch) => {
    setEditingBranch(branch.id);
    setEditForm({ name: branch.name, address: branch.address, phone: branch.phone, manager: branch.manager });
  };

  const saveEdit = () => {
    if (!editForm.name.trim()) { toast.error('اسم الفرع مطلوب'); return; }
    setBranches((prev) => prev.map((b) => b.id === editingBranch ? { ...b, ...editForm } : b));
    toast.success('تم تحديث بيانات الفرع بنجاح');
    setEditingBranch(null);
  };

  const cancelEdit = () => { setEditingBranch(null); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">الفروع</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          عرض وتعديل تفاصيل الفروع والمخازن مع المنتجات والمبيعات
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center"><Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" /></div>
          <div><p className="text-xs text-gray-500 dark:text-slate-400">عدد الفروع</p><p className="text-xl font-bold text-slate-900 dark:text-white">{branches.length}</p></div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center"><Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /></div>
          <div><p className="text-xs text-gray-500 dark:text-slate-400">إجمالي القطع</p><p className="text-xl font-bold text-slate-900 dark:text-white">{branchStats.reduce((s, b) => s + b.totalItems, 0).toLocaleString('ar-EG')}</p></div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center"><DollarSign className="w-6 h-6 text-amber-600 dark:text-amber-400" /></div>
          <div><p className="text-xs text-gray-500 dark:text-slate-400">قيمة المخزون</p><p className="text-xl font-bold text-slate-900 dark:text-white">{formatEGP(branchStats.reduce((s, b) => s + b.totalStockValue, 0))}</p></div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center"><TrendingUp className="w-6 h-6 text-violet-600 dark:text-violet-400" /></div>
          <div><p className="text-xs text-gray-500 dark:text-slate-400">إجمالي المبيعات</p><p className="text-xl font-bold text-slate-900 dark:text-white">{formatEGP(branchStats.reduce((s, b) => s + b.totalRevenue, 0))}</p></div>
        </div>
      </div>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 gap-6">
        {branchStats.map((branch) => {
          const isExpanded = expandedBranch === branch.id;
          const isEditing = editingBranch === branch.id;
          return (
            <motion.div key={branch.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
              {/* Branch Header */}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center flex-shrink-0"><Building2 className="w-7 h-7 text-primary-600 dark:text-primary-400" /></div>
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input type="text" value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} className="input-field text-sm py-1.5 w-full" placeholder="اسم الفرع" />
                          <input type="text" value={editForm.address} onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))} className="input-field text-sm py-1.5 w-full" placeholder="العنوان" />
                          <div className="flex gap-2">
                            <input type="text" value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} className="input-field text-sm py-1.5 flex-1" placeholder="الهاتف" />
                            <input type="text" value={editForm.manager} onChange={(e) => setEditForm((p) => ({ ...p, manager: e.target.value }))} className="input-field text-sm py-1.5 flex-1" placeholder="المدير" />
                          </div>
                          <div className="flex gap-2 mt-1">
                            <button onClick={saveEdit} className="btn-success text-xs py-1.5 px-3 flex items-center gap-1"><Save className="w-3 h-3" /> حفظ</button>
                            <button onClick={cancelEdit} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"><X className="w-3 h-3" /> إلغاء</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{branch.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400 mt-1"><MapPin className="w-3 h-3" /> {branch.address}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400"><Phone className="w-3 h-3" /> {branch.phone}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400"><User className="w-3 h-3" /> {branch.manager}</div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isEditing && (
                      <button onClick={() => startEdit(branch)} className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl" title="تعديل بيانات الفرع">
                        <Edit2 className="w-4 h-4 text-primary-500" />
                      </button>
                    )}
                    <button onClick={() => setExpandedBranch(isExpanded ? null : branch.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                    <Package className="w-4 h-4 mx-auto text-primary-500 mb-1" />
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{branch.totalItems}</p>
                    <p className="text-[10px] text-gray-500 dark:text-slate-400">قطع في المخزون</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                    <DollarSign className="w-4 h-4 mx-auto text-amber-500 mb-1" />
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{formatEGP(branch.totalStockValue)}</p>
                    <p className="text-[10px] text-gray-500 dark:text-slate-400">قيمة المخزون</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                    <TrendingUp className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatEGP(branch.totalRevenue)}</p>
                    <p className="text-[10px] text-gray-500 dark:text-slate-400">إجمالي المبيعات</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                    <ShoppingCart className="w-4 h-4 mx-auto text-violet-500 mb-1" />
                    <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{branch.salesCount}</p>
                    <p className="text-[10px] text-gray-500 dark:text-slate-400">عدد الفواتير</p>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-gray-200 dark:border-slate-700">
                  {/* ===== Products Section ===== */}
                  <div className="p-5">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary-500" />
                      جميع المنتجات في {branch.name} ({branch.branchProducts.length} منتج)
                    </h4>
                    {branch.branchProducts.length === 0 ? (
                      <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-4">لا توجد منتجات في هذا الفرع</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-slate-700 text-xs text-gray-500 dark:text-slate-400">
                              <th className="text-right p-2 font-medium">المنتج</th>
                              <th className="text-left p-2 font-medium">الفئة</th>
                              <th className="text-left p-2 font-medium">سعر البيع</th>
                              <th className="text-left p-2 font-medium">التكلفة</th>
                              <th className="text-center p-2 font-medium">المخزون</th>
                              <th className="text-center p-2 font-medium">قيمة المخزون</th>
                            </tr>
                          </thead>
                          <tbody>
                            {branch.branchProducts.map((p) => (
                              <tr key={p.id} className="border-b border-gray-100 dark:border-slate-800 text-sm hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                <td className="p-2">
                                  <span className="font-semibold text-slate-900 dark:text-white">{p.brand} {p.model}</span>
                                  <span className="text-[10px] text-gray-400 block">{p.dimensions} · {p.height}</span>
                                </td>
                                <td className="p-2 text-gray-500 dark:text-slate-400">{p.category}</td>
                                <td className="p-2 text-left font-medium text-emerald-600 dark:text-emerald-400">{formatEGP(p.price)}</td>
                                <td className="p-2 text-left text-gray-500 dark:text-slate-400">{formatEGP(p.cost)}</td>
                                <td className="p-2 text-center">
                                  <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-bold ${
                                    p.stock[branch.id] > 5 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                    : p.stock[branch.id] > 0 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                    : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                                  }`}>{p.stock[branch.id] || 0}</span>
                                </td>
                                <td className="p-2 text-left font-semibold text-slate-900 dark:text-white">{formatEGP((p.stock[branch.id] || 0) * p.cost)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* ===== Sales Section ===== */}
                  <div className="p-5 border-t border-gray-200 dark:border-slate-700">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      جميع مبيعات {branch.name} ({branch.branchSales.length} فاتورة - إجمالي {formatEGP(branch.totalRevenue)})
                    </h4>
                    {branch.branchSales.length === 0 ? (
                      <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-4">لا توجد مبيعات</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-slate-700 text-xs text-gray-500 dark:text-slate-400">
                              <th className="text-right p-2 font-medium">الفاتورة</th>
                              <th className="text-right p-2 font-medium">العميل</th>
                              <th className="text-right p-2 font-medium">التاريخ</th>
                              <th className="text-right p-2 font-medium">الكاشير</th>
                              <th className="text-center p-2 font-medium">المنتجات</th>
                              <th className="text-center p-2 font-medium">الدفع</th>
                              <th className="text-left p-2 font-medium">الإجمالي</th>
                              <th className="text-center p-2 font-medium"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {branch.branchSales.map((sale) => (
                              <tr key={sale.id} className="border-b border-gray-100 dark:border-slate-800 text-sm hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                <td className="p-2 text-primary-600 dark:text-primary-400 font-semibold">{sale.invoice}</td>
                                <td className="p-2 text-slate-900 dark:text-slate-200">
                                  {sale.customer}
                                  {sale.phone && <span className="text-[10px] text-gray-400 block">{sale.phone}</span>}
                                </td>
                                <td className="p-2 text-gray-500 dark:text-slate-400">{new Date(sale.date).toLocaleDateString('ar-EG')}</td>
                                <td className="p-2 text-gray-500 dark:text-slate-400">{sale.sellerName}</td>
                                <td className="p-2 text-center text-slate-900 dark:text-slate-200">{sale.items}</td>
                                <td className="p-2 text-center">
                                  <span className="badge-info text-[10px]">{sale.paymentMethod}</span>
                                </td>
                                <td className="p-2 text-left font-bold text-emerald-600 dark:text-emerald-400">{formatEGP(sale.total)}</td>
                                <td className="p-2 text-center">
                                  <button onClick={() => setViewSale(sale)} className="p-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg" title="عرض التفاصيل">
                                    <Eye className="w-4 h-4 text-primary-500" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

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

              <button onClick={() => setViewSale(null)} className="btn-secondary w-full">إغلاق</button>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
