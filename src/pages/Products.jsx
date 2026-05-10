import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Plus, Edit3, Trash2, X, Package, Minus, ShoppingCart, Warehouse } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatEGP } from '../utils/helpers';
import ProductIcon, { availableIconTypes } from '../components/ProductIcon';
import toast from 'react-hot-toast';

const emptyProduct = {
  brand: '', model: '', displayName: '', category: '', dimensions: '', height: '',
  price: '', cost: '', warranty: '', description: '', iconType: 'standard',
  rating: 4.0, tags: [],
};

export default function Products() {
  const { products, branches, updateProduct, addProduct, deleteProduct, getAllBrands, getAllCategories } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ ...emptyProduct });
  const [tagInput, setTagInput] = useState('');
  const [stockModalProduct, setStockModalProduct] = useState(null);

  const brands = getAllBrands();
  const categories = getAllCategories();

  // Open modal for adding
  const openAddModal = () => {
    setEditingProduct(null);
    setForm({ ...emptyProduct });
    setTagInput('');
    setShowModal(true);
  };

  // Open modal for editing
  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      brand: product.brand,
      model: product.model,
      displayName: product.displayName || '',
      category: product.category,
      dimensions: product.dimensions,
      height: product.height,
      price: product.price,
      cost: product.cost,
      warranty: product.warranty,
      description: product.description,
      iconType: product.iconType || 'standard',
      rating: product.rating,
      tags: [...product.tags],
    });
    setTagInput('');
    setShowModal(true);
  };

  // Save (add or update)
  const handleSave = () => {
    if (!form.brand || !form.model || !form.price) {
      toast.error('يرجى إدخال الماركة، الموديل، والسعر');
      return;
    }

    const productData = {
      ...form,
      price: Number(form.price),
      cost: Number(form.cost) || 0,
      rating: Number(form.rating) || 4.0,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success('تم تحديث المنتج');
    } else {
      addProduct(productData);
      toast.success('تم إضافة المنتج');
    }
    setShowModal(false);
  };

  // Delete confirmation
  const handleDelete = (product) => {
    if (window.confirm(`هل أنت متأكد من حذف "${product.model}"؟`)) {
      deleteProduct(product.id);
      toast.success('تم حذف المنتج');
    }
  };

  // Add tag
  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput('');
  };

  // Remove tag
  const removeTag = (tag) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.model.includes(searchQuery) ||
          p.brand.includes(searchQuery) ||
          p.description.includes(searchQuery)
      );
    }

    if (brandFilter) {
      result = result.filter((p) => p.brand === brandFilter);
    }

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [products, searchQuery, brandFilter, sortBy]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">المنتجات</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            {products.length} منتج متوفر
          </p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          إضافة منتج
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pr-10 py-2 text-sm"
          />
        </div>
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="select-field text-sm py-2 sm:w-44"
        >
          <option value="">كل الماركات</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select-field text-sm py-2 sm:w-44"
        >
          <option value="default">الترتيب الافتراضي</option>
          <option value="price-asc">السعر: من الأقل للأعلى</option>
          <option value="price-desc">السعر: من الأعلى للأقل</option>
          <option value="rating">التقييم</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product, i) => {
          const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card p-4 hover:shadow-md transition-all duration-200 group relative"
            >
              {/* Edit/Delete buttons */}
              <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(product)}
                  className="w-7 h-7 bg-white dark:bg-slate-700 rounded-lg shadow flex items-center justify-center hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-primary-600" />
                </button>
                <button
                  onClick={() => handleDelete(product)}
                  className="w-7 h-7 bg-white dark:bg-slate-700 rounded-lg shadow flex items-center justify-center hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                </button>
              </div>

              {/* Icon */}
              <div className="mb-3 flex justify-center">
                <ProductIcon iconType={product.iconType} category={product.category} size="xl" />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-2">
                {product.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="badge-info text-[10px]">{tag}</span>
                ))}
                <span className="badge-neutral text-[10px]">{product.category}</span>
              </div>

              {/* Info */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-primary-600 dark:text-primary-400">
                  {product.brand}
                </p>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {product.model}
                </p>
                {product.displayName && (
                  <p className="text-[10px] text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 inline-block px-1.5 py-0.5 rounded">
                    الفاتورة: {product.displayName}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {product.dimensions} · {product.height}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {product.warranty} ضمان
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 line-clamp-2">
                {product.description}
              </p>

              {/* Price & Stock */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
                <div>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {formatEGP(product.price)}
                  </p>
                  <p className="text-[10px] text-gray-400">التكلفة: {formatEGP(product.cost)}</p>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-medium text-slate-900 dark:text-white">
                      {product.rating}
                    </span>
                  </div>
                  <button
                    onClick={() => setStockModalProduct(product)}
                    className={`text-xs font-medium transition-colors hover:underline ${
                      totalStock > 10
                        ? 'text-emerald-600 hover:text-emerald-700'
                        : totalStock > 0
                        ? 'text-amber-600 hover:text-amber-700'
                        : 'text-rose-600 hover:text-rose-700'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {totalStock > 0 ? `${totalStock} في المخزون` : 'نفذ'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Product Add/Edit Modal */}
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
                    {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 max-h-[70vh] overflow-y-auto px-1">
                  {/* Row 1: Brand & Model */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">الماركة</label>
                      <input
                        type="text"
                        value={form.brand}
                        onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))}
                        placeholder="مثال: Janssen"
                        className="input-field text-sm py-2"
                        list="brand-suggestions"
                      />
                      <datalist id="brand-suggestions">
                        {brands.map((b) => <option key={b} value={b} />)}
                      </datalist>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">الموديل</label>
                      <input
                        type="text"
                        value={form.model}
                        onChange={(e) => setForm((prev) => ({ ...prev, model: e.target.value }))}
                        placeholder="مثال: كومفورت 2000"
                        className="input-field text-sm py-2"
                      />
                    </div>
                  </div>

                  {/* Row 1b: Display Name (Custom Name on Receipt) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
                      الاسم الظاهر في الفاتورة <span className="text-gray-400">(اختياري - إذا ترك فارغاً سيظهر الموديل)</span>
                    </label>
                    <input
                      type="text"
                      value={form.displayName}
                      onChange={(e) => setForm((prev) => ({ ...prev, displayName: e.target.value }))}
                      placeholder="مثال: مرتبة جانسن كومفورت 2000 مقاس 160x200"
                      className="input-field text-sm py-2"
                    />
                  </div>

                  {/* Row 2: Category & Icon */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">التصنيف</label>
                      <input
                        type="text"
                        value={form.category}
                        onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                        placeholder="مثال: سوست منفصلة"
                        className="input-field text-sm py-2"
                        list="category-suggestions"
                      />
                      <datalist id="category-suggestions">
                        {categories.map((c) => <option key={c} value={c} />)}
                      </datalist>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">الأيقونة</label>
                      <select
                        value={form.iconType}
                        onChange={(e) => setForm((prev) => ({ ...prev, iconType: e.target.value }))}
                        className="select-field text-sm py-2"
                      >
                        {availableIconTypes.map((icon) => (
                          <option key={icon.value} value={icon.value}>{icon.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Dimensions & Height */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">المقاس</label>
                      <input
                        type="text"
                        value={form.dimensions}
                        onChange={(e) => setForm((prev) => ({ ...prev, dimensions: e.target.value }))}
                        placeholder="مثال: 160x200"
                        className="input-field text-sm py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">الارتفاع</label>
                      <input
                        type="text"
                        value={form.height}
                        onChange={(e) => setForm((prev) => ({ ...prev, height: e.target.value }))}
                        placeholder="مثال: 25 سم"
                        className="input-field text-sm py-2"
                      />
                    </div>
                  </div>

                  {/* Row 4: Price & Cost */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">السعر (ج.م)</label>
                      <input
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                        placeholder="مثال: 8999"
                        className="input-field text-sm py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">التكلفة (ج.م)</label>
                      <input
                        type="number"
                        value={form.cost}
                        onChange={(e) => setForm((prev) => ({ ...prev, cost: e.target.value }))}
                        placeholder="مثال: 5500"
                        className="input-field text-sm py-2"
                      />
                    </div>
                  </div>

                  {/* Row 5: Warranty & Rating */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">الضمان</label>
                      <input
                        type="text"
                        value={form.warranty}
                        onChange={(e) => setForm((prev) => ({ ...prev, warranty: e.target.value }))}
                        placeholder="مثال: 10 سنوات"
                        className="input-field text-sm py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">التقييم</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={form.rating}
                        onChange={(e) => setForm((prev) => ({ ...prev, rating: e.target.value }))}
                        className="input-field text-sm py-2"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">الوصف</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="وصف المنتج..."
                      rows={2}
                      className="input-field text-sm py-2 resize-none"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">الوسوم (Tags)</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="أضف وسماً..."
                        className="input-field text-sm py-2 flex-1"
                      />
                      <button onClick={addTag} className="btn-secondary text-xs py-2 px-3">إضافة</button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {form.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="hover:text-rose-500">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                    إلغاء
                  </button>
                  <button onClick={handleSave} className="btn-primary flex-1">
                    {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Stock Modal - عرض المخزون في كل فرع */}
      <AnimatePresence>
        {stockModalProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setStockModalProduct(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Warehouse className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {stockModalProduct.brand} {stockModalProduct.model}
                    </h3>
                  </div>
                  <button onClick={() => setStockModalProduct(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-gray-500 dark:text-slate-400 mb-4 text-center">
                  إجمالي المخزون: <strong className="text-slate-900 dark:text-white">{Object.values(stockModalProduct.stock).reduce((a, b) => a + b, 0)}</strong> قطعة
                </p>

                <div className="space-y-2">
                  {branches.map((branch) => {
                    const qty = stockModalProduct.stock[branch.id] || 0;
                    return (
                      <div key={branch.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-900 dark:text-white">{branch.name}</p>
                          <p className="text-[10px] text-gray-500 dark:text-slate-400">{branch.city}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const newQty = Math.max(0, qty - 1);
                              const newStock = { ...stockModalProduct.stock, [branch.id]: newQty };
                              updateProduct(stockModalProduct.id, { stock: newStock });
                              setStockModalProduct((prev) => ({ ...prev, stock: newStock }));
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={qty}
                            onChange={(e) => {
                              const val = Math.max(0, parseInt(e.target.value) || 0);
                              const newStock = { ...stockModalProduct.stock, [branch.id]: val };
                              updateProduct(stockModalProduct.id, { stock: newStock });
                              setStockModalProduct((prev) => ({ ...prev, stock: newStock }));
                            }}
                            className="w-16 text-center text-sm font-semibold bg-transparent border-b border-gray-300 dark:border-slate-600 focus:border-primary-500 outline-none text-slate-900 dark:text-white"
                          />
                          <button
                            onClick={() => {
                              const newQty = qty + 1;
                              const newStock = { ...stockModalProduct.stock, [branch.id]: newQty };
                              updateProduct(stockModalProduct.id, { stock: newStock });
                              setStockModalProduct((prev) => ({ ...prev, stock: newStock }));
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
