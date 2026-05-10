import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Eye, X, CheckCircle, DollarSign, CreditCard, Trash2, ChevronDown, ChevronUp, Wallet, Banknote, PlusCircle, PackagePlus, Edit2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatEGP } from '../utils/helpers';
import toast from 'react-hot-toast';

const emptyInvoice = {
  supplierId: '',
  supplierName: '',
  isCustomSupplier: false,
  date: new Date().toISOString().split('T')[0],
  items: [],
  paidAmount: 0,
  notes: '',
};

export default function PurchaseInvoices() {
  const { purchaseInvoices, suppliers, products, customSuppliers, customProductNames, addPurchaseInvoice, updatePurchaseInvoice, deletePurchaseInvoice, addCustomSupplier, deleteCustomSupplier, addCustomProductName, deleteCustomProductName } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ ...emptyInvoice });
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [viewInvoice, setViewInvoice] = useState(null);
  const [payModal, setPayModal] = useState(null); // { invoice, amount: '' }
  const [showNewSupplierInput, setShowNewSupplierInput] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [showNewProductInput, setShowNewProductInput] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [productFilter, setProductFilter] = useState('all'); // 'all', 'regular', 'custom'

  // Combine all suppliers (data + custom)
  const allSuppliers = useMemo(() => {
    const dataSuppliers = suppliers.map((s) => ({
      id: s.id,
      name: s.name,
      type: 'data',
    }));
    const customS = customSuppliers.map((s) => ({
      id: s.id,
      name: s.name,
      type: 'custom',
    }));
    return [...dataSuppliers, ...customS];
  }, [suppliers, customSuppliers]);

  // Combine all selectable items: regular products + saved custom product names
  const allSelectableItems = useMemo(() => {
    const regular = products.map((p) => ({
      id: p.id,
      name: `${p.brand} ${p.model}`,
      displayName: `${p.brand} ${p.model}`,
      group: 'المنتجات الموجودة',
      type: 'regular',
      product: p,
    }));
    const custom = customProductNames.map((c) => ({
      id: c.id,
      name: c.name,
      displayName: c.name,
      group: 'المنتجات المخصصة',
      type: 'custom',
    }));
    const combined = [...regular, ...custom];
    if (productFilter === 'regular') return regular;
    if (productFilter === 'custom') return custom;
    return combined;
  }, [products, customProductNames, productFilter]);

  const filteredInvoices = useMemo(() => {
    if (!searchQuery) return purchaseInvoices;
    return purchaseInvoices.filter(
      (inv) =>
        inv.invoiceNumber.includes(searchQuery) ||
        inv.supplierName.includes(searchQuery)
    );
  }, [purchaseInvoices, searchQuery]);

  const addItemToInvoice = (product) => {
    const existing = newInvoice.items.find((i) => i.productId === product.id);
    if (existing) {
      setNewInvoice((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.unitPrice }
            : i
        ),
      }));
    } else {
      setNewInvoice((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            productId: product.id,
            productName: product.model || product.name || product.displayName,
            brand: product.brand || (product.type === 'custom' ? 'منتج مخصص' : ''),
            quantity: 1,
            unitPrice: product.cost || 0,
            total: product.cost || 0,
            isCustom: product.type === 'custom',
          },
        ],
      }));
    }
  };

  const addCustomItemToInvoice = (name) => {
    const nameTrimmed = name.trim();
    if (!nameTrimmed) {
      toast.error('يرجى إدخال اسم المنتج');
      return;
    }
    // Save the custom product name
    const saved = addCustomProductName(nameTrimmed);
    const newItemId = `citem-${Date.now()}`;
    setNewInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: saved.id,
          productName: nameTrimmed,
          brand: 'منتج مخصص',
          quantity: 1,
          unitPrice: 0,
          total: 0,
          isCustom: true,
        },
      ],
    }));
    setShowNewProductInput(false);
    setNewProductName('');
    toast.success(`تم إضافة "${nameTrimmed}" كمنتج مخصص`);
  };

  const removeItemFromInvoice = (productId) => {
    setNewInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.productId !== productId),
    }));
  };

  const updateItemQty = (productId, qty) => {
    const q = Math.max(1, parseInt(qty) || 1);
    setNewInvoice((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.productId === productId
          ? { ...i, quantity: q, total: q * i.unitPrice }
          : i
      ),
    }));
  };

  const updateItemPrice = (productId, price) => {
    const p = Math.max(0, parseFloat(price) || 0);
    setNewInvoice((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.productId === productId
          ? { ...i, unitPrice: p, total: i.quantity * p }
          : i
      ),
    }));
  };

  const invoiceTotal = newInvoice.items.reduce((sum, i) => sum + i.total, 0);

  const handleAddCustomSupplier = () => {
    const name = newSupplierName.trim();
    if (!name) {
      toast.error('يرجى إدخال اسم المورد');
      return;
    }
    const saved = addCustomSupplier(name);
    setNewInvoice((prev) => ({
      ...prev,
      supplierId: saved.id,
      supplierName: name,
      isCustomSupplier: true,
    }));
    setShowNewSupplierInput(false);
    setNewSupplierName('');
    toast.success(`تم إضافة المورد "${name}" بنجاح`);
  };

  const handleSelectSupplier = (id, name, type) => {
    setNewInvoice((prev) => ({
      ...prev,
      supplierId: id,
      supplierName: name,
      isCustomSupplier: type === 'custom',
    }));
  };

  const handleSaveInvoice = () => {
    if (!newInvoice.supplierId && !newInvoice.supplierName) {
      toast.error('يرجى اختيار أو إضافة مورد');
      return;
    }
    if (newInvoice.items.length === 0) {
      toast.error('يرجى إضافة منتجات للفاتورة');
      return;
    }

    const supplierName = newInvoice.supplierName;
    const invNum = `PUR-${new Date().getFullYear()}-${String(purchaseInvoices.length + 1).padStart(3, '0')}`;

    const invoiceData = {
      invoiceNumber: invNum,
      supplierId: newInvoice.supplierId,
      supplierName: supplierName,
      date: newInvoice.date || new Date().toISOString(),
      items: [...newInvoice.items],
      totalAmount: invoiceTotal,
      paidAmount: parseFloat(newInvoice.paidAmount) || 0,
      status: parseFloat(newInvoice.paidAmount) >= invoiceTotal ? 'مسددة' : parseFloat(newInvoice.paidAmount) > 0 ? 'مدفوع جزئياً' : 'غير مدفوعة',
      notes: newInvoice.notes,
    };

    addPurchaseInvoice(invoiceData);
    toast.success('تم إضافة فاتورة المشتريات بنجاح');
    setShowAddModal(false);
    setNewInvoice({ ...emptyInvoice });
  };

  const handlePayInvoice = (invoice, amount) => {
    const newPaid = Math.min(invoice.totalAmount, (invoice.paidAmount || 0) + parseFloat(amount));
    const newStatus = newPaid >= invoice.totalAmount ? 'مسددة' : newPaid > 0 ? 'مدفوع جزئياً' : 'غير مدفوعة';
    updatePurchaseInvoice(invoice.id, { paidAmount: newPaid, status: newStatus });
    toast.success(`تم تسديد ${formatEGP(parseFloat(amount))} من الفاتورة`);
    setPayModal(null);
  };

  const handleDeleteInvoice = (invoice) => {
    if (window.confirm(`هل أنت متأكد من حذف فاتورة "${invoice.invoiceNumber}"؟`)) {
      deletePurchaseInvoice(invoice.id);
      toast.success('تم حذف الفاتورة');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'مسددة': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
      case 'مدفوع جزئياً': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'غير مدفوعة': return 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400';
      default: return 'bg-gray-100 dark:bg-slate-700 text-gray-500';
    }
  };

  const getRemaining = (invoice) => invoice.totalAmount - (invoice.paidAmount || 0);

  const openPayModal = (invoice) => {
    setPayModal({ invoice, amount: String(getRemaining(invoice)) });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">فواتير المشتريات</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            إدارة فواتير شراء البضائع من الموردين
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          فاتورة مشتريات جديدة
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <p className="text-xs text-gray-500 dark:text-slate-400">إجمالي الفواتير</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{purchaseInvoices.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-gray-500 dark:text-slate-400">إجمالي المشتريات</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{formatEGP(purchaseInvoices.reduce((s, i) => s + i.totalAmount, 0))}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-gray-500 dark:text-slate-400">إجمالي المدفوع</p>
          <p className="text-xl font-bold text-emerald-600">{formatEGP(purchaseInvoices.reduce((s, i) => s + (i.paidAmount || 0), 0))}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-gray-500 dark:text-slate-400">المتبقي (مديونية)</p>
          <p className="text-xl font-bold text-rose-600">{formatEGP(purchaseInvoices.reduce((s, i) => s + getRemaining(i), 0))}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن فاتورة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pr-10 py-2 text-sm"
          />
        </div>
        <select
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
          className="select-field text-sm py-2 sm:w-48"
        >
          <option value="">كل الموردين</option>
          {allSuppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Invoices Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                <th className="text-right p-4 text-xs font-medium text-gray-500">رقم الفاتورة</th>
                <th className="text-right p-4 text-xs font-medium text-gray-500">المورد</th>
                <th className="text-right p-4 text-xs font-medium text-gray-500">التاريخ</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500">العدد</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500">الإجمالي</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500">المدفوع</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500">المتبقي</th>
                <th className="text-center p-4 text-xs font-medium text-gray-500">الحالة</th>
                <th className="text-center p-4 text-xs font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{inv.invoiceNumber}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-900 dark:text-slate-200">{inv.supplierName}</td>
                  <td className="p-4 text-sm text-slate-900 dark:text-slate-200">
                    {new Date(inv.date).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="p-4 text-sm text-slate-900 dark:text-slate-200">
                    {inv.items.reduce((s, i) => s + i.quantity, 0)} قطعة
                  </td>
                  <td className="p-4 text-sm font-semibold text-slate-900 dark:text-white">
                    {formatEGP(inv.totalAmount)}
                  </td>
                  <td className="p-4 text-sm text-emerald-600 font-semibold">
                    {formatEGP(inv.paidAmount || 0)}
                  </td>
                  <td className="p-4 text-sm">
                    {getRemaining(inv) > 0 ? (
                      <span className="text-rose-600 font-semibold">{formatEGP(getRemaining(inv))}</span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${getStatusStyle(inv.status)}`}>
                        {inv.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setViewInvoice(inv)}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      {getRemaining(inv) > 0 && (
                        <button
                          onClick={() => openPayModal(inv)}
                          className="p-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg"
                          title="تسديد دفعة"
                        >
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteInvoice(inv)}
                        className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4 text-rose-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment UI Modal */}
      <AnimatePresence>
        {payModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPayModal(null)}
              className="fixed inset-0 bg-black/50 z-[9990]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-[9991] flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Wallet className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">تسديد دفعة</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                    فاتورة {payModal.invoice.invoiceNumber}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-slate-400">المورد</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{payModal.invoice.supplierName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-slate-400">الإجمالي</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{formatEGP(payModal.invoice.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-slate-400">المدفوع سابقاً</span>
                    <span className="font-semibold text-emerald-600">{formatEGP(payModal.invoice.paidAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-slate-600">
                    <span className="font-medium text-rose-600">المتبقي</span>
                    <span className="font-bold text-rose-600 text-lg">{formatEGP(getRemaining(payModal.invoice))}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">المبلغ المراد سداده</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max={getRemaining(payModal.invoice)}
                      value={payModal.amount}
                      onChange={(e) => setPayModal((prev) => ({ ...prev, amount: e.target.value }))}
                      className="input-field text-lg py-3 text-center font-bold w-full"
                      placeholder="0"
                      autoFocus
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">ج.م</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 text-center">
                    أقصى مبلغ للتسديد: {formatEGP(getRemaining(payModal.invoice))}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setPayModal(null)}
                    className="btn-secondary flex-1"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={() => {
                      const amt = parseFloat(payModal.amount);
                      if (!amt || amt <= 0) {
                        toast.error('يرجى إدخال مبلغ صحيح');
                        return;
                      }
                      if (amt > getRemaining(payModal.invoice)) {
                        toast.error('المبلغ أكبر من المتبقي');
                        return;
                      }
                      handlePayInvoice(payModal.invoice, amt);
                      if (viewInvoice && viewInvoice.id === payModal.invoice.id) {
                        const newPaid = Math.min(payModal.invoice.totalAmount, (payModal.invoice.paidAmount || 0) + amt);
                        setViewInvoice({ ...payModal.invoice, paidAmount: newPaid });
                      }
                    }}
                    className="btn-success flex-1 flex items-center justify-center gap-2"
                  >
                    <Banknote className="w-4 h-4" />
                    تسديد
                  </button>
                </div>

                <div className="flex gap-2 mt-4 justify-center">
                  {[getRemaining(payModal.invoice), Math.round(getRemaining(payModal.invoice) / 2), Math.round(getRemaining(payModal.invoice) / 3)].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setPayModal((prev) => ({ ...prev, amount: String(amount) }))}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        parseFloat(payModal.amount) === amount
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-300'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-600 hover:border-emerald-300'
                      }`}
                    >
                      {formatEGP(amount)}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* View Invoice Details Modal */}
      <AnimatePresence>
        {viewInvoice && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewInvoice(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-xl my-8" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    فاتورة {viewInvoice.invoiceNumber}
                  </h3>
                  <button onClick={() => setViewInvoice(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">المورد</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{viewInvoice.supplierName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">التاريخ</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {new Date(viewInvoice.date).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">الحالة</p>
                    <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-medium mt-1 ${getStatusStyle(viewInvoice.status)}`}>
                      {viewInvoice.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">ملاحظات</p>
                    <p className="text-sm text-slate-900 dark:text-white">{viewInvoice.notes || '—'}</p>
                  </div>
                </div>

                <table className="w-full mb-4">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700">
                      <th className="text-right p-2 text-xs font-medium text-gray-500">المنتج</th>
                      <th className="text-center p-2 text-xs font-medium text-gray-500">الكمية</th>
                      <th className="text-left p-2 text-xs font-medium text-gray-500">سعر الوحدة</th>
                      <th className="text-left p-2 text-xs font-medium text-gray-500">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewInvoice.items.map((item, i) => (
                      <tr key={i} className="border-b border-gray-100 dark:border-slate-800">
                        <td className="p-2 text-sm text-slate-900 dark:text-slate-200">
                          {item.productName} {item.brand ? <span className="text-gray-400">({item.brand})</span> : ''}
                        </td>
                        <td className="p-2 text-center text-sm text-slate-900 dark:text-slate-200">{item.quantity}</td>
                        <td className="p-2 text-left text-sm text-slate-900 dark:text-slate-200">{formatEGP(item.unitPrice)}</td>
                        <td className="p-2 text-left text-sm font-semibold text-slate-900 dark:text-white">{formatEGP(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300 dark:border-slate-600">
                      <td colSpan={3} className="p-2 text-left text-sm font-bold text-slate-900 dark:text-white">الإجمالي</td>
                      <td className="p-2 text-left text-sm font-bold text-primary-600">{formatEGP(viewInvoice.totalAmount)}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="p-2 text-left text-sm text-emerald-600 font-semibold">المدفوع</td>
                      <td className="p-2 text-left text-sm font-semibold text-emerald-600">{formatEGP(viewInvoice.paidAmount || 0)}</td>
                    </tr>
                    {getRemaining(viewInvoice) > 0 && (
                      <tr>
                        <td colSpan={3} className="p-2 text-left text-sm text-rose-600 font-semibold">المتبقي</td>
                        <td className="p-2 text-left text-sm font-semibold text-rose-600">{formatEGP(getRemaining(viewInvoice))}</td>
                      </tr>
                    )}
                  </tfoot>
                </table>

                {getRemaining(viewInvoice) > 0 && (
                  <button
                    onClick={() => openPayModal(viewInvoice)}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    تسديد دفعة
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Invoice Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-3xl shadow-xl my-8" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">فاتورة مشتريات جديدة</h3>
                  <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Supplier Selection - Choose existing OR add custom */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">المورد</label>
                    {!showNewSupplierInput ? (
                      <>
                        <select
                          value={newInvoice.supplierId}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '__new__') {
                              setShowNewSupplierInput(true);
                              setNewInvoice((prev) => ({ ...prev, supplierId: '', supplierName: '', isCustomSupplier: false }));
                            } else {
                              const selected = allSuppliers.find((s) => s.id === val);
                              handleSelectSupplier(val, selected ? selected.name : '', selected ? selected.type : '');
                            }
                          }}
                          className="select-field text-sm py-2 w-full mb-1"
                        >
                          <option value="">اختر المورد</option>
                          <option value="__new__" className="text-primary-600 font-semibold">➕ إضافة مورد جديد...</option>
                          <optgroup label="--- الموردين الحاليين ---">
                            {allSuppliers.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                        {newInvoice.supplierName && (
                          <div className="text-xs text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-lg">
                            ✓ {newInvoice.supplierName}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newSupplierName}
                            onChange={(e) => setNewSupplierName(e.target.value)}
                            placeholder="اكتب اسم المورد الجديد..."
                            className="input-field text-sm py-2 flex-1"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddCustomSupplier();
                            }}
                          />
                          <button
                            onClick={handleAddCustomSupplier}
                            className="btn-primary text-xs px-3 py-1"
                            title="حفظ المورد"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setShowNewSupplierInput(false);
                            setNewSupplierName('');
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          ← الرجوع لاختيار مورد موجود
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">التاريخ</label>
                    <input
                      type="date"
                      value={newInvoice.date}
                      onChange={(e) => setNewInvoice((prev) => ({ ...prev, date: e.target.value }))}
                      className="input-field text-sm py-2 w-full"
                    />
                  </div>
                </div>

                {/* Product Selection - Choose existing OR add custom */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-500 dark:text-slate-400">إضافة منتجات للفاتورة</label>
                    <div className="flex items-center gap-2">
                      {/* Filter buttons */}
                      <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-0.5 text-xs">
                        <button onClick={() => setProductFilter('all')}
                          className={`px-2.5 py-1 rounded-md transition-all ${productFilter === 'all' ? 'bg-white dark:bg-slate-600 text-primary-600 dark:text-primary-400 shadow-sm font-medium' : 'text-gray-500 dark:text-slate-400'}`}>الكل</button>
                        <button onClick={() => setProductFilter('regular')}
                          className={`px-2.5 py-1 rounded-md transition-all ${productFilter === 'regular' ? 'bg-white dark:bg-slate-600 text-primary-600 dark:text-primary-400 shadow-sm font-medium' : 'text-gray-500 dark:text-slate-400'}`}>موجود</button>
                        <button onClick={() => setProductFilter('custom')}
                          className={`px-2.5 py-1 rounded-md transition-all ${productFilter === 'custom' ? 'bg-white dark:bg-slate-600 text-primary-600 dark:text-primary-400 shadow-sm font-medium' : 'text-gray-500 dark:text-slate-400'}`}>مخصص</button>
                      </div>
                      <button
                        onClick={() => {
                          setShowNewProductInput(!showNewProductInput);
                          setNewProductName('');
                        }}
                        className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                      >
                        {showNewProductInput ? (
                          'اختيار من المحفوظ'
                        ) : (
                          <>
                            <PackagePlus className="w-3 h-3" />
                            إضافة منتج مخصص جديد
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Custom product input */}
                  {showNewProductInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-3"
                    >
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newProductName}
                          onChange={(e) => setNewProductName(e.target.value)}
                          placeholder="اكتب اسم المنتج المخصص..."
                          className="input-field text-sm py-2 flex-1"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') addCustomItemToInvoice(newProductName);
                          }}
                        />
                        <button
                          onClick={() => addCustomItemToInvoice(newProductName)}
                          className="btn-primary text-xs px-3"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Selectable items grid (regular products + saved custom products) */}
                  {!showNewProductInput && (
                    <div className="max-h-48 overflow-y-auto p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                      {allSelectableItems.length === 0 && (
                        <p className="text-center text-gray-400 dark:text-slate-500 text-xs py-4">
                          {productFilter === 'custom' 
                            ? 'لم يتم إضافة منتجات مخصصة بعد. استخدم "إضافة منتج مخصص جديد" أعلاه.'
                            : 'لا توجد منتجات'}
                        </p>
                      )}
                      {allSelectableItems.length > 0 && (
                        <div className="space-y-1">
                          {allSelectableItems.map((item) => {
                            const isSelected = newInvoice.items.some((i) => i.productId === item.id);
                            return (
                              <button
                                key={item.id}
                                onClick={() => isSelected ? removeItemFromInvoice(item.id) : addItemToInvoice(item.product || item)}
                                className={`w-full text-right px-3 py-2 rounded-lg text-xs font-medium transition-colors border flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border-primary-300 dark:border-primary-700'
                                    : 'bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-300 border-gray-200 dark:border-slate-600 hover:border-primary-300'
                                }`}
                              >
                                <span>{item.displayName}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                  item.type === 'custom' 
                                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' 
                                    : 'text-gray-400 dark:text-slate-500'
                                }`}>
                                  {item.type === 'custom' ? 'مخصص' : 'منتج'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Invoice Items Table */}
                {newInvoice.items.length > 0 && (
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-slate-700">
                          <th className="text-right p-2 text-xs font-medium text-gray-500">المنتج</th>
                          <th className="text-center p-2 text-xs font-medium text-gray-500">الكمية</th>
                          <th className="text-left p-2 text-xs font-medium text-gray-500">سعر الوحدة</th>
                          <th className="text-left p-2 text-xs font-medium text-gray-500">الإجمالي</th>
                          <th className="text-center p-2 text-xs font-medium text-gray-500"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {newInvoice.items.map((item) => (
                          <tr key={item.productId} className="border-b border-gray-100 dark:border-slate-800">
                            <td className="p-2 text-sm text-slate-900 dark:text-slate-200">
                              {item.productName}
                              {item.brand && <span className="text-gray-400"> ({item.brand})</span>}
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItemQty(item.productId, e.target.value)}
                                className="w-16 text-center text-sm bg-transparent border-b border-gray-300 dark:border-slate-600 focus:border-primary-500 outline-none mx-auto block"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) => updateItemPrice(item.productId, e.target.value)}
                                className="w-24 text-left text-sm bg-transparent border-b border-gray-300 dark:border-slate-600 focus:border-primary-500 outline-none"
                                placeholder="0"
                              />
                            </td>
                            <td className="p-2 text-left text-sm font-semibold text-slate-900 dark:text-white">
                              {formatEGP(item.total)}
                            </td>
                            <td className="p-2 text-center">
                              <button onClick={() => removeItemFromInvoice(item.productId)} className="text-rose-500 hover:text-rose-700">
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-gray-300 dark:border-slate-600">
                          <td colSpan={3} className="p-2 text-left text-sm font-bold text-slate-900 dark:text-white">الإجمالي</td>
                          <td className="p-2 text-left text-sm font-bold text-primary-600">{formatEGP(invoiceTotal)}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}

                {/* Payment & Notes */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">المبلغ المدفوع (ج.م)</label>
                    <input
                      type="number"
                      min="0"
                      value={newInvoice.paidAmount}
                      onChange={(e) => setNewInvoice((prev) => ({ ...prev, paidAmount: e.target.value }))}
                      className="input-field text-sm py-2 w-full"
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {parseFloat(newInvoice.paidAmount) >= invoiceTotal
                        ? '✅ الفاتورة مسددة بالكامل'
                        : parseFloat(newInvoice.paidAmount) > 0
                        ? `⚠️ باقي ${formatEGP(invoiceTotal - parseFloat(newInvoice.paidAmount))}`
                        : 'لم يتم السداد بعد'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">ملاحظات</label>
                    <textarea
                      value={newInvoice.notes}
                      onChange={(e) => setNewInvoice((prev) => ({ ...prev, notes: e.target.value }))}
                      className="input-field text-sm py-2 w-full resize-none"
                      rows={3}
                      placeholder="اختياري..."
                    />
                  </div>
                </div>

                <button onClick={handleSaveInvoice} className="btn-primary w-full flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  حفظ فاتورة المشتريات
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
