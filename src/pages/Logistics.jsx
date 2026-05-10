import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Truck, MapPin, Phone, Package, ClipboardList, Plus, Edit3, Trash2, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { getStatusBadge, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const emptyLogistics = {
  invoice: '', customer: '', address: '', phone: '',
  status: 'قيد الانتظار', driver: '', branch: '', note: '',
  date: new Date().toISOString(), items: 1,
};

export default function Logistics() {
  const { logistics, branches, addLogistics, updateLogistics, deleteLogistics } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ ...emptyLogistics });

  const stats = [
    { label: 'قيد التوصيل', value: logistics.filter(l => l.status === 'قيد التوصيل').length, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'تم التوصيل', value: logistics.filter(l => l.status === 'تم التوصيل').length, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/20' },
    { label: 'قيد الانتظار', value: logistics.filter(l => l.status === 'قيد الانتظار').length, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/20' },
    { label: 'مرتجع', value: logistics.filter(l => l.status === 'مرتجع').length, color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/20' },
  ];

  const getBranchName = (branchId) => {
    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.name : '';
  };

  const filteredLogistics = useMemo(() => {
    return logistics.filter((l) => {
      const matchesSearch =
        !searchQuery ||
        l.invoice.includes(searchQuery) ||
        l.customer.includes(searchQuery) ||
        l.address.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
      const matchesBranch = branchFilter === 'all' || l.branch === branchFilter;
      return matchesSearch && matchesStatus && matchesBranch;
    });
  }, [logistics, searchQuery, statusFilter, branchFilter]);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({ ...emptyLogistics, branch: branches[0]?.id || '' });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      invoice: item.invoice,
      customer: item.customer,
      address: item.address,
      phone: item.phone,
      status: item.status,
      driver: item.driver || '',
      branch: item.branch || '',
      note: item.note || '',
      date: item.date,
      items: item.items,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.customer || !form.address) {
      toast.error('يرجى إدخال اسم العميل والعنوان');
      return;
    }

    if (editingItem) {
      updateLogistics(editingItem.id, form);
      toast.success('تم تحديث الشحنة');
    } else {
      addLogistics(form);
      toast.success('تم إضافة الشحنة');
    }
    setShowModal(false);
  };

  const handleDelete = (item) => {
    if (window.confirm(`هل أنت متأكد من حذف شحنة "${item.invoice}"؟`)) {
      deleteLogistics(item.id);
      toast.success('تم حذف الشحنة');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">إدارة التوصيل</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            تتبع عمليات التوصيل والشحن
          </p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          إضافة شحنة
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
              <Truck className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400">{stat.label}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث برقم الفاتورة أو العميل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pr-10 py-2 text-sm"
          />
        </div>
        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="select-field text-sm py-2 sm:w-44"
        >
          <option value="all">كل الفروع</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select-field text-sm py-2 sm:w-44"
        >
          <option value="all">كل الحالات</option>
          <option value="قيد التوصيل">قيد التوصيل</option>
          <option value="تم التوصيل">تم التوصيل</option>
          <option value="قيد الانتظار">قيد الانتظار</option>
          <option value="مرتجع">مرتجع</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                <th className="text-right p-4 text-xs font-medium text-gray-500 dark:text-slate-400">الفاتورة</th>
                <th className="text-right p-4 text-xs font-medium text-gray-500 dark:text-slate-400">العميل</th>
                <th className="text-right p-4 text-xs font-medium text-gray-500 dark:text-slate-400">الفرع</th>
                <th className="text-right p-4 text-xs font-medium text-gray-500 dark:text-slate-400">العنوان</th>
                <th className="text-center p-4 text-xs font-medium text-gray-500 dark:text-slate-400">السائق</th>
                <th className="text-center p-4 text-xs font-medium text-gray-500 dark:text-slate-400">الحالة</th>
                <th className="text-center p-4 text-xs font-medium text-gray-500 dark:text-slate-400">الملاحظات</th>
                <th className="text-center p-4 text-xs font-medium text-gray-500 dark:text-slate-400">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogistics.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                      {item.invoice}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{item.customer}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{item.phone}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500 dark:text-slate-400">
                    {getBranchName(item.branch) || '—'}
                  </td>
                  <td className="p-4 text-sm text-gray-500 dark:text-slate-400 max-w-xs truncate">
                    {item.address}
                  </td>
                  <td className="p-4 text-center text-sm text-slate-900 dark:text-slate-200">
                    {item.driver || '—'}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <span className={getStatusBadge(item.status)}>{item.status}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center text-xs text-gray-500 dark:text-slate-400">
                    {item.note || '—'}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="w-7 h-7 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-primary-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="w-7 h-7 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      </button>
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
        {filteredLogistics.map((item) => (
          <div key={item.id} className="mobile-card relative">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-primary-600">{item.invoice}</span>
              <span className={getStatusBadge(item.status)}>{item.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="mobile-card-label">العميل</p>
                <p className="mobile-card-value">{item.customer}</p>
              </div>
              <div>
                <p className="mobile-card-label">الفرع</p>
                <p className="mobile-card-value">{getBranchName(item.branch) || '—'}</p>
              </div>
              <div>
                <p className="mobile-card-label">السائق</p>
                <p className="mobile-card-value">{item.driver || 'لم يعين بعد'}</p>
              </div>
              <div>
                <p className="mobile-card-label">الهاتف</p>
                <p className="mobile-card-value" dir="ltr">{item.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="mobile-card-label">العنوان</p>
                <p className="mobile-card-value text-sm">{item.address}</p>
              </div>
              <div className="col-span-2">
                <p className="mobile-card-label">ملاحظات</p>
                <p className="mobile-card-value text-sm">{item.note || '—'}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-slate-700">
              <button
                onClick={() => openEditModal(item)}
                className="btn-secondary text-xs py-1.5 flex-1"
              >
                <Edit3 className="w-3 h-3" />
                تعديل
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="btn-danger text-xs py-1.5 flex-1"
              >
                <Trash2 className="w-3 h-3" />
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-xl my-8" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editingItem ? 'تعديل الشحنة' : 'إضافة شحنة جديدة'}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 max-h-[70vh] overflow-y-auto px-1">
                  {/* Row 1: Invoice & Branch */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">رقم الفاتورة</label>
                      <input
                        type="text"
                        value={form.invoice}
                        onChange={(e) => setForm((prev) => ({ ...prev, invoice: e.target.value }))}
                        placeholder="مثال: INV-2024-001"
                        className="input-field text-sm py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">الفرع</label>
                      <select
                        value={form.branch}
                        onChange={(e) => setForm((prev) => ({ ...prev, branch: e.target.value }))}
                        className="select-field text-sm py-2"
                      >
                        <option value="">اختر الفرع</option>
                        {branches.map((b) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Customer & Phone */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">اسم العميل</label>
                      <input
                        type="text"
                        value={form.customer}
                        onChange={(e) => setForm((prev) => ({ ...prev, customer: e.target.value }))}
                        placeholder="مثال: أحمد محمود"
                        className="input-field text-sm py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">رقم الهاتف</label>
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="مثال: 01012345678"
                        className="input-field text-sm py-2"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">العنوان</label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="مثال: شارع 9، مدينة نصر، القاهرة"
                      className="input-field text-sm py-2"
                    />
                  </div>

                  {/* Row 3: Status & Driver */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">الحالة</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                        className="select-field text-sm py-2"
                      >
                        <option value="قيد الانتظار">قيد الانتظار</option>
                        <option value="قيد التوصيل">قيد التوصيل</option>
                        <option value="تم التوصيل">تم التوصيل</option>
                        <option value="مرتجع">مرتجع</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">السائق</label>
                      <input
                        type="text"
                        value={form.driver}
                        onChange={(e) => setForm((prev) => ({ ...prev, driver: e.target.value }))}
                        placeholder="مثال: خالد عمر"
                        className="input-field text-sm py-2"
                      />
                    </div>
                  </div>

                  {/* Row 4: Items & Date */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">عدد المنتجات</label>
                      <input
                        type="number"
                        min="1"
                        value={form.items}
                        onChange={(e) => setForm((prev) => ({ ...prev, items: Number(e.target.value) }))}
                        className="input-field text-sm py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">التاريخ</label>
                      <input
                        type="date"
                        value={form.date?.split('T')[0] || ''}
                        onChange={(e) => setForm((prev) => ({ ...prev, date: new Date(e.target.value).toISOString() }))}
                        className="input-field text-sm py-2"
                      />
                    </div>
                  </div>

                  {/* Note */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">ملاحظات</label>
                    <textarea
                      value={form.note}
                      onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                      placeholder="ملاحظات إضافية..."
                      rows={2}
                      className="input-field text-sm py-2 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                    إلغاء
                  </button>
                  <button onClick={handleSave} className="btn-primary flex-1">
                    {editingItem ? 'حفظ التعديلات' : 'إضافة الشحنة'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
